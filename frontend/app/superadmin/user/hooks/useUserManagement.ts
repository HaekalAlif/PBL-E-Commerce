"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getCsrfToken, getCsrfTokenFromCookie } from "@/lib/axios";
import { User, UserFormData } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        // Filter out superadmin users and sort by newest first
        let filteredData = response.data.data
          .filter((user: User) => user.role !== 0)
          .sort((a: User, b: User) => b.id_user - a.id_user);

        setUsers(filteredData);
      } else {
        toast.error(response.data.message || "Failed to fetch users");
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new user
  const createUser = useCallback(
    async (formData: UserFormData) => {
      try {
        await getCsrfToken();

        // Ensure we can't create superadmin users
        if (formData.role === 0) {
          toast.error("Creating superadmin users is not allowed");
          return false;
        }

        const response = await axios.post(`${API_URL}/users`, formData, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        if (response.data.status === "success") {
          toast.success("User created successfully!");
          await fetchUsers();
          return true;
        } else {
          toast.error(response.data.message || "Failed to create user");
          return false;
        }
      } catch (error: any) {
        console.error("Error creating user:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to create user. Please try again."
        );
        return false;
      }
    },
    [fetchUsers]
  );

  // Update an existing user
  const updateUser = useCallback(
    async (userId: number, formData: UserFormData) => {
      try {
        // Get CSRF token from cookies
        const csrfToken = getCsrfTokenFromCookie();

        if (!csrfToken) {
          await getCsrfToken();
        }

        // Remove password if it's empty
        const dataToSend = { ...formData };
        if (!dataToSend.password) delete dataToSend.password;

        const response = await axios.put(
          `${API_URL}/users/${userId}`,
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-XSRF-TOKEN": getCsrfTokenFromCookie() || "",
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          toast.success("User updated successfully!");
          await fetchUsers();
          return true;
        } else {
          toast.error(response.data.message || "Failed to update user");
          return false;
        }
      } catch (error: any) {
        console.error("Error updating user:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to update user. Please try again."
        );
        return false;
      }
    },
    [fetchUsers]
  );

  // Delete a user
  const deleteUser = useCallback(
    async (userId: number) => {
      try {
        // Get CSRF token from cookies
        const csrfToken = getCsrfTokenFromCookie();

        if (!csrfToken) {
          await getCsrfToken();
        }

        const response = await axios.delete(`${API_URL}/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": getCsrfTokenFromCookie() || "",
          },
          withCredentials: true,
        });

        if (response.data.status === "success") {
          toast.success("User deleted successfully!");
          await fetchUsers();
          return true;
        } else {
          toast.error(response.data.message || "Failed to delete user");
          return false;
        }
      } catch (error: any) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.");
        return false;
      }
    },
    [fetchUsers]
  );

  return {
    users,
    loading,
    selectedUser,
    setSelectedUser,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
