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
            'tutor_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string|max:1000',
            'status' => 'required|in:draft,submitted',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Only validate tutor connection if status is 'submitted'
            if ($this->status === 'submitted') {
                $tutorId = $this->tutor_id;

                if (!$tutorId) {
                    $validator->errors()->add('tutor_id', 'You must select a tutor before submitting.');
                    return;
                }

                // Check if student is connected to this tutor
                $isConnected = $this->user()->tutors()
                    ->where('tutor_id', $tutorId)
                    ->exists();

                if (!$isConnected) {
                    $validator->errors()->add('tutor_id', 'You are not connected to this tutor.');
                }
            }
        });
    }
}
