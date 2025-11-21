<?php

use App\Http\Controllers\EssayController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BucketController;
use App\Http\Controllers\DictionaryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TutorController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('login-redirect', function() {
        return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Home
// All Users
Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/', [HomeController::class, 'index'])->name('/');
    
    // Dictionary
    Route::get('/dictionary', [DictionaryController::class, 'index'])->name('dictionary');
    Route::get('/lookup-word/{word}', [DictionaryController::class, 'lookup']);
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Tutor
Route::middleware(['auth', 'verified', 'role:tutor'])->name('tutor.')->group(function () {

    Route::get('/grade-essay', [TutorController::class, 'grade_essay'])->name('grade-essay');
    Route::post('/update-essay', [TutorController::class, 'update_essay'])->name('update-essay');
    Route::get('/students', [TutorController::class, 'students'])->name('students');
    Route::get('/tutor-view-essay', [TutorController::class, 'viewEssay'])->name('view-essay');
});

// Student
Route::middleware(['auth', 'verified', 'role:student'])->name('student.')->group(function () {

    // Progress Page
    Route::get('/progress', [StudentController::class, 'progress'])->name('progress');

    // Add Words
    Route::post('/add-words-page', [StudentController::class, 'addWordsPage'])->name('add-words-page');
    Route::get('/add-words-page', [StudentController::class, 'getAddWordsPage'])->name('add-words-page.get');

    // Write Essay
    Route::post('/write-essay', [StudentController::class, 'writeEssayPage'])->name('write-essay');
    Route::get('/write-essay', [StudentController::class, 'index']);

    // Update Bucket
    Route::controller(BucketController::class)->group(function () {
        Route::post('/buckets', 'store')->name('store-bucket');
        Route::post('/buckets/{bucketID}/add-new-words', 'addWords')->name('add-new-words');
        Route::delete('/buckets/{bucket_id}', 'destroy')->name('delete-bucket');
        Route::post('/buckets/check-word-exists', 'checkWordExists')->name('check-word-exists');
        Route::post('/buckets/add-word', 'addSingleWord')->name('add-word-to-bucket');
    });

    // Update Essay
    Route::controller(EssayController::class)->group(function () {
        Route::get('/essays', 'index')->name('essays.index');
        Route::post('/essays/write-essay', 'store')->name('store-essay');
    });

    // View Essay
    Route::get('/view-essay', [StudentController::class, 'viewEssay'])->name('view-essay');
});

require __DIR__.'/auth.php';