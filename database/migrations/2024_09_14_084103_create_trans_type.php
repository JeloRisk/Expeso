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
        Schema::table('expenses', function (Blueprint $table) {
            $table->string('type')->default('expense')->nullable(false);
        });

        Schema::table('budgets', function (Blueprint $table) {
            $table->string('type')->default('budget')->nullable(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expense', function (Blueprint $table) {
            $table->dropColumn('type');
        });

        Schema::table('budgets', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
