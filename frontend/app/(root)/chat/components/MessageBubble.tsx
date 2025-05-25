import { Message } from "../types";
import { formatDate } from "@/lib/formatter";
import {
  Check,
  CheckCheck,
  Clock,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onOfferResponse?: (
    messageId: number,
    status: string,
    responseMessage?: string
  ) => void;
  currentUserId?: number;
  chatRoomData?: any;
}

function MessageBubble({
  message,
  isOwnMessage,
  onOfferResponse,
  currentUserId,
  chatRoomData,
}: MessageBubbleProps) {
  const [responding, setResponding] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [creatingPurchase, setCreatingPurchase] = useState(false);
  const router = useRouter();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getMessageTypeStyle = () => {
    switch (message.tipe_pesan) {
      case "Penawaran":
        // Use consistent styling for both sender and receiver of offers
        return "border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50";
      case "System":
        return "border border-gray-200 bg-gray-50 text-gray-600";
      case "Gambar":
        return "border border-orange-200 bg-orange-50/30";
      default:
        return "";
    }
  };

  const getOfferStatusColor = () => {
    switch (message.status_penawaran) {
      case "Diterima":
        return "text-green-600 bg-green-50 border-green-200";
      case "Ditolak":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-amber-600 bg-amber-50 border-amber-200";
    }
  };

  const handleOfferResponse = async (status: string) => {
    if (!onOfferResponse) return;

    setResponding(true);
    try {
      await onOfferResponse(message.id_pesan, status, responseMessage);
      setShowResponseForm(false);
      setResponseMessage("");
      toast.success(`Penawaran ${status.toLowerCase()} berhasil!`);
    } catch (error: any) {
      console.error("Error responding to offer:", error);
      toast.error(error.response?.data?.message || "Gagal merespons penawaran");
    } finally {
      setResponding(false);
    }
  };

  const canRespondToOffer = () => {
    return (
      message.tipe_pesan === "Penawaran" &&
      message.status_penawaran === "Menunggu" &&
      !isOwnMessage &&
      chatRoomData?.id_penjual === currentUserId
    );
  };

  const canCheckoutFromOffer = () => {
    return (
      message.tipe_pesan === "Penawaran" &&
      message.status_penawaran === "Diterima" &&
      isOwnMessage &&
      chatRoomData?.id_pembeli === currentUserId
    );
  };

  const handleCreatePurchaseFromOffer = async () => {
    setCreatingPurchase(true);
    try {
      console.log("🛒 Creating purchase from offer:", message.id_pesan);

      // Step 1: Get user's addresses first
      toast.info("Preparing purchase from offer...");

      const addressResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );

      if (
        addressResponse.data.status !== "success" ||
        !addressResponse.data.data.length
      ) {
        toast.error("Please add a shipping address first");
        router.push("/user/alamat");
        return;
      }

      const addresses = addressResponse.data.data;
      const primaryAddress =
        addresses.find((addr: any) => addr.is_primary) || addresses[0];

      // Step 2: Try to create purchase from offer directly
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/offers/${message.id_pesan}/purchase`,
          {
            jumlah: 1, // Default quantity for now, could be made configurable
            id_alamat: primaryAddress.id_alamat,
          }
        );

        if (response.data.success) {
          const { kode_pembelian } = response.data.data;
          toast.success(
            "Purchase created from offer! Redirecting to checkout..."
          );

          // Step 3: Redirect to checkout page with offer flag
          router.push(`/checkout?code=${kode_pembelian}&from_offer=true`);
        } else {
          toast.error(
            response.data.message || "Failed to create purchase from offer"
          );
        }
      } catch (createError: any) {
        console.log(
          "Error creating purchase, checking if already exists:",
          createError.response?.data
        );

        // If creation failed, it might be because purchase already exists
        // Only then check for existing purchase
        if (
          createError.response?.status === 400 ||
          createError.response?.status === 409
        ) {
          try {
            const existingPurchaseResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/chat/offers/${message.id_pesan}/check-purchase`
            );

            if (
              existingPurchaseResponse.data.success &&
              existingPurchaseResponse.data.data?.kode_pembelian
            ) {
              const { kode_pembelian } = existingPurchaseResponse.data.data;
              toast.success("Redirecting to existing purchase...");
              router.push(`/checkout?code=${kode_pembelian}&from_offer=true`);
              return;
            }
          } catch (checkError) {
            console.log(
              "No existing purchase found, original error was:",
              createError.response?.data
            );
          }
        }

        // If we get here, throw the original creation error
        throw createError;
      }
    } catch (error: any) {
      console.error("Error creating purchase from offer:", error);
      if (error.response?.status === 401) {
        toast.error("Please log in to continue");
        router.push("/login");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to create purchase from offer"
        );
      }
    } finally {
      setCreatingPurchase(false);
    }
  };

  const formatOfferPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${imagePath}`;
  };

  const renderMessageContent = () => {
    switch (message.tipe_pesan) {
      case "Penawaran":
        return (
          <div className="space-y-3">
            {/* Offer Header */}
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-sm text-amber-800">
                Penawaran Harga
              </span>
            </div>

            {/* Offer Amount */}
            <div className="text-lg font-bold text-gray-900">
              {formatOfferPrice(message.harga_tawar || 0)}
            </div>

            {/* Offer Message */}
            {message.isi_pesan && (
              <div className="text-sm p-2 rounded bg-amber-50/50 text-gray-700">
                {message.isi_pesan}
              </div>
            )}

            {/* Offer Status */}
            <div
              className={`
                inline-block px-2 py-1 rounded-full text-xs font-medium border
                ${getOfferStatusColor()}
              `}
            >
              {message.status_penawaran === "Menunggu"
                ? "⏳ Menunggu Respons"
                : message.status_penawaran === "Diterima"
                ? "✅ Diterima"
                : message.status_penawaran === "Ditolak"
                ? "❌ Ditolak"
                : message.status_penawaran || "Menunggu"}
            </div>

            {/* Response Buttons for Seller */}
            {canRespondToOffer() && !showResponseForm && (
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => setShowResponseForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                >
                  Respons
                </Button>
              </div>
            )}

            {/* Response Form */}
            {canRespondToOffer() && showResponseForm && (
              <div className="mt-3 p-3 bg-white/80 rounded-lg space-y-2">
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Pesan tambahan (opsional)"
                  className="w-full p-2 text-sm border rounded resize-none bg-white text-gray-900"
                  rows={2}
                  maxLength={200}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleOfferResponse("Diterima")}
                    disabled={responding}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 flex-1"
                  >
                    {responding ? "..." : "✅ Terima"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleOfferResponse("Ditolak")}
                    disabled={responding}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 flex-1"
                  >
                    {responding ? "..." : "❌ Tolak"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowResponseForm(false);
                      setResponseMessage("");
                    }}
                    className="text-xs px-2 py-1 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}

            {/* Checkout Button for Accepted Offers (Buyer) */}
            {canCheckoutFromOffer() && (
              <div className="mt-3">
                <Button
                  size="sm"
                  onClick={handleCreatePurchaseFromOffer}
                  disabled={creatingPurchase}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-4 py-2 w-full font-medium transition-colors"
                >
                  {creatingPurchase ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </div>
                  ) : (
                    "🛒 Checkout Sekarang"
                  )}
                </Button>
              </div>
            )}
          </div>
        );

      case "Gambar":
        return (
          <div className="space-y-2">
            {/* Image Header */}
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="font-medium text-sm">Gambar</span>
            </div>

            {/* Image Display */}
            <div className="relative max-w-64 rounded-lg overflow-hidden">
              {!imageError ? (
                <Image
                  src={getImageUrl(message.isi_pesan || "")}
                  alt="Shared image"
                  width={256}
                  height={192}
                  className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onError={() => setImageError(true)}
                  onClick={() => {
                    // Open image in new tab
                    window.open(getImageUrl(message.isi_pesan || ""), "_blank");
                  }}
                />
              ) : (
                <div className="w-64 h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Gambar tidak dapat dimuat</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "System":
        return (
          <div className="text-center text-sm italic">{message.isi_pesan}</div>
        );

      default:
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.isi_pesan}
          </div>
        );
    }
  };

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : "order-1"}`}>
        {/* Message Container */}
        <div
          className={`
          relative px-4 py-3 rounded-2xl shadow-sm
          ${getMessageTypeStyle()}
          ${
            message.tipe_pesan === "System"
              ? "mx-auto bg-gray-100 text-gray-600 text-center"
              : message.tipe_pesan === "Penawaran"
              ? "bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 text-gray-900" // Consistent styling for offers
              : isOwnMessage
              ? "bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white ml-auto"
              : "bg-white border border-orange-100 text-gray-900"
          }
          ${
            isOwnMessage &&
            message.tipe_pesan !== "System" &&
            message.tipe_pesan !== "Penawaran"
              ? "rounded-br-md"
              : message.tipe_pesan !== "System" &&
                message.tipe_pesan !== "Penawaran"
              ? "rounded-bl-md"
              : ""
          }
        `}
        >
          {/* Sender Name (only for incoming messages and not system/offer messages) */}
          {!isOwnMessage &&
            message.tipe_pesan !== "System" &&
            message.tipe_pesan !== "Penawaran" && (
              <div className="text-xs font-medium text-[#F79E0E] mb-1">
                {message.user.name}
              </div>
            )}

          {/* Message Content */}
          {renderMessageContent()}

          {/* Message Tail (not for system and offer messages) */}
          {message.tipe_pesan !== "System" &&
            message.tipe_pesan !== "Penawaran" && (
              <div
                className={`
              absolute top-3 w-3 h-3 transform rotate-45
              ${
                isOwnMessage
                  ? "right-[-6px] bg-gradient-to-br from-[#F79E0E] to-[#FFB648]"
                  : "left-[-6px] bg-white border-l border-b border-orange-100"
              }
            `}
              />
            )}
        </div>

        {/* Message Info (not for system messages) */}
        {message.tipe_pesan !== "System" && (
          <div
            className={`
            flex items-center gap-2 mt-1 text-xs text-gray-500
            ${isOwnMessage ? "justify-end" : "justify-start"}
          `}
          >
            <span>{formatTime(message.created_at)}</span>

            {/* Read Status (only for own messages) */}
            {isOwnMessage && (
              <div className="flex items-center">
                {message.is_read ? (
                  <div title="Dibaca">
                    <CheckCheck className="h-3 w-3 text-blue-500" />
                  </div>
                ) : (
                  <div title="Terkirim">
                    <Check className="h-3 w-3 text-gray-400" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
