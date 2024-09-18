<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    // Get the budget for the current user for a specific month
    public function getBudgetForMonth($month, $year)
    {
        $userId = Auth::id();

        $budget = Budget::where('user_id', $userId)
            ->where('month', $month)
            ->where('year', $year)
            ->first();

        if (!$budget) {
            return response()->json(['message' => 'No budget found for this month'], 404);
        }

        // Get the total expenses for the month
        $totalExpenses = $budget->expenses()->sum('amount');

        return response()->json([
            'budget' => $budget->amount,
            'totalExpenses' => $totalExpenses,
            'balance' => $budget->amount - $totalExpenses, // Remaining budget
        ]);
    }

    // Store a new budget
    public function store(Request $request)
    {
        $userId = Auth::id();

        $validated = $request->validate([
            'amount' => 'required|numeric',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
        ]);

        $budget = Budget::updateOrCreate(
            ['user_id' => $userId, 'month' => $validated['month'], 'year' => $validated['year']],
            ['amount' => $validated['amount']]
        );

        return response()->json($budget, 201);
    }

    // Update an existing budget
    public function update(Request $request, $id)
    {
    $budget = Budget::findOrFail($id);

        $this->authorize('update', $budget);

        $validated = $request->validate([
            'amount' => 'required|numeric',
        ]);

        $budget->update($validated);

        return response()->json($budget);
    }

    // Delete a budget
    public function destroy($id)
    {
        $budget = Budget::findOrFail($id);

        $this->authorize('delete', $budget);

        $budget->delete();

        return response()->json(['message' => 'Budget deleted successfully']);
    }
}
