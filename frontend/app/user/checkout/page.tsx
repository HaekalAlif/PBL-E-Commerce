"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Loader2, Store } from "lucide-react";
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
    id_toko: number;
    nama_toko: string;
    slug?: string;
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

// New interface to group products by store
interface StoreCheckout {
  id_toko: number;
  nama_toko: string;
  products: CheckoutProduct[];
  subtotal: number;
  selectedAddressId: number | null;
  shippingOptions: ShippingOption[];
  selectedShipping: string | null;
  shippingCost: number;
  notes: string;
  isLoadingShipping: boolean;
}

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States for checkout data
  const [purchaseCode, setPurchaseCode] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [storeCheckouts, setStoreCheckouts] = useState<StoreCheckout[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState<number | null>(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  // Price calculations
  const [subtotal, setSubtotal] = useState(0);
  const [totalShipping, setTotalShipping] = useState(0);
  const [adminFee] = useState(1000); // Fixed admin fee
  const [total, setTotal] = useState(0);

  // Add flag to track if this is a multi-store checkout
  const [isMultiStoreCheckout, setIsMultiStoreCheckout] = useState(false);

  useEffect(() => {
    // Get product slug and quantity from URL query params (for direct purchase)
    const productSlug = searchParams.get("product_slug");
    const quantity = searchParams.get("quantity") || "1";

    // Get purchase code from URL query params (for cart checkout)
    const code = searchParams.get("code");

    // Get multi-store flag from URL query params
    const multiStore = searchParams.get("multi_store") === "true";
    setIsMultiStoreCheckout(multiStore);

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
  }, [storeCheckouts]);

  // Fetch existing purchase details with custom axios instance
  const fetchPurchaseDetails = async (code: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${code}`
      );

      if (response.data.status === "success") {
        const purchaseData = response.data.data;
        console.log("Purchase data received:", purchaseData);

        if (!purchaseData) {
          console.error("No purchase data received from the server");
          toast.error("Failed to load purchase details");
          return;
        }

        // Handle missing detailPembelian
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
              processProductsIntoStores(detailsResponse.data.data);

              // If purchase already has an address selected
              if (purchaseData.id_alamat) {
                setDefaultAddressId(purchaseData.id_alamat);
              }

              // Check if this is a multi-store checkout from metadata
              if (purchaseData.catatan_pembeli) {
                try {
                  const metadata = JSON.parse(purchaseData.catatan_pembeli);
                  if (metadata && metadata.is_multi_store) {
                    setIsMultiStoreCheckout(true);
                  }
                } catch (e) {
                  // Not valid JSON, ignore
                }
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

        // Process the purchase details
        if (
          Array.isArray(purchaseData.detailPembelian) &&
          purchaseData.detailPembelian.length > 0
        ) {
          processProductsIntoStores(purchaseData.detailPembelian);

          // If purchase already has an address selected
          if (purchaseData.id_alamat) {
            setDefaultAddressId(purchaseData.id_alamat);
          }

          // Check if this is a multi-store checkout from metadata
          if (purchaseData.catatan_pembeli) {
            try {
              const metadata = JSON.parse(purchaseData.catatan_pembeli);
              if (metadata && metadata.is_multi_store) {
                setIsMultiStoreCheckout(true);
              }
            } catch (e) {
              // Not valid JSON, ignore
            }
          }
        } else {
          console.error("Purchase has empty or invalid detailPembelian");
          toast.error("Purchase has no valid products");
          router.push("/user/katalog");
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

  // Group products by store and create store checkout objects
  const processProductsIntoStores = (detailItems: any[]) => {
    const storeMap = new Map<number, StoreCheckout>();

    detailItems.forEach((detail) => {
      // Skip items without product info
      if (!detail.barang) {
        console.error("Detail missing barang information:", detail);
        return;
      }

      const toko = detail.toko ||
        detail.barang.toko || { id_toko: 0, nama_toko: "Unknown Shop" };
      const tokoId = toko.id_toko;

      // Create or get the store group
      if (!storeMap.has(tokoId)) {
        storeMap.set(tokoId, {
          id_toko: tokoId,
          nama_toko: toko.nama_toko,
          products: [],
          subtotal: 0,
          selectedAddressId: defaultAddressId,
          shippingOptions: [],
          selectedShipping: null,
          shippingCost: 0,
          notes: "",
          isLoadingShipping: false,
        });
      }

      const storeGroup = storeMap.get(tokoId)!;

      // Get product data
      const productImages = detail.barang.gambar_barang || [];

      // Create product object
      const product: CheckoutProduct = {
        id_barang: detail.barang.id_barang,
        nama_barang: detail.barang.nama_barang,
        harga: detail.harga_satuan,
        jumlah: detail.jumlah,
        subtotal: detail.subtotal,
        gambar_barang: productImages,
        toko: toko,
      };

      // Add product to store group
      storeGroup.products.push(product);
      storeGroup.subtotal += detail.subtotal;
    });

    // Convert map to array
    setStoreCheckouts(Array.from(storeMap.values()));
  };

  // Create new purchase with direct product
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

      // First fetch user addresses to get the primary address
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
        setDefaultAddressId(addressId);

        // Create purchase with axiosInstance and correct path, using slug
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/purchases`,
          {
            product_slug: productSlug,
            jumlah: quantity,
            id_alamat: addressId,
          }
        );

        console.log("Purchase creation response:", response.data);

        if (response.data.status === "success") {
          const { kode_pembelian } = response.data.data;
          setPurchaseCode(kode_pembelian);

          toast.success("Purchase created, loading details...");

          // Add a delay before fetching purchase details
          setTimeout(() => {
            fetchPurchaseDetails(kode_pembelian);
          }, 1500);
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
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );

      if (response.data.status === "success") {
        setAddresses(response.data.data);

        // Select primary address by default if no address is selected yet
        if (!defaultAddressId && response.data.data.length > 0) {
          const primaryAddress = response.data.data.find(
            (addr: Address) => addr.is_primary
          );
          const addressId = primaryAddress
            ? primaryAddress.id_alamat
            : response.data.data[0].id_alamat;

          setDefaultAddressId(addressId);

          // Apply to all stores
          setStoreCheckouts((prevStores) =>
            prevStores.map((store) => ({
              ...store,
              selectedAddressId: addressId,
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load shipping addresses");
    }
  };

  // Calculate shipping options for a specific store
  const calculateShipping = async (storeIndex: number) => {
    const store = storeCheckouts[storeIndex];

    if (!store.selectedAddressId) {
      toast.info("Please select a shipping address for this store");
      return;
    }

    // Update loading state for this store
    setStoreCheckouts((prevStores) => {
      const newStores = [...prevStores];
      newStores[storeIndex] = {
        ...newStores[storeIndex],
        isLoadingShipping: true,
        shippingOptions: [],
        selectedShipping: null,
        shippingCost: 0,
      };
      return newStores;
    });

    try {
      // Get selected address details
      const selectedAddress = addresses.find(
        (addr) => addr.id_alamat === store.selectedAddressId
      );

      if (!selectedAddress) {
        toast.error("Please select a valid shipping address");
        // Update loading state
        setStoreCheckouts((prevStores) => {
          const newStores = [...prevStores];
          newStores[storeIndex] = {
            ...newStores[storeIndex],
            isLoadingShipping: false,
          };
          return newStores;
        });
        return;
      }

      // Simulate a short loading time
      setTimeout(() => {
        // Generate dummy options with different prices for each store
        const basePrice = 10000 + storeIndex * 2000;
        const sampleOptions = [
          {
            service: "REG",
            description: "Layanan Regular",
            cost: basePrice + 5000,
            etd: "2-3",
          },
          {
            service: "OKE",
            description: "Layanan Ekonomis",
            cost: basePrice,
            etd: "3-6",
          },
          {
            service: "YES",
            description: "Yakin Esok Sampai",
            cost: basePrice + 15000,
            etd: "1",
          },
        ];

        // Find the cheapest option
        const cheapestOption = sampleOptions.reduce(
          (prev, curr) => (prev.cost < curr.cost ? prev : curr),
          sampleOptions[0]
        );

        // Update the store with shipping options
        setStoreCheckouts((prevStores) => {
          const newStores = [...prevStores];
          newStores[storeIndex] = {
            ...newStores[storeIndex],
            shippingOptions: sampleOptions,
            selectedShipping: cheapestOption.service,
            shippingCost: cheapestOption.cost,
            isLoadingShipping: false,
          };
          return newStores;
        });
      }, 1000);
    } catch (error) {
      console.error("Error calculating shipping:", error);
      toast.error(
        "Failed to calculate shipping costs. Using default options instead."
      );

      // Set default shipping options
      const basePrice = 10000 + storeIndex * 2000;
      const defaultOptions = [
        {
          service: "REG",
          description: "Layanan Regular",
          cost: basePrice + 5000,
          etd: "2-3",
        },
        {
          service: "OKE",
          description: "Layanan Ekonomis",
          cost: basePrice,
          etd: "3-6",
        },
      ];

      setStoreCheckouts((prevStores) => {
        const newStores = [...prevStores];
        newStores[storeIndex] = {
          ...newStores[storeIndex],
          shippingOptions: defaultOptions,
          selectedShipping: "OKE",
          shippingCost: basePrice,
          isLoadingShipping: false,
        };
        return newStores;
      });
    }
  };

  // Calculate order totals
  const calculateTotals = () => {
    let productsSubtotal = 0;
    let shippingTotal = 0;

    storeCheckouts.forEach((store) => {
      productsSubtotal += store.subtotal;
      shippingTotal += store.shippingCost;
    });

    setSubtotal(productsSubtotal);
    setTotalShipping(shippingTotal);
    setTotal(productsSubtotal + shippingTotal + adminFee);
  };

  // Update shipping option for a specific store
  const handleShippingChange = (storeIndex: number, value: string) => {
    const store = storeCheckouts[storeIndex];
    const option = store.shippingOptions.find((opt) => opt.service === value);

    if (option) {
      setStoreCheckouts((prevStores) => {
        const newStores = [...prevStores];
        newStores[storeIndex] = {
          ...newStores[storeIndex],
          selectedShipping: value,
          shippingCost: option.cost,
        };
        return newStores;
      });
    }
  };

  // Update address for a specific store
  const handleAddressChange = (storeIndex: number, addressId: number) => {
    setStoreCheckouts((prevStores) => {
      const newStores = [...prevStores];
      newStores[storeIndex] = {
        ...newStores[storeIndex],
        selectedAddressId: addressId,
        // Reset shipping when address changes
        shippingOptions: [],
        selectedShipping: null,
        shippingCost: 0,
      };
      return newStores;
    });
  };

  // Update notes for a specific store
  const handleNotesChange = (storeIndex: number, notes: string) => {
    setStoreCheckouts((prevStores) => {
      const newStores = [...prevStores];
      newStores[storeIndex] = {
        ...newStores[storeIndex],
        notes: notes,
      };
      return newStores;
    });
  };

  // Check if all stores have shipping selected
  const allStoresReadyForCheckout = () => {
    return storeCheckouts.every(
      (store) =>
        store.selectedAddressId &&
        store.selectedShipping &&
        !store.isLoadingShipping
    );
  };

  // Process the checkout for all stores
  const handleCheckout = async () => {
    if (!allStoresReadyForCheckout()) {
      toast.info("Please select shipping method for all stores");
      return;
    }

    setProcessingCheckout(true);

    try {
      // Create an array of store checkout configurations
      const storeConfigs = storeCheckouts.map((store) => ({
        id_toko: store.id_toko,
        id_alamat: store.selectedAddressId,
        opsi_pengiriman: `JNE ${store.selectedShipping}`,
        biaya_kirim: store.shippingCost,
        catatan_pembeli: store.notes,
      }));

      // Process multi-store checkout
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${purchaseCode}/multi-checkout`,
        {
          stores: storeConfigs,
          metode_pembayaran: "midtrans", // Always use midtrans
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
          {/* Store checkouts */}
          {storeCheckouts.map((store, storeIndex) => (
            <div key={store.id_toko} className="space-y-6">
              {/* Store header */}
              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center">
                    <Store className="h-5 w-5 mr-2" />
                    {store.nama_toko}
                  </CardTitle>
                </CardHeader>

                {/* Products for this store */}
                <CardContent className="space-y-4">
                  {store.products.map((product, productIndex) => (
                    <div key={productIndex} className="flex gap-4 py-2">
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
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{product.nama_barang}</h3>
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
                  ))}
                </CardContent>
              </Card>

              {/* Shipping address for this store */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address for {store.nama_toko}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.length > 0 ? (
                    <RadioGroup
                      value={store.selectedAddressId?.toString() || ""}
                      onValueChange={(value) =>
                        handleAddressChange(storeIndex, parseInt(value))
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
                            id={`address-${storeIndex}-${address.id_alamat}`}
                            className="mt-1"
                          />
                          <Label
                            htmlFor={`address-${storeIndex}-${address.id_alamat}`}
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
                              {address.alamat_lengkap}, {address.district?.name}
                              , {address.regency?.name},{" "}
                              {address.province?.name}, {address.kode_pos}
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

                  {store.selectedAddressId && !store.shippingOptions.length && (
                    <Button
                      variant="outline"
                      onClick={() => calculateShipping(storeIndex)}
                      disabled={store.isLoadingShipping}
                      className="w-full"
                    >
                      {store.isLoadingShipping && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Calculate Shipping
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Shipping options for this store */}
              {store.shippingOptions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Method for {store.nama_toko}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={store.selectedShipping || ""}
                      onValueChange={(value) =>
                        handleShippingChange(storeIndex, value)
                      }
                      className="space-y-3"
                    >
                      {store.shippingOptions.map((option) => (
                        <div
                          key={option.service}
                          className="flex items-start space-x-2 border rounded-lg p-3 hover:border-black transition-colors"
                        >
                          <RadioGroupItem
                            value={option.service}
                            id={`shipping-${storeIndex}-${option.service}`}
                            className="mt-1"
                          />
                          <Label
                            htmlFor={`shipping-${storeIndex}-${option.service}`}
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

              {/* Notes for this store */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes for {store.nama_toko} (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={`Add notes for your order from ${store.nama_toko}`}
                    value={store.notes}
                    onChange={(e) =>
                      handleNotesChange(storeIndex, e.target.value)
                    }
                    className="resize-none"
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Store subtotal */}
              <Card>
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Store Subtotal:</span>
                    <span className="font-bold">
                      {formatRupiah(store.subtotal + store.shippingCost)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
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
                  <span className="text-gray-500">Products Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Shipping</span>
                  <span>{formatRupiah(totalShipping)}</span>
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
                  processingCheckout ||
                  storeCheckouts.length === 0 ||
                  !allStoresReadyForCheckout()
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
