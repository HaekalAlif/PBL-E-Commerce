export function ChatRoomListSkeleton() {
  return (
    <div className="h-full bg-white border-r border-orange-100 flex flex-col lg:w-80 w-full">
      {/* Header Skeleton */}
      <div className="flex-shrink-0 p-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-200/60 to-amber-200/60 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-20 bg-gradient-to-r from-orange-200/70 to-orange-300/70 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gradient-to-r from-orange-100/60 to-orange-200/60 rounded animate-pulse" />
          </div>
        </div>

        {/* Search Skeleton */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-orange-200/50 rounded animate-pulse" />
          <div className="w-full h-10 bg-gradient-to-r from-orange-50/80 to-orange-100/50 border border-orange-200/40 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Chat Room List Skeleton */}
      <div className="flex-1 overflow-hidden">
        <div className="p-2">
          {/* Loading indicator */}
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full border border-orange-100">
              <div className="relative">
                <div className="w-3 h-3 bg-orange-300 rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              </div>
              <span className="text-xs text-orange-600 font-medium">
                Memuat percakapan...
              </span>
            </div>
          </div>

          {/* Room Item Skeletons */}
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="p-3 border-b border-orange-50 animate-pulse"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar Skeleton */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-200/70 to-amber-200/70 rounded-full" />

                  {/* Random unread badge skeleton for variety */}
                  {Math.random() > 0.7 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-300 to-red-400 rounded-full animate-pulse" />
                  )}
                </div>

                {/* Content Skeleton */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    {/* Name Skeleton */}
                    <div
                      className="h-4 bg-gradient-to-r from-orange-200/80 to-orange-300/80 rounded"
                      style={{
                        width: `${70 + Math.random() * 50}px`,
                        animationDelay: `${index * 0.15}s`,
                      }}
                    />

                    {/* Time Skeleton */}
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-100/60 rounded animate-pulse" />
                      <div
                        className="h-3 bg-gradient-to-r from-orange-100/70 to-orange-200/70 rounded"
                        style={{
                          width: `${30 + Math.random() * 20}px`,
                          animationDelay: `${index * 0.2}s`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Product Info Skeleton - Random appearance */}
                  {Math.random() > 0.4 && (
                    <div
                      className="h-3 bg-gradient-to-r from-amber-100/60 to-amber-200/60 rounded mb-2"
                      style={{
                        width: `${80 + Math.random() * 60}px`,
                        animationDelay: `${index * 0.25}s`,
                      }}
                    />
                  )}

                  {/* Message Skeleton */}
                  <div className="space-y-1">
                    <div
                      className="h-4 bg-gradient-to-r from-gray-200/70 to-gray-300/70 rounded"
                      style={{
                        width: `${60 + Math.random() * 40}%`,
                        animationDelay: `${index * 0.3}s`,
                      }}
                    />

                    {/* Second line for longer messages - Random appearance */}
                    {Math.random() > 0.6 && (
                      <div
                        className="h-4 bg-gradient-to-r from-gray-100/60 to-gray-200/60 rounded"
                        style={{
                          width: `${30 + Math.random() * 30}%`,
                          animationDelay: `${index * 0.35}s`,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex-shrink-0 p-4 border-t border-orange-100 bg-orange-25">
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-orange-200/60 rounded animate-pulse" />
          <div className="h-3 w-48 bg-gradient-to-r from-orange-100/60 to-orange-200/60 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
