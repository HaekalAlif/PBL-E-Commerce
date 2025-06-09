import React from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { UserGrowthData } from "../types";
import { Users, Store } from "lucide-react";

interface UserGrowthChartProps {
  data: UserGrowthData[];
  loading?: boolean;
}

export default function UserGrowthChart({
  data,
  loading,
}: UserGrowthChartProps) {
  if (loading) {
    return (
      <Card className="p-6 h-full">
        <div className="animate-pulse h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  // Ensure data is properly converted to numbers
  const processedData = data.map((item) => ({
    ...item,
    total_users: Number(item.total_users) || 0,
    regular_users: Number(item.regular_users) || 0,
    seller_users: Number(item.seller_users) || 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium">{data.formatted_date}</p>
          <div className="space-y-1 mt-2">
            <p className="text-blue-600">
              Total Users: {Number(data.total_users)}
            </p>
            <p className="text-green-600">
              Regular Users: {Number(data.regular_users)}
            </p>
            <p className="text-purple-600">
              Users with Store: {Number(data.seller_users)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalUsers = processedData.reduce(
    (sum, item) => sum + item.total_users,
    0
  );
  const totalSellers = processedData.reduce(
    (sum, item) => sum + item.seller_users,
    0
  );
  const avgGrowth =
    processedData.length > 1
      ? (
          (processedData[processedData.length - 1]?.total_users -
            processedData[0]?.total_users) /
          processedData.length
        ).toFixed(1)
      : 0;

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">User Growth</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Avg Monthly Growth</p>
          <p className="text-xl font-bold text-blue-600">+{avgGrowth}</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Total Users
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{totalUsers}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Store className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">
              With Store
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-700">{totalSellers}</p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="formatted_date"
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis stroke="#6b7280" fontSize={12} tick={{ fill: "#6b7280" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="regular_users"
              fill="#3b82f6"
              name="Regular Users"
              radius={[0, 0, 4, 4]}
              stackId="users"
            />
            <Bar
              dataKey="seller_users"
              fill="#8b5cf6"
              name="Users with Store"
              radius={[4, 4, 0, 0]}
              stackId="users"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Store Creation Rate:</span>
          <span className="font-medium">
            {totalUsers > 0
              ? ((totalSellers / totalUsers) * 100).toFixed(1)
              : 0}
            %
          </span>
        </div>
      </div>
    </Card>
  );
}
