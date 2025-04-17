"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, ChevronDown, Shield } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

interface UserInfo {
  username: string;
  email: string;
  name?: string;
  id_user?: number;
  role_name?: string;
}

const ProfileCardNav = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    email: "",
  });
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const response = await axios.get(`${apiUrl}/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        if (response.data.status === "success") {
          const userData = response.data.data;
          setUserInfo({
            id_user: userData.id_user,
            username: userData.username || "",
            name: userData.name || "",
            email: userData.email || "",
            role_name: userData.role_name || "",
          });
        } else {
          throw new Error(response.data.message || "Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );

        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
          return "";
        };

        setUserInfo({
          username: getCookie("username") || "User",
          email: getCookie("email") || "",
        });
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchUserData();
    }
  }, [mounted]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileClick = () => {
    router.push("/user");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div className="transition-all duration-200 group">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full relative justify-between p-5 rounded-lg transition-all duration-200 hover:bg-orange-100 text-orange-600 "
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-orange-500 text-white font-semibold text-sm">
                    {loading ? "..." : getInitials(userInfo.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              </div>
              <div className="flex flex-col items-start">
                <p className="font-medium text-sm truncate max-w-[120px]">
                  {loading ? "Loading..." : userInfo.username}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {loading ? "..." : userInfo.email}
                </p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-orange-500 opacity-70 group-hover:opacity-100 transition-opacity" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-64 p-2 border border-orange-300 bg-orange-50 shadow-md"
          align="end"
          side="bottom"
        >
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-orange-500 text-white font-semibold">
                {loading ? "..." : getInitials(userInfo.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="font-medium text-sm">
                {loading ? "Loading..." : userInfo.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {loading ? "..." : userInfo.email}
              </p>
            </div>
          </div>

          {userInfo.role_name && (
            <div className="mx-2 my-1.5 px-3 py-1.5 bg-orange-100 rounded-md flex items-center">
              <Shield className="h-3.5 w-3.5 text-orange-600 mr-2" />
              <span className="text-xs font-medium">{userInfo.role_name}</span>
            </div>
          )}

          <DropdownMenuSeparator className="my-1.5 bg-orange-200" />

          <div className="px-1.5">
            <DropdownMenuItem
              onClick={handleProfileClick}
              className="flex items-center cursor-pointer py-2 rounded-md hover:bg-orange-200 transition-colors"
            >
              <User className="mr-2.5 h-4 w-4 text-orange-600" />
              <span className="text-orange-700">My Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center cursor-pointer py-2 rounded-md hover:bg-orange-200 transition-colors">
              <Settings className="mr-2.5 h-4 w-4 text-orange-600" />
              <span className="text-orange-700">Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center cursor-pointer py-2 rounded-md hover:bg-orange-100 text-red-600"
            >
              <LogOut className="mr-2.5 h-4 w-4 text-orange-600" />
              <span>Logout</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileCardNav;
