import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Shield, CheckCircle, Store } from "lucide-react";

interface UserStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    adminCount: number;
    sellerCount: number;
  };
}

export default function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Users */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h3 className="text-xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
        </Card>

        {/* Active Users */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <h3 className="text-xl font-bold">{stats.activeUsers}</h3>
            </div>
          </div>
        </Card>

        {/* Admin Users */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Admin</p>
              <h3 className="text-xl font-bold">{stats.adminCount}</h3>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
