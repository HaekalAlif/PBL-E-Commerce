import { Message } from "../types";
import { formatDate } from "@/lib/formatter";
import { Check, CheckCheck, Clock } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
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
        return "border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50";
      case "System":
        return "border border-gray-200 bg-gray-50 text-gray-600";
      default:
        return "";
    }
  };

  const getOfferStatusColor = () => {
    switch (message.status_penawaran) {
      case "Diterima":
        return "text-green-600 bg-green-50";
      case "Ditolak":
        return "text-red-600 bg-red-50";
      default:
        return "text-amber-600 bg-amber-50";
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
            isOwnMessage
              ? "bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white ml-auto"
              : "bg-white border border-orange-100 text-gray-900"
          }
          ${isOwnMessage ? "rounded-br-md" : "rounded-bl-md"}
        `}
        >
          {/* Sender Name (only for incoming messages) */}
          {!isOwnMessage && (
            <div className="text-xs font-medium text-[#F79E0E] mb-1">
              {message.user.name}
            </div>
          )}

          {/* Message Content */}
          {message.tipe_pesan === "Penawaran" ? (
            <div className="space-y-2">
              <div className="font-medium">
                💰 Penawaran: Rp {message.harga_tawar?.toLocaleString("id-ID")}
              </div>
              {message.isi_pesan && (
                <div className="text-sm opacity-90">{message.isi_pesan}</div>
              )}
              <div
                className={`
                inline-block px-2 py-1 rounded-full text-xs font-medium
                ${getOfferStatusColor()}
              `}
              >
                {message.status_penawaran || "Menunggu"}
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words">
              {message.isi_pesan}
            </div>
          )}

          {/* Message Tail */}
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
        </div>

        {/* Message Info */}
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
      </div>
    </div>
  );
}

export default MessageBubble;
