<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SchoolCalendarController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(['message' => 'School calendar index endpoint working']);
    }
    
    public function store(Request $request)
    {
        return response()->json(['message' => 'School calendar store endpoint working']);
    }
    
    public function show($id)
    {
        return response()->json(['message' => 'School calendar show endpoint working']);
    }
    
    public function update(Request $request, $id)
    {
        return response()->json(['message' => 'School calendar update endpoint working']);
    }
    
    public function destroy($id)
    {
        return response()->json(['message' => 'School calendar destroy endpoint working']);
    }
    
    public function monthly($year, $month)
    {
        return response()->json(['message' => 'School calendar monthly endpoint working']);
    }
    
    public function upcoming(Request $request)
    {
        return response()->json(['message' => 'School calendar upcoming endpoint working']);
    }
    
    public function bulkImport(Request $request)
    {
        return response()->json(['message' => 'School calendar bulk import endpoint working']);
    }
    
    public function export(Request $request)
    {
        return response()->json(['message' => 'School calendar export endpoint working']);
    }
}