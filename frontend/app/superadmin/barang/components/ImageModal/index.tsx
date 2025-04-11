import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  title,
}: ImageModalProps) {
  const [zoom, setZoom] = React.useState(1);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  // Reset zoom when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setZoom(1);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh] p-1 overflow-hidden">
        <div className="absolute right-2 top-2 z-10 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">Zoom Out</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom In</span>
          </Button>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>
        {title && <DialogTitle className="px-6 pt-4">{title}</DialogTitle>}
        <div
          className="overflow-auto flex items-center justify-center p-2"
          style={{ height: "calc(80vh - 60px)" }}
        >
          <img
            src={imageUrl}
            alt={title || "Image preview"}
            className="object-contain transition-transform max-h-full max-w-full"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
