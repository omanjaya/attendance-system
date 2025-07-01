<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Services\SqlInjectionPreventionService;

class SqlInjectionPreventionTest extends TestCase
{
    private SqlInjectionPreventionService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new SqlInjectionPreventionService();
    }

    /** @test */
    public function validate_query_detects_dangerous_patterns()
    {
        $dangerousQueries = [
            "DROP TABLE users",
            "DELETE FROM users WHERE 1=1",
            "SELECT * FROM users UNION SELECT * FROM passwords",
            "INSERT INTO users VALUES('hacker'); DROP TABLE users; --",
            "EXEC xp_cmdshell 'dir'",
            "SELECT * INTO OUTFILE '/tmp/users.txt' FROM users",
        ];

        foreach ($dangerousQueries as $query) {
            $isValid = $this->service->validateQuery($query);
            $this->assertFalse($isValid, "Query should be invalid: {$query}");
        }
    }

    /** @test */
    public function validate_query_allows_safe_patterns()
    {
        $safeQueries = [
            "SELECT * FROM users WHERE id = ?",
            "UPDATE users SET name = ? WHERE id = ?",
            "INSERT INTO users (name, email) VALUES (?, ?)",
            "SELECT u.name, e.department FROM users u JOIN employees e ON u.id = e.user_id",
            "SELECT COUNT(*) FROM attendances WHERE date = ?",
        ];

        foreach ($safeQueries as $query) {
            $isValid = $this->service->validateQuery($query);
            $this->assertTrue($isValid, "Query should be valid: {$query}");
        }
    }

    /** @test */
    public function create_safe_query_builds_correct_sql()
    {
        // Test simple query
        $query = $this->service->createSafeQuery('users', ['id' => 1], ['name', 'email']);
        $expected = "SELECT `name`, `email` FROM `users` WHERE `id` = ?";
        $this->assertStringContainsString('SELECT', $query);
        $this->assertStringContainsString('FROM', $query);
        $this->assertStringContainsString('WHERE', $query);
    }

    /** @test */
    public function create_safe_query_handles_no_conditions()
    {
        $query = $this->service->createSafeQuery('users', [], ['*']);
        $this->assertStringContainsString('SELECT * FROM', $query);
        $this->assertStringNotContainsString('WHERE', $query);
    }

    /** @test */
    public function create_safe_query_rejects_invalid_table_names()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid table name');
        
        $this->service->createSafeQuery('users; DROP TABLE passwords; --');
    }

    /** @test */
    public function create_safe_query_rejects_invalid_column_names()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid column name');
        
        $this->service->createSafeQuery('users', [], ['name; DROP TABLE users; --']);
    }

    /** @test */
    public function sanitize_user_input_removes_sql_comments()
    {
        $inputs = [
            "test -- comment" => "test",
            "test /* comment */" => "test",
            "SELECT * FROM users -- comment" => "SELECT * FROM users",
            "/* multi\nline\ncomment */ SELECT" => "SELECT",
        ];

        foreach ($inputs as $input => $expected) {
            $result = $this->service->sanitizeUserInput($input);
            $this->assertEquals($expected, trim($result), "Failed for input: {$input}");
        }
    }

    /** @test */
    public function sanitize_user_input_removes_dangerous_keywords()
    {
        $inputs = [
            "EXEC command" => "command",
            "test EXECUTE something" => "test something",
            "SP_executesql query" => "query",
            "BULK INSERT data" => "data",
            "SHUTDOWN server" => "server",
        ];

        foreach ($inputs as $input => $expected) {
            $result = $this->service->sanitizeUserInput($input);
            $this->assertEquals($expected, trim($result), "Failed for input: {$input}");
        }
    }

    /** @test */
    public function sanitize_user_input_removes_dangerous_characters()
    {
        $inputs = [
            "test'''query" => "testquery",
            'test"""query' => "testquery",
            "test;;query" => "testquery",
            "test\\\\query" => "testquery",
        ];

        foreach ($inputs as $input => $expected) {
            $result = $this->service->sanitizeUserInput($input);
            $this->assertEquals($expected, trim($result), "Failed for input: {$input}");
        }
    }

    /** @test */
    public function column_whitelist_contains_expected_tables()
    {
        $expectedTables = [
            'users',
            'employees', 
            'attendances',
            'leaves',
            'payroll_records',
            'notifications',
            'schedules',
            'periods'
        ];

        foreach ($expectedTables as $table) {
            $columns = $this->service->createColumnWhitelist($table);
            $this->assertIsArray($columns, "Should return array for table: {$table}");
            $this->assertNotEmpty($columns, "Should have columns for table: {$table}");
        }
    }

    /** @test */
    public function column_whitelist_returns_empty_for_unknown_table()
    {
        $columns = $this->service->createColumnWhitelist('unknown_table');
        $this->assertEmpty($columns);
    }

    /** @test */
    public function is_column_allowed_works_correctly()
    {
        // Test allowed columns
        $this->assertTrue($this->service->isColumnAllowed('users', 'id'));
        $this->assertTrue($this->service->isColumnAllowed('users', 'name'));
        $this->assertTrue($this->service->isColumnAllowed('users', '*'));

        // Test disallowed columns
        $this->assertFalse($this->service->isColumnAllowed('users', 'password'));
        $this->assertFalse($this->service->isColumnAllowed('users', 'secret_token'));

        // Test unknown table
        $this->assertFalse($this->service->isColumnAllowed('unknown_table', 'id'));
    }

    /** @test */
    public function validate_table_name_works_correctly()
    {
        $reflection = new \ReflectionClass($this->service);
        $method = $reflection->getMethod('isValidTableName');
        $method->setAccessible(true);

        // Valid table names
        $validNames = ['users', 'user_profiles', 'table123', 'Table_Name'];
        foreach ($validNames as $name) {
            $this->assertTrue($method->invoke($this->service, $name), "Should be valid: {$name}");
        }

        // Invalid table names
        $invalidNames = [
            '123table', // Starts with number
            'table-name', // Contains dash
            'table name', // Contains space
            'table;drop', // Contains semicolon
            '', // Empty string
            'table.name', // Contains dot
        ];
        foreach ($invalidNames as $name) {
            $this->assertFalse($method->invoke($this->service, $name), "Should be invalid: {$name}");
        }
    }

    /** @test */
    public function validate_column_name_works_correctly()
    {
        $reflection = new \ReflectionClass($this->service);
        $method = $reflection->getMethod('isValidColumnName');
        $method->setAccessible(true);

        // Valid column names
        $validNames = ['id', 'user_name', 'column123', '*', 'table.column', 'table.*'];
        foreach ($validNames as $name) {
            $this->assertTrue($method->invoke($this->service, $name), "Should be valid: {$name}");
        }

        // Invalid column names
        $invalidNames = [
            '123column', // Starts with number
            'column-name', // Contains dash
            'column name', // Contains space
            'column;drop', // Contains semicolon
            '', // Empty string
            'table.col.name', // Too many dots
        ];
        foreach ($invalidNames as $name) {
            $this->assertFalse($method->invoke($this->service, $name), "Should be invalid: {$name}");
        }
    }

    /** @test */
    public function escape_table_name_works_correctly()
    {
        $reflection = new \ReflectionClass($this->service);
        $method = $reflection->getMethod('escapeTableName');
        $method->setAccessible(true);

        $result = $method->invoke($this->service, 'users');
        $this->assertStringContainsString('`users`', $result);
    }

    /** @test */
    public function escape_column_name_works_correctly()
    {
        $reflection = new \ReflectionClass($this->service);
        $method = $reflection->getMethod('escapeColumnName');
        $method->setAccessible(true);

        // Test simple column
        $result = $method->invoke($this->service, 'name');
        $this->assertEquals('`name`', $result);

        // Test asterisk
        $result = $method->invoke($this->service, '*');
        $this->assertEquals('*', $result);

        // Test table.column format
        $result = $method->invoke($this->service, 'users.name');
        $this->assertEquals('`users`.`name`', $result);

        // Test table.* format
        $result = $method->invoke($this->service, 'users.*');
        $this->assertEquals('`users`.*', $result);
    }

    /** @test */
    public function sanitize_bindings_redacts_sensitive_data()
    {
        $reflection = new \ReflectionClass($this->service);
        $method = $reflection->getMethod('sanitizeBindings');
        $method->setAccessible(true);

        $bindings = [
            'john@example.com',
            'password123',
            'secret_token_abc',
            'normal_value'
        ];

        $result = $method->invoke($this->service, $bindings);

        $this->assertEquals('john@example.com', $result[0]);
        $this->assertEquals('[REDACTED]', $result[1]);
        $this->assertEquals('[REDACTED]', $result[2]);
        $this->assertEquals('normal_value', $result[3]);
    }
}