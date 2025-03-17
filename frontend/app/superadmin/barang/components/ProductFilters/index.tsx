"use client";

import { useEffect, useState } from "react";
import { Search, Filter, RefreshCw, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Category, PRODUCT_STATUS } from "../../types";

interface ProductFiltersProps {
  searchTerm: string;
  categoryFilter: number | null;
  statusFilter: string | null;
  priceSort: string | null;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryFilterChange: (value: number | null) => void;
  onStatusFilterChange: (value: string | null) => void;
  onPriceSortChange: (value: string | null) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
}

export default function ProductFilters({
  searchTerm,
  categoryFilter,
  statusFilter,
  priceSort,
  categories,
  onSearchChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onPriceSortChange,
  onClearFilters,
  onRefresh,
}: ProductFiltersProps) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(debouncedSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, onSearchChange]);

  // Get category name
  const getCategoryName = (id: number | null) => {
    if (!id) return "";
    const category = categories.find((c) => c.id_kategori === id);
    return category ? category.nama_kategori : "";
  };

  // Format status for display
  const formatStatus = (status: string | null) => {
    if (!status) return "";
    return PRODUCT_STATUS[status as keyof typeof PRODUCT_STATUS] || status;
  };

  // Format price sort for display
  const formatPriceSort = (sort: string | null) => {
    if (!sort) return "";
    return sort === "highest" ? "Highest Price" : "Lowest Price";
  };

  const showClearButton =
    searchTerm !== "" ||
    categoryFilter !== null ||
    statusFilter !== null ||
    priceSort !== null;

  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search products by name, description or slug..."
            value={debouncedSearchTerm}
            onChange={(e) => setDebouncedSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Category filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Category
                {categoryFilter !== null && (
                  <Badge variant="secondary" className="ml-1">
                    {getCategoryName(categoryFilter)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-80 overflow-auto">
              <DropdownMenuCheckboxItem
                checked={categoryFilter === null}
                onCheckedChange={() => onCategoryFilterChange(null)}
              >
                All Categories
              </DropdownMenuCheckboxItem>
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id_kategori}
                  checked={categoryFilter === category.id_kategori}
                  onCheckedChange={() =>
                    onCategoryFilterChange(category.id_kategori)
                  }
                >
                  {category.nama_kategori}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Status
                {statusFilter !== null && (
                  <Badge variant="secondary" className="ml-1">
                    {formatStatus(statusFilter)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={statusFilter === null}
                onCheckedChange={() => onStatusFilterChange(null)}
              >
                All Status
              </DropdownMenuCheckboxItem>
              {Object.keys(PRODUCT_STATUS).map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter === status}
                  onCheckedChange={() => onStatusFilterChange(status)}
                >
                  {PRODUCT_STATUS[status as keyof typeof PRODUCT_STATUS]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price sorting dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-2">
                {priceSort === "highest" ? (
                  <SortDesc className="h-4 w-4" />
                ) : priceSort === "lowest" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
                Price
                {priceSort !== null && (
                  <Badge variant="secondary" className="ml-1">
                    {formatPriceSort(priceSort)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={priceSort === null}
                onCheckedChange={() => onPriceSortChange(null)}
              >
                Default Order
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priceSort === "highest"}
                onCheckedChange={() => onPriceSortChange("highest")}
              >
                Highest to Lowest
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priceSort === "lowest"}
                onCheckedChange={() => onPriceSortChange("lowest")}
              >
                Lowest to Highest
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh button */}
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>

          {/* Clear filters button */}
          {showClearButton && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter badge indicators */}
      {showClearButton && (
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="text-sm text-muted-foreground">
            Filters applied:
            {searchTerm && (
              <Badge variant="outline" className="ml-2">
                Search: {searchTerm}
              </Badge>
            )}
            {categoryFilter !== null && (
              <Badge variant="outline" className="ml-2">
                Category: {getCategoryName(categoryFilter)}
              </Badge>
            )}
            {statusFilter !== null && (
              <Badge variant="outline" className="ml-2">
                Status: {formatStatus(statusFilter)}
              </Badge>
            )}
            {priceSort !== null && (
              <Badge variant="outline" className="ml-2">
                Price: {formatPriceSort(priceSort)}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
