<?php

namespace App\Http\Controllers;

use App\Models\SchoolCalendar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Carbon\Carbon;

class SchoolCalendarController extends Controller
{
    /**
     * Display a listing of calendar events.
     */
    public function index(): View
    {
        $this->authorize('calendar.view');
        
        $events = SchoolCalendar::orderBy('start_date')->get()->map(function ($event) {
            $event->type_color = $this->getEventTypeColor($event->type);
            return $event;
        });
        
        return view('calendar.index', compact('events'));
    }

    /**
     * Store a newly created calendar event.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('calendar.create');
        
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'required|in:holiday,event,exam,meeting,training',
            'description' => 'nullable|string|max:1000',
            'is_school_wide' => 'boolean',
            'affects_attendance' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            SchoolCalendar::create([
                'title' => $request->title,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'type' => $request->type,
                'is_school_wide' => $request->boolean('is_school_wide'),
                'affects_attendance' => $request->boolean('affects_attendance'),
                'created_by' => auth()->id(),
            ]);

            return redirect()->route('calendar.index')
                ->with('success', 'Calendar event created successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Failed to create calendar event. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Update the specified calendar event.
     */
    public function update(Request $request, SchoolCalendar $calendar): RedirectResponse
    {
        $this->authorize('calendar.edit');
        
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'required|in:holiday,event,exam,meeting,training',
            'description' => 'nullable|string|max:1000',
            'is_school_wide' => 'boolean',
            'affects_attendance' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            $calendar->update([
                'title' => $request->title,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'type' => $request->type,
                'is_school_wide' => $request->boolean('is_school_wide'),
                'affects_attendance' => $request->boolean('affects_attendance'),
            ]);

            return redirect()->route('calendar.index')
                ->with('success', 'Calendar event updated successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Failed to update calendar event. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Remove the specified calendar event.
     */
    public function destroy(SchoolCalendar $calendar): RedirectResponse
    {
        $this->authorize('calendar.delete');
        
        try {
            $calendar->delete();

            return redirect()->route('calendar.index')
                ->with('success', 'Calendar event deleted successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Failed to delete calendar event. Please try again.']);
        }
    }

    /**
     * Get color for event type
     */
    private function getEventTypeColor(string $type): string
    {
        return match ($type) {
            'holiday' => '#dc3545',
            'event' => '#0d6efd',
            'exam' => '#fd7e14',
            'meeting' => '#198754',
            'training' => '#6f42c1',
            default => '#6c757d',
        };
    }
}