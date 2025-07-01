<?php

namespace App\Http\Requests\Attendance;

use App\Http\Requests\BaseFormRequest;

class ClockInRequest extends BaseFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'employee_id' => [
                'required',
                'integer',
                'exists:employees,id'
            ],
            'face_data' => [
                'nullable',
                'string',
                'max:10000' // Base64 encoded face data
            ],
            'location' => [
                'nullable',
                'array'
            ],
            'location.latitude' => [
                'required_with:location',
                'numeric',
                'between:-90,90'
            ],
            'location.longitude' => [
                'required_with:location',
                'numeric',
                'between:-180,180'
            ],
            'location.accuracy' => [
                'nullable',
                'numeric',
                'min:0'
            ],
            'device_info' => [
                'nullable',
                'array'
            ],
            'device_info.user_agent' => [
                'nullable',
                'string',
                'max:500'
            ],
            'device_info.ip_address' => [
                'nullable',
                'ip'
            ],
            'notes' => [
                'nullable',
                'string',
                'max:500'
            ]
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'employee_id' => 'employee',
            'face_data' => 'face recognition data',
            'location.latitude' => 'latitude',
            'location.longitude' => 'longitude',
            'location.accuracy' => 'location accuracy',
            'device_info.user_agent' => 'device information',
            'device_info.ip_address' => 'IP address',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();
        
        // Sanitize device info
        if ($this->has('device_info')) {
            $deviceInfo = $this->device_info;
            
            // Get real IP address
            $realIp = $this->ip();
            $deviceInfo['ip_address'] = $realIp;
            
            // Sanitize user agent
            if (isset($deviceInfo['user_agent'])) {
                $deviceInfo['user_agent'] = substr(strip_tags($deviceInfo['user_agent']), 0, 500);
            }
            
            $this->merge(['device_info' => $deviceInfo]);
        }
    }
}