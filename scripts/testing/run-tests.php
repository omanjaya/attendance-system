<?php

/**
 * Comprehensive Test Runner for School Attendance System
 * 
 * This script runs all test suites and generates a detailed report.
 */

echo "🧪 School Attendance System - Test Suite Runner\n";
echo "================================================\n\n";

// Test categories and their importance
$testSuites = [
    'Security Tests' => [
        'importance' => 'CRITICAL',
        'commands' => [
            'php artisan test tests/Feature/SecurityTest.php',
            'php artisan test tests/Unit/SecurityServiceTest.php',
            'php artisan test tests/Unit/SqlInjectionPreventionTest.php',
        ]
    ],
    'Authentication Tests' => [
        'importance' => 'HIGH',
        'commands' => [
            'php artisan test tests/Feature/AuthenticationTest.php',
        ]
    ],
    'Employee Management Tests' => [
        'importance' => 'HIGH', 
        'commands' => [
            'php artisan test tests/Feature/EmployeeManagementTest.php',
        ]
    ],
    'Attendance Tests' => [
        'importance' => 'HIGH',
        'commands' => [
            'php artisan test tests/Feature/AttendanceTest.php',
        ]
    ],
    'All Feature Tests' => [
        'importance' => 'MEDIUM',
        'commands' => [
            'php artisan test tests/Feature/',
        ]
    ],
    'All Unit Tests' => [
        'importance' => 'MEDIUM',
        'commands' => [
            'php artisan test tests/Unit/',
        ]
    ],
];

// Function to run a command and capture output
function runTestCommand($command, &$results) {
    echo "Running: $command\n";
    
    $output = [];
    $returnCode = 0;
    
    exec($command . ' 2>&1', $output, $returnCode);
    
    $results[] = [
        'command' => $command,
        'success' => $returnCode === 0,
        'output' => implode("\n", $output),
        'return_code' => $returnCode
    ];
    
    if ($returnCode === 0) {
        echo "✅ PASSED\n";
    } else {
        echo "❌ FAILED\n";
    }
    
    echo "\n";
    
    return $returnCode === 0;
}

// Function to extract test statistics from output
function extractTestStats($output) {
    $stats = [
        'tests' => 0,
        'assertions' => 0,
        'failures' => 0,
        'errors' => 0,
        'warnings' => 0,
        'skipped' => 0,
        'time' => 0
    ];
    
    // Parse PHPUnit output for statistics
    if (preg_match('/Tests: (\d+), Assertions: (\d+)/', $output, $matches)) {
        $stats['tests'] = (int)$matches[1];
        $stats['assertions'] = (int)$matches[2];
    }
    
    if (preg_match('/Failures: (\d+)/', $output, $matches)) {
        $stats['failures'] = (int)$matches[1];
    }
    
    if (preg_match('/Errors: (\d+)/', $output, $matches)) {
        $stats['errors'] = (int)$matches[1];
    }
    
    if (preg_match('/Warnings: (\d+)/', $output, $matches)) {
        $stats['warnings'] = (int)$matches[1];
    }
    
    if (preg_match('/Skipped: (\d+)/', $output, $matches)) {
        $stats['skipped'] = (int)$matches[1];
    }
    
    if (preg_match('/Time: ([\d.]+)/', $output, $matches)) {
        $stats['time'] = (float)$matches[1];
    }
    
    return $stats;
}

// Function to generate color-coded output
function colorize($text, $color) {
    $colors = [
        'red' => "\033[31m",
        'green' => "\033[32m",
        'yellow' => "\033[33m",
        'blue' => "\033[34m",
        'magenta' => "\033[35m",
        'cyan' => "\033[36m",
        'white' => "\033[37m",
        'reset' => "\033[0m"
    ];
    
    return $colors[$color] . $text . $colors['reset'];
}

// Main test execution
$allResults = [];
$totalStats = [
    'tests' => 0,
    'assertions' => 0,
    'failures' => 0,
    'errors' => 0,
    'warnings' => 0,
    'skipped' => 0,
    'time' => 0,
    'suites_passed' => 0,
    'suites_failed' => 0
];

echo "🚀 Starting Test Execution...\n\n";

foreach ($testSuites as $suiteName => $suite) {
    echo colorize("📋 Running: $suiteName [{$suite['importance']}]", 'cyan') . "\n";
    echo str_repeat('-', 50) . "\n";
    
    $suiteResults = [];
    $suiteSuccess = true;
    
    foreach ($suite['commands'] as $command) {
        $success = runTestCommand($command, $suiteResults);
        if (!$success) {
            $suiteSuccess = false;
        }
    }
    
    // Aggregate statistics for this suite
    foreach ($suiteResults as $result) {
        $stats = extractTestStats($result['output']);
        $totalStats['tests'] += $stats['tests'];
        $totalStats['assertions'] += $stats['assertions'];
        $totalStats['failures'] += $stats['failures'];
        $totalStats['errors'] += $stats['errors'];
        $totalStats['warnings'] += $stats['warnings'];
        $totalStats['skipped'] += $stats['skipped'];
        $totalStats['time'] += $stats['time'];
    }
    
    if ($suiteSuccess) {
        echo colorize("✅ $suiteName: ALL TESTS PASSED", 'green') . "\n";
        $totalStats['suites_passed']++;
    } else {
        echo colorize("❌ $suiteName: SOME TESTS FAILED", 'red') . "\n";
        $totalStats['suites_failed']++;
    }
    
    $allResults[$suiteName] = [
        'suite' => $suite,
        'results' => $suiteResults,
        'success' => $suiteSuccess
    ];
    
    echo "\n";
}

// Generate final report
echo colorize("📊 FINAL TEST REPORT", 'magenta') . "\n";
echo str_repeat('=', 60) . "\n";

echo "📈 Overall Statistics:\n";
echo "   • Total Tests: {$totalStats['tests']}\n";
echo "   • Total Assertions: {$totalStats['assertions']}\n";
echo "   • Execution Time: " . round($totalStats['time'], 2) . "s\n\n";

echo "📋 Test Suites:\n";
echo "   • Passed: " . colorize($totalStats['suites_passed'], 'green') . "\n";
echo "   • Failed: " . colorize($totalStats['suites_failed'], 'red') . "\n\n";

if ($totalStats['failures'] > 0 || $totalStats['errors'] > 0) {
    echo colorize("⚠️  Issues Found:", 'yellow') . "\n";
    echo "   • Failures: " . colorize($totalStats['failures'], 'red') . "\n";
    echo "   • Errors: " . colorize($totalStats['errors'], 'red') . "\n";
    
    if ($totalStats['warnings'] > 0) {
        echo "   • Warnings: " . colorize($totalStats['warnings'], 'yellow') . "\n";
    }
    
    echo "\n";
}

if ($totalStats['skipped'] > 0) {
    echo "⏭️  Skipped Tests: " . colorize($totalStats['skipped'], 'yellow') . "\n\n";
}

// Calculate success rate
$successRate = 0;
if ($totalStats['tests'] > 0) {
    $passed = $totalStats['tests'] - $totalStats['failures'] - $totalStats['errors'];
    $successRate = round(($passed / $totalStats['tests']) * 100, 1);
}

echo "🎯 Success Rate: ";
if ($successRate >= 95) {
    echo colorize($successRate . '%', 'green');
} elseif ($successRate >= 80) {
    echo colorize($successRate . '%', 'yellow');
} else {
    echo colorize($successRate . '%', 'red');
}
echo "\n\n";

// Security-specific report
echo colorize("🔒 SECURITY TEST ANALYSIS", 'cyan') . "\n";
echo str_repeat('=', 40) . "\n";

$securityPassed = true;
if (isset($allResults['Security Tests'])) {
    $securityResults = $allResults['Security Tests'];
    if ($securityResults['success']) {
        echo colorize("✅ All security tests passed - System is secure", 'green') . "\n";
    } else {
        echo colorize("❌ Security tests failed - CRITICAL ISSUES FOUND", 'red') . "\n";
        $securityPassed = false;
    }
} else {
    echo colorize("⚠️  Security tests not found", 'yellow') . "\n";
    $securityPassed = false;
}

// Recommendations
echo "\n" . colorize("💡 RECOMMENDATIONS", 'blue') . "\n";
echo str_repeat('=', 30) . "\n";

if (!$securityPassed) {
    echo "🚨 CRITICAL: Fix security issues immediately before deployment\n";
}

if ($successRate < 95) {
    echo "⚠️  Improve test coverage - aim for 95%+ success rate\n";
}

if ($totalStats['failures'] > 0) {
    echo "🔧 Fix failing tests before deploying to production\n";
}

if ($totalStats['warnings'] > 0) {
    echo "📝 Review and address test warnings\n";
}

echo "✅ Run tests regularly during development\n";
echo "📊 Monitor test performance and add more edge cases\n";

// Generate exit code
$exitCode = 0;
if ($totalStats['failures'] > 0 || $totalStats['errors'] > 0 || !$securityPassed) {
    $exitCode = 1;
}

echo "\n" . str_repeat('=', 60) . "\n";

if ($exitCode === 0) {
    echo colorize("🎉 ALL TESTS COMPLETED SUCCESSFULLY!", 'green') . "\n";
} else {
    echo colorize("❌ TESTS COMPLETED WITH ISSUES", 'red') . "\n";
}

echo "📋 Full test logs available in the command output above\n";
echo "🕒 Test execution completed at " . date('Y-m-d H:i:s') . "\n\n";

exit($exitCode);