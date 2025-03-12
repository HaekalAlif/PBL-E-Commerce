"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, UserFormData } from "../../types";

interface UserFormDialogProps {
  isOpen: boolean;
  isCreateMode: boolean;
  user?: User | null;
  onClose: () => void;
  onSubmit: (formData: UserFormData) => void;
}

export default function UserFormDialog({
  isOpen,
  isCreateMode,
  user,
  onClose,
  onSubmit,
}: UserFormDialogProps) {
  const [formData, setFormData] = useState<UserFormData>({
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    no_hp: user?.no_hp || "",
    tanggal_lahir: user?.tanggal_lahir || "",
    role: user?.role || 2, // Default to regular user
    is_verified: user?.is_verified ?? true,
    is_active: user?.is_active ?? true,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Reset form when user or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: user?.username || "",
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        no_hp: user?.no_hp || "",
        tanggal_lahir: user?.tanggal_lahir || "",
        role: user?.role || 2,
        is_verified: user?.is_verified ?? true,
        is_active: user?.is_active ?? true,
      });
      // Also reset password visibility when form opens
      setShowPassword(false);
    }
  }, [isOpen, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isCreateMode ? "Create New User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {isCreateMode
              ? "Add a new user to the system"
              : "Update user information"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">
              {isCreateMode
                ? "Password"
                : "New Password (leave blank to keep current)"}
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password || ""}
                onChange={handleInputChange}
                placeholder={isCreateMode ? "Password" : "New password"}
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="no_hp">Phone Number</Label>
              <Input
                id="no_hp"
                name="no_hp"
                value={formData.no_hp || ""}
                onChange={handleInputChange}
                placeholder="Phone Number"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tanggal_lahir">Date of Birth</Label>
              <Input
                id="tanggal_lahir"
                name="tanggal_lahir"
                type="date"
                value={formData.tanggal_lahir || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              name="role"
              value={formData.role.toString()}
              onValueChange={(value) => handleSelectChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">User</SelectItem>
                <SelectItem value="1">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("is_active", checked)
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="is_verified">Verified</Label>
              <Switch
                id="is_verified"
                checked={formData.is_verified}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("is_verified", checked)
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isCreateMode ? "Create User" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
