<?php

use App\Http\Controllers\EssayController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WordBucketController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Essay;
use App\Models\WordBucket;
use Illuminate\Http\Request;

Route::get('/', function () {
    $essays = Essay::all();


    // how to show data
    dd($essays);
    // dd($essays[0]->title);

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// the Essay Contorller is doing the heavy lifting here
Route::get('/essays', [EssayController::class, 'index'])->name('essays.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Word buckets
Route::get('/wordbuckets', function () {
    
    $wordBuckets = WordBucket::with('words')->get();

    return Inertia::render('WordBuckets', [
        'wordBuckets' => $wordBuckets,
    ]);

})->middleware(['auth', 'verified'])->name('wordbuckets');
Route::get('/write-essay', function () {
    $wordBuckets = WordBucket::with('words')->get();

    return Inertia::render('WriteEssay', [
        'wordBuckets' => $wordBuckets,
    ]);
})->middleware(['auth', 'verified'])->name('write-essay');
Route::post('/word_buckets', [WordBucketController::class, 'store'])->name('wordbuckets.store');

Route::post('/start-essay', function (Request $request) {
    $bucket = $request->input('bucket');
    $words = $request->input('words', []);

    return Inertia::render('StartEssay', [
        'bucket' => $bucket,
        'words' => $words,
    ]);
})->middleware(['auth', 'verified'])->name('start-essay');



// Auth
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
