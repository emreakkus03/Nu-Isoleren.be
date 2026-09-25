<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SeoInventory;
use Illuminate\Http\JsonResponse;

final class SeoInventoryController extends Controller
{
    public function __invoke(SeoInventory $inventory): JsonResponse
    {
        return response()->json(['data' => $inventory->entries()]);
    }
}
