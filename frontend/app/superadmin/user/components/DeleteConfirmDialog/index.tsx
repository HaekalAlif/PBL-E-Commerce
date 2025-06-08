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
import { User as UserIcon } from "lucide-react";

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
      <AlertDialogContent className="rounded-2xl p-0 overflow-hidden">
        <AlertDialogHeader className="bg-orange-50 px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-orange-400 rounded-full w-10 h-10 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-gray-900">
              Konfirmasi Hapus User
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="px-6 pt-2 pb-4 text-gray-700">
          Apakah Anda yakin ingin menghapus user{" "}
          <span className="font-semibold text-orange-600">
            "{user?.username}"
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </AlertDialogDescription>
        <AlertDialogFooter className="bg-gray-50 px-6 py-4 flex justify-end gap-2 rounded-b-2xl">
          <AlertDialogCancel className="rounded-md px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-md px-4 py-2 bg-red-600 text-white hover:bg-red-700 font-semibold"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}