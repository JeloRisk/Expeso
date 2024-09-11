<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $primaryKey = 'budgetId';
    protected $fillable = ['amount', 'category', 'start_date', 'end_date', 'remaining_amount', 'user_id'];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function expenses()
    {
        return $this->hasMany(Expense::class, 'budgetId');
    }
    use HasFactory;
}
