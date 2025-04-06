import { useState } from "react";
import { Search, CalendarIcon, Filter } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { OrderFilters as OrderFiltersType } from "../../types";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "../../types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderFiltersProps {
  filters: OrderFiltersType;
  updateFilters: (filters: Partial<OrderFiltersType>) => void;
  resetFilters: () => void;
}

export default function OrderFilters({
  filters,
  updateFilters,
  resetFilters,
}: OrderFiltersProps) {
  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.payment_status ||
    filters.date_from ||
    filters.date_to;

  return (
    <div className="space-y-4 pb-4 border-b w-full">
      {/* Main filter controls - ensure full width and consistent padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full px-0">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search order ID or customer..."
            className="pl-8 w-full"
            value={filters.search || ""}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {/* Status filter */}
        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex justify-between"
              >
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Order Status
                </div>
                {filters.status && (
                  <Badge variant="secondary" className="ml-2">
                    {ORDER_STATUS_LABELS[filters.status]}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                checked={!filters.status}
                onCheckedChange={() => updateFilters({ status: "" })}
              >
                All Statuses
              </DropdownMenuCheckboxItem>
              {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={filters.status === value}
                  onCheckedChange={() => updateFilters({ status: value })}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Payment status filter */}
        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex justify-between"
              >
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Payment Status
                </div>
                {filters.payment_status && (
                  <Badge variant="secondary" className="ml-2">
                    {PAYMENT_STATUS_LABELS[filters.payment_status]}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                checked={!filters.payment_status}
                onCheckedChange={() => updateFilters({ payment_status: "" })}
              >
                All Payment Statuses
              </DropdownMenuCheckboxItem>
              {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={filters.payment_status === value}
                  onCheckedChange={() =>
                    updateFilters({ payment_status: value })
                  }
                >
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Date filter - Now more compact */}
        <div className="w-full">
          <div className="flex flex-col sm:flex-row items-center w-full gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[45%] justify-start text-left font-normal truncate"
                  style={{ minWidth: filters.date_from ? "auto" : "80px" }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {filters.date_from
                      ? format(new Date(filters.date_from), "d MMM")
                      : "Start"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    filters.date_from ? new Date(filters.date_from) : undefined
                  }
                  onSelect={(date) =>
                    updateFilters({
                      date_from: date ? format(date, "yyyy-MM-dd") : "",
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="hidden sm:block text-sm">—</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[45%] justify-start text-left font-normal truncate"
                  style={{ minWidth: filters.date_to ? "auto" : "80px" }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {filters.date_to
                      ? format(new Date(filters.date_to), "d MMM")
                      : "End"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    filters.date_to ? new Date(filters.date_to) : undefined
                  }
                  onSelect={(date) =>
                    updateFilters({
                      date_to: date ? format(date, "yyyy-MM-dd") : "",
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Filter badge indicators - Also make date formats shorter */}
      {hasActiveFilters && (
        <div className="flex flex-row items-center justify-between w-full mt-2 px-0">
          <div className="text-sm text-muted-foreground flex-1 overflow-hidden">
            <span className="mr-2">Filters applied:</span>
            <div className="flex flex-wrap gap-2 mt-1 overflow-hidden">
              {filters.search && (
                <Badge
                  variant="outline"
                  className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  Search: {filters.search}
                </Badge>
              )}
              {filters.status && (
                <Badge
                  variant="outline"
                  className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  Status: {ORDER_STATUS_LABELS[filters.status]}
                </Badge>
              )}
              {filters.payment_status && (
                <Badge
                  variant="outline"
                  className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  Payment: {PAYMENT_STATUS_LABELS[filters.payment_status]}
                </Badge>
              )}
              {filters.date_from && (
                <Badge
                  variant="outline"
                  className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <span className="truncate">
                    From: {format(new Date(filters.date_from), "d MMM")}
                  </span>
                </Badge>
              )}
              {filters.date_to && (
                <Badge
                  variant="outline"
                  className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <span className="truncate">
                    To: {format(new Date(filters.date_to), "d MMM")}
                  </span>
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="flex-shrink-0 ml-2"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
