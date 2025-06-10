"use client";

import { motion } from "framer-motion";
import { useCatalog } from "./hooks/useCatalog";
import { useBuyNow } from "./hooks/useBuyNow";
import { SearchAndFilter } from "./components/SearchAndFilter";
import { FilterSidebar } from "./components/FilterSidebar";
import { ProductGrid } from "./components/ProductGrid";
import { Pagination } from "./components/Pagination";
import { Package, Sparkles } from "lucide-react";

export default function KatalogPage() {
  const {
    products,
    categories,
    provinces,
    regencies,
    loading,
    searchQuery,
    filters,
    currentPage,
    totalPages,
    setSearchQuery,
    handleSearch,
    updateFilter,
    clearFilters,
    setCurrentPage,
  } = useCatalog();

  const { processingBuyNow, handleBuyNow } = useBuyNow();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/20 via-white to-orange-50/20">
      {/* Enhanced Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-200/10 to-orange-200/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-tr from-yellow-200/10 to-amber-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-br from-orange-100/10 to-amber-100/10 rounded-full blur-2xl animate-pulse delay-500" />

        {/* Floating decorative elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 opacity-5"
        >
          <Package className="w-24 h-24 text-amber-400" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-32 right-32 opacity-5"
        >
          <Sparkles className="w-20 h-20 text-orange-400" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-6 relative">
        {/* Main Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Filter Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <FilterSidebar
                categories={categories}
                provinces={provinces}
                regencies={regencies}
                filters={filters}
                onFilterChange={updateFilter}
                onClearFilters={clearFilters}
              />
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Search Bar with Category Filter */}
              <SearchAndFilter
                searchQuery={searchQuery}
                categories={categories}
                selectedCategory={filters.category}
                onSearchChange={setSearchQuery}
                onSearch={handleSearch}
                onCategoryChange={(categorySlug) =>
                  updateFilter("category", categorySlug)
                }
              />

              {/* Products Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-amber-50/40 rounded-2xl blur-xl" />
                <div className="relative bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-amber-100/30">
                  <ProductGrid
                    products={products}
                    loading={loading}
                    processingBuyNow={processingBuyNow}
                    onBuyNow={handleBuyNow}
                  />
                </div>
              </motion.div>

              {/* Pagination */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
