<?php
// app/Http/Controllers/EssayController.php

namespace App\Http\Controllers;

use App\Models\Essay;
use Inertia\Inertia;
use Illuminate\Http\Request;

class EssayController extends Controller
{

    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'pending_tutor_review' => 'required|boolean'
        ]);

        // protected $fillable = ['title', 'content', 'user_id', 'bucket_id', 'pending_tutor_review'];

        // Create the Essay
        $essay = Essay::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'pending_tutor_review' => $validated['pending_tutor_review'] ?? false,
        ]);

        
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
