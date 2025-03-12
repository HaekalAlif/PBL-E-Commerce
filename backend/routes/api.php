<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;

require __DIR__.'/auth.php';

// Protected routes (requiring authentication)
Route::middleware(['auth:sanctum'])->group(function () {
    // User routes
    Route::get('/user/profile', [UserController::class, 'getCurrentUser']);
});