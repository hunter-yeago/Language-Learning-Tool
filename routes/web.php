<?php

use App\Http\Controllers\EssayController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BucketController;
use App\Http\Controllers\DictionaryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Essay;
use App\Models\bucket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {

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

// Go to Dictionary
Route::get('/dictionary', function () {
    return Inertia::render('Dictionary');
})->middleware(['auth', 'verified'])->name('dictionary');

//Dictionary
Route::get('/lookup-word/{word}', [DictionaryController::class, 'lookup']);

// Go to CreateNewWordBank
Route::get('/create-new-word-bank', function () {

    $buckets = Bucket::with('words')->get();

    return Inertia::render('CreateNewWordBank', [
        'buckets' => $buckets,
    ]);

})->middleware(['auth', 'verified'])->name('buckets');

// Go to Tutor Essay Page
Route::post('/tutor-essay-page', function (Request $request) {
    
    $essay = $request->input('essay');
    return Inertia::render('TutorEssayPage', ['essay' => $essay]);
})->middleware(['auth', 'verified'])->name('tutor-essay-page');


Route::get('/bucket-dashboard', function (Request $request) {
    
    $essays = Essay::where('user_id', Auth::id())->with('words')->get();
    $buckets = Bucket::where('user_id', Auth::id())->with('words')->get();
    
    // If a bucket param is passed in
    $bucketID = $request->query('bucketID');
    // dd($buckets);

    return Inertia::render('BucketsDashboard', [
        'essays' => $essays,
        'buckets' => $buckets,
        'bucketID' => $bucketID,
    ]);

})->middleware(['auth', 'verified'])->name('bucket-dashboard');

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
Route::post('/buckets', [BucketController::class, 'store'])->name('store-bucket');

// Create Essay
Route::post('/essays', [EssayController::class, 'store'])->name('store-essay');

// Add Words to Words Bucket
Route::post('/buckets/{bucketID}/add-new-words', [BucketController::class, 'addWords'])->name('add-new-words');

// place holder to deal with get on /start-essay
Route::get('/start-essay', function () {
    return Inertia::render('Dictionary');
})->middleware(['auth', 'verified'])->name('dictionary');


Route::post('/start-essay', function (Request $request) {
    $bucket = $request->input('bucket');
    $words = $request->input('words', []);

    return Inertia::render('StartEssay', [
        'bucket' => $bucket,
        'words' => $words,
    ]);
})->middleware(['auth', 'verified'])->name('start-essay');


Route::get('/add-words-form', function (Request $request) {
    $bucket = $request->input('bucket');
    $words = $request->input('words', []);

    return Inertia::render('AddWordsForm', [
        'bucket' => $bucket,
        'words' => $words,
    ]);
})->middleware(['auth', 'verified'])->name('add-words-form');



// Auth
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
