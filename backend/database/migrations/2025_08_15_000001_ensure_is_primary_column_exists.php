<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class EnsureIsPrimaryColumnExists extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('alamat_user', 'is_primary')) {
            Schema::table('alamat_user', function (Blueprint $table) {
                $table->boolean('is_primary')->default(false)->after('kode_pos');
            });
            echo "Added missing is_primary column to alamat_user table\n";
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // We're not removing the column if it was missing
        // This ensures data integrity
    }
}
