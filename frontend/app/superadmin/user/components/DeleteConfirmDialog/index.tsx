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
import { User } from "../../types";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  user,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-lg shadow-lg border border-gray-200">
        <AlertDialogHeader className="bg-orange-100 p-4 rounded-t-lg">
          <AlertDialogTitle className="text-lg font-semibold text-orange-600">
            Confirm Deletion
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="p-4 text-sm text-gray-700">
          Are you sure you want to delete user{" "}
          <span className="font-bold text-gray-900">"{user?.username}"</span>?
          This action cannot be undone.
        </AlertDialogDescription>
        <AlertDialogFooter className="p-4 flex justify-end space-x-2">
          <AlertDialogCancel className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}