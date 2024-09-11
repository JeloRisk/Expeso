<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id('category_id');
            $table->string('name'); // Name of the category
            $table->text('description')->nullable(); // Description of the category
            $table->timestamps(); // Automatically adds created_at and updated_at columns
        });

        // Optional: Insert default categories with descriptions
        DB::table('expense_categories')->insert([
            ['name' => 'Rent', 'description' => 'Payments made for renting property (e.g., house, apartment).'],
            ['name' => 'Utilities', 'description' => 'Monthly utility bills (e.g., electricity, water, gas).'],
            ['name' => 'Transportation', 'description' => 'Expenses related to transportation (e.g., fuel, public transport).'],
            ['name' => 'Food', 'description' => 'Expenses for groceries, restaurants, and other food-related costs.'],
            ['name' => 'Health/Medical', 'description' => 'Health-related expenses, including insurance, medications, doctor visits.'],
            ['name' => 'Debt Repayment', 'description' => 'Payments made towards debts (e.g., loans, credit card balances).'],
            ['name' => 'Savings and Investment', 'description' => 'Money set aside for savings accounts or investments.'],
            ['name' => 'Entertainment', 'description' => 'Spending on leisure activities (e.g., movies, sports, dining out).'],
            ['name' => 'Education', 'description' => 'Expenses for educational purposes (e.g., tuition fees, books).'],
            ['name' => 'Personal Care', 'description' => 'Personal care expenses (e.g., grooming, beauty, fitness).'],
            ['name' => 'Gifts and Donation', 'description' => 'Money given for gifts or charitable donations.'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expense_categories');
    }
};
