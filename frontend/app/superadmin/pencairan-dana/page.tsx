"use client";

import { useEffect, useState } from "react";
import { usePencairanManagement } from "./hooks/usePencairanManagement";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import PencairanFilters from "./components/PencairanFilters";
import PencairanTable from "./components/PencairanTable";
import PencairanStats from "./components/PencairanStats";
import PencairanDetailsDialog from "./components/PencairanDetailsDialog";
import BulkActionsBar from "./components/BulkActionsBar";

export default function PencairanDanaPage() {
  const {
    pencairans,
    loading,
    totalPages,
    totalPencairans,
    selectedPencairan,
    isDetailOpen,
    stats,
    setIsDetailOpen,
    fetchPencairans,
    fetchStats,
    getPencairanDetails,
    processPencairan,
    addComment,
    bulkProcess,
  } = usePencairanManagement();

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    date_from: "",
    date_to: "",
    amount_min: undefined,
    amount_max: undefined,
    page: 1,
    per_page: 10,
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    fetchPencairans(filters);
  }, [filters, fetchPencairans]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleProcessPencairan = async (action: string, notes: string) => {
    if (!selectedPencairan) return;

    const success = await processPencairan(
      selectedPencairan.id_pencairan,
      action,
      notes
    );

    if (success) {
      await fetchPencairans(filters);
      await fetchStats();
      setIsDetailOpen(false);
    }
  };

  const handleAddComment = async (notes: string) => {
    if (!selectedPencairan) return;

    const success = await addComment(selectedPencairan.id_pencairan, notes);

    if (success) {
      // Optionally refresh data
      await fetchPencairans(filters);
    }
  };

  const handleBulkAction = async (action: string, notes: string) => {
    const success = await bulkProcess(selectedIds, action, notes);

    if (success) {
      await fetchPencairans(filters);
      await fetchStats();
      setSelectedIds([]);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      date_from: "",
      date_to: "",
      amount_min: undefined,
      amount_max: undefined,
      page: 1,
      per_page: 10,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Withdrawal Management
            </CardTitle>
            <CardDescription>
              Monitor and process seller withdrawal requests
            </CardDescription>
          </div>
          <Button
            onClick={() => fetchPencairans(filters)}
            size="sm"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {/* Withdrawal stats component */}
          {stats && <PencairanStats stats={stats} />}

          {/* Withdrawal filters component */}
          <PencairanFilters
            filters={filters}
            updateFilters={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters }))
            }
            resetFilters={resetFilters}
          />

          {/* Withdrawals table component */}
          <PencairanTable
            pencairans={pencairans}
            loading={loading}
            totalPages={totalPages}
            totalPencairans={totalPencairans}
            filters={filters}
            updateFilters={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters }))
            }
            onViewDetails={getPencairanDetails}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </CardContent>
      </Card>

      {/* Withdrawal details dialog */}
      <PencairanDetailsDialog
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        pencairan={selectedPencairan}
        onProcessPencairan={handleProcessPencairan}
        onAddComment={handleAddComment}
      />

      {/* Bulk actions bar */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedIds([])}
      />
    </div>
  );
}
