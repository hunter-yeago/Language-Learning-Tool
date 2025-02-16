<?php
// app/Http/Controllers/EssayController.php

namespace App\Http\Controllers;

use App\Models\Essay;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EssayController extends Controller
{

    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        // protected $fillable = ['title', 'content', 'user_id', 'bucket_id', 'pending_tutor_review'];

        echo 'testing: ';
        print_r($request);

        // Create the Essay
        $essay = Essay::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            // 'bucket_id' => 
            'user_id' => Auth::id(),
        ]);

        // I also have to enter the information into the essay_join tables?

        
        // return redirect()->route('bucket-dashboard', ['bucketID' => $bucket->id])
        //     ->with('success', 'Words added successfully!');
    }

    public function index()
    {
        // Fetch all essays from the database
        $essays = Essay::all();

        // Return the data using Inertia
        return Inertia::render('Essays', [
            'essays' => $essays,
        ]);
    }
}
