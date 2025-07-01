<?php

namespace App\Http\Requests\Employee;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends BaseFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => $this->getNameValidationRules(),
            'employee_number' => [
                ...$this->getEmployeeNumberValidationRules(),
                'unique:employees,employee_number'
            ],
            'email' => [
                'required',
                'email:rfc',
                'max:255',
                'unique:users,email'
            ],
            'phone' => $this->getPhoneValidationRules(),
            'department' => [
                'required',
                'string',
                'max:100',
                Rule::in(['IT', 'HR', 'Finance', 'Academic', 'Administration', 'Security'])
            ],
            'position' => [
                'required',
                'string',
                'max:100'
            ],
            'employee_type' => [
                'required',
                Rule::in(['permanent', 'honorary', 'contract'])
            ],
            'status' => [
                'required',
                Rule::in(['active', 'inactive', 'terminated'])
            ],
            'join_date' => [
                'required',
                'date',
                'before_or_equal:today'
            ],
            'salary' => [
                'nullable',
                'numeric',
                'min:0',
                'max:999999999'
            ],
            'hourly_rate' => [
                'nullable',
                'numeric',
                'min:0',
                'max:999999'
            ],
            'address' => [
                'nullable',
                'string',
                'max:500'
            ],
            'date_of_birth' => [
                'nullable',
                'date',
                'before:today'
            ],
            'national_id' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^[0-9]+$/',
                'unique:employees,national_id'
            ],
            'bank_account' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[0-9\-]+$/'
            ],
            'emergency_contact_name' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[a-zA-Z\s\-\.\']+$/'
            ],
            'emergency_contact_phone' => $this->getPhoneValidationRules(),
            'avatar' => [
                'nullable',
                ...$this->getFileValidationRules(['jpeg', 'png', 'jpg'], 1024)
            ]
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'employee_number' => 'employee ID',
            'join_date' => 'joining date',
            'date_of_birth' => 'date of birth',
            'national_id' => 'national ID number',
            'bank_account' => 'bank account number',
            'emergency_contact_name' => 'emergency contact name',
            'emergency_contact_phone' => 'emergency contact phone',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return array_merge(parent::messages(), [
            'employee_number.regex' => 'The employee ID may only contain uppercase letters, numbers, and dashes.',
            'national_id.regex' => 'The national ID must contain only numbers.',
            'bank_account.regex' => 'The bank account number may only contain numbers and dashes.',
            'emergency_contact_name.regex' => 'The emergency contact name may only contain letters, spaces, dots, and apostrophes.',
        ]);
    }
}