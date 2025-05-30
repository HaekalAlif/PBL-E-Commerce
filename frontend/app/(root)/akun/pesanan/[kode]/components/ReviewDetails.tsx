import { Clock, Star } from "lucide-react";
import { formatDate } from "@/lib/formatter";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewDetailsProps {
  review: {
    rating: number;
    komentar: string;
    image_review?: string;
    created_at: string;
  };
}

export function ReviewDetails({ review }: ReviewDetailsProps) {
  return (
    <Card className="border-orange-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-orange-50 border border-orange-100">
            <Star className="h-4 w-4 text-[#F79E0E]" />
          </div>
          <span className="font-medium">Review Anda</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "text-[#F79E0E] fill-[#F79E0E]"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-[#F79E0E] font-medium">
              {review.rating}/5
            </span>
          </div>

          <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-orange-100">
            {review.komentar}
          </div>

          {review.image_review && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-orange-100">
              <Image
                src={review.image_review}
                alt="Review image"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{formatDate(review.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
