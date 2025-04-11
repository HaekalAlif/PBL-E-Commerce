import { useState } from "react";
import { Search, CalendarIcon, Filter, DollarSign } from "lucide-react";
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
import type { PaymentFilters as PaymentFiltersType } from "../../types";
import { PAYMENT_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "../../types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Slider
} from "@/components/ui/slider";

interface PaymentFiltersProps {
  filters: PaymentFiltersType;
  updateFilters: (filters: Partial<PaymentFiltersType>) => void;
  resetFilters: () => void;
}

export default function PaymentFilters({
  filters,
  updateFilters,
  resetFilters,
}: PaymentFiltersProps) {
  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.payment_method ||
    filters.date_from ||
    filters.date_to ||
    filters.min_amount ||
    filters.max_amount;

  const [isAmountFilterOpen, setIsAmountFilterOpen] = useState(false);
  
  return (
    <div className="space-y-4 pb-4 border-b w-full">
      {/* Main filter controls - ensure full width and consistent padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full px-0">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoice ID or customer..."
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
                  Payment Status
                </div>
                {filters.status && (
                  <Badge variant="secondary" className="ml-2">
                    {PAYMENT_STATUS_LABELS[filters.status]}
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
              {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
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

        {/* Payment method filter */}
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
                  Payment Method
                </div>
                {filters.payment_method && (
                  <Badge variant="secondary" className="ml-2">
                    {PAYMENT_METHOD_LABELS[filters.payment_method] || filters.payment_method}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                checked={!filters.payment_method}
                onCheckedChange={() => updateFilters({ payment_method: "" })}
              >
                All Methods
              </DropdownMenuCheckboxItem>
              {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={filters.payment_method === value}
                  onCheckedChange={() => updateFilters({ payment_method: value })}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Amount Filter - Now more compact */}
        <Popover open={isAmountFilterOpen} onOpenChange={setIsAmountFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex justify-between"
            >
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Amount Range
              </div>
              {(filters.min_amount || filters.max_amount) && (
                <Badge variant="secondary" className="ml-2">
                  {filters.min_amount && filters.max_amount 
                    ? `${filters.min_amount} - ${filters.max_amount}` 
                    : filters.min_amount 
                      ? `Min: ${filters.min_amount}` 
                      : `Max: ${filters.max_amount}`}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Payment Amount Range</h4>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1.5 block">Min Amount</label>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.min_amount || ""}
                    onChange={(e) => updateFilters({ min_amount: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1.5 block">Max Amount</label>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.max_amount || ""}
                    onChange={(e) => updateFilters({ max_amount: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
              </div>
              <Button 
                variant="default" 
                className="w-full" 
                onClick={() => setIsAmountFilterOpen(false)}
              >
                Apply Filter
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Date Range Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <h4 className="text-sm font-medium mr-2 min-w-[80px]">Date Range:</h4>
        <div className="flex items-center gap-2 flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[140px] justify-start text-left font-normal"
                style={{ minWidth: filters.date_from ? "auto" : "140px" }}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {filters.date_from
                    ? format(new Date(filters.date_from), "d MMM yyyy")
                    : "Start Date"}
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
                className="w-full sm:w-[140px] justify-start text-left font-normal"
                style={{ minWidth: filters.date_to ? "auto" : "140px" }}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {filters.date_to
                    ? format(new Date(filters.date_to), "d MMM yyyy")
                    : "End Date"}
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
                  Status: {PAYMENT_STATUS_LABELS[filters.status]}
                </Badge>
              )}
              {filters.payment_method && (
                <Badge
                  variant="outline"
                  className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  Method: {PAYMENT_METHOD_LABELS[filters.payment_method] || filters.payment_method}
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
              {(filters.min_amount || filters.max_amount) && (
                <Badge
                  variant="outline"
                  className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <span className="truncate">
                    Amount: {filters.min_amount || 0} - {filters.max_amount || '∞'}
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
