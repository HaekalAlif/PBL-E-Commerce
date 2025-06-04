import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Address, StoreCheckout } from "../types";

export const useCheckout = () => {
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

  // Fetch existing purchase details with custom axios instance
  const fetchPurchaseDetails = async (code: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${code}`
      );

      if (response.data.status === "success") {
        const purchaseData = response.data.data;

        if (!purchaseData) {
          toast.error("Failed to load purchase details");
          return;
        }

        if (!purchaseData.detailPembelian) {
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

              if (purchaseData.id_alamat) {
                setDefaultAddressId(purchaseData.id_alamat);
              }

              if (purchaseData.catatan_pembeli) {
                try {
                  const metadata = JSON.parse(purchaseData.catatan_pembeli);
                  if (metadata && metadata.is_multi_store) {
                    setIsMultiStoreCheckout(true);
                  }
                } catch (e) {}
              }
              return;
            }
          } catch (fallbackError) {}

          toast.error("Purchase has no product details");
          router.push("/user/katalog");
          return;
        }

        if (
          Array.isArray(purchaseData.detailPembelian) &&
          purchaseData.detailPembelian.length > 0
        ) {
          processProductsIntoStores(purchaseData.detailPembelian);

          if (purchaseData.id_alamat) {
            setDefaultAddressId(purchaseData.id_alamat);
          }

          if (purchaseData.catatan_pembeli) {
            try {
              const metadata = JSON.parse(purchaseData.catatan_pembeli);
              if (metadata && metadata.is_multi_store) {
                setIsMultiStoreCheckout(true);
              }
            } catch (e) {}
          }
        } else {
          toast.error("Purchase has no valid products");
          router.push("/user/katalog");
        }
      } else {
        toast.error(response.data.message || "Failed to load purchase details");
      }
    } catch (error) {
      toast.error("Failed to load purchase details");
    } finally {
      setLoading(false);
    }
  };

  const processProductsIntoStores = (detailItems: any[]) => {
    const storeMap = new Map<number, StoreCheckout>();

    detailItems.forEach((detail) => {
      if (!detail.barang) {
        return;
      }

      const toko = detail.toko ||
        detail.barang.toko || { id_toko: 0, nama_toko: "Unknown Shop" };
      const tokoId = toko.id_toko;

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

      const productImages = detail.barang.gambar_barang || [];

      const product = {
        id_barang: detail.barang.id_barang,
        nama_barang: detail.barang.nama_barang,
        harga: detail.harga_satuan,
        jumlah: detail.jumlah,
        subtotal: detail.subtotal,
        gambar_barang: productImages,
        toko: toko,
      };

      storeGroup.products.push(product);
      storeGroup.subtotal += detail.subtotal;
    });

    setStoreCheckouts(Array.from(storeMap.values()));
  };

  const createNewPurchaseFromSlug = async (
    productSlug: string,
    quantity: number
  ) => {
    setLoading(true);
    try {
      const addressesResponse = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );

      if (addressesResponse.data.status === "success") {
        const addressList = addressesResponse.data.data;

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

        setDefaultAddressId(addressId);

        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/purchases`,
          {
            product_slug: productSlug,
            jumlah: quantity,
            id_alamat: addressId,
          }
        );

        if (response.data.status === "success") {
          const { kode_pembelian } = response.data.data;
          setPurchaseCode(kode_pembelian);

          toast.success("Purchase created, loading details...");

          setTimeout(() => {
            fetchPurchaseDetails(kode_pembelian);
          }, 1500);
        } else {
          toast.error(response.data.message || "Failed to create purchase");
          router.push("/user/katalog");
        }
      }
    } catch (error: any) {
      if (error.response) {
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

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/calculate`,
        {
          id_toko: store.id_toko,
          id_alamat: store.selectedAddressId,
          products: products,
        }
      );

      if (response.data.status === "success") {
        const { shipping_options } = response.data.data;

        if (!shipping_options || shipping_options.length === 0) {
          throw new Error("No shipping options available");
        }

        // Transform API response to match our interface
        const transformedOptions = shipping_options.map((option: any) => ({
          service: `${option.courier_code}-${option.service}`,
          description: option.display_name,
          cost: option.cost,
          etd: option.etd,
          courier_name: option.courier_name,
          service_code: option.service,
        }));

        // Auto-select the cheapest option
        const cheapestOption = transformedOptions[0]; // Already sorted by cost

        setStoreCheckouts((prevStores) => {
          const newStores = [...prevStores];
          newStores[storeIndex] = {
            ...newStores[storeIndex],
            shippingOptions: transformedOptions,
            selectedShipping: cheapestOption.service,
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

      // Show detailed error message without fallback
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
          selectedShipping: value,
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
      const storeConfigs = storeCheckouts.map((store) => ({
        id_toko: store.id_toko,
        id_alamat: store.selectedAddressId,
        opsi_pengiriman: `JNE ${store.selectedShipping}`,
        biaya_kirim: store.shippingCost,
        catatan_pembeli: store.notes,
      }));

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${purchaseCode}/multi-checkout`,
        {
          stores: storeConfigs,
          metode_pembayaran: "midtrans",
        }
      );

      if (response.data.status === "success") {
        const { kode_tagihan } = response.data.data;
        toast.success("Checkout successful! Redirecting to payment page...");
        router.push(`/user/payments/${kode_tagihan}`);
      }
    } catch (error) {
      toast.error("Failed to process checkout. Please try again.");
    } finally {
      setProcessingCheckout(false);
    }
  };

  useEffect(() => {
    if (!searchParams) return;

    const productSlug = searchParams.get("product_slug");
    const quantity = searchParams.get("quantity") || "1";
    const code = searchParams.get("code");
    const multiStore = searchParams.get("multi_store") === "true";

    setIsMultiStoreCheckout(multiStore);

    if (code) {
      setPurchaseCode(code);
      fetchPurchaseDetails(code);
    } else if (productSlug) {
      createNewPurchaseFromSlug(productSlug, parseInt(quantity));
    } else {
      toast.error("No product or purchase details provided");
      router.push("/user/katalog");
    }

    fetchUserAddresses();
  }, [searchParams]);

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
    handleShippingChange,
    handleAddressChange,
    handleNotesChange,
    calculateShipping,
    handleCheckout,
    allStoresReadyForCheckout,
  };
};
