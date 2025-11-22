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
        Schema::table('essay_word_join', function (Blueprint $table) {
            // Consensus grade calculated from all reviews
            $table->string('consensus_grade')->nullable()->after('grade');

            // Confidence level (0-100) of consensus
            $table->integer('consensus_confidence')->nullable()->after('consensus_grade');

            // Student's approved grade (what they actually accepted)
            $table->string('student_approved_grade')->nullable()->after('consensus_confidence');

            // Number of reviewers who graded this word
            $table->integer('review_count')->default(0)->after('student_approved_grade');

            // Timestamp when student approved the grade
            $table->timestamp('student_approved_at')->nullable()->after('review_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('essay_word_join', function (Blueprint $table) {
            $table->dropColumn([
                'consensus_grade',
                'consensus_confidence',
                'student_approved_grade',
                'review_count',
                'student_approved_at'
            ]);
        });
    }
};
