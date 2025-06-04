import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, User, Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Review } from "../types";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ReviewDetailsProps {
  review: Review;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "text-[#F79E0E] fill-[#F79E0E]" : "text-gray-200"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-[#F79E0E]">
        {rating}/5
      </span>
    </div>
  );
};

export function ReviewDetails({ review }: ReviewDetailsProps) {
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Get user name with fallback
  const userName = review.user?.name || "Pengguna";

  return (
    <Card className="border-orange-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-orange-50 border border-orange-100">
            <Star className="h-4 w-4 text-[#F79E0E]" />
          </div>
          <span className="font-medium">Review Pembeli</span>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Sudah Direview
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Reviewer Info */}
          <div className="flex items-center gap-3 pb-3 border-b border-orange-100">
            <div className="p-2 rounded-lg bg-gray-100">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{userName}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatDate(review.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} />
          </div>

          {/* Review Comment */}
          <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-orange-100">
            {review.komentar}
          </div>

          {/* Review Image */}
          {review.image_review && (
            <div className="relative">
              <div
                className="relative aspect-video w-full rounded-lg overflow-hidden border border-orange-100 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsImageOpen(true)}
              >
                <Image
                  src={review.image_review}
                  alt="Review image"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Klik untuk memperbesar
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Image Preview Dialog */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogTitle className="sr-only">Preview Foto Review</DialogTitle>
          <div className="relative w-full h-[80vh]">
            {review.image_review && (
              <Image
                src={review.image_review}
                alt="Review Image Preview"
                fill
                className="object-contain"
                style={{ objectFit: "contain" }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
