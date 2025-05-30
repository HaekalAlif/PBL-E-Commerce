import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import type { KomplainFilterValues } from "../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "Menunggu", label: "Menunggu" },
  { value: "Diproses", label: "Diproses" },
  { value: "Selesai", label: "Selesai" },
] as const;

interface KomplainFiltersProps {
  filters: KomplainFilterValues;
  updateFilters: (filters: Partial<KomplainFilterValues>) => void;
  resetFilters: () => void;
}

export default function KomplainFilters({
  filters,
  updateFilters,
  resetFilters,
}: KomplainFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.status || filters.date_from || filters.date_to;

  const handleStatusChange = (value: string) => {
    updateFilters({ status: value === "all" ? "" : value });
  };

  return (
    <div className="space-y-4 pb-4 border-b w-full">
      <div className="flex flex-wrap gap-3">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Cari kode pesanan atau nama pembeli..."
            value={filters.search || ""}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="max-w-xs"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status Komplain" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[180px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.date_from ? (
                filters.date_to ? (
                  <>
                    {format(new Date(filters.date_from), "dd/MM/yyyy")} -{" "}
                    {format(new Date(filters.date_to), "dd/MM/yyyy")}
                  </>
                ) : (
                  format(new Date(filters.date_from), "dd/MM/yyyy")
                )
              ) : (
                "Pilih Tanggal"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={
                filters.date_from ? new Date(filters.date_from) : new Date()
              }
              selected={{
                from: filters.date_from
                  ? new Date(filters.date_from)
                  : undefined,
                to: filters.date_to ? new Date(filters.date_to) : undefined,
              }}
              onSelect={(range) => {
                updateFilters({
                  date_from: range?.from
                    ? format(range.from, "yyyy-MM-dd")
                    : "",
                  date_to: range?.to ? format(range.to, "yyyy-MM-dd") : "",
                });
              }}
              locale={id}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-10 px-3 text-xs"
          >
            <X className="mr-2 h-4 w-4" />
            Reset Filter
          </Button>
        )}
      </div>
    </div>
  );
}
