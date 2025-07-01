<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PeriodController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(['message' => 'Period index endpoint working']);
    }
    
    public function store(Request $request)
    {
        return response()->json(['message' => 'Period store endpoint working']);
    }
    
    public function show($id)
    {
        return response()->json(['message' => 'Period show endpoint working']);
    }
    
    public function update(Request $request, $id)
    {
        return response()->json(['message' => 'Period update endpoint working']);
    }
    
    public function destroy($id)
    {
        return response()->json(['message' => 'Period destroy endpoint working']);
    }
    
    public function reorder(Request $request)
    {
        return response()->json(['message' => 'Period reorder endpoint working']);
    }
}