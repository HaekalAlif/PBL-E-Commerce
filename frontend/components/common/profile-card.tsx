"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
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

const ProfileCard = () => {
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
        // Get API URL from environment variables
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const response = await axios.get(`${apiUrl}/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true, // Important for sending cookies with request
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

        // Fallback to using cookies if API fails
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

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleProfileClick = () => {
    router.push("#");
  };

  if (!mounted) return null;

  return (
    <div className="p-2.5 border-b">
      <div className="rounded-lg">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full px-2 hover:bg-accent">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {loading ? "..." : getInitials(userInfo.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm truncate max-w-[150px]">
                    {loading ? "Loading..." : userInfo.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {loading ? "..." : userInfo.email}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="right">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            {userInfo.role_name && (
              <div className="px-2 py-1 text-xs text-muted-foreground">
                Role: {userInfo.role_name}
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProfileCard;
