<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Expense;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct()
    {
        $this->middleware('auth'); // Ensure the user is authenticated
    }
    public function index()
    {
        //
    $userId = auth()->id();

        $expenses = Expense::where('user_id', $userId)
            ->with('user', 'budget', 'category')
            ->get();

        foreach ($expenses as $expense) {
            $this->authorize('view', $expense);
        }

        return response()->json($expenses);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        $userId = auth()->id();

        $validatedData = $request->validate([
            'expenseName' => 'nullable|string',
            'amount' => 'required|numeric',
            'category_id' => 'required|numeric|exists:expense_categories',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'budgetId' => 'nullable|exists:budgets,budgetId', // Allow nullable budgetId
        ]);

        $validatedData['user_id'] = $userId;

        $expense = Expense::create($validatedData);

        return response()->json($expense, 201);
    }
    public function update(Request $request, string $id)
    {
        $expense = Expense::find($id);

        if (!$expense) {
            return response()->json(['message' => 'Expense not found.'], 404);
        }

        // Optional: Check if the authenticated user owns the expense (authorization)
        if ($expense->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Validate the request data
        $validatedData = $request->validate([
            'expenseName' => 'nullable|string',
            'amount' => 'required|numeric',
            'category_id' => 'required|numeric|exists:expense_categories,id', // Ensure category exists
            'date' => 'required|date',
            'description' => 'nullable|string',
            'budgetId' => 'nullable|exists:budgets,budgetId', // Allow nullable budgetId
        ]);

        // Update the expense with the validated data
        $expense->update($validatedData);

        // Return a success response
        return response()->json($expense, 200);
    }


    public function getExpensesPerDay(Request $request)
    {

        // Query to get the sum of expenses grouped by day
        $expenses = DB::table('expenses')
            ->select(DB::raw('DATE(date) as date'), DB::raw('SUM(amount) as total'))
            ->groupBy('date')
            ->get();

        return response()->json($expenses);
    }
    public function getTotalExpense()
    {
        $total = Expense::whereNull('deleted_at')->sum('amount');
        // $total = 100;
        return response()->json($total);
    }
    public function getTotalForMonth()
    {
        $userId = Auth::id();
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $total = DB::table('expenses')
            ->where('user_id', $userId)
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->sum('amount');
        // $total = 100;

        return response()->json(['total' => $total]);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($expenseId)
    {
        $item = Expense::find($expenseId);
        if ($item) {
            $item->delete(); // Soft delete the item
        }
        return response()->json(null, 204);
    }
}
