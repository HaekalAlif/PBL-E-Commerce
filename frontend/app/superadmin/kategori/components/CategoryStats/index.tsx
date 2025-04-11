import React from 'react';
import { Card } from '@/components/ui/card';
import { Tag, CheckCircle } from 'lucide-react';

interface CategoryStatsProps {
  stats: {
    totalCategories: number;
    activeCategories: number;
  };
}

export default function CategoryStats({ stats }: CategoryStatsProps) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Categories */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
              <Tag className="h-5 w-5 text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Total Categories</p>
              <h3 className="text-xl font-bold">{stats.totalCategories}</h3>
            </div>
          </div>
        </Card>

        {/* Active Categories */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Active Categories</p>
              <h3 className="text-xl font-bold">{stats.activeCategories}</h3>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
