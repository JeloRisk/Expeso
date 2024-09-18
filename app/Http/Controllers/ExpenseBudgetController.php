<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Expense;
use App\Models\ExpenseCategory;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

class ExpenseBudgetController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getExpensesAndBudgets(Request $request)
    {
        try {
            $userId = auth()->id();
            $type = $request->query('type', 'expense'); // Default to 'expense'
            $categoryId = $request->query('category_id', null); // Get the category filter if provided
            $category = ExpenseCategory::where('name', $categoryId)->first();

            if ($type === 'expense') {
                $query = Expense::where('user_id', $userId)->with('category');
                if ($category) {
                    $query->where('category_id', $category->category_id);
                }
                $expenses = $query->get();
                $transactions = $expenses;
            } elseif ($type === 'budget') {
                // Budgets have no categories, proceed as normal
                $budgets = DB::table('budgets')
                    ->where('user_id', $userId)
                    ->select('budgetId as id', 'amount', DB::raw("STR_TO_DATE(CONCAT(year, '-', month, '-01'), '%Y-%m-%d') as date"), 'description', 'type')
                    ->get();
                $transactions = $budgets;
            } else {
                // For 'all', combine expenses and budgets
                $query = Expense::where('user_id', $userId)->with('category');
                if ($categoryId) {
                    $query->where('category_id', $categoryId);
                }
                $expenses = $query->get();
                $budgets = DB::table('budgets')
                    ->where('user_id', $userId)
                    ->select('budgetId as id', 'amount', DB::raw("STR_TO_DATE(CONCAT(year, '-', month, '-01'), '%Y-%m-%d') as date"), 'description', 'type')
                    ->get();
                $transactions = $expenses->concat($budgets);
            }

            // Sorting and pagination
            $sortedTransactions = $transactions->sortByDesc('date')->values();
            $currentPage = LengthAwarePaginator::resolveCurrentPage();
            $perPage = 5;
            $currentPageItems = $sortedTransactions->slice(($currentPage - 1) * $perPage, $perPage)->values();
            $paginatedTransactions = new LengthAwarePaginator(
                $currentPageItems,
                $sortedTransactions->count(),
                $perPage,
                $currentPage,
                ['path' => $request->url(), 'query' => $request->query()]
            );

            $totalExpenses = Expense::where('user_id', $userId)->sum('amount');
            $totalBudgets = DB::table('budgets')->where('user_id', $userId)->sum('amount');

            return response()->json([
                'transactions' => $paginatedTransactions,
                'totalExpenses' => $totalExpenses,
                'totalBudgets' => $totalBudgets,
                'balance' => $totalBudgets - $totalExpenses
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching expenses and budgets', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to fetch transactions'], 500);
        }
    }
}
