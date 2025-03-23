<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Pembelian extends Model
{
    use HasFactory;

    protected $table = 'pembelian';
    protected $primaryKey = 'id_pembelian';
    public $timestamps = true;
    
    protected $fillable = [
        'id_pembeli',
        'id_alamat',
        'kode_pembelian',
        'status_pembelian',
        'catatan_pembeli',
        'is_deleted',
        'created_by',
        'updated_by',
    ];
    
    // Define the relationship with the buyer (user)
    public function pembeli()
    {
        return $this->belongsTo(User::class, 'id_pembeli', 'id_user');
    }
    
    // Define the relationship with purchase details
    public function detailPembelian()
    {
        return $this->hasMany(DetailPembelian::class, 'id_pembelian', 'id_pembelian');
    }
    
    // Additional helper method to ensure detailPembelian is loaded
    public function getDetailPembelianAttribute()
    {
        // If the relationship is not loaded yet, load it
        if (!$this->relationLoaded('detailPembelian')) {
            $this->load('detailPembelian');
        }
        
        return $this->getRelation('detailPembelian');
    }
    
    // Define the relationship with the invoice
    public function tagihan()
    {
        return $this->hasOne(Tagihan::class, 'id_pembelian', 'id_pembelian');
    }
    
    // Define the relationship with the shipping address
    public function alamat()
    {
        return $this->belongsTo(AlamatUser::class, 'id_alamat', 'id_alamat');
    }
    
    // Define relationship with the user who created the record
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'id_user');
    }
    
    // Define relationship with the user who updated the record
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id_user');
    }
    
    // Helper method to check if purchase can be canceled
    public function canBeCancelled()
    {
        return in_array($this->status_pembelian, ['Draft', 'Menunggu Pembayaran']);
    }
    
    // Generate a unique purchase code
    public static function generateKodePembelian()
    {
        $prefix = 'PBL-' . date('ymd');
        $unique = false;
        $code = '';
        
        while (!$unique) {
            $random = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
            $code = $prefix . $random;
            
            // Check if code already exists
            $exists = self::where('kode_pembelian', $code)->exists();
            
            if (!$exists) {
                $unique = true;
            }
        }
        
        return $code;
    }
}
