<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
//php artisan make:request Api/V1/LoginUserRequest
class LoginUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Only allow MinSU student/counselor emails from the official domain
            'email' => ['required', 'string', 'email', 'ends_with:minsu.edu.ph'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }
}
