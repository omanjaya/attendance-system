<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Attendance System') }}</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background: #f8f9fa;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        h1 {
            font-size: 3rem;
            color: #212529;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.25rem;
            color: #6c757d;
            margin-bottom: 2rem;
        }
        .buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            border-radius: 0.375rem;
            transition: all 0.2s;
        }
        .btn-primary {
            background: #0d6efd;
            color: white;
        }
        .btn-primary:hover {
            background: #0b5ed7;
        }
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        .btn-secondary:hover {
            background: #5c636a;
        }
        .status {
            margin-top: 3rem;
            padding: 1rem;
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 0.375rem;
            color: #0c5460;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>{{ config('app.name', 'Attendance System') }}</h1>
        <p>Welcome to the School Attendance Management System</p>
        
        <div class="buttons">
            <a href="/login" class="btn btn-primary">Login</a>
            <a href="/api/v1" class="btn btn-secondary">API Documentation</a>
        </div>
        
        <div class="status">
            <strong>System Status:</strong> Operational<br>
            <strong>Version:</strong> 1.0.0<br>
            <strong>Environment:</strong> {{ app()->environment() }}
        </div>
    </div>
</body>
</html>