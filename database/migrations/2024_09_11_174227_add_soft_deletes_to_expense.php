<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->softDeletes(); // This adds the `deleted_at` column
        });
    }

    public function down()
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropSoftDeletes(); // This removes the `deleted_at` column
        });
    }
};
