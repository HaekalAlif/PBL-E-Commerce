"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Trash2,
  MinusCircle,
  PlusCircle,
  ShoppingCart,
  Store,
  AlertTriangle,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CartItem {
  id_keranjang: number;
  id_barang: number;
  jumlah: number;
  is_selected: boolean;
  barang: {
    id_barang: number;
    nama_barang: string;
    harga: number;
    status_barang: string;
    stok: number;
    slug: string;
    gambarBarang?: Array<{
      url_gambar: string;
    }>;
    gambar_barang?: Array<{
      url_gambar: string;
    }>;
    toko: {
      id_toko: number;
      nama_toko: string;
      slug: string;
    };
  };
}

// New interface to group cart items by store
interface StoreGroup {
  id_toko: number;
  nama_toko: string;
  slug: string;
  items: CartItem[];
  allSelected: boolean;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [storeGroups, setStoreGroups] = useState<StoreGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Load cart items
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Group items by store when cart items change
  useEffect(() => {
    groupItemsByStore();
  }, [cartItems]);

  // Calculate totals when cart items or selections change
  useEffect(() => {
    calculateTotals();
    // Check if all items are selected
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

  // Group items by store
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

    // Calculate if all items in a store are selected
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

  // Check if a product is available
  const isProductAvailable = (product: CartItem["barang"]) => {
    return product.status_barang === "Tersedia" && product.stok > 0;
  };

  const handleSelectItem = async (itemId: number, selected: boolean) => {
    // Find the item to check availability
    const item = cartItems.find((item) => item.id_keranjang === itemId);
    if (!item) return;

    // Don't allow selection of unavailable items
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

      // Update local state
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
      // Get all available items from this store
      const storeItems = cartItems.filter(
        (item) =>
          item.barang.toko.id_toko === storeId &&
          isProductAvailable(item.barang)
      );

      if (storeItems.length === 0) {
        toast.error("No available items to select in this store");
        return;
      }

      // Update each item
      for (const item of storeItems) {
        await axiosInstance.put(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/${item.id_keranjang}`,
          {
            is_selected: selected,
          }
        );
      }

      // Update local state
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
      // Only select available items
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

      // Update local state - but only for available products
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

    // Find the item to check stock limit
    const item = cartItems.find((item) => item.id_keranjang === itemId);
    if (!item) return;

    // Check if product is available
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

      // Update local state
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

      // Update local state
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
    // Filter for selected items that are available
    const selectedItems = cartItems.filter(
      (item) => item.is_selected && isProductAvailable(item.barang)
    );

    if (selectedItems.length === 0) {
      toast.error("Please select at least one available item to checkout");
      return;
    }

    setProcessingCheckout(true);

    try {
      // Fetch user addresses to redirect if none exist
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

      // Check if items are from multiple stores
      const storeIds = new Set(
        selectedItems.map((item) => item.barang.toko.id_toko)
      );
      const isMultiStore = storeIds.size > 1;

      // Create purchase from cart
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/checkout`,
        {
          id_alamat: addressResponse.data.data[0].id_alamat, // Use first address by default
        }
      );

      if (response.data.status === "success") {
        toast.success("Checkout successful! Redirecting to checkout page...");
        // Include multi_store flag in the URL
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

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your cart...</span>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
        <Card className="w-full py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Start shopping to add items to your cart
            </p>
            <Button onClick={() => router.push("/user/katalog")}>
              Browse Products
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  className="mr-3"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  Select All Items
                </label>
              </div>
            </CardHeader>
          </Card>

          {/* Group by store */}
          {storeGroups.map((store) => (
            <Card key={store.id_toko} className="overflow-hidden">
              <CardHeader className="pb-2 bg-gray-50">
                <div className="flex items-center">
                  <Checkbox
                    id={`store-${store.id_toko}`}
                    checked={store.allSelected}
                    onCheckedChange={(checked) =>
                      handleSelectStoreItems(store.id_toko, !!checked)
                    }
                    className="mr-3"
                  />
                  <label
                    htmlFor={`store-${store.id_toko}`}
                    className="text-sm font-medium cursor-pointer flex-1 flex items-center"
                  >
                    <Store className="h-4 w-4 mr-2" />
                    {store.nama_toko}
                  </label>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 divide-y">
                {store.items.map((item) => {
                  const isAvailable = isProductAvailable(item.barang);
                  return (
                    <div
                      key={item.id_keranjang}
                      className="flex gap-4 pt-4 first:pt-2"
                    >
                      <div className="pt-1">
                        <Checkbox
                          checked={item.is_selected}
                          disabled={!isAvailable}
                          onCheckedChange={(checked) =>
                            handleSelectItem(item.id_keranjang, !!checked)
                          }
                        />
                      </div>

                      <div className="w-20 h-20 bg-gray-100 relative overflow-hidden rounded-md">
                        {(item.barang.gambarBarang &&
                          item.barang.gambarBarang.length > 0) ||
                        (item.barang.gambar_barang &&
                          item.barang.gambar_barang.length > 0) ? (
                          <img
                            src={
                              item.barang.gambarBarang?.[0]?.url_gambar ||
                              item.barang.gambar_barang?.[0]?.url_gambar
                            }
                            alt={item.barang.nama_barang}
                            className={`object-cover w-full h-full ${
                              !isAvailable ? "opacity-50" : ""
                            }`}
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

                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                            <Badge
                              variant="destructive"
                              className="pointer-events-none"
                            >
                              {item.barang.stok === 0
                                ? "Out of Stock"
                                : "Unavailable"}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/user/katalog/detail/${item.barang.slug}`}
                            className="hover:underline"
                          >
                            <h3 className="font-medium">
                              {item.barang.nama_barang}
                            </h3>
                          </Link>

                          {!isAvailable && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>

                        <p className="text-sm text-gray-500">
                          {item.barang.toko.nama_toko}
                        </p>
                        <p className="font-medium mt-1">
                          {formatRupiah(item.barang.harga)}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() =>
                                handleQuantityChange(
                                  item.id_keranjang,
                                  item.jumlah - 1
                                )
                              }
                              disabled={item.jumlah <= 1 || !isAvailable}
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center">
                              {item.jumlah}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() =>
                                handleQuantityChange(
                                  item.id_keranjang,
                                  item.jumlah + 1
                                )
                              }
                              disabled={
                                item.jumlah >= item.barang.stok || !isAvailable
                              }
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                            <span
                              className={`text-sm ${
                                !isAvailable
                                  ? "text-red-500 font-medium"
                                  : "text-gray-500"
                              } ml-2`}
                            >
                              {isAvailable
                                ? `Stock: ${item.barang.stok}`
                                : item.barang.stok === 0
                                ? "Out of Stock"
                                : "Unavailable"}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id_keranjang)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal ({getAvailableSelectedCount()} items)
                  </span>
                  <span>{formatRupiah(subTotal)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                className="w-full"
                disabled={
                  processingCheckout || getAvailableSelectedCount() === 0
                }
                onClick={handleCheckout}
              >
                {processingCheckout ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Checkout"
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleMakeOffer}
                disabled={getAvailableSelectedCount() === 0}
              >
                Make an Offer
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
