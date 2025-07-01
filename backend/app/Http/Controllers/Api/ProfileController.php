<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json(['message' => 'Profile endpoint working']);
    }
    
    public function update(Request $request)
    {
        return response()->json(['message' => 'Profile update endpoint working']);
    }
    
    public function uploadAvatar(Request $request)
    {
        return response()->json(['message' => 'Avatar upload endpoint working']);
    }
    
    public function deleteAvatar(Request $request)
    {
        return response()->json(['message' => 'Avatar delete endpoint working']);
    }
    
    public function updatePassword(Request $request)
    {
        return response()->json(['message' => 'Password update endpoint working']);
    }
    
    public function notificationSettings(Request $request)
    {
        return response()->json(['message' => 'Notification settings endpoint working']);
    }
    
    public function updateNotificationSettings(Request $request)
    {
        return response()->json(['message' => 'Update notification settings endpoint working']);
    }
}