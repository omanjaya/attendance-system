<?php

namespace App\Http\Controllers;

use App\Models\Period;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PeriodController extends Controller
{
    /**
     * Display a listing of periods.
     */
    public function index(): View
    {
        $this->authorize('schedules.view');
        
        $periods = Period::orderBy('sort_order')->orderBy('start_time')->get();
        
        return view('periods.index', compact('periods'));
    }

    /**
     * Store a newly created period.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('schedules.create');
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'type' => 'required|in:class,break,lunch,assembly',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            // Auto-assign sort order if not provided
            if (!$request->filled('sort_order')) {
                $maxOrder = Period::max('sort_order') ?? 0;
                $request->merge(['sort_order' => $maxOrder + 1]);
            }

            Period::create($request->all());

            return redirect()->route('periods.index')
                ->with('success', 'Period created successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Failed to create period. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Update the specified period.
     */
    public function update(Request $request, Period $period): RedirectResponse
    {
        $this->authorize('schedules.edit');
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'type' => 'required|in:class,break,lunch,assembly',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            $period->update($request->all());

            return redirect()->route('periods.index')
                ->with('success', 'Period updated successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Failed to update period. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Remove the specified period.
     */
    public function destroy(Period $period): RedirectResponse
    {
        $this->authorize('schedules.delete');
        
        try {
            $period->delete();

            return redirect()->route('periods.index')
                ->with('success', 'Period deleted successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Failed to delete period. Please try again.']);
        }
    }

    /**
     * Reorder periods based on new sort order
     */
    public function reorder(Request $request)
    {
        $this->authorize('schedules.edit');
        
        $validated = $request->validate([
            'periods' => 'required|array',
            'periods.*.id' => 'required|exists:periods,id',
            'periods.*.sort_order' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            foreach ($validated['periods'] as $periodData) {
                Period::where('id', $periodData['id'])
                    ->update(['sort_order' => $periodData['sort_order']]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Period order updated successfully.'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'error' => 'Failed to update period order: ' . $e->getMessage()
            ], 500);
        }
    }
}