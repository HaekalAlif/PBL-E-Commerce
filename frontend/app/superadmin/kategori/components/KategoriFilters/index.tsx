"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KategoriFiltersProps {
  searchTerm: string;
  statusFilter: boolean | null;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: boolean | null) => void;
  onClearFilters: () => void;
}

export default function KategoriFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onClearFilters,
}: KategoriFiltersProps) {
  const showClearButton = searchTerm || statusFilter !== null;

  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Cari berdasarkan nama kategori..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex gap-2">
          {/* Status filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Status
                {statusFilter !== null && (
                  <Badge variant="secondary" className="ml-1">
                    {statusFilter ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={statusFilter === null}
                onCheckedChange={() => onStatusFilterChange(null)}
              >
                Semua Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === true}
                onCheckedChange={() => onStatusFilterChange(true)}
              >
                Aktif
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === false}
                onCheckedChange={() => onStatusFilterChange(false)}
              >
                Tidak Aktif
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear filters button */}
          {showClearButton && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Hapus Filter
            </Button>
          )}
        </div>
      </div>

      {/* Filter badge indicators */}
      <div className="flex flex-wrap gap-2 mt-2">
        {showClearButton && (
          <div className="text-sm text-muted-foreground">
            Filter yang diterapkan:
            {searchTerm && (
              <Badge variant="outline" className="ml-2">
                Pencarian: {searchTerm}
              </Badge>
            )}
            {statusFilter !== null && (
              <Badge variant="outline" className="ml-2">
                Status: {statusFilter ? "Aktif" : "Tidak Aktif"}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
