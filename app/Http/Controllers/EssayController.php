<?php
// app/Http/Controllers/EssayController.php

namespace App\Http\Controllers;

use App\Models\Essay;
use Inertia\Inertia;
use Illuminate\Http\Request;

class EssayController extends Controller
{
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
