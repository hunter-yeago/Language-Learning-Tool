<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEssayRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && $user->hasRole('student');
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'bucket_id' => 'required|exists:buckets,id',
            'content' => 'required|string',
            'words' => 'nullable|array',
            'words.*.id' => 'required_with:words|integer|exists:words,id',
            'words.*.used' => 'boolean',
            'tutor_id' => 'required|exists:users,id',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
