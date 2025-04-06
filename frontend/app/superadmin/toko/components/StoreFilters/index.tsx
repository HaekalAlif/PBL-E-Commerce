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

interface StoreFiltersProps {
  searchTerm: string;
  statusFilter: boolean | null;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: boolean | null) => void;
  onClearFilters: () => void;
}

export default function StoreFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onClearFilters,
}: StoreFiltersProps) {
  const showClearButton = searchTerm || statusFilter !== null;

  return (
    <div className="border-b pb-4 mb-4 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Input
            placeholder="Search by store name, address or contact..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Status filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-2 items-center whitespace-nowrap"
              >
                <Filter className="h-4 w-4 flex-shrink-0" />
                <span>Status</span>
                {statusFilter !== null && (
                  <Badge
                    variant="secondary"
                    className="ml-1 truncate max-w-[80px]"
                  >
                    {statusFilter ? "Active" : "Inactive"}
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
              <DropdownMenuCheckboxItem
                checked={statusFilter === true}
                onCheckedChange={() => onStatusFilterChange(true)}
              >
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === false}
                onCheckedChange={() => onStatusFilterChange(false)}
              >
                Inactive
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

      {/* Filter badge indicators with overflow handling */}
      {showClearButton && (
        <div className="flex flex-wrap gap-2 mt-2 overflow-hidden">
          <div className="text-sm text-muted-foreground w-full">
            <span className="mr-2">Filters applied:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {searchTerm && (
                <Badge
                  variant="outline"
                  className="max-w-[200px] overflow-hidden"
                >
                  <span className="truncate">Search: {searchTerm}</span>
                </Badge>
              )}
              {statusFilter !== null && (
                <Badge
                  variant="outline"
                  className="max-w-[150px] overflow-hidden"
                >
                  <span className="truncate">
                    Status: {statusFilter ? "Active" : "Inactive"}
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
