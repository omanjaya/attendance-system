<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\NotificationPreference;
use App\Events\NotificationSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class NotificationController extends Controller
{
    /**
     * Get user notifications with pagination and filtering
     */
    public function index(Request $request)
    {
        try {
            $user = auth()->user();
            $query = Notification::where('user_id', $user->id);

            // Filtering
            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            if ($request->filled('unread_only') && $request->unread_only) {
                $query->whereNull('read_at');
            }

            if ($request->filled('priority')) {
                $query->where('priority', $request->priority);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = min($request->get('limit', 50), 100); // Max 100 per page
            $notifications = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $notifications->items(),
                'meta' => [
                    'current_page' => $notifications->currentPage(),
                    'last_page' => $notifications->lastPage(),
                    'per_page' => $notifications->perPage(),
                    'total' => $notifications->total(),
                    'unread_count' => $this->getUnreadCount($user->id)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create and send a new notification
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'type' => 'required|in:attendance,leave,payroll,system',
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
            'priority' => 'sometimes|in:low,normal,high',
            'data' => 'sometimes|array',
            'schedule_at' => 'sometimes|date|after:now',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $notifications = [];
            foreach ($request->user_ids as $userId) {
                $notification = Notification::create([
                    'user_id' => $userId,
                    'type' => $request->type,
                    'title' => $request->title,
                    'message' => $request->message,
                    'priority' => $request->priority ?? 'normal',
                    'data' => $request->data ?? [],
                    'created_by' => auth()->id(),
                    'scheduled_at' => $request->schedule_at,
                ]);

                $notifications[] = $notification;

                // Broadcast notification if not scheduled
                if (!$request->schedule_at) {
                    event(new NotificationSent($notification));
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Notification sent to {count($notifications)} users",
                'data' => $notifications
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to send notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show specific notification
     */
    public function show(Notification $notification)
    {
        try {
            // Check if user owns this notification
            if ($notification->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Notification not found'
                ], 404);
            }

            // Mark as read if not already read
            if (!$notification->read_at) {
                $notification->update(['read_at' => now()]);
            }

            return response()->json([
                'success' => true,
                'data' => $notification
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Notification $notification)
    {
        try {
            // Check if user owns this notification
            if ($notification->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Notification not found'
                ], 404);
            }

            if (!$notification->read_at) {
                $notification->update(['read_at' => now()]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read',
                'data' => $notification
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        try {
            $user = auth()->user();
            $updated = Notification::where('user_id', $user->id)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => "Marked {$updated} notifications as read"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark all notifications as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a notification
     */
    public function destroy(Notification $notification)
    {
        try {
            // Check if user owns this notification
            if ($notification->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Notification not found'
                ], 404);
            }

            $notification->delete();

            return response()->json([
                'success' => true,
                'message' => 'Notification deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear all notifications for user
     */
    public function clearAll()
    {
        try {
            $user = auth()->user();
            $deleted = Notification::where('user_id', $user->id)->delete();

            return response()->json([
                'success' => true,
                'message' => "Deleted {$deleted} notifications"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get notification preferences
     */
    public function getPreferences()
    {
        try {
            $user = auth()->user();
            $preferences = NotificationPreference::where('user_id', $user->id)->first();

            if (!$preferences) {
                // Create default preferences
                $preferences = NotificationPreference::create([
                    'user_id' => $user->id,
                    'browser_notifications' => true,
                    'attendance_notifications' => true,
                    'leave_notifications' => true,
                    'payroll_notifications' => true,
                    'system_notifications' => true,
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $preferences
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get notification preferences',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update notification preferences
     */
    public function updatePreferences(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'browser_notifications' => 'sometimes|boolean',
            'attendance_notifications' => 'sometimes|boolean',
            'leave_notifications' => 'sometimes|boolean',
            'payroll_notifications' => 'sometimes|boolean',
            'system_notifications' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = auth()->user();
            $preferences = NotificationPreference::updateOrCreate(
                ['user_id' => $user->id],
                $request->only([
                    'browser_notifications',
                    'attendance_notifications', 
                    'leave_notifications',
                    'payroll_notifications',
                    'system_notifications'
                ])
            );

            return response()->json([
                'success' => true,
                'message' => 'Notification preferences updated',
                'data' => $preferences
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update notification preferences',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send notification to specific users/roles/departments
     */
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:attendance,leave,payroll,system',
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
            'priority' => 'sometimes|in:low,normal,high',
            'recipients' => 'required|array',
            'recipients.user_ids' => 'sometimes|array',
            'recipients.user_ids.*' => 'exists:users,id',
            'recipients.roles' => 'sometimes|array',
            'recipients.departments' => 'sometimes|array',
            'data' => 'sometimes|array',
            'schedule_at' => 'sometimes|date|after:now',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $recipients = $this->resolveRecipients($request->recipients);

            if (empty($recipients)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No valid recipients found'
                ], 400);
            }

            DB::beginTransaction();

            $notifications = [];
            foreach ($recipients as $userId) {
                $notification = Notification::create([
                    'user_id' => $userId,
                    'type' => $request->type,
                    'title' => $request->title,
                    'message' => $request->message,
                    'priority' => $request->priority ?? 'normal',
                    'data' => $request->data ?? [],
                    'created_by' => auth()->id(),
                    'scheduled_at' => $request->schedule_at,
                ]);

                $notifications[] = $notification;

                // Broadcast notification if not scheduled
                if (!$request->schedule_at) {
                    event(new NotificationSent($notification));
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Notification sent to {count($notifications)} users",
                'data' => [
                    'sent_count' => count($notifications),
                    'recipient_count' => count($recipients),
                    'type' => $request->type,
                    'priority' => $request->priority ?? 'normal'
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to send notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unread notifications count
     */
    public function unreadCount(Request $request)
    {
        try {
            $user = auth()->user();
            $count = $this->getUnreadCount($user->id);

            return response()->json([
                'success' => true,
                'data' => [
                    'unread_count' => $count
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get unread count',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Private helper methods

    private function getUnreadCount($userId)
    {
        return Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->count();
    }

    private function resolveRecipients($recipients)
    {
        $userIds = collect();

        // Direct user IDs
        if (!empty($recipients['user_ids'])) {
            $userIds = $userIds->merge($recipients['user_ids']);
        }

        // Users by roles
        if (!empty($recipients['roles'])) {
            $roleUsers = \App\Models\User::whereHas('roles', function ($query) use ($recipients) {
                $query->whereIn('name', $recipients['roles']);
            })->pluck('id');
            $userIds = $userIds->merge($roleUsers);
        }

        // Users by departments
        if (!empty($recipients['departments'])) {
            $departmentUsers = \App\Models\User::whereHas('employee', function ($query) use ($recipients) {
                $query->whereIn('department', $recipients['departments']);
            })->pluck('id');
            $userIds = $userIds->merge($departmentUsers);
        }

        return $userIds->unique()->values()->toArray();
    }
}