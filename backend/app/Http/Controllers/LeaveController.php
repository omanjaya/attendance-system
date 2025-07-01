<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\Employee;
use App\Models\SchoolCalendar;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use DB;

class LeaveController extends Controller
{
    public function index(Request $request)
    {
        $employee = auth()->user()->employee;
        
        if (!$employee) {
            return redirect()->route('dashboard')->with('error', 'Employee profile not found.');
        }

        $query = LeaveRequest::with(['employee:id,name,employee_number', 'approver:id,name'])
            ->forEmployee($employee->id);

        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('type')) {
            $query->ofType($request->type);
        }

        if ($request->filled('year')) {
            $query->forYear($request->year);
        }

        $leaveRequests = $query->latest()->paginate(15);
        $leaveTypes = LeaveRequest::getLeaveTypes();
        $statuses = LeaveRequest::getStatuses();

        return view('leaves.index', compact('leaveRequests', 'leaveTypes', 'statuses'));
    }

    public function create()
    {
        $employee = auth()->user()->employee;
        
        if (!$employee) {
            return redirect()->route('dashboard')->with('error', 'Employee profile not found.');
        }

        $leaveTypes = LeaveRequest::getLeaveTypes();
        return view('leaves.create', compact('leaveTypes'));
    }

    public function store(Request $request)
    {
        $employee = auth()->user()->employee;
        
        if (!$employee) {
            return response()->json(['error' => 'Employee profile not found.'], 404);
        }

        $validated = $request->validate([
            'leave_type' => 'required|in:' . implode(',', array_keys(LeaveRequest::getLeaveTypes())),
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:1000',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        try {
            DB::beginTransaction();

            $startDate = Carbon::parse($validated['start_date']);
            $endDate = Carbon::parse($validated['end_date']);

            $leaveRequest = new LeaveRequest([
                'employee_id' => $employee->id,
                'leave_type' => $validated['leave_type'],
                'start_date' => $startDate,
                'end_date' => $endDate,
                'reason' => $validated['reason'],
                'status' => LeaveRequest::STATUS_PENDING,
                'requested_by' => auth()->id(),
                'is_paid' => $this->isPaidLeave($validated['leave_type']),
            ]);

            if ($this->hasConflictingLeave($employee, $startDate, $endDate)) {
                throw ValidationException::withMessages([
                    'start_date' => 'You already have approved leave during this period.'
                ]);
            }

            if (!$this->isValidLeavePeriod($startDate, $endDate)) {
                throw ValidationException::withMessages([
                    'start_date' => 'Leave period contains non-working days only.'
                ]);
            }

            if ($request->hasFile('attachment')) {
                $path = $request->file('attachment')->store('leave-attachments', 'private');
                $leaveRequest->attachment = $path;
            }

            $leaveRequest->save();

            DB::commit();

            return redirect()->route('leaves.show', $leaveRequest)
                ->with('success', 'Leave request submitted successfully.');

        } catch (ValidationException $e) {
            DB::rollback();
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to submit leave request: ' . $e->getMessage()])->withInput();
        }
    }

    public function show(LeaveRequest $leave)
    {
        $employee = auth()->user()->employee;
        
        if (!$employee || ($leave->employee_id !== $employee->id && !auth()->user()->can('manage leaves'))) {
            abort(403, 'Unauthorized access to this leave request.');
        }

        $leave->load(['employee', 'requester', 'approver']);
        return view('leaves.show', compact('leave'));
    }

    public function edit(LeaveRequest $leave)
    {
        $employee = auth()->user()->employee;
        
        if (!$employee || $leave->employee_id !== $employee->id) {
            abort(403, 'Unauthorized access to this leave request.');
        }

        if (!$leave->canBeEdited()) {
            return redirect()->route('leaves.show', $leave)
                ->with('error', 'This leave request cannot be edited.');
        }

        $leaveTypes = LeaveRequest::getLeaveTypes();
        return view('leaves.edit', compact('leave', 'leaveTypes'));
    }

    public function update(Request $request, LeaveRequest $leave)
    {
        $employee = auth()->user()->employee;
        
        if (!$employee || $leave->employee_id !== $employee->id) {
            return response()->json(['error' => 'Unauthorized access.'], 403);
        }

        if (!$leave->canBeEdited()) {
            return response()->json(['error' => 'This leave request cannot be edited.'], 422);
        }

        $validated = $request->validate([
            'leave_type' => 'required|in:' . implode(',', array_keys(LeaveRequest::getLeaveTypes())),
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:1000',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'remove_attachment' => 'nullable|boolean',
        ]);

        try {
            DB::beginTransaction();

            $startDate = Carbon::parse($validated['start_date']);
            $endDate = Carbon::parse($validated['end_date']);

            if ($this->hasConflictingLeave($employee, $startDate, $endDate, $leave->id)) {
                throw ValidationException::withMessages([
                    'start_date' => 'You already have approved leave during this period.'
                ]);
            }

            $updateData = [
                'leave_type' => $validated['leave_type'],
                'start_date' => $startDate,
                'end_date' => $endDate,
                'reason' => $validated['reason'],
                'is_paid' => $this->isPaidLeave($validated['leave_type']),
            ];

            if ($request->boolean('remove_attachment') && $leave->attachment) {
                Storage::disk('private')->delete($leave->attachment);
                $updateData['attachment'] = null;
            }

            if ($request->hasFile('attachment')) {
                if ($leave->attachment) {
                    Storage::disk('private')->delete($leave->attachment);
                }
                $updateData['attachment'] = $request->file('attachment')->store('leave-attachments', 'private');
            }

            $leave->update($updateData);

            DB::commit();

            return redirect()->route('leaves.show', $leave)
                ->with('success', 'Leave request updated successfully.');

        } catch (ValidationException $e) {
            DB::rollback();
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to update leave request: ' . $e->getMessage()])->withInput();
        }
    }

    public function cancel(LeaveRequest $leave)
    {
        $employee = auth()->user()->employee;
        
        if (!$employee || $leave->employee_id !== $employee->id) {
            return response()->json(['error' => 'Unauthorized access.'], 403);
        }

        if (!$leave->canBeCancelled()) {
            return response()->json(['error' => 'This leave request cannot be cancelled.'], 422);
        }

        try {
            $leave->cancel();
            
            return response()->json([
                'success' => true,
                'message' => 'Leave request cancelled successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to cancel leave request: ' . $e->getMessage()], 500);
        }
    }

    public function managePending(Request $request)
    {
        $this->authorize('manage leaves');

        $query = LeaveRequest::with(['employee:id,name,employee_number', 'requester:id,name'])
            ->pending();

        if ($request->filled('type')) {
            $query->ofType($request->type);
        }

        if ($request->filled('employee_id')) {
            $query->forEmployee($request->employee_id);
        }

        $pendingRequests = $query->latest()->paginate(15);
        $leaveTypes = LeaveRequest::getLeaveTypes();
        $employees = Employee::active()->get(['id', 'name', 'employee_number']);

        return view('leaves.manage-pending', compact('pendingRequests', 'leaveTypes', 'employees'));
    }

    public function approve(Request $request, LeaveRequest $leave)
    {
        $this->authorize('manage leaves');

        if (!$leave->isPending()) {
            return response()->json(['error' => 'Only pending leave requests can be approved.'], 422);
        }

        $validated = $request->validate([
            'approval_notes' => 'nullable|string|max:500',
        ]);

        try {
            $success = $leave->approve(auth()->user(), $validated['approval_notes'] ?? null);
            
            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Leave request approved successfully.',
                    'leave' => $leave->fresh(['employee', 'approver'])
                ]);
            } else {
                return response()->json(['error' => 'Failed to approve leave request.'], 422);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error approving leave: ' . $e->getMessage()], 500);
        }
    }

    public function reject(Request $request, LeaveRequest $leave)
    {
        $this->authorize('manage leaves');

        if (!$leave->isPending()) {
            return response()->json(['error' => 'Only pending leave requests can be rejected.'], 422);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        try {
            $success = $leave->reject(auth()->user(), $validated['rejection_reason']);
            
            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Leave request rejected successfully.',
                    'leave' => $leave->fresh(['employee', 'approver'])
                ]);
            } else {
                return response()->json(['error' => 'Failed to reject leave request.'], 422);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error rejecting leave: ' . $e->getMessage()], 500);
        }
    }

    public function balance(Employee $employee)
    {
        $this->authorize('manage leaves');

        $currentYear = now()->year;
        
        $leaveBalance = [
            'employee' => $employee,
            'year' => $currentYear,
            'balances' => []
        ];

        foreach (LeaveRequest::getLeaveTypes() as $type => $name) {
            $usedDays = LeaveRequest::forEmployee($employee->id)
                ->ofType($type)
                ->approved()
                ->forYear($currentYear)
                ->sum('total_days');

            $totalAllowed = $this->getTotalAllowedDays($type, $employee);
            
            $leaveBalance['balances'][$type] = [
                'name' => $name,
                'total_allowed' => $totalAllowed,
                'used_days' => $usedDays,
                'remaining_days' => max(0, $totalAllowed - $usedDays),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $leaveBalance
        ]);
    }

    public function downloadAttachment(LeaveRequest $leave)
    {
        $employee = auth()->user()->employee;
        
        if (!$employee || ($leave->employee_id !== $employee->id && !auth()->user()->can('manage leaves'))) {
            abort(403, 'Unauthorized access.');
        }

        if (!$leave->hasAttachment()) {
            abort(404, 'Attachment not found.');
        }

        if (!Storage::disk('private')->exists($leave->attachment)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('private')->download($leave->attachment);
    }

    public function bulkApprove(Request $request)
    {
        $this->authorize('manage leaves');

        $validated = $request->validate([
            'leave_ids' => 'required|array',
            'leave_ids.*' => 'exists:leave_requests,id',
            'approval_notes' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            $leaves = LeaveRequest::whereIn('id', $validated['leave_ids'])->pending()->get();
            $successCount = 0;
            $errors = [];

            foreach ($leaves as $leave) {
                $success = $leave->approve(auth()->user(), $validated['approval_notes'] ?? null);
                if ($success) {
                    $successCount++;
                } else {
                    $errors[] = "Failed to approve leave for {$leave->employee->name}";
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Approved {$successCount} leave requests successfully.",
                'data' => [
                    'success_count' => $successCount,
                    'total_count' => $leaves->count(),
                    'errors' => $errors
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve leave requests: ' . $e->getMessage()
            ], 500);
        }
    }

    public function calendar(Request $request)
    {
        $employee = auth()->user()->employee;
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        $query = LeaveRequest::with(['employee:id,name'])
            ->approved();

        if ($employee && !auth()->user()->can('manage leaves')) {
            $query->forEmployee($employee->id);
        }

        if ($month) {
            $query->forMonth($year, $month);
        } else {
            $query->forYear($year);
        }

        $leaves = $query->get();

        $calendarData = $leaves->map(function ($leave) {
            return [
                'id' => $leave->id,
                'title' => $leave->employee->name . ' - ' . $leave->leave_type_name,
                'start' => $leave->start_date->format('Y-m-d'),
                'end' => $leave->end_date->addDay()->format('Y-m-d'), // FullCalendar end is exclusive
                'backgroundColor' => $this->getLeaveTypeColor($leave->leave_type),
                'borderColor' => $this->getLeaveTypeColor($leave->leave_type),
                'extendedProps' => [
                    'employee' => $leave->employee->name,
                    'type' => $leave->leave_type_name,
                    'reason' => $leave->reason,
                    'days' => $leave->total_days,
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $calendarData
        ]);
    }

    private function hasConflictingLeave(Employee $employee, Carbon $startDate, Carbon $endDate, ?int $excludeId = null): bool
    {
        $query = LeaveRequest::forEmployee($employee->id)
            ->approved()
            ->where(function ($q) use ($startDate, $endDate) {
                $q->where(function ($subQ) use ($startDate, $endDate) {
                    $subQ->where('start_date', '<=', $endDate)
                         ->where('end_date', '>=', $startDate);
                });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    private function isValidLeavePeriod(Carbon $startDate, Carbon $endDate): bool
    {
        $currentDate = $startDate->copy();
        while ($currentDate <= $endDate) {
            if (SchoolCalendar::isWorkingDay($currentDate)) {
                return true;
            }
            $currentDate->addDay();
        }
        return false;
    }

    private function isPaidLeave(string $leaveType): bool
    {
        $paidLeaveTypes = [
            LeaveRequest::TYPE_SICK,
            LeaveRequest::TYPE_VACATION,
            LeaveRequest::TYPE_MATERNITY,
            LeaveRequest::TYPE_PATERNITY,
            LeaveRequest::TYPE_BEREAVEMENT,
        ];

        return in_array($leaveType, $paidLeaveTypes);
    }

    private function getTotalAllowedDays(string $leaveType, Employee $employee): int
    {
        return match ($leaveType) {
            LeaveRequest::TYPE_SICK => 12,
            LeaveRequest::TYPE_VACATION => 12,
            LeaveRequest::TYPE_PERSONAL => 3,
            LeaveRequest::TYPE_EMERGENCY => 3,
            LeaveRequest::TYPE_MATERNITY => 90,
            LeaveRequest::TYPE_PATERNITY => 3,
            LeaveRequest::TYPE_BEREAVEMENT => 3,
            default => 0,
        };
    }

    private function getLeaveTypeColor(string $leaveType): string
    {
        return match ($leaveType) {
            LeaveRequest::TYPE_SICK => '#dc3545',
            LeaveRequest::TYPE_VACATION => '#28a745',
            LeaveRequest::TYPE_PERSONAL => '#17a2b8',
            LeaveRequest::TYPE_EMERGENCY => '#fd7e14',
            LeaveRequest::TYPE_MATERNITY => '#e83e8c',
            LeaveRequest::TYPE_PATERNITY => '#6f42c1',
            LeaveRequest::TYPE_BEREAVEMENT => '#6c757d',
            default => '#007bff',
        };
    }
}
