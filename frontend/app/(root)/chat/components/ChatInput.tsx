import { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

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
        // Show error feedback
        const errorMessage =
          error instanceof Error ? error.message : "Gagal mengirim pesan";
        // You could add a toast notification here
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

  return (
    <div className="p-4 bg-white">
      <div className="flex items-end gap-3">
        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-gray-400 hover:text-[#F79E0E] hover:bg-orange-50 rounded-full flex-shrink-0"
          disabled={disabled || isSending}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Input Container */}
        <div className="flex-1 relative">
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
