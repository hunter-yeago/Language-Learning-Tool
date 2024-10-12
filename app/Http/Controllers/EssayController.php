<?php

namespace App\Http\Controllers;

use App\Models\Essay;
use Illuminate\Http\Request;

class EssayController extends Controller
{
    public function index()
    {
        // Fetch all essays from the database
        $essays = Essay::all();

        // Return the data as JSON (for testing)
        return response()->json($essays);
    }
}
