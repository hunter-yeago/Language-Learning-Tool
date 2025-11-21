<?php

namespace App;

/**
 * Grade types for word assessments
 *
 * This enum defines the valid grades that can be assigned to words
 * in the language learning system.
 */
enum GradeType: string
{
    case CORRECT = 'correct';
    case INCORRECT = 'incorrect';
    case PARTIALLY_CORRECT = 'partially_correct';
    case NOT_GRADED = 'not_graded';
    case NOT_USED = 'not_used';

    /**
     * Get all valid grade values as an array
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    /**
     * Check if a given value is a valid grade
     *
     * @param string|null $value
     * @return bool
     */
    public static function isValid(?string $value): bool
    {
        if ($value === null) {
            return true; // null is acceptable for ungraded words
        }

        return in_array($value, self::values(), true);
    }
}
