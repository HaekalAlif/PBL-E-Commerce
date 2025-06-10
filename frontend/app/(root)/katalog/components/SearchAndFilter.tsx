import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Tag } from "lucide-react";
import { Category } from "../types";

interface SearchAndFilterProps {
  searchQuery: string;
  categories: Category[];
  selectedCategory: string | null; // Changed from number to string
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onCategoryChange: (categorySlug: string | null) => void; // Changed parameter name
}

export function SearchAndFilter({
  searchQuery,
  categories,
  selectedCategory,
  onSearchChange,
  onSearch,
  onCategoryChange,
}: SearchAndFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-0 border shadow-lg bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardContent className="px-4">
          {/* Search Input */}
          <form onSubmit={onSearch} className="mb-4">
            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Cari produk yang kamu inginkan..."
                  className="pl-12 pr-12 py-3 text-base border-2 border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 rounded-xl bg-white shadow-sm transition-all duration-300 h-12"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Cari
                </Button>
              </motion.div>
            </div>
          </form>

          {/* Category Filter Badges - More Compact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="border-t border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700">
                  Kategori:
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-gray-100">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Badge
                  variant={selectedCategory === null ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    selectedCategory === null
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg border-0"
                      : "border-2 border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50 bg-white"
                  }`}
                  onClick={() => onCategoryChange(null)}
                >
                  Semua Kategori
                </Badge>
              </motion.div>

              {categories.map((category) => (
                <motion.div
                  key={category.id_kategori}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Badge
                    variant={
                      selectedCategory === category.slug
                        ? "default"
                        : "outline"
                    }
                    className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                      selectedCategory === category.slug
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg border-0"
                        : "border-2 border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50 bg-white"
                    }`}
                    onClick={() => onCategoryChange(category.slug)}
                  >
                    {category.nama_kategori}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
