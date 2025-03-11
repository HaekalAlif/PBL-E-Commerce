"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";

const AdminPage = () => {
  const [userData, setUserData] = useState({
    role: "",
    roleName: "",
  });

  useEffect(() => {
    // Get user role data from cookies for display purposes
    const userRole = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_role="))
      ?.split("=")[1];

    const roleName = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role_name="))
      ?.split("=")[1];

    setUserData({
      role: userRole || "",
      roleName: roleName || "",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Admin Dashboard
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Welcome to your admin dashboard
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    User Role
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userData.roleName || "Not available"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="px-4 py-5 sm:px-6 flex justify-end">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
