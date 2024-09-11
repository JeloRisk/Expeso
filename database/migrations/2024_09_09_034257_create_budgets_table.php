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
        Schema::create('budgets', function (Blueprint $table) {
            $table->id('budgetId');
            $table->decimal('amount', 10, 2);
            $table->string('category');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('remaining_amount', 10, 2); // Track remaining budget
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');  // Foreign key linking to the User table
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
