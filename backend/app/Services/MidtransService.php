<?php

namespace App\Services;

use App\Models\Tagihan;
use App\Models\Pembelian;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class MidtransService
{
    protected $isProduction;
    protected $serverKey;
    protected $clientKey;
    protected $apiUrl;

    public function __construct()
    {
        // Set environment variables
        $this->isProduction = config('services.midtrans.is_production', false);
        $this->serverKey = config('services.midtrans.server_key', env('MIDTRANS_SERVER_KEY'));
        $this->clientKey = config('services.midtrans.client_key', env('MIDTRANS_CLIENT_KEY'));
        
        // Set API URL based on environment
        $this->apiUrl = $this->isProduction
            ? 'https://api.midtrans.com'
            : 'https://api.sandbox.midtrans.com';
    }

    /**
     * Get Snap Token for frontend payment processing
     *
     * @param Tagihan $tagihan
     * @param array $options
     * @return array
     */
    public function getSnapToken(Tagihan $tagihan, array $options = [])
    {
        try {
            // Basic logging
            Log::info('Starting Midtrans token request', [
                'tagihan_id' => $tagihan->id_tagihan,
                'kode_tagihan' => $tagihan->kode_tagihan
            ]);
            
            // Get related invoice and user information
            $pembelian = $tagihan->pembelian;
            if (!$pembelian) {
                return [
                    'success' => false,
                    'message' => 'Purchase information not found'
                ];
            }

            // Get user information - check both user and pembeli relationships
            $user = $pembelian->user ?? $pembelian->pembeli;
            
            // Create transaction details - simplified approach
            $transactionDetails = [
                'order_id' => $tagihan->kode_tagihan,
                'gross_amount' => (int)$tagihan->total_tagihan
            ];
            
            // Simplified customer details
            $customerDetails = [
                'first_name' => $user->name ?? 'Customer',
                'email' => $user->email ?? 'customer@example.com',
                'phone' => $user->no_hp ?? '08000000000'
            ];
            
            // Create basic item details
            $itemDetails = [
                [
                    'id' => 'INVOICE-' . $tagihan->id_tagihan,
                    'name' => 'Payment for order ' . $tagihan->kode_tagihan,
                    'price' => (int)$tagihan->total_tagihan,
                    'quantity' => 1
                ]
            ];
            
            // Standard payload that should work with Midtrans
            $payload = [
                'transaction_details' => $transactionDetails,
                'customer_details' => $customerDetails,
                'item_details' => $itemDetails
            ];
            
            // Log the payload being sent
            Log::info('Sending payload to Midtrans', [
                'transaction_id' => $tagihan->kode_tagihan,
                'amount' => $tagihan->total_tagihan
            ]);
            
            // Send request to Midtrans API
            $response = Http::withBasicAuth($this->serverKey, '')
                ->withHeaders(['Accept' => 'application/json'])
                ->post($this->apiUrl . '/snap/v1/transactions', $payload);
            
            // Parse response
            if ($response->successful() && isset($response['token'])) {
                return [
                    'success' => true,
                    'snap_token' => $response['token'],
                    'redirect_url' => $response['redirect_url'] ?? null
                ];
            } else {
                // Log error response
                Log::error('Midtrans API error', [
                    'status' => $response->status(),
                    'response' => $response->json(),
                    'error_messages' => $response->json()['error_messages'] ?? 'No error messages provided'
                ]);
                
                return [
                    'success' => false,
                    'message' => $response->json()['error_messages'][0] ?? 'Unknown error'
                ];
            }
        } catch (\Exception $e) {
            Log::error('Exception in getSnapToken', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get transaction status from Midtrans
     *
     * @param string $orderId
     * @return array|null
     */
    public function getStatus($orderId)
    {
        try {
            $response = Http::withBasicAuth($this->serverKey, '')
                ->get($this->apiUrl . '/v2/' . $orderId . '/status');

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('Error checking Midtrans transaction status', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Handle notification from Midtrans
     *
     * @param Request $request
     * @return object|null
     */
    public function handleNotification($request)
    {
        try {
            $notificationBody = $request->getContent();
            $notification = json_decode($notificationBody);

            if (!$notification || !isset($notification->transaction_status)) {
                Log::error('Invalid Midtrans notification', ['body' => $notificationBody]);
                return null;
            }

            return $notification;
        } catch (\Exception $e) {
            Log::error('Error handling Midtrans notification', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }
}
