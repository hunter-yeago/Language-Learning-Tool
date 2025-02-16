<?php

use App\Http\Controllers\EssayController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\bucketController;
use App\Http\Controllers\DictionaryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Essay;
use App\Models\bucket;
use Illuminate\Http\Request;

Route::get('/', function () {
    $essays = Essay::all();


    // how to show data
//    dd($essays);
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

// Go to Dashboard
Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Go to Dashboard
Route::get('/dictionary', function () {
    return Inertia::render('Dictionary');
})->middleware(['auth', 'verified'])->name('dictionary');

//Dictionary
Route::get('/lookup-word/{word}', [DictionaryController::class, 'lookup']);

// Go to CreateNewWordBank
Route::get('/create-new-word-bank', function () {

    $buckets = bucket::with('words')->get();

    return Inertia::render('CreateNewWordBank', [
        'buckets' => $buckets,
    ]);

})->middleware(['auth', 'verified'])->name('buckets');

Route::get('/word-bucket-dashboard', function (Request $request) {

    $buckets = bucket::with('words')->get();
    $bucketID = $request->query('bucketID');

    return Inertia::render('bucketsDashboard', [
        'buckets' => $buckets,
        'bucketID' => $bucketID,
    ]);

})->middleware(['auth', 'verified'])->name('word-bucket-dashboard');

// Start Adding Words
Route::post('/start-adding-words', function (Request $request) {

    $bucket = $request->input('bucket');
    $words = $request->input('words', []);

    // Return an Inertia response instead of a JSON response
    return Inertia::render('StartAddingWords', [
        'bucket' => $bucket,
        'words' => $words,
    ]);
})->middleware(['auth', 'verified'])->name('start-adding-words');

Route::get('/start-adding-words', function () {
    return redirect()->route('add-words');
})->middleware('auth', 'verified')->name('start-adding-words');

// Create Work Bucket
Route::post('/buckets', [bucketController::class, 'store'])->name('store-bucket');

// Add Words to Words Bucket
Route::post('/buckets/{bucketID}/add-new-words', [bucketController::class, 'addWords'])->name('add-new-words');


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
