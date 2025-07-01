<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(['message' => 'Schedule index endpoint working']);
    }
    
    public function store(Request $request)
    {
        return response()->json(['message' => 'Schedule store endpoint working']);
    }
    
    public function show($id)
    {
        return response()->json(['message' => 'Schedule show endpoint working']);
    }
    
    public function update(Request $request, $id)
    {
        return response()->json(['message' => 'Schedule update endpoint working']);
    }
    
    public function destroy($id)
    {
        return response()->json(['message' => 'Schedule destroy endpoint working']);
    }
    
    public function mySchedule(Request $request)
    {
        return response()->json(['message' => 'My schedule endpoint working']);
    }
    
    public function upcoming(Request $request)
    {
        return response()->json(['message' => 'Upcoming schedule endpoint working']);
    }
    
    public function bulkAssign(Request $request)
    {
        return response()->json(['message' => 'Bulk assign schedule endpoint working']);
    }
    
    public function calendar($date = null)
    {
        return response()->json(['message' => 'Schedule calendar endpoint working']);
    }
    
    public function copy(Request $request)
    {
        return response()->json(['message' => 'Schedule copy endpoint working']);
    }
    
    public function templates(Request $request)
    {
        return response()->json(['message' => 'Schedule templates endpoint working']);
    }
    
    public function generate(Request $request)
    {
        return response()->json(['message' => 'Schedule generate endpoint working']);
    }
}