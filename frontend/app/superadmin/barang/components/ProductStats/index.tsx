import React from "react";
import { Card } from "@/components/ui/card";
import { Package, CheckCircle, Archive, Tag } from "lucide-react";
import { formatRupiah } from "@/lib/formatter";

interface ProductStatsProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    deletedProducts: number;
    totalCategories: number;
    averagePrice?: number;
  };
}

export default function ProductStats({ stats }: ProductStatsProps) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Products */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Total Products</p>
              <h3 className="text-xl font-bold">{stats.totalProducts}</h3>
            </div>
          </div>
        </Card>

        {/* Active Products */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Active Products</p>
              <h3 className="text-xl font-bold">{stats.activeProducts}</h3>
            </div>
          </div>
        </Card>

        {/* Deleted Products */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-red-100 rounded-full w-10 h-10 flex items-center justify-center">
              <Archive className="h-5 w-5 text-red-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Deleted Products</p>
              <h3 className="text-xl font-bold">{stats.deletedProducts}</h3>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
