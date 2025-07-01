<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>{{ config('app.name', 'Attendance System') }}</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <style>
        body {
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            margin: 0;
            padding: 0;
            background: #f8fafc;
            color: #1e293b;
        }
        #app {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .loading {
            text-align: center;
            padding: 2rem;
        }
        .spinner {
            border: 4px solid #e2e8f0;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="antialiased">
    <div id="app">
        <div class="loading">
            <div class="spinner"></div>
            <h2>Loading Application...</h2>
            <p>Please wait while we redirect you to the frontend.</p>
        </div>
    </div>
    
    <!-- Scripts -->
    <script>
        // Redirect to frontend development server
        setTimeout(function() {
            window.location.href = 'http://localhost:5173';
        }, 2000);
    </script>
    
    <script>
        // Pass configuration to frontend
        window.Laravel = {
            csrfToken: '{{ csrf_token() }}',
            apiUrl: '{{ config('app.url') }}/api/v1',
            appName: '{{ config('app.name') }}',
            locale: '{{ app()->getLocale() }}'
        };
    </script>
</body>
</html>