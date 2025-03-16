"use client";

import {
  Pencil,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Store } from "../../types";

const ITEMS_PER_PAGE = 10;

interface StoreTableProps {
  stores: Store[];
  totalStores: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
  onRestore: (store: Store) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function StoreTable({
  stores,
  totalStores,
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
  onRestore,
  onClearFilters,
  hasActiveFilters,
}: StoreTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length > 0 ? (
            stores.map((store) => (
              <TableRow key={store.id_toko}>
                <TableCell className="font-medium">
                  {String(store.nama_toko).replace(/0+$/, "")}
                </TableCell>
                <TableCell>{store.user?.name || "No owner"}</TableCell>
                <TableCell>{store.kontak || "-"}</TableCell>
                <TableCell>
                  <div
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      store.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {store.is_active ? "Active" : "Inactive"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {store.is_deleted ? (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onRestore(store)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(store)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => onDelete(store)}
                        >
                          <Trash2
                            className="h-4 w-4 text-white"
                            strokeWidth={2}
                          />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                {hasActiveFilters ? (
                  <>
                    No stores found matching your search criteria.
                    <Button variant="link" onClick={onClearFilters}>
                      Clear filters
                    </Button>
                  </>
                ) : (
                  "No stores found."
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {stores.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalStores)} of{" "}
            {totalStores} stores
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
