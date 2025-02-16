<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetAllWordRelatedData extends Command
{
    protected $signature = 'db:reset {--words : Only reset words and buckets tables}';
    protected $description = 'Reset the database tables';

    public function handle()
    {
        if ($this->option('words')) {
            // Truncate specific tables
            DB::table('buckets')->truncate();
            DB::table('words')->truncate();
            $this->info('Word buckets and words tables have been truncated.');
        } else {
            // Migrate fresh
            $this->call('migrate:fresh', ['--seed' => true]);
            $this->info('All tables have been dropped and recreated with seed data.');
        }
    }
}
