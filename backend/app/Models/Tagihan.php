<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Tagihan extends Model
{
    use HasFactory;

    protected $table = 'tagihan';
    protected $primaryKey = 'id_tagihan';
    public $timestamps = true;
    
    protected $fillable = [
        'id_pembelian',
        'kode_tagihan',
        'total_harga',
        'biaya_kirim',
        'opsi_pengiriman',
        'biaya_admin',
        'total_tagihan',
        'metode_pembayaran',
        'midtrans_transaction_id',
        'midtrans_payment_type',
        'midtrans_status',
        'status_pembayaran',
        'deadline_pembayaran',
        'tanggal_pembayaran',
        'snap_token',
        'payment_url',
    ];
    
    protected $dates = [
        'deadline_pembayaran',
        'tanggal_pembayaran',
    ];
    
    // Define the relationship with the purchase
    public function pembelian()
    {
        return $this->belongsTo(Pembelian::class, 'id_pembelian', 'id_pembelian');
    }
    
    // Generate a unique invoice code
    public static function generateKodeTagihan()
    {
        $prefix = 'INV-';
        $date = now()->format('Ymd');
        $random = mt_rand(1000, 9999);
        $uniqueCode = $prefix . $date . $random;
        
        // Ensure uniqueness
        while (self::where('kode_tagihan', $uniqueCode)->exists()) {
            $random = mt_rand(1000, 9999);
            $uniqueCode = $prefix . $date . $random;
        }
        
        return $uniqueCode;
    }
    
    // Check if payment is still valid (not expired)
    public function isValid()
    {
        if ($this->status_pembayaran == 'Dibayar') {
            return true;
        }
        
        if ($this->status_pembayaran == 'Expired' || $this->status_pembayaran == 'Gagal') {
            return false;
        }
        
        // If status is "Menunggu", check deadline
        if ($this->deadline_pembayaran && Carbon::now()->gt($this->deadline_pembayaran)) {
            // Auto-update status to Expired if deadline has passed
            $this->status_pembayaran = 'Expired';
            $this->save();
            return false;
        }
        
        return true;
    }
    
    // Check if payment is already completed
    public function isPaid()
    {
        return $this->status_pembayaran == 'Dibayar';
    }
    
    // Calculate the total invoice amount
    public function calculateTotal()
    {
        return $this->total_harga + $this->biaya_kirim + $this->biaya_admin;
    }
    
    // Update payment status based on Midtrans callback
    public function updateFromMidtransCallback($midtransStatus)
    {
        $this->midtrans_status = $midtransStatus;
        
        if ($midtransStatus == 'settlement' || $midtransStatus == 'capture') {
            $this->status_pembayaran = 'Dibayar';
            $this->tanggal_pembayaran = Carbon::now();
        } 
        elseif ($midtransStatus == 'pending') {
            $this->status_pembayaran = 'Menunggu';
        }
        elseif ($midtransStatus == 'deny' || $midtransStatus == 'cancel' || $midtransStatus == 'expire') {
            $this->status_pembayaran = 'Gagal';
            
            // Update related purchase status but don't change stock since it wasn't reduced
            if ($this->pembelian) {
                $this->pembelian->status_pembelian = 'Dibatalkan';
                $this->pembelian->save();
            }
        }
        
        return $this->save();
    }
    
    // Set payment deadline (default: 24 hours from now)
    public function setPaymentDeadline($hours = 24)
    {
        $this->deadline_pembayaran = Carbon::now()->addHours($hours);
        return $this;
    }
}
