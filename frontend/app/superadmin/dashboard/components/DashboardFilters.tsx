import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardFilters as DashboardFiltersType } from "../types";
import { CalendarIcon, Filter, RefreshCw } from "lucide-react";

interface DashboardFiltersProps {
  filters: DashboardFiltersType;
  onFiltersChange: (filters: DashboardFiltersType) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export default function DashboardFilters({
  filters,
  onFiltersChange,
  onRefresh,
  loading,
}: DashboardFiltersProps) {
  const handlePeriodChange = (period: string) => {
    onFiltersChange({
      ...filters,
      period: period as DashboardFiltersType["period"],
    });
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "7":
        return "Last 7 Days";
      case "30":
        return "Last 30 Days";
      case "90":
        return "Last 90 Days";
      case "365":
        return "Last Year";
      default:
        return "Last 30 Days";
    }
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Dashboard Filters:</span>
        </div>

        <div className="flex flex-1 items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <Select value={filters.period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Badge variant="outline" className="ml-2">
            {getPeriodLabel(filters.period)}
          </Badge>
        </div>

        <Button
          onClick={onRefresh}
          disabled={loading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    </Card>
  );
}
