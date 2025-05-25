"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  Settings,
  User,
  ChevronDown,
  Shield,
  ShoppingBag,
  Store,
  Heart,
  CreditCard,
  MapPin,
  MessageSquare,
  Bell,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";
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

const loadingVariants = {
  animate: {
    backgroundPosition: ["0%", "100%"],
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

const ProfileLoadingSkeleton = () => (
  <motion.div
    variants={loadingVariants}
    animate="animate"
    className="flex items-center gap-2 px-3 py-2"
  >
    <div className="relative">
      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 animate-pulse" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-200 rounded-full animate-pulse" />
    </div>
    <div className="h-4 w-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded animate-pulse" />
  </motion.div>
);

const dropdownAnimation = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.3,
      stiffness: 300,
      damping: 22,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

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

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!mounted || loading) {
    return (
      <div className="transition-all duration-200">
        <Button variant="ghost" className="relative">
          <ProfileLoadingSkeleton />
        </Button>
      </div>
    );
  }

  const menuItems = [
    {
      group: "Account",
      items: [
        {
          icon: User,
          label: "My Profile",
          onClick: () => router.push("/akun/profile"),
        },
        {
          icon: Settings,
          label: "Settings",
          onClick: () => router.push("/akun/setting"),
        },
      ],
    },
    {
      group: "Shopping",
      items: [
        {
          icon: ShoppingBag,
          label: "My Orders",
          onClick: () => router.push("/akun/pesanan"),
        },
        {
          icon: Store,
          label: "My Shop",
          onClick: () => router.push("/toko/profile"),
        },
      ],
    },
    {
      group: "Help",
      items: [
        {
          icon: MessageSquare,
          label: "Messages",
          onClick: () => router.push("/chat"),
        },
        {
          icon: HelpCircle,
          label: "Help Center",
          onClick: () => router.push("/help"),
        },
      ],
    },
  ];

  return (
    <div className="transition-all duration-200">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 border border-transparent hover:border-orange-200"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 border-2 border-orange-200">
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                    {loading ? "..." : getInitials(userInfo.username)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex items-center gap-1 max-md:hidden">
                <span className="text-sm font-medium text-gray-700">
                  {loading ? "Loading..." : userInfo.username}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </Button>
          </motion.div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-72 p-2 border border-orange-100 shadow-lg rounded-xl"
          align="end"
          sideOffset={8}
          alignOffset={0}
          asChild
        >
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={dropdownAnimation}
          >
            <div className="p-3 mb-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white shadow">
                  <AvatarImage src="/placeholder.png" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                    {getInitials(userInfo.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    {userInfo.username}
                  </p>
                  <p className="text-xs text-gray-500">{userInfo.email}</p>
                  {userInfo.role_name && (
                    <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-orange-200 text-orange-700 rounded-full text-xs font-medium">
                      <Shield className="w-3 h-3 mr-1" />
                      {userInfo.role_name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {menuItems.map((group, index) => (
              <div key={group.group}>
                {index > 0 && (
                  <DropdownMenuSeparator className="my-1.5 bg-orange-100" />
                )}
                <DropdownMenuLabel className="text-xs font-medium text-gray-500 px-2">
                  {group.group}
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {group.items.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      onClick={item.onClick}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-orange-50"
                    >
                      <item.icon className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700">
                        {item.label}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </div>
            ))}

            <DropdownMenuSeparator className="my-1.5 bg-orange-100" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </DropdownMenuItem>
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileCardNav;
