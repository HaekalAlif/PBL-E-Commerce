"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product } from "../../types";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  product: Product | null;
  isHardDelete: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  product,
  isHardDelete,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!product) return null;

  const isRestoring = product.is_deleted && !isHardDelete;

  const title = isRestoring
    ? "Confirm Restoration"
    : isHardDelete
    ? "Confirm Permanent Deletion"
    : "Confirm Deletion";

  const description = isRestoring
    ? `Are you sure you want to restore product "${product.nama_barang}"?`
    : isHardDelete
    ? `Are you sure you want to permanently delete product "${product.nama_barang}"? This action cannot be undone.`
    : `Are you sure you want to delete product "${product.nama_barang}"? You can restore it later.`;

  const confirmButtonText = isRestoring
    ? "Restore"
    : isHardDelete
    ? "Delete Permanently"
    : "Delete";

  const confirmButtonClass = isRestoring
    ? "bg-green-600 hover:bg-green-700"
    : "bg-red-600 hover:bg-red-700";

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={confirmButtonClass}>
            {confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
