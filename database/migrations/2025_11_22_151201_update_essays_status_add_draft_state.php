<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // PostgreSQL doesn't have ENUM directly in columns, it uses CHECK constraints
        // First, drop the existing constraint
        DB::statement("ALTER TABLE essays DROP CONSTRAINT IF EXISTS essays_status_check");

        // Add the new constraint with 'draft' included
        DB::statement("ALTER TABLE essays ADD CONSTRAINT essays_status_check CHECK (status IN ('draft', 'submitted', 'under_review', 'graded', 'returned'))");

        // Change the default value
        DB::statement("ALTER TABLE essays ALTER COLUMN status SET DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the constraint with 'draft'
        DB::statement("ALTER TABLE essays DROP CONSTRAINT IF EXISTS essays_status_check");

        // Re-add the old constraint without 'draft'
        DB::statement("ALTER TABLE essays ADD CONSTRAINT essays_status_check CHECK (status IN ('submitted', 'under_review', 'graded', 'returned'))");

        // Restore the old default
        DB::statement("ALTER TABLE essays ALTER COLUMN status SET DEFAULT 'submitted'");
    }
};
