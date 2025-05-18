<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GradeEssayRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = Auth::user();
        return $user && $user->hasRole('tutor');
    }

    public function rules(): array
    {
        return [
            'essay_id' => 'required|exists:essays,id',
            'words' => 'required|array',
            'feedback' => 'required|string',
        ];
    }
}
