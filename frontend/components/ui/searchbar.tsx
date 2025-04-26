"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Searchbar: React.FC = () => {
  const [activeSearch, setActiveSearch] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleWords = [
    "apple",
    "banana",
    "cherry",
    "grape",
    "orange",
    "pineapple",
    "strawberry",
    "watermelon",
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (value.trim() === "") {
        setActiveSearch([]);
      } else {
        setActiveSearch(
          sampleWords
            .filter((w) => w.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 8)
        );
      }
      setIsLoading(false);
    }, 300);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="w-full relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          placeholder="Cari produk..."
          className={cn(
            "w-full px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm",
            "border-2 border-gray-200 text-gray-800",
            "focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
            "transition-all duration-300 ease-in-out",
            "placeholder:text-gray-400"
          )}
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
        />
        <button
          type="submit"
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2",
            "p-2 bg-amber-500 rounded-full",
            "hover:bg-amber-600 transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isFocused && activeSearch.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full mt-2 w-full",
              "bg-white rounded-2xl shadow-lg",
              "border border-gray-100",
              "backdrop-blur-lg bg-white/95",
              "z-50 overflow-hidden"
            )}
          >
            <div className="p-2">
              {activeSearch.map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-gray-700",
                    "hover:bg-amber-50 rounded-lg",
                    "transition-colors duration-150",
                    "flex items-center gap-3"
                  )}
                  onClick={() => {
                    setSearchTerm(item);
                    setIsFocused(false);
                  }}
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>{item}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Searchbar;
