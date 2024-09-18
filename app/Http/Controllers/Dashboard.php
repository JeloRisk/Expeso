<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Budget;
use App\Models\Expense;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

class Dashboard extends Controller
{
    public function getExpenseSummaryAll()
    {
        $user = auth()->id();
        $currentMonth = now()->month;
        $currentYear = now()->year;

        // Get last month's details
        $lastMonth = now()->subMonth()->month;
        $lastMonthYear = now()->subMonth()->year;

        // Filter expenses to the current month and year
        $totalExpenseCurrentMonth = Expense::where('user_id', $user)
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->sum('amount');

        $totalExpenseLastMonth = Expense::where('user_id', $user)
            ->whereMonth('date', $lastMonth)
            ->whereYear('date', $lastMonthYear)
            ->sum('amount');

        $totalBudget = Budget::where('user_id', $user)->sum('amount');
        $balance = $totalBudget - $totalExpenseCurrentMonth;

        $expenseByCategoryCurrentMonth = Expense::select('category_id', DB::raw('SUM(amount) as total_spent'))
            ->where('user_id', $user)
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->groupBy('category_id')
            ->orderBy('total_spent', 'desc')
            ->with('category')
            ->get();

        $expenseByCategoryLastMonth = Expense::select('category_id', DB::raw('SUM(amount) as total_spent'))
            ->where('user_id', $user)
            ->whereMonth('date', $lastMonth)
            ->whereYear('date', $lastMonthYear)
            ->groupBy('category_id')
            ->orderBy('total_spent', 'desc')
            ->with('category')
            ->get();

        $formattedExpenseByCategory = $expenseByCategoryCurrentMonth->map(function ($currentExpense) use ($expenseByCategoryLastMonth, $totalExpenseCurrentMonth) {
            $categoryName = $currentExpense->category->name ?? 'Unknown';
            $totalSpentLastMonth = $expenseByCategoryLastMonth->where('category_id', $currentExpense->category_id)->first()->total_spent ?? 0;
            $percentChange = $totalSpentLastMonth > 0 ? (($currentExpense->total_spent - $totalSpentLastMonth) / $totalSpentLastMonth) * 100 : 0;
            $percentOfTotal = $totalExpenseCurrentMonth > 0 ? ($currentExpense->total_spent / $totalExpenseCurrentMonth) * 100 : 0;
            $changeType = $percentChange > 0 ? 'increase' : ($percentChange < 0 ? 'decrease' : 'no change');
            return [
                'category_id' => $currentExpense->category_id,
                'category_name' => $categoryName,
                'total_spent' => $currentExpense->total_spent,
                'percent_of_total' => $percentOfTotal,
                'percent_change' => abs(round($percentChange, 2)),
                'changeType' => $changeType,
                'type' => "expense"
            ];
        });

        return response()->json([
            'totalExpenseCurrentMonth' => $totalExpenseCurrentMonth,
            'totalExpenseLastMonth' => $totalExpenseLastMonth,
            'totalBudget' => $totalBudget,
            'balance' => $balance,
            'expenseByCategory' => $formattedExpenseByCategory->take(4)
        ]);
    }




    public function recentTransactions()
    {
        $user = auth()->id();
        $expenses = Expense::where('user_id', $user)->with("category")->get();

        $budgets = DB::table('budgets')
            ->where('user_id', $user)
            ->select('budgetId as id', 'amount', DB::raw("STR_TO_DATE(CONCAT(year, '-', month, '-01'), '%Y-%m-%d') as date"), 'description', 'type')
            ->get();
        $transactions = $expenses->concat($budgets);
        $sortedTransactions = $transactions->sortByDesc('date')->take(5)->values();

        return response()->json($sortedTransactions);
    }
    public function getYearlyExpenses()
    {
        $user = auth()->id();
        $currentYear = Carbon::now()->year;

        $yearlyExpenses = Expense::where('user_id', $user)
            ->whereYear('date', $currentYear) // Assuming 'date' is your expense date column
            ->select(DB::raw('YEAR(date) as year, SUM(amount) as total_spent'))
            ->groupBy('year')
            ->get();

        return response()->json($yearlyExpenses);
    }

    // Monthly Expense Summary
    public function getMonthlyExpenses()
    {
        $user = auth()->id();
        $currentYear = Carbon::now()->year;

        $monthlyExpenses = Expense::where('user_id', $user)
            ->whereYear('date', $currentYear)
            ->select(DB::raw('MONTH(date) as month, SUM(amount) as total_spent'))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json($monthlyExpenses);
    }

    // Weekly Expense Summary
    public function getWeeklyExpenses()
    {
        $user = auth()->id();
        $currentWeek = Carbon::now()->weekOfYear;
        $currentYear = Carbon::now()->year;

        $weeklyExpenses = Expense::where('user_id', $user)
            ->whereYear('date', $currentYear)
            ->where(DB::raw('WEEK(date, 1)'), $currentWeek) // WEEK(date, 1) starts the week on Monday
            ->select(DB::raw('WEEK(date, 1) as week, SUM(amount) as total_spent'))
            ->groupBy('week')
            ->get();

        return response()->json($weeklyExpenses);
    }

    // Custom Range Expenses (optional)
    public function getCustomRangeExpenses(Request $request)
    {
        $user = auth()->id();
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        $rangeExpenses = Expense::where('user_id', $user)
            ->whereBetween('date', [$startDate, $endDate])
            ->select(DB::raw('DATE(date) as day, SUM(amount) as total_spent'))
            ->groupBy('day')
            ->orderBy('day', 'asc')
            ->get();

        return response()->json($rangeExpenses);
    }
}
