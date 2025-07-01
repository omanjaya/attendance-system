<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

abstract class BaseFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'status_code' => 422
            ], 422)
        );
    }

    /**
     * Get custom validation messages
     */
    public function messages(): array
    {
        return [
            'required' => 'The :attribute field is required.',
            'email' => 'The :attribute must be a valid email address.',
            'unique' => 'The :attribute has already been taken.',
            'min' => 'The :attribute must be at least :min characters.',
            'max' => 'The :attribute may not be greater than :max characters.',
            'confirmed' => 'The :attribute confirmation does not match.',
            'regex' => 'The :attribute format is invalid.',
            'in' => 'The selected :attribute is invalid.',
            'numeric' => 'The :attribute must be a number.',
            'integer' => 'The :attribute must be an integer.',
            'date' => 'The :attribute is not a valid date.',
            'before' => 'The :attribute must be a date before :date.',
            'after' => 'The :attribute must be a date after :date.',
            'image' => 'The :attribute must be an image.',
            'mimes' => 'The :attribute must be a file of type: :values.',
            'max_file_size' => 'The :attribute may not be greater than :max kilobytes.',
        ];
    }

    /**
     * Common validation rules for file uploads
     */
    protected function getFileValidationRules(array $allowedTypes = ['jpeg', 'png', 'jpg'], int $maxSize = 2048): array
    {
        return [
            'image',
            'mimes:' . implode(',', $allowedTypes),
            'max:' . $maxSize
        ];
    }

    /**
     * Common validation rules for passwords
     */
    protected function getPasswordValidationRules(bool $confirmed = true): array
    {
        $rules = [
            'required',
            'string',
            'min:8',
            'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/'
        ];

        if ($confirmed) {
            $rules[] = 'confirmed';
        }

        return $rules;
    }

    /**
     * Common validation rules for names
     */
    protected function getNameValidationRules(): array
    {
        return [
            'required',
            'string',
            'max:255',
            'regex:/^[a-zA-Z\s\-\.\']+$/'
        ];
    }

    /**
     * Common validation rules for phone numbers
     */
    protected function getPhoneValidationRules(): array
    {
        return [
            'nullable',
            'string',
            'regex:/^(\+62|62|0)[0-9]{9,13}$/'
        ];
    }

    /**
     * Common validation rules for employee numbers
     */
    protected function getEmployeeNumberValidationRules(): array
    {
        return [
            'required',
            'string',
            'max:20',
            'regex:/^[A-Z0-9\-]+$/'
        ];
    }

    /**
     * Sanitize input before validation
     */
    protected function prepareForValidation(): void
    {
        // Remove extra whitespace
        $input = $this->all();
        foreach ($input as $key => $value) {
            if (is_string($value)) {
                $input[$key] = trim($value);
            }
        }
        $this->replace($input);
    }

    /**
     * Get sanitized input with XSS protection
     */
    public function sanitized(): array
    {
        $input = $this->validated();
        return $this->sanitizeArray($input);
    }

    /**
     * Recursively sanitize array
     */
    private function sanitizeArray(array $data): array
    {
        $sanitized = [];
        
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $sanitized[$key] = $this->sanitizeArray($value);
            } elseif (is_string($value)) {
                $sanitized[$key] = $this->sanitizeString($value);
            } else {
                $sanitized[$key] = $value;
            }
        }
        
        return $sanitized;
    }

    /**
     * Sanitize string value
     */
    private function sanitizeString(string $value): string
    {
        // For fields that should allow HTML (like descriptions)
        if (in_array($this->getFieldName($value), ['description', 'notes', 'message'])) {
            return strip_tags($value, '<p><br><strong><em><ul><ol><li>');
        }
        
        // Regular sanitization
        return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Get field name from current context (simplified)
     */
    private function getFieldName(string $value): string
    {
        // This would need proper implementation based on your needs
        return '';
    }
}