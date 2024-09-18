<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'month',
        'year',
        'type'
    ];

    // Define the relationship to the user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Get expenses related to this budget for the month
    public function expenses()
    {
        return $this->hasMany(Expense::class, 'user_id', 'user_id')
            ->whereMonth('date', $this->month)
            ->whereYear('date', $this->year);
    }
}
