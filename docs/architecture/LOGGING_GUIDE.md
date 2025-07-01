# Enhanced Logging System

Comprehensive logging system for both frontend and backend debugging and monitoring.

## 🎯 Features

### Frontend Logging
- ✅ **Structured Logging** with levels (ERROR, WARN, INFO, DEBUG, TRACE)
- ✅ **Console Styling** with colors and collapsible groups
- ✅ **Local Storage** for log persistence
- ✅ **Automatic API Request/Response Logging**
- ✅ **Error Tracking** with context and stack traces
- ✅ **Export Functionality** for debugging
- ✅ **Rate Limiting** on critical errors

### Backend Logging
- ✅ **Multiple Channels** (API, Auth, Database, Performance, etc.)
- ✅ **JSON Formatting** for structured data
- ✅ **Request/Response Middleware** with timing
- ✅ **Authentication Event Logging**
- ✅ **Performance Monitoring**
- ✅ **Log Rotation** with configurable retention

## 🚀 Quick Start

### Frontend Usage

```javascript
import logger from '@/utils/logger'

// Basic logging
logger.error('Something went wrong', { userId: 123, action: 'login' })
logger.warn('Deprecated feature used', { feature: 'oldApi' })
logger.info('User logged in', { userId: 123 })
logger.debug('API response received', { endpoint: '/users' })

// Set log level
logger.setLogLevel('DEBUG') // or 'INFO', 'WARN', 'ERROR'

// Performance logging
logger.time('api-request')
// ... some operation
logger.timeEnd('api-request')

// Export logs for debugging
logger.exportLogs()

// Access logs programmatically
const errorLogs = logger.getLogs(logger.levels.ERROR)
console.log(errorLogs)
```

### Backend Usage

```php
// Use specific channels
Log::channel('api')->info('API request processed', [
    'endpoint' => '/users',
    'response_time' => 150,
    'user_id' => 123
]);

Log::channel('auth')->warning('Failed login attempt', [
    'email' => 'user@example.com',
    'ip' => '192.168.1.1'
]);

Log::channel('performance')->warning('Slow query detected', [
    'query' => 'SELECT * FROM users',
    'duration' => 1500
]);
```

## 📁 Log Files

### Backend Logs Location: `storage/logs/`

| File | Purpose | Retention |
|------|---------|-----------|
| `laravel.log` | General application logs | 14 days |
| `api-{date}.log` | API requests/responses | 30 days |
| `auth-{date}.log` | Authentication events | 30 days |
| `database-{date}.log` | Database queries | 7 days |
| `frontend-{date}.log` | Frontend error reports | 7 days |
| `performance-{date}.log` | Performance metrics | 30 days |
| `security-{date}.log` | Security events | 365 days |

### Frontend Logs
- Stored in browser's localStorage
- Exported as JSON files
- Automatically sent to backend for critical errors

## 🔧 Configuration

### Frontend Environment Variables (.env)
```bash
VITE_LOG_LEVEL=DEBUG    # DEBUG, INFO, WARN, ERROR
VITE_APP_DEBUG=true     # Enable debug features
```

### Backend Environment Variables (.env)
```bash
LOG_CHANNEL=stack
LOG_STACK=daily,api,auth,database
LOG_LEVEL=debug         # debug, info, warning, error
```

## 🎛️ Log Viewer Component

For development debugging, use the LogViewer component:

```vue
<template>
  <div>
    <LogViewer v-if="isDevelopment" />
  </div>
</template>

<script>
import LogViewer from '@/components/debug/LogViewer.vue'

export default {
  components: { LogViewer },
  computed: {
    isDevelopment() {
      return import.meta.env.DEV
    }
  }
}
</script>
```

### Log Viewer Features
- ✅ **Real-time Log Streaming**
- ✅ **Multiple Channel Support**
- ✅ **Search and Filter**
- ✅ **Auto-refresh**
- ✅ **Export Functionality**
- ✅ **Clear Logs**

## 📊 API Endpoints

### Log Management (Development Only)

```bash
# Get logs
GET /api/logs?channel=api&lines=100

# Get available channels
GET /api/logs/channels

# Clear logs
DELETE /api/logs/clear?channel=api

# Store frontend logs
POST /api/logs/frontend
{
  "level": "ERROR",
  "message": "Something went wrong",
  "context": { "userId": 123 },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## 🚨 Error Tracking

### Automatic Error Capture

**Frontend:**
- Unhandled JavaScript errors
- API request failures
- Authentication errors
- Performance issues

**Backend:**
- HTTP 4xx/5xx responses
- Database query errors
- Authentication failures
- Security violations

### Error Context

Each error includes:
- **Timestamp** with timezone
- **User Information** (if authenticated)
- **Request Details** (IP, User-Agent, URL)
- **Stack Trace** (in development)
- **Performance Metrics** (memory, timing)

## 🔍 Debugging Examples

### Frontend Debug Session
```javascript
// Enable debug mode
logger.setLogLevel('DEBUG')

// Track user actions
logger.info('User clicked button', { 
  button: 'login',
  page: '/auth/login',
  timestamp: Date.now()
})

// API debugging
logger.debug('Making API request', {
  url: '/api/auth/login',
  method: 'POST',
  data: { email: 'user@example.com' }
})

// Performance monitoring
logger.logPerformance('page-load', 1500, { page: '/dashboard' })

// Export all logs for analysis
logger.exportLogs()
```

### Backend Debug Commands
```bash
# View real-time API logs
tail -f storage/logs/api-$(date +%Y-%m-%d).log

# Search for specific user activity
grep "user_id.*123" storage/logs/api-*.log

# Monitor authentication events
tail -f storage/logs/auth-$(date +%Y-%m-%d).log | jq .

# Check performance issues
grep "duration.*[0-9]{4}" storage/logs/performance-*.log
```

## 🛡️ Security Considerations

### Data Sanitization
- **Passwords** are automatically redacted
- **API tokens** are masked
- **Sensitive headers** are filtered
- **PII data** is anonymized in production

### Log Retention
- **Security logs**: 1 year
- **Audit logs**: 1 year
- **Performance logs**: 30 days
- **API logs**: 30 days
- **Debug logs**: 7 days

## 📈 Performance Impact

### Frontend
- **Minimal overhead** in production
- **Structured data** for efficient parsing
- **Rate limiting** prevents log spam
- **Local storage** with size limits

### Backend
- **Asynchronous logging** for performance
- **Log rotation** prevents disk overflow
- **JSON formatting** for log aggregation
- **Channel separation** for focused debugging

## 🔧 Troubleshooting

### Common Issues

**Frontend logs not appearing:**
1. Check `VITE_LOG_LEVEL` environment variable
2. Verify logger import in component
3. Check browser console for errors

**Backend logs not writing:**
1. Check storage permissions: `chmod 775 storage/logs`
2. Verify log channel configuration
3. Check disk space

**Log viewer not loading:**
1. Ensure you're in development mode
2. Check authentication (some endpoints require auth)
3. Verify API endpoints are accessible

### Debug Commands

```bash
# Check log permissions
ls -la storage/logs/

# Test log writing
php artisan tinker
>>> Log::info('Test message');

# Clear all caches
php artisan config:clear
php artisan cache:clear
```

## 🎯 Best Practices

### Frontend Logging
```javascript
// ✅ Good - Structured with context
logger.error('Login failed', { 
  email: user.email,
  reason: 'invalid_credentials',
  attempts: 3
})

// ❌ Bad - Unstructured
logger.error('Login failed for user@example.com')
```

### Backend Logging
```php
// ✅ Good - Use appropriate channels and levels
Log::channel('auth')->warning('Failed login attempt', [
    'email' => $request->email,
    'ip' => $request->ip(),
    'user_agent' => $request->userAgent()
]);

// ❌ Bad - Generic logging
Log::info('User failed to login');
```

### Log Levels Guide
- **ERROR**: System errors, exceptions, critical failures
- **WARN**: Deprecated features, validation failures, recoverable errors
- **INFO**: User actions, system events, successful operations
- **DEBUG**: Detailed debugging information, variable dumps
- **TRACE**: Very detailed execution flow (use sparingly)

## 📚 Integration Examples

### Vue Component with Logging
```vue
<script setup>
import { onMounted } from 'vue'
import logger from '@/utils/logger'

onMounted(() => {
  logger.info('Component mounted', { 
    component: 'UserDashboard',
    props: props 
  })
})

const handleError = (error) => {
  logger.error('Component error', {
    component: 'UserDashboard',
    error: error.message,
    stack: error.stack
  })
}
</script>
```

### Laravel Controller with Logging
```php
<?php

class UserController extends Controller
{
    public function store(Request $request)
    {
        Log::channel('api')->info('Creating user', [
            'request_id' => $request->attributes->get('request_id'),
            'email' => $request->email
        ]);

        try {
            $user = User::create($request->validated());
            
            Log::channel('api')->info('User created successfully', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);
            
            return response()->json(['user' => $user]);
        } catch (\Exception $e) {
            Log::channel('api')->error('User creation failed', [
                'error' => $e->getMessage(),
                'request_data' => $request->validated()
            ]);
            
            throw $e;
        }
    }
}
```

This enhanced logging system provides comprehensive debugging capabilities for both development and production environments while maintaining performance and security standards.