<?php

use App\Http\Controllers\ExpenseCategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\Dashboard;

use App\Models\Expense;
use App\Http\Controllers\BudgetController;

use App\Http\Controllers\ExpenseBudgetController;

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
    Route::get('/transactions', [ExpenseBudgetController::class, 'getExpensesAndBudgets']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/expenses', [ExpenseController::class, 'index']);
    Route::apiResource('expenses', ExpenseController::class);
    Route::apiResource("categories", ExpenseCategoryController::class);

    Route::get('/getTotal', [ExpenseController::class, 'getTotalExpense']);
    Route::get('/totalMonth', [ExpenseController::class, 'getTotalForMonth']);
    // Route::get('/expenses-by-day', [ExpenseController::class, 'getExpensesPerDay']);



    // dash

    Route::get('/getSummary', [Dashboard::class, 'getExpenseSummaryAll']);
    Route::get('/getMonthlyExpenses', [Dashboard::class, 'getMonthlyExpenses']);
    Route::get('/getYearlyExpenses', [Dashboard::class, 'getYearlyExpenses']);
    Route::get('/getWeeklyExpenses', [Dashboard::class, 'getWeeklyExpenses']);
    Route::get('/recentTransactions', [Dashboard::class, 'recentTransactions']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    // Route::get('/me', [AuthController::class, 'me']);


    Route::get('/budget/{month}/{year}', [BudgetController::class, 'getBudgetForMonth']);
    Route::post('/budget', [BudgetController::class, 'store']);
    Route::put('/budget/{id}', [BudgetController::class, 'update']);
    Route::delete('/budget/{id}', [BudgetController::class, 'destroy']);
});


Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);


/*

SELECT expenseId AS id, amount, date, description, 'expense' AS type FROM expenses WHERE user_id = 4 UNION SELECT budgetId AS id, amount, STR_TO_DATE(CONCAT(year, '-', month, '-01'), '%Y-%m-%d') AS date, description, 'budget' AS type FROM budgets WHERE user_id =4 ORDER BY date DESC; 
*/