<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SqlInjectionPreventionService
{
    /**
     * Validate and sanitize database queries
     */
    public function validateQuery(string $query, array $bindings = []): bool
    {
        // Check for dangerous SQL keywords outside of proper context
        $dangerousPatterns = [
            '/\b(DROP|DELETE|TRUNCATE|ALTER|CREATE)\s+(?!.*WHERE|.*JOIN)/i',
            '/\bUNION\s+(?:ALL\s+)?SELECT\b/i',
            '/\b(EXEC|EXECUTE|SP_)\b/i',
            '/\bINTO\s+(?:OUTFILE|DUMPFILE)\b/i',
            '/\bLOAD_FILE\s*\(/i',
            '/\b(INFORMATION_SCHEMA|MYSQL\.USER|PG_)\b/i',
            '/;\s*(?:DROP|DELETE|INSERT|UPDATE|CREATE|ALTER)/i',
        ];

        foreach ($dangerousPatterns as $pattern) {
            if (preg_match($pattern, $query)) {
                Log::channel('security')->warning('Potentially dangerous SQL query detected', [
                    'query' => $query,
                    'bindings' => $this->sanitizeBindings($bindings),
                    'user_id' => auth()->id(),
                    'ip' => request()->ip(),
                    'pattern_matched' => $pattern
                ]);
                return false;
            }
        }

        return true;
    }

    /**
     * Sanitize bindings for logging
     */
    private function sanitizeBindings(array $bindings): array
    {
        $sensitiveFields = ['password', 'token', 'secret', 'key'];
        
        return array_map(function ($binding) use ($sensitiveFields) {
            if (is_string($binding)) {
                foreach ($sensitiveFields as $field) {
                    if (stripos($binding, $field) !== false) {
                        return '[REDACTED]';
                    }
                }
            }
            return $binding;
        }, $bindings);
    }

    /**
     * Create safe parameterized query
     */
    public function createSafeQuery(string $table, array $conditions = [], array $select = ['*']): string
    {
        // Validate table name
        if (!$this->isValidTableName($table)) {
            throw new \InvalidArgumentException('Invalid table name');
        }

        // Validate column names
        foreach ($select as $column) {
            if (!$this->isValidColumnName($column)) {
                throw new \InvalidArgumentException("Invalid column name: {$column}");
            }
        }

        foreach (array_keys($conditions) as $column) {
            if (!$this->isValidColumnName($column)) {
                throw new \InvalidArgumentException("Invalid column name: {$column}");
            }
        }

        // Build safe query
        $selectClause = implode(', ', array_map([$this, 'escapeColumnName'], $select));
        $query = "SELECT {$selectClause} FROM " . $this->escapeTableName($table);

        if (!empty($conditions)) {
            $whereClause = [];
            foreach (array_keys($conditions) as $column) {
                $whereClause[] = $this->escapeColumnName($column) . ' = ?';
            }
            $query .= ' WHERE ' . implode(' AND ', $whereClause);
        }

        return $query;
    }

    /**
     * Validate table name
     */
    private function isValidTableName(string $table): bool
    {
        // Only allow alphanumeric characters and underscores
        return preg_match('/^[a-zA-Z][a-zA-Z0-9_]*$/', $table) === 1;
    }

    /**
     * Validate column name
     */
    private function isValidColumnName(string $column): bool
    {
        // Allow column names, with optional table prefix and asterisk
        if ($column === '*') {
            return true;
        }
        
        // Handle table.column format
        if (str_contains($column, '.')) {
            $parts = explode('.', $column);
            if (count($parts) !== 2) {
                return false;
            }
            return $this->isValidTableName($parts[0]) && ($parts[1] === '*' || $this->isValidColumnName($parts[1]));
        }

        // Regular column name validation
        return preg_match('/^[a-zA-Z][a-zA-Z0-9_]*$/', $column) === 1;
    }

    /**
     * Escape table name
     */
    private function escapeTableName(string $table): string
    {
        return DB::getTablePrefix() . '`' . str_replace('`', '``', $table) . '`';
    }

    /**
     * Escape column name
     */
    private function escapeColumnName(string $column): string
    {
        if ($column === '*') {
            return '*';
        }

        if (str_contains($column, '.')) {
            $parts = explode('.', $column);
            return '`' . str_replace('`', '``', $parts[0]) . '`.' . 
                   ($parts[1] === '*' ? '*' : '`' . str_replace('`', '``', $parts[1]) . '`');
        }

        return '`' . str_replace('`', '``', $column) . '`';
    }

    /**
     * Execute safe query with logging
     */
    public function executeSafeQuery(string $query, array $bindings = [])
    {
        if (!$this->validateQuery($query, $bindings)) {
            throw new \InvalidArgumentException('Query contains potentially dangerous patterns');
        }

        try {
            $startTime = microtime(true);
            $result = DB::select($query, $bindings);
            $executionTime = (microtime(true) - $startTime) * 1000;

            // Log slow queries
            if ($executionTime > 1000) { // 1 second
                Log::channel('performance')->warning('Slow query detected', [
                    'query' => $query,
                    'execution_time_ms' => round($executionTime, 2),
                    'bindings_count' => count($bindings),
                    'result_count' => count($result),
                    'user_id' => auth()->id()
                ]);
            }

            return $result;

        } catch (\Exception $e) {
            Log::channel('security')->error('Query execution failed', [
                'query' => $query,
                'bindings' => $this->sanitizeBindings($bindings),
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'ip' => request()->ip()
            ]);

            throw $e;
        }
    }

    /**
     * Prevent common SQL injection patterns in user input
     */
    public function sanitizeUserInput(string $input): string
    {
        // Remove SQL comments
        $input = preg_replace('/--.*$/m', '', $input);
        $input = preg_replace('/\/\*.*?\*\//s', '', $input);

        // Remove dangerous keywords at word boundaries
        $dangerousKeywords = [
            'EXEC', 'EXECUTE', 'SP_', 'XP_', 'OPENROWSET', 'OPENDATASOURCE',
            'BULK', 'INSERT', 'SHUTDOWN', 'DUMP', 'RESTORE'
        ];

        foreach ($dangerousKeywords as $keyword) {
            $input = preg_replace('/\b' . preg_quote($keyword, '/') . '\b/i', '', $input);
        }

        // Remove multiple consecutive special characters that could be injection attempts
        $input = preg_replace('/[\'";\\\\]{2,}/', '', $input);

        return trim($input);
    }

    /**
     * Create whitelist-based column validator
     */
    public function createColumnWhitelist(string $table): array
    {
        $allowedColumns = [
            'users' => ['id', 'name', 'email', 'created_at', 'updated_at'],
            'employees' => ['id', 'name', 'employee_number', 'department', 'position', 'status', 'created_at'],
            'attendances' => ['id', 'employee_id', 'date', 'clock_in', 'clock_out', 'status', 'total_hours'],
            'leaves' => ['id', 'employee_id', 'type', 'start_date', 'end_date', 'days', 'status'],
            'payroll_records' => ['id', 'employee_id', 'period_start', 'period_end', 'gross_pay', 'net_pay', 'status'],
            'notifications' => ['id', 'user_id', 'type', 'title', 'message', 'read_at', 'created_at'],
            'schedules' => ['id', 'employee_id', 'day_of_week', 'start_time', 'end_time', 'is_active'],
            'periods' => ['id', 'name', 'start_time', 'end_time', 'day_of_week'],
        ];

        return $allowedColumns[$table] ?? [];
    }

    /**
     * Validate column against whitelist
     */
    public function isColumnAllowed(string $table, string $column): bool
    {
        $allowedColumns = $this->createColumnWhitelist($table);
        return in_array($column, $allowedColumns) || $column === '*';
    }

    /**
     * Log suspicious query attempts
     */
    public function logSuspiciousActivity(string $query, array $context = []): void
    {
        Log::channel('security')->warning('Suspicious SQL activity detected', array_merge([
            'query' => $query,
            'user_id' => auth()->id(),
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now()->toISOString(),
        ], $context));
    }
}