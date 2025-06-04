import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import {
  Address,
  DetailPembelianAPI,
  ProductInCheckout,
  StoreCheckout,
} from "../types";

export const useCheckout = (
  code: string | null,
  multiStore: boolean = false,
  fromOffer: boolean = false
) => {
  const router = useRouter();

  // States for checkout data
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
  const [totalSavings, setTotalSavings] = useState(0);
  const [isFromOffer, setIsFromOffer] = useState(fromOffer);

  // Fetch purchase details by code
  const fetchPurchaseDetails = async () => {
    if (!code) {
      toast.error("No purchase code provided");
      router.push("/");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${code}`
      );

      if (response.data.status === "success") {
        const purchaseData = response.data.data;

        if (!purchaseData) {
          toast.error("Failed to load purchase details");
          router.push("/");
          return;
        }

        // Check if this is from an offer (either from URL param or purchase metadata)
        if (
          fromOffer ||
          (purchaseData.catatan_pembeli &&
            purchaseData.catatan_pembeli.includes("from accepted offer"))
        ) {
          setIsFromOffer(true);
        }

        if (
          !purchaseData.detail_pembelian ||
          purchaseData.detail_pembelian.length === 0
        ) {
          toast.error("Purchase has no product details");
          router.push("/");
          return;
        }

        processProductsIntoStores(purchaseData.detail_pembelian);

        if (purchaseData.id_alamat) {
          setDefaultAddressId(purchaseData.id_alamat);
        }
      } else {
        toast.error(response.data.message || "Failed to load purchase details");
        router.push("/");
      }
    } catch (error: any) {
      console.error("Error fetching purchase:", error);
      toast.error("Failed to load purchase details");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const processProductsIntoStores = (detailItems: DetailPembelianAPI[]) => {
    const storeMap = new Map<number, StoreCheckout>();
    let offerSavings = 0;

    console.log("Processing detail items:", detailItems);

    detailItems.forEach((detail) => {
      if (!detail.barang) {
        console.warn("Detail item missing barang:", detail);
        return;
      }

      // Get store info - with improved priority logic
      let storeData = null;
      let tokoId = 0;
      let tokoName = "Unknown Shop";
      let storeAddress = "";

      // Priority 1: Get from detail.toko (most complete data)
      if (detail.toko?.id_toko) {
        storeData = detail.toko;
        tokoId = detail.toko.id_toko;
        tokoName = detail.toko.nama_toko || `Store ${detail.toko.id_toko}`;

        // Get store address from alamat_toko
        if (detail.toko.alamat_toko && detail.toko.alamat_toko.length > 0) {
          const primaryAddress =
            detail.toko.alamat_toko.find((addr) => addr.is_primary) ||
            detail.toko.alamat_toko[0];
          const addressParts = [
            primaryAddress.alamat_lengkap,
            primaryAddress.district?.name,
            primaryAddress.regency?.name,
            primaryAddress.province?.name,
          ].filter(Boolean);
          storeAddress = addressParts.join(", ");
        }
      }
      // Priority 2: Get from detail.barang.toko
      else if (detail.barang.toko?.id_toko) {
        storeData = detail.barang.toko;
        tokoId = detail.barang.toko.id_toko;
        tokoName =
          detail.barang.toko.nama_toko || `Store ${detail.barang.toko.id_toko}`;

        // Get store address from alamat_toko
        if (
          detail.barang.toko.alamat_toko &&
          detail.barang.toko.alamat_toko.length > 0
        ) {
          const primaryAddress =
            detail.barang.toko.alamat_toko.find((addr) => addr.is_primary) ||
            detail.barang.toko.alamat_toko[0];
          const addressParts = [
            primaryAddress.alamat_lengkap,
            primaryAddress.district?.name,
            primaryAddress.regency?.name,
            primaryAddress.province?.name,
          ].filter(Boolean);
          storeAddress = addressParts.join(", ");
        }
      }
      // Priority 3: Fallback to ID only
      else {
        tokoId = detail.id_toko || detail.barang.id_toko || 0;
        tokoName = `Store ${tokoId}`;
      }

      console.log("Store processing result:", {
        tokoId,
        tokoName,
        storeAddress,
        hasStoreData: !!storeData,
        addressCount: storeData?.alamat_toko?.length || 0,
      });

      if (!storeMap.has(tokoId)) {
        storeMap.set(tokoId, {
          id_toko: tokoId,
          nama_toko: tokoName,
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

      // Get product images
      const productImages = detail.barang.gambar_barang || [];

      // Check if this item is from an offer and calculate savings
      const isItemFromOffer =
        detail.is_from_offer ||
        (detail.id_pesan !== null && detail.id_pesan !== undefined);
      let itemSavings = detail.savings || 0;

      if (isItemFromOffer && !itemSavings && detail.barang.harga) {
        itemSavings =
          (detail.barang.harga - detail.harga_satuan) * detail.jumlah;
      }

      if (itemSavings > 0) {
        offerSavings += itemSavings;
        setIsFromOffer(true);
      }

      const product: ProductInCheckout = {
        id_barang: detail.barang.id_barang,
        nama_barang: detail.barang.nama_barang,
        harga: detail.harga_satuan,
        jumlah: detail.jumlah,
        subtotal: detail.subtotal,
        gambar_barang: productImages,
        toko: {
          id_toko: tokoId,
          nama_toko: tokoName,
        },
        is_from_offer: isItemFromOffer,
        offer_price: isItemFromOffer ? detail.harga_satuan : undefined,
        original_price:
          detail.original_price || detail.barang.harga || undefined,
        savings: itemSavings,
      };

      storeGroup.products.push(product);
      storeGroup.subtotal += detail.subtotal;
    });

    if (offerSavings > 0) {
      setTotalSavings(offerSavings);
      setIsFromOffer(true);
    }

    const storeArray = Array.from(storeMap.values());
    console.log("Final store checkouts:", storeArray);
    setStoreCheckouts(storeArray);
  };

  const fetchUserAddresses = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );

      if (response.data.status === "success") {
        setAddresses(response.data.data);

        if (!defaultAddressId && response.data.data.length > 0) {
          const primaryAddress = response.data.data.find(
            (addr: Address) => addr.is_primary
          );
          const addressId = primaryAddress
            ? primaryAddress.id_alamat
            : response.data.data[0].id_alamat;

          setDefaultAddressId(addressId);

          setStoreCheckouts((prevStores) =>
            prevStores.map((store) => ({
              ...store,
              selectedAddressId: addressId,
            }))
          );
        }
      }
    } catch (error) {
      toast.error("Failed to load shipping addresses");
    }
  };

  const calculateShipping = async (storeIndex: number) => {
    const store = storeCheckouts[storeIndex];

    if (!store.selectedAddressId) {
      toast.info("Please select a shipping address for this store");
      return;
    }

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
      const selectedAddress = addresses.find(
        (addr) => addr.id_alamat === store.selectedAddressId
      );

      if (!selectedAddress) {
        toast.error("Please select a valid shipping address");
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

      // Prepare products data for weight calculation
      const products = store.products.map((product) => ({
        id_barang: product.id_barang,
        quantity: product.jumlah,
      }));

      console.log("Calling RajaOngkir API with data:", {
        id_toko: store.id_toko,
        id_alamat: store.selectedAddressId,
        products: products,
      });

      // Call the RajaOngkir API through our backend
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/calculate`,
        {
          id_toko: store.id_toko,
          id_alamat: store.selectedAddressId,
          products: products,
        }
      );

      console.log("RajaOngkir API response:", response.data);

      if (response.data.status === "success") {
        const { shipping_options } = response.data.data;

        if (!shipping_options || shipping_options.length === 0) {
          throw new Error("No shipping options available");
        }

        // Transform API response to match our interface
        const transformedOptions = shipping_options.map((option: any) => ({
          service: option.service, // Use just the service code (e.g., "REG", "JTR")
          description: option.display_name,
          cost: option.cost,
          etd: option.etd,
          courier_name: option.courier_name,
          service_code: option.service,
          courier_code: option.courier_code,
          full_service_name: option.full_service_name, // Add this for opsi_pengiriman
        }));

        // Auto-select the cheapest option
        const cheapestOption = transformedOptions[0]; // Already sorted by cost

        setStoreCheckouts((prevStores) => {
          const newStores = [...prevStores];
          newStores[storeIndex] = {
            ...newStores[storeIndex],
            shippingOptions: transformedOptions,
            selectedShipping: cheapestOption.service, // Store just the service code
            shippingCost: cheapestOption.cost,
            isLoadingShipping: false,
          };
          return newStores;
        });

        toast.success("Shipping options loaded successfully");
      } else {
        throw new Error(
          response.data.message || "Failed to calculate shipping"
        );
      }
    } catch (error: any) {
      console.error("Shipping calculation error:", error);

      // Show detailed error message
      let errorMessage = "Failed to fetch shipping costs.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setStoreCheckouts((prevStores) => {
        const newStores = [...prevStores];
        newStores[storeIndex] = {
          ...newStores[storeIndex],
          shippingOptions: [],
          selectedShipping: null,
          shippingCost: 0,
          isLoadingShipping: false,
        };
        return newStores;
      });

      toast.error(`Error: ${errorMessage}`);
    }
  };

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

  const handleShippingChange = (storeIndex: number, value: string) => {
    const store = storeCheckouts[storeIndex];
    const option = store.shippingOptions.find((opt) => opt.service === value);

    if (option) {
      setStoreCheckouts((prevStores) => {
        const newStores = [...prevStores];
        newStores[storeIndex] = {
          ...newStores[storeIndex],
          selectedShipping: value, // Store just the service name (e.g., "REG", "OKE", "YES")
          shippingCost: option.cost,
        };
        return newStores;
      });
    }
  };

  const handleAddressChange = (storeIndex: number, addressId: number) => {
    setStoreCheckouts((prevStores) => {
      const newStores = [...prevStores];
      newStores[storeIndex] = {
        ...newStores[storeIndex],
        selectedAddressId: addressId,
        shippingOptions: [],
        selectedShipping: null,
        shippingCost: 0,
      };
      return newStores;
    });
  };

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

  const allStoresReadyForCheckout = () => {
    return storeCheckouts.every(
      (store) =>
        store.selectedAddressId &&
        store.selectedShipping &&
        !store.isLoadingShipping
    );
  };

  const handleCheckout = async () => {
    if (!allStoresReadyForCheckout()) {
      toast.info("Please select shipping method for all stores");
      return;
    }

    setProcessingCheckout(true);

    try {
      console.log("🛒 Starting checkout process...");

      // For single store checkout, use direct format (not stores array)
      if (!multiStore) {
        const store = storeCheckouts[0];

        // Find the full service name for opsi_pengiriman
        const selectedOption = store.shippingOptions.find(
          (opt) => opt.service === store.selectedShipping
        );
        const opsiPengiriman =
          selectedOption?.full_service_name ||
          store.selectedShipping ||
          "Unknown Service";

        const requestData = {
          id_alamat: store.selectedAddressId,
          opsi_pengiriman: opsiPengiriman, // Use full service name instead of just service code
          biaya_kirim: store.shippingCost,
          catatan_pembeli: store.notes || "",
          metode_pembayaran: "midtrans",
          from_offer: isFromOffer || fromOffer,
        };

        console.log("📤 Single store request data:", requestData);

        const checkoutUrl = `${process.env.NEXT_PUBLIC_API_URL}/purchases/${code}/checkout`;
        const response = await axiosInstance.post(checkoutUrl, requestData);

        if (response.data.status === "success") {
          const { kode_tagihan } = response.data.data;
          toast.success("Checkout successful! Redirecting to payment page...");
          router.push(`/payments/${kode_tagihan}`);
        } else {
          console.error("❌ Checkout failed:", response.data);
          toast.error(response.data.message || "Checkout failed");
        }
      } else {
        // Multi-store checkout
        const storeConfigs = storeCheckouts.map((store) => {
          // Find the full service name for each store
          const selectedOption = store.shippingOptions.find(
            (opt) => opt.service === store.selectedShipping
          );
          const opsiPengiriman =
            selectedOption?.full_service_name ||
            store.selectedShipping ||
            "Unknown Service";

          return {
            id_toko: store.id_toko,
            id_alamat: store.selectedAddressId,
            opsi_pengiriman: opsiPengiriman, // Use full service name
            biaya_kirim: store.shippingCost,
            catatan_pembeli: store.notes || "",
          };
        });

        const requestData = {
          stores: storeConfigs,
          metode_pembayaran: "midtrans",
          from_offer: isFromOffer || fromOffer,
        };

        console.log("📤 Multi-store request data:", requestData);

        const checkoutUrl = `${process.env.NEXT_PUBLIC_API_URL}/purchases/${code}/multi-checkout`;
        const response = await axiosInstance.post(checkoutUrl, requestData);

        if (response.data.status === "success") {
          const { kode_tagihan } = response.data.data;
          toast.success("Checkout successful! Redirecting to payment page...");
          router.push(`/payments/${kode_tagihan}`);
        } else {
          console.error("❌ Multi-store checkout failed:", response.data);
          toast.error(response.data.message || "Multi-store checkout failed");
        }
      }
    } catch (error: any) {
      console.error("❌ Checkout error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      });

      let errorMessage = "Failed to process checkout. Please try again.";

      if (error.response?.status === 422) {
        console.error("🔍 Validation errors:", error.response.data.errors);

        if (error.response.data.errors) {
          const validationErrors = Object.values(
            error.response.data.errors
          ).flat();
          errorMessage = `Validation failed: ${validationErrors.join(", ")}`;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setProcessingCheckout(false);
    }
  };

  useEffect(() => {
    if (code) {
      fetchPurchaseDetails();
      fetchUserAddresses();
    }
  }, [code]);

  useEffect(() => {
    calculateTotals();
  }, [storeCheckouts]);

  return {
    loading,
    processingCheckout,
    addresses,
    storeCheckouts,
    subtotal,
    totalShipping,
    adminFee,
    total,
    totalSavings,
    isFromOffer,
    handleShippingChange,
    handleAddressChange,
    handleNotesChange,
    calculateShipping,
    handleCheckout,
    allStoresReadyForCheckout,
  };
};
