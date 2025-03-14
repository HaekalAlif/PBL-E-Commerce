<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Toko extends Model
{
    use HasFactory;

    // Set the table name explicitly
    protected $table = 'toko';
    
    // Set the primary key
    protected $primaryKey = 'id_toko';

    // Fields that can be mass-assigned
    protected $fillable = [
        'id_user',
        'nama_toko',
        'deskripsi',
        'alamat',
        'kontak',
        'is_active',
        'is_deleted',
        'created_by',
        'updated_by'
    ];

    // Define relationship with User model
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'id_user');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id_user');
    }
}
