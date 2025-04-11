import React from "react";
import { Card } from "@/components/ui/card";
import { ShoppingBag, CheckCircle, Clock, XCircle } from "lucide-react";

interface StoreStatsProps {
  stats: {
    totalStores: number;
    activeStores: number;
    pendingStores: number;
    deletedStores: number;
  };
}

export default function StoreStats({ stats }: StoreStatsProps) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stores */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Total Stores</p>
              <h3 className="text-xl font-bold">{stats.totalStores}</h3>
            </div>
          </div>
        </Card>

        {/* Active Stores */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Active Stores</p>
              <h3 className="text-xl font-bold">{stats.activeStores}</h3>
            </div>
          </div>
        </Card>

        {/* Pending Stores */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Pending Stores</p>
              <h3 className="text-xl font-bold">{stats.pendingStores}</h3>
            </div>
          </div>
        </Card>

        {/* Deleted Stores */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-red-100 rounded-full w-10 h-10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Deleted Stores</p>
              <h3 className="text-xl font-bold">{stats.deletedStores}</h3>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
