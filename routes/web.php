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

    return Inertia::render('WelcomePage', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Pages

// Dashboard Page
Route::get('/', function (Request $request) {
    
    $essays = Essay::where('user_id', Auth::id())->with('words')->get();
    $buckets = Bucket::where('user_id', Auth::id())->with('words')->get();
    
    // If a bucket param is passed in
    $bucketID = $request->query('bucketID');

    return Inertia::render('Dashboard', [
        'essays' => $essays,
        'buckets' => $buckets,
        'bucketID' => $bucketID,
    ]);

})->middleware(['auth', 'verified'])->name('/');

// Dictionary Page
Route::get('/dictionary', function () {
    return Inertia::render('DictionaryPage');
})->middleware(['auth', 'verified'])->name('dictionary');

// Tutor Essay Page
Route::post('/tutor-essay-page', function (Request $request) {
    
    $essay = $request->input('essay');
    return Inertia::render('TutorEssayPage', ['essay' => $essay]);
})->middleware(['auth', 'verified'])->name('tutor-essay-page');

// Add Words Page

    // Start Adding Words Page
    Route::post('/add-words-page', function (Request $request) {

        $bucket = $request->input('bucket');
        
        // instead of passing this stuff from the frontend - shouldn't I just pass
        // the bucket ID in the $request, and then go and grab the words and bucket from here 
        // something like $buckets = Bucket::where('user_id', $request->input('bucketID'))->with('words')->get();
        $words = $request->input('words', []);

        // Return an Inertia response instead of a JSON response
        return Inertia::render('AddWordsPage', [
            'bucket' => $bucket,
            'words' => $words,
        ]);
    })->middleware(['auth', 'verified'])->name('add-words-page');

    // Leaving Add Words Page
    Route::get('/add-words-page', function () {
        return redirect()->route('/');
    })->middleware('auth', 'verified')->name('add-words-page');

// Write Essay Page

    // Go to Write Essay Page
    Route::post('/write-essay', function (Request $request) {
        $bucket = $request->input('bucket');
        // $words = $request->input('words', []);

        return Inertia::render('WriteEssayPage', [
            'bucket' => $bucket,
            'words' => $bucket['words'],
        ]);
    })->middleware(['auth', 'verified'])->name('write-essay');

    // Leaving Write Essay Page
    Route::get('/write-essay', function (Request $request) {

        $essays = Essay::where('user_id', Auth::id())->with('words')->get();
        $buckets = Bucket::where('user_id', Auth::id())->with('words')->get();
        
        // If a bucket param is passed in
        $bucketID = $request->query('bucketID');

        return Inertia::render('Dashboard', [
            'essays' => $essays,
            'buckets' => $buckets,
            'bucketID' => $bucketID,
        ]);

    })->middleware(['auth', 'verified'])->name('dashboard');




// CRUD Routes

// do I really need ->name() ?

Route::controller(BucketController::class)->group(function () {
    Route::post('/buckets', 'store')->name('store-bucket');
    Route::post('/buckets/{bucketID}/add-new-words', 'addWords')->name('add-new-words');
});

Route::controller(EssayController::class)->group(function () {
    Route::get('/essays', 'index')->name('essays.index');
    Route::post('/essays', 'store')->name('store-essay');
});

    // Lookup Words in Dictionary
    Route::get('/lookup-word/{word}', [DictionaryController::class, 'lookup']);

// Auth
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
