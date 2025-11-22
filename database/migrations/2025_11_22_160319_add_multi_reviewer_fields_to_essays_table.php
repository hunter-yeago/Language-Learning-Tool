<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('essays', function (Blueprint $table) {
            // Add primary_reviewer_id to track main assigned reviewer
            $table->foreignId('primary_reviewer_id')->nullable()->after('tutor_id')->constrained('users')->onDelete('set null');

            // Track if essay needs student review/approval
            $table->boolean('requires_student_review')->default(false)->after('status');

            // Track when student reviewed the graded essay
            $table->timestamp('student_reviewed_at')->nullable()->after('viewed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('essays', function (Blueprint $table) {
            $table->dropForeign(['primary_reviewer_id']);
            $table->dropColumn(['primary_reviewer_id', 'requires_student_review', 'student_reviewed_at']);
        });
    }
};
