<?php

namespace App\Http\Requests;

use App\GradeType;
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
        $validGrades = implode(',', GradeType::values());

        return [
            'essay_id' => 'required|exists:essays,id',
            'words' => 'required|array',
            'words.*.id' => 'required|integer|exists:words,id',
            'words.*.pivot' => 'required|array',
            'words.*.pivot.grade' => "nullable|in:{$validGrades}",
            'words.*.pivot.comment' => 'nullable|string|max:1000',
            'feedback' => 'string',
        ];
    }

    public function messages(): array
    {
        return [
            'words.*.pivot.grade.in' => 'The grade must be one of: ' . implode(', ', GradeType::values()),
            'words.*.id.exists' => 'One or more words do not exist in the database.',
            'words.*.pivot.comment.max' => 'Word comments cannot exceed 1000 characters.',
        ];
    }
}
