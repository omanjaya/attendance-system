<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class LogController extends Controller
{
    /**
     * Store frontend logs
     */
    public function storeFrontendLog(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'level' => 'required|string|in:ERROR,WARN,INFO,DEBUG,TRACE',
            'message' => 'required|string|max:1000',
            'timestamp' => 'required|string',
            'context' => 'sometimes|array',
            'stack' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid log data',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $logData = [
                'source' => 'frontend',
                'user_id' => $request->user()?->id,
                'session_id' => $request->session()->getId() ?? 'unknown',
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->header('Referer'),
                'level' => $request->level,
                'message' => $request->message,
                'timestamp' => $request->timestamp,
                'context' => $request->context ?? [],
                'stack' => $request->stack,
            ];

            // Log based on level
            switch (strtoupper($request->level)) {
                case 'ERROR':
                    Log::channel('frontend')->error($request->message, $logData);
                    break;
                case 'WARN':
                    Log::channel('frontend')->warning($request->message, $logData);
                    break;
                case 'INFO':
                    Log::channel('frontend')->info($request->message, $logData);
                    break;
                case 'DEBUG':
                case 'TRACE':
                default:
                    Log::channel('frontend')->debug($request->message, $logData);
                    break;
            }

            return response()->json([
                'success' => true,
                'message' => 'Log stored successfully'
            ]);

        } catch (\Exception $e) {
            Log::channel('errors')->error('Failed to store frontend log', [
                'error' => $e->getMessage(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to store log'
            ], 500);
        }
    }

    /**
     * Get logs for debugging (development only)
     */
    public function getLogs(Request $request)
    {
        if (!config('app.debug')) {
            return response()->json([
                'success' => false,
                'message' => 'Log viewing not available in production'
            ], 403);
        }

        $channel = $request->get('channel', 'laravel');
        $lines = min($request->get('lines', 100), 1000); // Max 1000 lines
        
        try {
            $logFile = storage_path("logs/{$channel}.log");
            
            if (!file_exists($logFile)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Log file not found'
                ], 404);
            }

            $logs = $this->tailFile($logFile, $lines);

            return response()->json([
                'success' => true,
                'data' => [
                    'channel' => $channel,
                    'lines' => count($logs),
                    'logs' => $logs
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to read logs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available log channels
     */
    public function getChannels()
    {
        if (!config('app.debug')) {
            return response()->json([
                'success' => false,
                'message' => 'Log viewing not available in production'
            ], 403);
        }

        $logDir = storage_path('logs');
        $files = glob($logDir . '/*.log');
        
        $channels = array_map(function($file) {
            return pathinfo($file, PATHINFO_FILENAME);
        }, $files);

        return response()->json([
            'success' => true,
            'data' => [
                'channels' => $channels,
                'total' => count($channels)
            ]
        ]);
    }

    /**
     * Clear logs (development only)
     */
    public function clearLogs(Request $request)
    {
        if (!config('app.debug')) {
            return response()->json([
                'success' => false,
                'message' => 'Log clearing not available in production'
            ], 403);
        }

        $channel = $request->get('channel');
        
        if (!$channel) {
            return response()->json([
                'success' => false,
                'message' => 'Channel parameter required'
            ], 422);
        }

        try {
            $logFile = storage_path("logs/{$channel}.log");
            
            if (file_exists($logFile)) {
                file_put_contents($logFile, '');
            }

            return response()->json([
                'success' => true,
                'message' => "Log file '{$channel}' cleared successfully"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear logs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Read last N lines from a file
     */
    private function tailFile(string $filepath, int $lines): array
    {
        $handle = fopen($filepath, 'r');
        $linecounter = $lines;
        $pos = -2;
        $beginning = false;
        $text = [];
        
        while ($linecounter > 0) {
            $t = " ";
            while ($t != "\n") {
                if (fseek($handle, $pos, SEEK_END) == -1) {
                    $beginning = true;
                    break;
                }
                $t = fgetc($handle);
                $pos--;
            }
            $linecounter--;
            if ($beginning) {
                rewind($handle);
            }
            $text[$lines - $linecounter - 1] = fgets($handle);
            if ($beginning) break;
        }
        
        fclose($handle);
        return array_reverse($text);
    }
}