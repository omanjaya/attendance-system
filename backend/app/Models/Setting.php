<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Setting Model
 * 
 * Manages application-wide settings with caching for performance.
 * Supports different value types: string, integer, boolean, json.
 * 
 * @property int $id
 * @property string $key
 * @property string|null $value
 * @property string $type
 * @property string|null $description
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class Setting extends Model
{
    use HasFactory;

    /**
     * Setting types
     */
    public const TYPE_STRING = 'string';
    public const TYPE_INTEGER = 'integer';
    public const TYPE_BOOLEAN = 'boolean';
    public const TYPE_DECIMAL = 'decimal';
    public const TYPE_JSON = 'json';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
    ];

    /**
     * Cache TTL in seconds (1 hour)
     */
    private const CACHE_TTL = 3600;

    /**
     * Cache key prefix
     */
    private const CACHE_PREFIX = 'setting:';

    /**
     * Get a setting value by key with optional default
     */
    public static function getValue(string $key, mixed $default = null): mixed
    {
        $cacheKey = self::CACHE_PREFIX . $key;
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($key, $default) {
            $setting = self::where('key', $key)->first();
            
            if (!$setting) {
                return $default;
            }
            
            return self::castValue($setting->value, $setting->type);
        });
    }

    /**
     * Set a setting value by key
     */
    public static function setValue(string $key, mixed $value, string $type = null, string $description = null): bool
    {
        $type = $type ?? self::detectType($value);
        $valueString = self::convertValueToString($value, $type);
        
        $setting = self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $valueString,
                'type' => $type,
                'description' => $description ?? self::find($key)?->description,
            ]
        );

        // Clear cache
        Cache::forget(self::CACHE_PREFIX . $key);

        return $setting->wasRecentlyCreated || $setting->wasChanged();
    }

    /**
     * Delete a setting
     */
    public static function deleteSetting(string $key): bool
    {
        $deleted = self::where('key', $key)->delete();
        
        if ($deleted) {
            Cache::forget(self::CACHE_PREFIX . $key);
        }
        
        return $deleted > 0;
    }

    /**
     * Get multiple settings at once
     */
    public static function getMultiple(array $keys, array $defaults = []): array
    {
        $results = [];
        
        foreach ($keys as $key) {
            $default = $defaults[$key] ?? null;
            $results[$key] = self::getValue($key, $default);
        }
        
        return $results;
    }

    /**
     * Set multiple settings at once
     */
    public static function setMultiple(array $settings): int
    {
        $updated = 0;
        
        foreach ($settings as $key => $value) {
            if (self::setValue($key, $value)) {
                $updated++;
            }
        }
        
        return $updated;
    }

    /**
     * Check if a setting exists
     */
    public static function exists(string $key): bool
    {
        return self::where('key', $key)->exists();
    }

    /**
     * Get all settings as an associative array
     */
    public static function getAllSettings(): array
    {
        return Cache::remember('settings:all', self::CACHE_TTL, function () {
            $settings = self::all();
            $result = [];
            
            foreach ($settings as $setting) {
                $result[$setting->key] = self::castValue($setting->value, $setting->type);
            }
            
            return $result;
        });
    }

    /**
     * Clear all settings cache
     */
    public static function clearCache(): void
    {
        // Clear specific setting caches
        $keys = self::pluck('key');
        foreach ($keys as $key) {
            Cache::forget(self::CACHE_PREFIX . $key);
        }
        
        // Clear all settings cache
        Cache::forget('settings:all');
    }

    /**
     * Get settings by prefix
     */
    public static function getByPrefix(string $prefix): array
    {
        $settings = self::where('key', 'like', $prefix . '%')->get();
        $result = [];
        
        foreach ($settings as $setting) {
            $result[$setting->key] = self::castValue($setting->value, $setting->type);
        }
        
        return $result;
    }

    /**
     * Cast value to appropriate type
     */
    private static function castValue(?string $value, string $type): mixed
    {
        if ($value === null) {
            return null;
        }
        
        return match ($type) {
            self::TYPE_INTEGER => (int) $value,
            self::TYPE_BOOLEAN => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            self::TYPE_DECIMAL => (float) $value,
            self::TYPE_JSON => json_decode($value, true),
            default => $value,
        };
    }

    /**
     * Convert value to string for storage
     */
    private static function convertValueToString(mixed $value, string $type): string
    {
        return match ($type) {
            self::TYPE_BOOLEAN => $value ? '1' : '0',
            self::TYPE_JSON => json_encode($value),
            default => (string) $value,
        };
    }

    /**
     * Detect type from value
     */
    private static function detectType(mixed $value): string
    {
        return match (true) {
            is_bool($value) => self::TYPE_BOOLEAN,
            is_int($value) => self::TYPE_INTEGER,
            is_float($value) => self::TYPE_DECIMAL,
            is_array($value) || is_object($value) => self::TYPE_JSON,
            default => self::TYPE_STRING,
        };
    }

    /**
     * Get available types
     */
    public static function getTypes(): array
    {
        return [
            self::TYPE_STRING => 'String',
            self::TYPE_INTEGER => 'Integer',
            self::TYPE_BOOLEAN => 'Boolean',
            self::TYPE_DECIMAL => 'Decimal',
            self::TYPE_JSON => 'JSON',
        ];
    }

    /**
     * Boot method to clear cache when setting is updated
     */
    protected static function boot()
    {
        parent::boot();

        static::saved(function ($setting) {
            Cache::forget(self::CACHE_PREFIX . $setting->key);
            Cache::forget('settings:all');
        });

        static::deleted(function ($setting) {
            Cache::forget(self::CACHE_PREFIX . $setting->key);
            Cache::forget('settings:all');
        });
    }

    /**
     * Get the human-readable type name.
     */
    public function getTypeNameAttribute(): string
    {
        return self::getTypes()[$this->type] ?? $this->type;
    }

    /**
     * Get the parsed value attribute.
     */
    public function getParsedValueAttribute(): mixed
    {
        return self::castValue($this->value, $this->type);
    }
}