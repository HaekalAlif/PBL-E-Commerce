import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageCircle, ThumbsUp, Calendar, User } from "lucide-react";
import { useStoreReviews } from "../hooks/useStoreReviews";
import { formatDistanceToNow, format } from "date-fns";
import { id } from "date-fns/locale";

interface StoreReviewsProps {
  storeSlug: string;
  rating: {
    average_rating: number;
    total_reviews: number;
    rating_distribution: { [key: number]: number };
  };
}

const ReviewSkeleton = () => (
  <Card className="border-0 shadow-sm bg-white">
    <CardContent className="p-6">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function StoreReviews({ storeSlug, rating }: StoreReviewsProps) {
  const [selectedRating, setSelectedRating] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  const { reviews, loading, error, totalPages } = useStoreReviews({
    slug: storeSlug,
    rating: selectedRating,
    page: currentPage,
  });

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? "text-amber-400 fill-current" : "text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingPercentage = (stars: number) => {
    if (rating.total_reviews === 0) return 0;
    return Math.round(
      (rating.rating_distribution[stars] / rating.total_reviews) * 100
    );
  };

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
            <MessageCircle className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Ulasan Pelanggan</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-amber-600 mb-2">
              {rating.average_rating > 0
                ? rating.average_rating.toFixed(1)
                : "0.0"}
            </div>
            {renderStars(rating.average_rating, "lg")}
            <p className="text-gray-500 mt-2">
              dari {rating.total_reviews} ulasan
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="lg:col-span-2 space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-16">
                  <span className="text-sm font-medium text-gray-600">
                    {stars}
                  </span>
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getRatingPercentage(stars)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">
                  {rating.rating_distribution[stars] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Filters */}
        <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-gray-100">
          <Button
            variant={selectedRating === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRating(undefined)}
            className={
              selectedRating === undefined
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }
          >
            Semua ({rating.total_reviews})
          </Button>
          {[5, 4, 3, 2, 1].map(
            (stars) =>
              rating.rating_distribution[stars] > 0 && (
                <Button
                  key={stars}
                  variant={selectedRating === stars ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRating(stars)}
                  className={
                    selectedRating === stars
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }
                >
                  {stars} ⭐ ({rating.rating_distribution[stars]})
                </Button>
              )
          )}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id_review}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100">
                      <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 font-semibold">
                        {review.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800">
                              {review.user.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs border-blue-200 text-blue-600 bg-blue-50"
                            >
                              <User className="w-3 h-3 mr-1" />
                              Pembeli
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating, "sm")}
                              <span className="text-sm font-medium text-gray-600 ml-1">
                                {review.rating}/5
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {format(
                                  new Date(review.created_at),
                                  "dd MMM yyyy, HH:mm",
                                  { locale: id }
                                )}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              (
                              {formatDistanceToNow(
                                new Date(review.created_at),
                                {
                                  addSuffix: true,
                                  locale: id,
                                }
                              )}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs border-green-200 text-green-600 bg-green-50"
                          >
                            Transaksi Selesai
                          </Badge>
                        </div>
                      </div>

                      {/* Products in review with images */}
                      <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100">
                        <p className="text-xs font-medium text-amber-700 mb-3">
                          Produk yang dibeli:
                        </p>
                        <div className="space-y-3">
                          {(
                            review.pembelian?.detailPembelian ||
                            review.pembelian?.detail_pembelian
                          )?.map((detail, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-2 bg-white rounded-lg border border-amber-100"
                            >
                              {/* Product Image */}
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                                {detail.barang?.gambarBarang?.[0]?.url_gambar ||
                                detail.barang?.gambar_barang?.[0]
                                  ?.url_gambar ? (
                                  <img
                                    src={
                                      (detail.barang.gambarBarang?.[0]?.url_gambar?.startsWith(
                                        "http"
                                      )
                                        ? detail.barang.gambarBarang[0]
                                            .url_gambar
                                        : detail.barang.gambar_barang?.[0]?.url_gambar?.startsWith(
                                            "http"
                                          )
                                        ? detail.barang.gambar_barang[0]
                                            .url_gambar
                                        : `${
                                            process.env.NEXT_PUBLIC_BACKEND_URL
                                          }/storage/${
                                            detail.barang.gambarBarang?.[0]
                                              ?.url_gambar ||
                                            detail.barang.gambar_barang?.[0]
                                              ?.url_gambar
                                          }`) || "/placeholder-product.png"
                                    }
                                    alt={detail.barang?.nama_barang || "Produk"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/placeholder-product.png";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-xs text-gray-400">
                                      No Image
                                    </span>
                                  </div>
                                )}
                              </div>
                              {/* Product Name */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-amber-700 truncate">
                                  {detail.barang?.nama_barang || "Produk"}
                                </p>
                              </div>
                            </div>
                          )) || (
                            <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                <span className="text-xs text-gray-400">
                                  No Image
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Produk tidak tersedia
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Review content */}
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-amber-400">
                        <p className="text-gray-700 leading-relaxed">
                          "{review.komentar}"
                        </p>
                      </div>

                      {/* Review image if available */}
                      {review.image_review && (
                        <div className="mt-3">
                          <img
                            src={
                              review.image_review.startsWith("http")
                                ? review.image_review
                                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${review.image_review}`
                            }
                            alt="Review"
                            className="w-32 h-32 object-cover rounded-xl border border-gray-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {selectedRating
                ? `Tidak ada ulasan ${selectedRating} bintang`
                : "Belum ada ulasan"}
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedRating
                ? "Coba pilih rating lain atau lihat semua ulasan"
                : "Toko ini belum memiliki ulasan dari pelanggan"}
            </p>
            {selectedRating && (
              <Button
                onClick={() => setSelectedRating(undefined)}
                variant="outline"
                className="border-gray-200"
              >
                Lihat Semua Ulasan
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <div className="flex gap-2 bg-white rounded-lg shadow-sm border border-gray-100 p-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                className={
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
