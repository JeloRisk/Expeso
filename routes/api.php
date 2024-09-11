<?php

use App\Http\Controllers\ExpenseCategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ExpenseController;
use App\Models\Expense;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/expenses', [ExpenseController::class, 'index']);
    Route::apiResource('expenses', ExpenseController::class);
    Route::apiResource("categories", ExpenseCategoryController::class);
    // Route::get('/expenses-by-day', [ExpenseController::class, 'getExpensesPerDay']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    // Route::get('/me', [AuthController::class, 'me']);

});


Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
