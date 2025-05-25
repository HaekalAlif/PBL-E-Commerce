import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ChatRoomSkeleton() {
  return (
    <div className="h-full flex flex-col bg-white border border-orange-100 rounded-xl">
      {/* Header Skeleton */}
      <div className="flex-shrink-0 p-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-200 to-amber-200 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gradient-to-r from-orange-100 to-transparent rounded animate-pulse" />
              <div className="h-3 w-24 bg-gradient-to-r from-orange-50 to-transparent rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-orange-100 rounded animate-pulse" />
            <div className="h-3 w-16 bg-orange-50 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Messages Container Skeleton */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 p-4 space-y-4 bg-gradient-to-b from-orange-50/20 to-transparent overflow-y-auto">
          {/* Message skeletons with staggered animation */}
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className={`flex ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              } mb-4`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="max-w-[70%] space-y-2">
                {/* Message bubble skeleton */}
                <div
                  className={`
                  px-4 py-3 rounded-2xl animate-pulse
                  ${
                    index % 2 === 0
                      ? "bg-gradient-to-r from-gray-100 to-gray-50 rounded-bl-md"
                      : "bg-gradient-to-r from-orange-100 to-orange-50 rounded-br-md"
                  }
                `}
                >
                  <div className="space-y-2">
                    <div
                      className={`h-4 rounded ${
                        index % 2 === 0
                          ? "bg-gradient-to-r from-gray-200 to-gray-100"
                          : "bg-gradient-to-r from-orange-200 to-orange-100"
                      }`}
                      style={{
                        width: `${50 + Math.random() * 40}%`,
                        animationDelay: `${index * 0.2}s`,
                      }}
                    />
                    {Math.random() > 0.5 && (
                      <div
                        className={`h-4 rounded ${
                          index % 2 === 0
                            ? "bg-gradient-to-r from-gray-200 to-gray-100"
                            : "bg-gradient-to-r from-orange-200 to-orange-100"
                        }`}
                        style={{
                          width: `${30 + Math.random() * 30}%`,
                          animationDelay: `${index * 0.3}s`,
                        }}
                      />
                    )}
                  </div>
                </div>
                {/* Time skeleton */}
                <div
                  className={`flex items-center gap-2 ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className="h-3 w-12 bg-gradient-to-r from-gray-100 to-transparent rounded animate-pulse"
                    style={{
                      animationDelay: `${index * 0.4}s`,
                    }}
                  />
                  {index % 2 !== 0 && (
                    <div
                      className="h-3 w-3 bg-gradient-to-r from-gray-100 to-transparent rounded animate-pulse"
                      style={{
                        animationDelay: `${index * 0.5}s`,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area Skeleton - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-orange-100 bg-white p-4">
        <div className="flex items-end gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full animate-pulse flex-shrink-0" />
          <div className="flex-1">
            <div className="h-12 bg-gradient-to-r from-orange-50 to-orange-25 border border-orange-200 rounded-2xl animate-pulse" />
          </div>
          <div className="h-12 w-12 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full animate-pulse flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
