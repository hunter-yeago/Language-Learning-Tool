<?php

namespace App\Http\Controllers;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class DictionaryController extends Controller
{

    public function lookup($word): JsonResponse
    {
        $client = new Client();

        try {
            $response = $client->request('GET', 'https://lingua-robot.p.rapidapi.com/language/v1/entries/en/'  . $word, [
                'headers' => [
                    'X-RapidAPI-Host' => 'lingua-robot.p.rapidapi.com',
                    'X-RapidAPI-Key' => '7e4a40fd34msh43056d0fad7f73fp1eb448jsn2137a74626d0'
                ]
            ]);

            $body = $response->getBody();
            $content = json_decode($body, true);

            return response()->json(['success' => true, 'response' => $content]);

        } catch (Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Request failed: ' . $e->getMessage()], 500);
        } catch (GuzzleException $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Request failed: ' . $e->getMessage()], 500);
        }
    }
}
