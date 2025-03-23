"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// Replace standard axios with your custom instance
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface CheckoutProduct {
  id_barang: number;
  nama_barang: string;
  harga: number;
  jumlah: number;
  subtotal: number;
  gambar_barang?: {
    url_gambar: string;
  }[];
  toko: {
    nama_toko: string;
  };
}

interface Address {
  id_alamat: number;
  nama_penerima: string;
  no_telp: string;
  alamat_lengkap: string;
  kode_pos: string;
  is_primary: boolean;
  province: {
    id: number;
    name: string;
  };
  regency: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
  };
  village: {
    id: number;
    name: string;
  };
}

interface ShippingOption {
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Remove the useToast hook
  // const { toast } = useToast();

  // States for checkout data
  const [purchaseCode, setPurchaseCode] = useState<string>("");
  const [products, setProducts] = useState<CheckoutProduct[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  // Price calculations
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [adminFee] = useState(1000); // Fixed admin fee
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Get product slug and quantity from URL query params (for direct purchase)
    const productSlug = searchParams.get("product_slug");
    const quantity = searchParams.get("quantity") || "1";

    // Get purchase code from URL query params (for cart checkout)
    const code = searchParams.get("code");

    if (code) {
      // Load existing purchase data
      setPurchaseCode(code);
      fetchPurchaseDetails(code);
    } else if (productSlug) {
      // Create new purchase with direct product
      createNewPurchaseFromSlug(productSlug, parseInt(quantity));
    } else {
      // No product or purchase code provided
      toast.error("No product or purchase details provided");
      router.push("/user/katalog");
    }

    // Load user addresses
    fetchUserAddresses();
  }, [searchParams]);

  useEffect(() => {
    // Calculate totals when relevant data changes
    calculateTotals();
  }, [products, shippingCost]);

  // Fetch existing purchase details with custom axios instance
  const fetchPurchaseDetails = async (code: string) => {
    setLoading(true);
    try {
      // Use the NEXT_PUBLIC_API_URL consistently
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${code}`
      );

      if (response.data.status === "success") {
        const purchaseData = response.data.data;

        // Add debug logging to see what data we're getting
        console.log("Purchase data received:", purchaseData);

        // Check if we have purchase data at all
        if (!purchaseData) {
          console.error("No purchase data received from the server");
          toast.error("Failed to load purchase details");
          return;
        }

        // Specifically check for detailPembelian
        if (!purchaseData.detailPembelian) {
          console.error(
            "Purchase data missing detailPembelian field:",
            purchaseData
          );

          // Try to fetch the details directly as a fallback
          try {
            const detailsResponse = await axiosInstance.get(
              `${process.env.NEXT_PUBLIC_API_URL}/purchases/${code}/items`
            );

            if (
              detailsResponse.data.status === "success" &&
              Array.isArray(detailsResponse.data.data) &&
              detailsResponse.data.data.length > 0
            ) {
              console.log(
                "Retrieved purchase details via fallback:",
                detailsResponse.data.data
              );

              // Transform the data to expected format
              const transformedProducts = detailsResponse.data.data.map(
                (detail: any) => ({
                  id_barang: detail.barang.id_barang,
                  nama_barang: detail.barang.nama_barang,
                  harga: detail.harga_satuan,
                  jumlah: detail.jumlah,
                  subtotal: detail.subtotal,
                  gambar_barang: detail.barang.gambar_barang || [],
                  toko: detail.toko || { nama_toko: "Unknown Shop" },
                })
              );

              setProducts(transformedProducts);

              // If purchase already has an address selected
              if (purchaseData.id_alamat) {
                setSelectedAddressId(purchaseData.id_alamat);
              }
              return;
            }
          } catch (fallbackError) {
            console.error(
              "Fallback fetch for purchase details failed:",
              fallbackError
            );
          }

          toast.error("Purchase has no product details");
          router.push("/user/katalog");
          return;
        }

        // Check if detailPembelian exists and is an array
        if (Array.isArray(purchaseData.detailPembelian)) {
          // Handle empty array case
          if (purchaseData.detailPembelian.length === 0) {
            console.error("Purchase has empty detailPembelian array");
            toast.error("Purchase has no products");
            router.push("/user/katalog");
            return;
          }

          // Transform the purchase data into the expected format
          const transformedProducts = purchaseData.detailPembelian
            .map((detail: any) => {
              // Verify we have the barang (product) object
              if (!detail.barang) {
                console.error("Detail missing barang information:", detail);
                return null;
              }

              // Get product images from either gambar_barang or the nested structure
              const productImages = detail.barang.gambar_barang || [];

              return {
                id_barang: detail.barang.id_barang,
                nama_barang: detail.barang.nama_barang,
                harga: detail.harga_satuan,
                jumlah: detail.jumlah,
                subtotal: detail.subtotal,
                gambar_barang: productImages,
                toko: detail.toko || { nama_toko: "Unknown Shop" },
              };
            })
            .filter(Boolean); // Remove any null entries

          if (transformedProducts.length === 0) {
            console.error("No valid products after transformation");
            toast.error("No valid products in checkout");
            router.push("/user/katalog");
            return;
          }

          setProducts(transformedProducts);
          console.log("Transformed products:", transformedProducts);
        } else {
          // Handle the case where detailPembelian is missing or empty
          console.error(
            "Purchase data does not contain detailPembelian array:",
            purchaseData
          );
          toast.error("Purchase has no products");
        }

        // If purchase already has an address selected
        if (purchaseData.id_alamat) {
          setSelectedAddressId(purchaseData.id_alamat);
        }
      } else {
        console.error("Server returned error status:", response.data);
        toast.error(response.data.message || "Failed to load purchase details");
      }
    } catch (error) {
      console.error("Error fetching purchase details:", error);
      toast.error("Failed to load purchase details");
    } finally {
      setLoading(false);
    }
  };

  // Create new purchase with direct product
  const createNewPurchase = async (productId: number, quantity: number) => {
    setLoading(true);
    try {
      console.log(
        "Creating purchase for product:",
        productId,
        "quantity:",
        quantity
      );

      // First fetch user addresses to get the primary address using axiosInstance
      const addressesResponse = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );

      if (addressesResponse.data.status === "success") {
        const addressList = addressesResponse.data.data;
        console.log("Addresses loaded:", addressList.length);

        // Find primary address
        const primaryAddress = addressList.find(
          (addr: Address) => addr.is_primary
        );

        if (!primaryAddress && addressList.length === 0) {
          toast.error("Please add a shipping address first");
          router.push("/user/alamat");
          return;
        }

        const addressId = primaryAddress
          ? primaryAddress.id_alamat
          : addressList[0].id_alamat;

        console.log("Using address ID:", addressId);

        // Create purchase with axiosInstance and correct path
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/purchases`,
          {
            id_barang: productId,
            jumlah: quantity,
            id_alamat: addressId,
          }
        );

        console.log("Purchase creation response:", response.data);

        if (response.data.status === "success") {
          const { kode_pembelian } = response.data.data;
          setPurchaseCode(kode_pembelian);

          // Add a small delay before fetching purchase details to ensure server processing
          setTimeout(() => {
            fetchPurchaseDetails(kode_pembelian);
          }, 500);

          setSelectedAddressId(addressId);
        }
      }
    } catch (error: any) {
      console.error("Error creating purchase:", error);

      // Show more detailed error message
      if (error.response) {
        console.error("Response data:", error.response.data);
        toast.error(
          `Failed to create purchase: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else {
        toast.error("Failed to create purchase: Network error");
      }

      router.push("/user/katalog");
    } finally {
      setLoading(false);
    }
  };

  // Create new purchase with direct product using slug - improved error handling
  const createNewPurchaseFromSlug = async (
    productSlug: string,
    quantity: number
  ) => {
    setLoading(true);
    try {
      console.log(
        "Creating purchase for product slug:",
        productSlug,
        "quantity:",
        quantity
      );

      // First fetch user addresses to get the primary address using axiosInstance
      const addressesResponse = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );

      if (addressesResponse.data.status === "success") {
        const addressList = addressesResponse.data.data;
        console.log("Addresses loaded:", addressList.length);

        // Find primary address
        const primaryAddress = addressList.find(
          (addr: Address) => addr.is_primary
        );

        if (!primaryAddress && addressList.length === 0) {
          toast.error("Please add a shipping address first");
          router.push("/user/alamat");
          return;
        }

        const addressId = primaryAddress
          ? primaryAddress.id_alamat
          : addressList[0].id_alamat;

        console.log("Using address ID:", addressId);

        // Create purchase with axiosInstance and correct path, using slug
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/purchases`,
          {
            product_slug: productSlug, // Use slug instead of ID
            jumlah: quantity,
            id_alamat: addressId,
          }
        );

        console.log("Purchase creation response:", response.data);

        if (response.data.status === "success") {
          const { kode_pembelian } = response.data.data;
          setPurchaseCode(kode_pembelian);

          toast.success("Purchase created, loading details...");

          // Add a larger delay before fetching purchase details
          setTimeout(() => {
            fetchPurchaseDetails(kode_pembelian);
          }, 1500); // Increased delay to allow server processing

          setSelectedAddressId(addressId);
        } else {
          toast.error(response.data.message || "Failed to create purchase");
          router.push("/user/katalog");
        }
      }
    } catch (error: any) {
      console.error("Error creating purchase:", error);

      // Show more detailed error message
      if (error.response) {
        console.error("Response data:", error.response.data);
        toast.error(
          `Failed to create purchase: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else {
        toast.error("Failed to create purchase: Network error");
      }

      router.push("/user/katalog");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user addresses
  const fetchUserAddresses = async () => {
    try {
      // Use the correct endpoint path with NEXT_PUBLIC_API_URL
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );

      if (response.data.status === "success") {
        setAddresses(response.data.data);

        // Select primary address by default if no address is selected yet
        if (!selectedAddressId && response.data.data.length > 0) {
          const primaryAddress = response.data.data.find(
            (addr: Address) => addr.is_primary
          );
          setSelectedAddressId(
            primaryAddress
              ? primaryAddress.id_alamat
              : response.data.data[0].id_alamat
          );
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load shipping addresses");
    }
  };

  // Calculate shipping options using dummy data - fix the error handling
  const calculateShipping = async () => {
    if (!selectedAddressId) {
      toast.info("Please select a shipping address");
      return;
    }

    setLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);

    try {
      // Get selected address details - with better error handling
      const selectedAddress = addresses.find(
        (addr) => addr.id_alamat === selectedAddressId
      );

      if (!selectedAddress) {
        toast.error("Please select a valid shipping address");
        setLoadingShipping(false);
        return;
      }

      // No need to validate regency - just use dummy data directly
      // We'll skip the API call to RajaOngkir and simulate the response

      // Simulate a short loading time
      setTimeout(() => {
        // Dummy shipping options
        const sampleOptions = [
          {
            service: "REG",
            description: "Layanan Regular",
            cost: 15000,
            etd: "2-3",
          },
          {
            service: "OKE",
            description: "Layanan Ekonomis",
            cost: 10000,
            etd: "3-6",
          },
          {
            service: "YES",
            description: "Yakin Esok Sampai",
            cost: 25000,
            etd: "1",
          },
        ];

        setShippingOptions(sampleOptions);

        // Select the cheapest option by default
        const cheapestOption = sampleOptions.reduce(
          (prev, curr) => (prev.cost < curr.cost ? prev : curr),
          sampleOptions[0]
        );
        setSelectedShipping(cheapestOption.service);
        setShippingCost(cheapestOption.cost);

        setLoadingShipping(false);
      }, 1000);
    } catch (error) {
      console.error("Error calculating shipping:", error);
      toast.error(
        "Failed to calculate shipping costs. Using default options instead."
      );

      // Use default shipping options even if calculation fails
      const defaultOptions = [
        {
          service: "REG",
          description: "Layanan Regular",
          cost: 15000,
          etd: "2-3",
        },
        {
          service: "OKE",
          description: "Layanan Ekonomis",
          cost: 10000,
          etd: "3-6",
        },
      ];

      setShippingOptions(defaultOptions);
      setSelectedShipping("OKE");
      setShippingCost(10000);
      setLoadingShipping(false);
    }
  };

  // Calculate order totals
  const calculateTotals = () => {
    const productsSubtotal = products.reduce(
      (total, product) => total + product.subtotal,
      0
    );
    setSubtotal(productsSubtotal);
    setTotal(productsSubtotal + shippingCost + adminFee);
  };

  // Update shipping cost when option changes
  const handleShippingChange = (value: string) => {
    setSelectedShipping(value);
    const option = shippingOptions.find((opt) => opt.service === value);
    if (option) {
      setShippingCost(option.cost);
    }
  };

  // Process the checkout - always use midtrans
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.info("Please select a shipping address");
      return;
    }

    if (!selectedShipping) {
      toast.info("Please select a shipping method");
      return;
    }

    setProcessingCheckout(true);

    try {
      // Proceed with checkout using axiosInstance - use correct path with NEXT_PUBLIC_API_URL
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${purchaseCode}/checkout`,
        {
          opsi_pengiriman: `JNE ${selectedShipping}`,
          biaya_kirim: shippingCost,
          metode_pembayaran: "midtrans", // Always use midtrans
          catatan_pembeli: notes,
        }
      );

      if (response.data.status === "success") {
        const { kode_tagihan } = response.data.data;
        toast.success("Checkout successful! Redirecting to payment page...");
        // Redirect to payment page
        router.push(`/user/payments/${kode_tagihan}`);
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast.error("Failed to process checkout. Please try again.");
    } finally {
      setProcessingCheckout(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading checkout details...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main checkout column */}
        <div className="md:col-span-2 space-y-6">
          {/* Product details */}
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div key={index} className="flex gap-4 py-2">
                    <div className="w-16 h-16 bg-gray-100 relative overflow-hidden rounded-md">
                      {product.gambar_barang &&
                      product.gambar_barang.length > 0 ? (
                        <img
                          src={product.gambar_barang[0]?.url_gambar}
                          alt={product.nama_barang}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-product.png";
                          }}
                        />
                      ) : product.gambar_barang &&
                        product.gambar_barang.length > 0 ? (
                        <img
                          src={product.gambar_barang[0]?.url_gambar}
                          alt={product.nama_barang}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-product.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{product.nama_barang}</h3>
                      <p className="text-sm text-gray-500">
                        {product.toko.nama_toko}
                      </p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">
                          {formatRupiah(product.harga)} x {product.jumlah}
                        </span>
                        <span className="font-medium">
                          {formatRupiah(product.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No products in checkout</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {addresses.length > 0 ? (
                <RadioGroup
                  value={selectedAddressId?.toString() || ""}
                  onValueChange={(value) =>
                    setSelectedAddressId(parseInt(value))
                  }
                  className="space-y-4"
                >
                  {addresses.map((address) => (
                    <div
                      key={address.id_alamat}
                      className="flex items-start space-x-2 border rounded-lg p-3 hover:border-black transition-colors"
                    >
                      <RadioGroupItem
                        value={address.id_alamat.toString()}
                        id={`address-${address.id_alamat}`}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={`address-${address.id_alamat}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium flex justify-between">
                          <span>{address.nama_penerima}</span>
                          {address.is_primary && (
                            <span className="text-xs border border-black px-2 py-0.5 rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {address.no_telp}
                        </div>
                        <div className="text-sm mt-1">
                          {address.alamat_lengkap}, {address.district?.name},{" "}
                          {address.regency?.name}, {address.province?.name},{" "}
                          {address.kode_pos}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-2">
                    You don't have any saved addresses
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/user/alamat")}
                  >
                    Add New Address
                  </Button>
                </div>
              )}

              {selectedAddressId && !shippingOptions.length && (
                <Button
                  variant="outline"
                  onClick={calculateShipping}
                  disabled={loadingShipping}
                  className="w-full"
                >
                  {loadingShipping && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Calculate Shipping
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Shipping options */}
          {shippingOptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={selectedShipping || ""}
                  onValueChange={handleShippingChange}
                  className="space-y-3"
                >
                  {shippingOptions.map((option) => (
                    <div
                      key={option.service}
                      className="flex items-start space-x-2 border rounded-lg p-3 hover:border-black transition-colors"
                    >
                      <RadioGroupItem
                        value={option.service}
                        id={`shipping-${option.service}`}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={`shipping-${option.service}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">
                          JNE {option.service} - {option.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          Estimated delivery: {option.etd} days
                        </div>
                        <div className="text-sm font-semibold mt-1">
                          {formatRupiah(option.cost)}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes for this order"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order summary column */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>{formatRupiah(shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Admin Fee</span>
                  <span>{formatRupiah(adminFee)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>

              {/* Add payment info */}
              <div className="text-sm text-gray-500 mt-2">
                <p>Payment method: Midtrans Payment Gateway</p>
                <p className="mt-1">
                  You can choose your preferred payment method (Credit Card,
                  Bank Transfer, E-Wallet, etc.) on the payment page.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={
                  !selectedAddressId ||
                  !selectedShipping ||
                  processingCheckout ||
                  products.length === 0
                }
                onClick={handleCheckout}
              >
                {processingCheckout ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
