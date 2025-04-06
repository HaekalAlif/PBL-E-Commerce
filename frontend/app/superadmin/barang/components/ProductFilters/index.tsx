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
    <div className="border-b pb-4 mb-4 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Input
            placeholder="Search products by name, description or slug..."
            value={debouncedSearchTerm}
            onChange={(e) => setDebouncedSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Category filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-2 items-center max-w-[200px] overflow-hidden"
              >
                <Filter className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Category</span>
                {categoryFilter !== null && (
                  <Badge
                    variant="secondary"
                    className="ml-1 max-w-[100px] truncate"
                  >
                    <span className="truncate">
                      {getCategoryName(categoryFilter)}
                    </span>
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
              <Button
                variant="outline"
                size="sm"
                className="flex gap-2 items-center max-w-[200px] overflow-hidden"
              >
                <Filter className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Status</span>
                {statusFilter !== null && (
                  <Badge
                    variant="secondary"
                    className="ml-1 max-w-[100px] truncate"
                  >
                    <span className="truncate">
                      {formatStatus(statusFilter)}
                    </span>
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

          {/* Clear filters button */}
          {showClearButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter badge indicators */}
      {showClearButton && (
        <div className="flex flex-wrap gap-2 mt-2 overflow-hidden">
          <div className="text-sm text-muted-foreground w-full">
            <span className="mr-2">Filters applied:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {searchTerm && (
                <Badge
                  variant="outline"
                  className="max-w-[150px] overflow-hidden"
                >
                  <span className="truncate">Search: {searchTerm}</span>
                </Badge>
              )}
              {categoryFilter !== null && (
                <Badge
                  variant="outline"
                  className="max-w-[150px] overflow-hidden"
                >
                  <span className="truncate">
                    Category: {getCategoryName(categoryFilter)}
                  </span>
                </Badge>
              )}
              {statusFilter !== null && (
                <Badge
                  variant="outline"
                  className="max-w-[150px] overflow-hidden"
                >
                  <span className="truncate">
                    Status: {formatStatus(statusFilter)}
                  </span>
                </Badge>
              )}
              {priceSort !== null && (
                <Badge
                  variant="outline"
                  className="max-w-[150px] overflow-hidden"
                >
                  <span className="truncate">
                    Price: {formatPriceSort(priceSort)}
                  </span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
