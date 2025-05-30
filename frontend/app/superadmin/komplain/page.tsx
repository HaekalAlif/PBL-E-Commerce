"use client";

import { useEffect, useState } from "react";
import { useKomplainManagement } from "./hooks/useKomplainManagement";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import KomplainFilters from "./components/KomplainFilters";
import KomplainTable from "./components/KomplainTable";
import KomplainStats from "./components/KomplainStats";
import KomplainDetailsDialog from "./components/KomplainDetailsDialog";

export default function KomplainManagementPage() {
  const {
    komplains,
    loading,
    totalPages,
    totalKomplains,
    selectedKomplain,
    isDetailOpen,
    stats,
    setIsDetailOpen,
    fetchKomplains,
    fetchStats,
    getKomplainDetails,
    processKomplain,
  } = useKomplainManagement();

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    date_from: "",
    date_to: "",
    page: 1,
    per_page: 10,
  });

  useEffect(() => {
    fetchKomplains(filters);
  }, [filters, fetchKomplains]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleProcessKomplain = async (status: string, notes: string) => {
    if (!selectedKomplain) return;

    const success = await processKomplain(
      selectedKomplain.id_komplain,
      status,
      notes // Add the notes parameter here
    );

    if (success) {
      // Refresh data after successful processing
      await fetchKomplains(filters);
      await fetchStats();
      setIsDetailOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Complaint Management
            </CardTitle>
            <CardDescription>
              Monitor and process customer complaints
            </CardDescription>
          </div>
          <Button
            onClick={() => fetchKomplains(filters)}
            size="sm"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {/* Complaint stats component */}
          {stats && <KomplainStats stats={stats} />}

          {/* Complaint filters component */}
          <KomplainFilters
            filters={filters}
            updateFilters={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters }))
            }
            resetFilters={() =>
              setFilters({
                search: "",
                status: "",
                date_from: "",
                date_to: "",
                page: 1,
                per_page: 10,
              })
            }
          />

          {/* Complaints table component */}
          <KomplainTable
            komplains={komplains}
            loading={loading}
            totalPages={totalPages}
            totalKomplains={totalKomplains}
            filters={filters}
            updateFilters={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters }))
            }
            onViewDetails={getKomplainDetails}
          />
        </CardContent>
      </Card>

      {/* Complaint details dialog */}
      <KomplainDetailsDialog
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        komplain={selectedKomplain}
        onProcessKomplain={handleProcessKomplain}
      />
    </div>
  );
}
