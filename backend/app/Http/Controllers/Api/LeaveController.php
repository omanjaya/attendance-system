<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(['message' => 'Leave index endpoint working']);
    }
    
    public function store(Request $request)
    {
        return response()->json(['message' => 'Leave store endpoint working']);
    }
    
    public function show($id)
    {
        return response()->json(['message' => 'Leave show endpoint working']);
    }
    
    public function update(Request $request, $id)
    {
        return response()->json(['message' => 'Leave update endpoint working']);
    }
    
    public function cancel($id)
    {
        return response()->json(['message' => 'Leave cancel endpoint working']);
    }
    
    public function myBalance(Request $request)
    {
        return response()->json(['message' => 'Leave my balance endpoint working']);
    }
    
    public function types(Request $request)
    {
        return response()->json(['message' => 'Leave types endpoint working']);
    }
    
    public function calendar($year = null)
    {
        return response()->json(['message' => 'Leave calendar endpoint working']);
    }
    
    public function managePending(Request $request)
    {
        return response()->json(['message' => 'Leave manage pending endpoint working']);
    }
    
    public function manageAll(Request $request)
    {
        return response()->json(['message' => 'Leave manage all endpoint working']);
    }
    
    public function approve($id)
    {
        return response()->json(['message' => 'Leave approve endpoint working']);
    }
    
    public function reject($id)
    {
        return response()->json(['message' => 'Leave reject endpoint working']);
    }
    
    public function balance($employee)
    {
        return response()->json(['message' => 'Leave balance endpoint working']);
    }
    
    public function departmentLeaves($department)
    {
        return response()->json(['message' => 'Leave department endpoint working']);
    }
    
    public function export(Request $request)
    {
        return response()->json(['message' => 'Leave export endpoint working']);
    }
}