import { useState, useRef } from "react";
import { Send, Paperclip, Smile, DollarSign, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendImage?: (file: File) => void;
  onOpenOfferForm?: () => void;
  canMakeOffer?: boolean;
  disabled?: boolean;
}

function ChatInput({
  onSendMessage,
  onSendImage,
  onOpenOfferForm,
  canMakeOffer = false,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleSendMessage = async () => {
    if (message.trim() !== "" && !isSending && !disabled) {
      setIsSending(true);
      try {
        await onSendMessage(message.trim());
        setMessage("");
        // Reset textarea height
        const textarea = document.getElementById(
          "chat-input"
        ) as HTMLTextAreaElement;
        if (textarea) {
          textarea.style.height = "auto";
        }

        // Focus back on the input after sending
        setTimeout(() => {
          textarea?.focus();
        }, 100);
      } catch (error) {
        console.error("Failed to send message:", error);
        toast.error("Gagal mengirim pesan");
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendImage) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Hanya file gambar yang diperbolehkan");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      onSendImage(file);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 bg-white">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div className="flex items-end gap-2">
        {/* Offer Button - Only show for buyers */}
        {canMakeOffer && onOpenOfferForm && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenOfferForm}
            className="h-10 w-10 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-full flex-shrink-0"
            disabled={disabled || isSending}
            title="Buat Penawaran"
          >
            <DollarSign className="h-5 w-5" />
          </Button>
        )}

        {/* Image Upload Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="h-10 w-10 text-gray-400 hover:text-[#F79E0E] hover:bg-orange-50 rounded-full flex-shrink-0"
          disabled={disabled || isSending}
          title="Kirim Gambar"
        >
          <Image className="h-5 w-5" />
        </Button>

        {/* Input Container */}
        <div className="flex-1 relative ">
          <textarea
            id="chat-input"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan..."
            disabled={disabled || isSending}
            rows={1}
            className="w-full px-4 py-3 pr-12 border border-orange-200 rounded-2xl 
                     focus:outline-none focus:ring-2 focus:ring-[#F79E0E]/20 focus:border-[#F79E0E]
                     placeholder:text-gray-400 resize-none bg-orange-50/30
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
            style={{
              minHeight: "44px",
              maxHeight: "100px",
              lineHeight: "1.4",
            }}
          />

          {/* Emoji Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-1 h-8 w-8 text-gray-400 hover:text-[#F79E0E] hover:bg-orange-50 rounded-full"
            disabled={disabled || isSending}
            title="Emoji"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={disabled || isSending || message.trim() === ""}
          className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F79E0E] to-[#FFB648] 
                   hover:from-[#F79E0E]/90 hover:to-[#FFB648]/90 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg hover:shadow-xl transition-all duration-200
                   disabled:shadow-none flex-shrink-0"
          title="Kirim Pesan"
        >
          {isSending ? (
            <div className="relative">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <div className="absolute inset-0 w-4 h-4 border-2 border-transparent border-r-white/60 rounded-full animate-spin animation-delay-75" />
            </div>
          ) : (
            <Send className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>

      {/* Character Counter - Compact version */}
      {message.length > 500 && (
        <div className="flex justify-end mt-2">
          <span
            className={`text-xs ${
              message.length > 1000 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {message.length}/1000
          </span>
        </div>
      )}
    </div>
  );
}

export default ChatInput;
