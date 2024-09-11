<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $primaryKey = 'expenseId';

    protected $fillable = ['expenseName', 'amount', 'date', 'description', 'user_id', 'budgetId', 'category_id'];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function category()
    {
        return $this->belongsTo(ExpenseCategory::class, 'category_id');
    }


    public function budget()
    {
        return $this->belongsTo(Budget::class, 'budgetId');
    }
}
