import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartItem, StoreGroup } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export function useCart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [storeGroups, setStoreGroups] = useState<StoreGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    groupItemsByStore();
  }, [cartItems]);

  useEffect(() => {
    calculateTotals();
    const allItemsSelected =
      cartItems.length > 0 && cartItems.every((item) => item.is_selected);
    setAllSelected(allItemsSelected);
  }, [cartItems]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`
      );
      if (response.data.status === "success") {
        setCartItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const groupItemsByStore = () => {
    if (!cartItems.length) {
      setStoreGroups([]);
      return;
    }

    const groupedByStore: Record<number, StoreGroup> = {};

    cartItems.forEach((item) => {
      const storeId = item.barang.toko.id_toko;

      if (!groupedByStore[storeId]) {
        groupedByStore[storeId] = {
          id_toko: storeId,
          nama_toko: item.barang.toko.nama_toko,
          slug: item.barang.toko.slug,
          items: [],
          allSelected: false,
        };
      }

      groupedByStore[storeId].items.push(item);
    });

    Object.values(groupedByStore).forEach((store) => {
      store.allSelected =
        store.items.length > 0 && store.items.every((item) => item.is_selected);
    });

    setStoreGroups(Object.values(groupedByStore));
  };

  const calculateTotals = () => {
    const selectedItems = cartItems.filter(
      (item) => item.is_selected && isProductAvailable(item.barang)
    );
    const subtotalAmount = selectedItems.reduce(
      (sum, item) => sum + item.barang.harga * item.jumlah,
      0
    );

    setSubTotal(subtotalAmount);
    setTotal(subtotalAmount);
  };

  const isProductAvailable = (product: CartItem["barang"]) => {
    return product.status_barang === "Tersedia" && product.stok > 0;
  };

  const handleSelectItem = async (itemId: number, selected: boolean) => {
    const item = cartItems.find((item) => item.id_keranjang === itemId);
    if (!item) return;

    if (selected && !isProductAvailable(item.barang)) {
      toast.error("Cannot select out-of-stock or unavailable items");
      return;
    }

    try {
      await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`,
        {
          is_selected: selected,
        }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id_keranjang === itemId
            ? { ...item, is_selected: selected }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating item selection:", error);
      toast.error("Failed to update selection");
    }
  };

  const handleSelectStoreItems = async (storeId: number, selected: boolean) => {
    try {
      const storeItems = cartItems.filter(
        (item) =>
          item.barang.toko.id_toko === storeId &&
          isProductAvailable(item.barang)
      );

      if (storeItems.length === 0) {
        toast.error("No available items to select in this store");
        return;
      }

      for (const item of storeItems) {
        await axiosInstance.put(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/${item.id_keranjang}`,
          {
            is_selected: selected,
          }
        );
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.barang.toko.id_toko === storeId &&
          isProductAvailable(item.barang)
            ? { ...item, is_selected: selected }
            : item
        )
      );
    } catch (error) {
      console.error("Error selecting store items:", error);
      toast.error("Failed to update selections");
    }
  };

  const handleSelectAll = async (selected: boolean) => {
    try {
      const availableItemIds = cartItems
        .filter((item) => isProductAvailable(item.barang))
        .map((item) => item.id_keranjang);

      if (availableItemIds.length === 0) {
        toast.error("No available items to select");
        return;
      }

      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/select-all`,
        {
          select: selected,
        }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          is_selected: isProductAvailable(item.barang)
            ? selected
            : item.is_selected,
        }))
      );
    } catch (error) {
      console.error("Error selecting all items:", error);
      toast.error("Failed to update selections");
    }
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.find((item) => item.id_keranjang === itemId);
    if (!item) return;

    if (!isProductAvailable(item.barang)) {
      toast.error("This product is currently unavailable");
      return;
    }

    if (newQuantity > item.barang.stok) {
      toast.error(`Maximum available stock is ${item.barang.stok}`);
      return;
    }

    try {
      await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`,
        {
          jumlah: newQuantity,
        }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id_keranjang === itemId ? { ...item, jumlah: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`
      );

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id_keranjang !== itemId)
      );

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    const selectedItems = cartItems.filter(
      (item) => item.is_selected && isProductAvailable(item.barang)
    );

    if (selectedItems.length === 0) {
      toast.error("Please select at least one available item to checkout");
      return;
    }

    setProcessingCheckout(true);

    try {
      const addressResponse = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );

      if (
        addressResponse.data.status === "success" &&
        addressResponse.data.data.length === 0
      ) {
        toast.error("Please add a shipping address before checkout");
        router.push("/user/alamat");
        return;
      }

      const storeIds = new Set(
        selectedItems.map((item) => item.barang.toko.id_toko)
      );
      const isMultiStore = storeIds.size > 1;

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/checkout`,
        {
          id_alamat: addressResponse.data.data[0].id_alamat,
        }
      );

      if (response.data.status === "success") {
        toast.success("Checkout successful! Redirecting to checkout page...");
        router.push(
          `/user/checkout?code=${response.data.data.kode_pembelian}&multi_store=${isMultiStore}`
        );
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to create checkout. Please try again.");
    } finally {
      setProcessingCheckout(false);
    }
  };

  const handleMakeOffer = () => {
    toast.info("Offer feature coming soon!");
  };

  const getAvailableSelectedCount = () => {
    return cartItems.filter(
      (item) => item.is_selected && isProductAvailable(item.barang)
    ).length;
  };

  return {
    cartItems,
    storeGroups,
    loading,
    processingCheckout,
    allSelected,
    subTotal,
    total,
    isProductAvailable,
    handleSelectItem,
    handleSelectStoreItems,
    handleSelectAll,
    handleQuantityChange,
    handleRemoveItem,
    handleCheckout,
    handleMakeOffer,
    getAvailableSelectedCount,
  };
}
