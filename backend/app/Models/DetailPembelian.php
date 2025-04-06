<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailPembelian extends Model
{
    use HasFactory;
    
    protected $table = 'detail_pembelian';
    protected $primaryKey = 'id_detail'; // This is the actual column name in DB
    
    protected $fillable = [
        'id_pembelian',
        'id_barang',
        'id_toko',
        'jumlah',
        'harga_satuan',
        'subtotal'
    ];
    
    /**
     * Relationship with Pembelian
     */
    public function pembelian()
    {
        return $this->belongsTo(Pembelian::class, 'id_pembelian', 'id_pembelian');
    }
    
    /**
     * Relationship with Barang
     */
    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang', 'id_barang');
    }
    
    /**
     * Relationship with Toko
     */
    public function toko()
    {
        return $this->belongsTo(Toko::class, 'id_toko', 'id_toko');
    }

    /**
     * Get the shipping information record associated with this purchase detail
     */
    public function pengiriman_pembelian()
    {
        return $this->hasOne(PengirimanPembelian::class, 'id_detail_pembelian', 'id_detail');
    }

    // Keep the camelCase relationship for backwards compatibility
    public function pengirimanPembelian()
    {
        return $this->pengiriman_pembelian();
    }
}
