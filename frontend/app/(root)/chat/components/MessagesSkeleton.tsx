export function MessagesSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Loading header with pulse effect */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full border border-orange-100">
          <div className="relative">
            <div className="w-4 h-4 bg-orange-300 rounded-full animate-ping absolute"></div>
            <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
          </div>
          <span className="text-sm text-orange-600 font-medium">
            Memuat pesan...
          </span>
        </div>
      </div>

      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`flex ${
            index % 2 === 0 ? "justify-start" : "justify-end"
          } mb-4`}
          style={{
            animationDelay: `${index * 0.15}s`,
            opacity: 0,
            animation: `fadeInUp 0.6s ease-out ${index * 0.15}s forwards`,
          }}
        >
          <div className="max-w-[70%] space-y-2">
            {/* Message bubble skeleton with shimmer effect */}
            <div
              className={`
              px-4 py-3 rounded-2xl relative overflow-hidden
              ${
                index % 2 === 0
                  ? "bg-gradient-to-r from-gray-100 to-gray-50 rounded-bl-md"
                  : "bg-gradient-to-r from-orange-100 to-orange-50 rounded-br-md"
              }
            `}
            >
              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12 animate-shimmer"
                style={{
                  animation: `shimmer 2s infinite ${index * 0.3}s`,
                }}
              ></div>

              <div className="space-y-2 relative z-10">
                <div
                  className={`h-4 rounded ${
                    index % 2 === 0
                      ? "bg-gradient-to-r from-gray-200/80 to-gray-100/80"
                      : "bg-gradient-to-r from-orange-200/80 to-orange-100/80"
                  }`}
                  style={{
                    width: `${60 + Math.random() * 40}%`,
                  }}
                />
                {Math.random() > 0.6 && (
                  <div
                    className={`h-4 rounded ${
                      index % 2 === 0
                        ? "bg-gradient-to-r from-gray-200/80 to-gray-100/80"
                        : "bg-gradient-to-r from-orange-200/80 to-orange-100/80"
                    }`}
                    style={{
                      width: `${40 + Math.random() * 30}%`,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Time skeleton with fade effect */}
            <div
              className={`flex items-center gap-2 ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div className="h-3 w-12 bg-gradient-to-r from-gray-100/60 to-transparent rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      <div className="flex justify-start mb-4">
        <div className="max-w-[70%]">
          <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-100">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 ml-2">
                Sedang mengetik...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<style jsx>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%) skewX(-12deg);
    }
    100% {
      transform: translateX(300%) skewX(-12deg);
    }
  }
`}</style>;
