<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Expense;
use Illuminate\Http\Request;

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

    public function getExpensesPerDay(Request $request)
    {

        // Query to get the sum of expenses grouped by day
        $expenses = DB::table('expenses')
            ->select(DB::raw('DATE(date) as date'), DB::raw('SUM(amount) as total'))
            ->groupBy('date')
            ->get();

        return response()->json($expenses);
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
