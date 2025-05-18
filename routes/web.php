<?php

use App\Http\Controllers\EssayController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BucketController;
use App\Http\Controllers\DictionaryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TutorController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
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
Route::get('/', [HomeController::class, 'index'])->name('home');

// Tutor
Route::middleware(['auth', 'verified', 'role:tutor'])
    ->name('tutor.')
    ->group(function () {
    Route::get('/dashboard', [TutorController::class, 'dashboard'])->name('dashboard');
    Route::get('/essay-page', [TutorController::class, 'showEssayPage'])->name('essay-page');
    Route::post('/essay-page', [TutorController::class, 'storeEssayPage'])->name('essay-page.store');

    Route::post('/update-bucket-and-essay', [EssayController::class, 'gradeEssay'])->name('update-bucket-and-essay');
});

// Student
Route::middleware(['auth', 'verified', 'role:student'])
    ->name('student.')
    ->group(function () {
    
    Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');

    Route::post('/add-words-page', [StudentDashboardController::class, 'addWordsPage'])->name('add-words-page');
    Route::get('/add-words-page', fn() => redirect()->route('student.dashboard'));

    Route::post('/write-essay', [StudentDashboardController::class, 'writeEssayPage'])->name('write-essay');
    Route::get('/write-essay', [StudentDashboardController::class, 'redirectToDashboard']);

    Route::controller(BucketController::class)->group(function () {
        Route::post('/buckets', 'store')->name('store-bucket');
        Route::post('/buckets/{bucketID}/add-new-words', 'addWords')->name('add-new-words');
    });

    Route::controller(EssayController::class)->group(function () {
        Route::get('/essays', 'index')->name('essays.index');
        Route::post('/essays/write-essay', 'store')->name('store-essay');
    });
});

// Dictionary
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dictionary', fn() => Inertia::render('DictionaryPage'))->name('dictionary');
    Route::get('/lookup-word/{word}', [DictionaryController::class, 'lookup']);
});

// Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
