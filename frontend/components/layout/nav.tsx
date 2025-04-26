"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Searchbar from "../ui/searchbar";
import { useRouter } from "next/navigation";
import ProfileCardNav from "../common/profile-card-nav";
import axios from "axios";
import { motion } from "framer-motion";

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 12H21"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 5H21"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 19H21"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NotificationIcon = () => (
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 27 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors duration-200 hover:opacity-80"
    >
      <path
        d="M10.192 28.3925C10.8675 29.2698 11.8594 29.8376 12.9483 29.9702C14.0372 30.1028 15.1332 29.7893 15.9938 29.099C16.2585 28.8948 16.4967 28.6574 16.7027 28.3925M2.00112 18.502V18.1954C2.04458 17.2883 2.32552 16.4095 2.81495 15.6494C3.62962 14.7364 4.1873 13.6176 4.4295 12.4104C4.4295 11.4773 4.4295 10.5309 4.50825 9.59784C4.91517 5.10578 9.20749 2 13.4473 2H13.5523C17.7921 2 22.0845 5.10578 22.5045 9.59784C22.5833 10.5309 22.5045 11.4773 22.5701 12.4104C22.8156 13.6204 23.3727 14.7427 24.1847 15.6628C24.6778 16.4161 24.9592 17.2917 24.9985 18.1954V18.4886C25.0278 19.7073 24.6222 20.8955 23.8565 21.8344C22.8447 22.9321 21.4717 23.615 19.9974 23.7538C15.6742 24.2337 11.3123 24.2337 6.98914 23.7538C5.51649 23.609 4.14544 22.9271 3.12998 21.8344C2.37612 20.8948 1.97597 19.7136 2.00112 18.502Z"
        stroke="#F5A921"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </motion.div>
);

const CartIcon = () => (
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 28 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors duration-200 hover:opacity-80"
    >
      <path
        d="M27.9959 20.7756C27.9924 19.8162 27.709 18.88 27.1821 18.088C26.6553 17.296 25.9094 16.6845 25.0407 16.3328L27.9492 5.14596C28.01 4.90771 28.0163 4.65826 27.9677 4.41708C27.9192 4.1759 27.817 3.94951 27.6692 3.7556C27.5182 3.5739 27.3294 3.42933 27.1167 3.33253C26.9041 3.23573 26.673 3.18916 26.4405 3.19625H5.13258L4.61932 1.18262C4.53008 0.842082 4.33372 0.541433 4.06084 0.327526C3.78796 0.113619 3.45387 -0.00153239 3.11065 1.54017e-05H0V3.19625H1.91305L5.77026 17.9948C5.8614 18.3435 6.06474 18.6502 6.34717 18.8649C6.62959 19.0796 6.97445 19.1898 7.32558 19.1775H23.3299C23.7424 19.1775 24.138 19.3458 24.4297 19.6455C24.7214 19.9452 24.8852 20.3517 24.8852 20.7756C24.8852 21.1994 24.7214 21.6059 24.4297 21.9056C24.138 22.2053 23.7424 22.3737 23.3299 22.3737H3.11065C2.69815 22.3737 2.30255 22.5421 2.01087 22.8418C1.71919 23.1415 1.55533 23.548 1.55533 23.9718C1.55533 24.3957 1.71919 24.8021 2.01087 25.1019C2.30255 25.4016 2.69815 25.5699 3.11065 25.5699H4.94594C4.69014 26.2941 4.60794 27.0709 4.70631 27.8346C4.80467 28.5984 5.0807 29.3265 5.51101 29.9573C5.94133 30.5882 6.51326 31.1032 7.17838 31.4588C7.84349 31.8144 8.5822 32 9.33196 32C10.0817 32 10.8204 31.8144 11.4855 31.4588C12.1506 31.1032 12.7226 30.5882 13.1529 29.9573C13.5832 29.3265 13.8592 28.5984 13.9576 27.8346C14.056 27.0709 13.9738 26.2941 13.718 25.5699H17.3885C17.1557 26.2293 17.0665 26.9332 17.1272 27.6319C17.188 28.3305 17.3972 29.007 17.7401 29.6135C18.083 30.2201 18.5513 30.7419 19.1119 31.1422C19.6725 31.5425 20.3118 31.8116 20.9846 31.9304C21.6574 32.0491 22.3474 32.0148 23.0059 31.8297C23.6643 31.6446 24.2753 31.3133 24.7956 30.8592C25.3159 30.405 25.7328 29.8391 26.017 29.2013C26.3013 28.5636 26.4458 27.8695 26.4405 27.168C26.4376 26.3424 26.2231 25.5321 25.8184 24.8188C26.4835 24.388 27.0318 23.7914 27.4125 23.0845C27.7932 22.3777 27.9938 21.5834 27.9959 20.7756ZM21.9145 15.9812H8.55429L5.97245 6.39249H24.4186L21.9145 15.9812ZM9.33196 28.7662C9.02434 28.7662 8.72363 28.6724 8.46786 28.4968C8.21209 28.3212 8.01274 28.0716 7.89502 27.7796C7.7773 27.4876 7.7465 27.1663 7.80651 26.8563C7.86653 26.5463 8.01466 26.2615 8.23217 26.038C8.44969 25.8145 8.72682 25.6623 9.02853 25.6006C9.33023 25.539 9.64295 25.5706 9.92715 25.6916C10.2114 25.8125 10.4543 26.0174 10.6252 26.2802C10.7961 26.543 10.8873 26.852 10.8873 27.168C10.8873 27.5919 10.7234 27.9984 10.4317 28.2981C10.1401 28.5978 9.74445 28.7662 9.33196 28.7662ZM21.7746 28.7662C21.4669 28.7662 21.1662 28.6724 20.9105 28.4968C20.6547 28.3212 20.4553 28.0716 20.3376 27.7796C20.2199 27.4876 20.1891 27.1663 20.2491 26.8563C20.3091 26.5463 20.4573 26.2615 20.6748 26.038C20.8923 25.8145 21.1694 25.6623 21.4711 25.6006C21.7728 25.539 22.0856 25.5706 22.3698 25.6916C22.654 25.8125 22.8969 26.0174 23.0678 26.2802C23.2387 26.543 23.3299 26.852 23.3299 27.168C23.3299 27.5919 23.166 27.9984 22.8743 28.2981C22.5827 28.5978 22.1871 28.7662 21.7746 28.7662Z"
        fill="#F5A921"
      />
    </svg>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center gap-8 flex-1">
      <div className="h-8 w-32 bg-gradient-to-r from-amber-200 to-amber-300 rounded-md" />
      <div className="h-10 max-w-[500px] w-full bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg ml-56" />
    </div>
    <div className="flex items-center gap-4">
      <div className="h-10 w-28 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg" />
      <div className="h-10 w-28 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg" />
    </div>
  </div>
);

const MobileLoadingSkeleton = () => (
  <div className="flex items-center justify-between p-4 gap-4">
    <div className="h-10 flex-1 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg" />
    <div className="h-10 w-24 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg" />
  </div>
);

const Navigation = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const response = await axios.get(`${apiUrl}/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
          validateStatus: (status) => {
            return status === 200 || status === 401;
          },
        });

        if (response.status === 200 && response.data?.status === "success") {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Unexpected error checking auth status:", error);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/register");

  return (
    <motion.nav
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-sm border-b"
    >
      {/* Desktop Layout */}
      <div className="hidden max-sm:hidden sm:flex items-center justify-between h-16 px-4 md:px-6 lg:px-12 mx-auto max-w-[1920px]">
        {isLoggedIn === null ? (
          <LoadingSkeleton />
        ) : (
          <>
            <motion.a
              href="/"
              className="font-bold text-lg text-amber-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              E Commerce
            </motion.a>

            <div className="flex flex-1 max-w-3xl mx-8">
              <Searchbar />
            </div>

            <div className="flex items-center gap-6">
              {isLoggedIn === true && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-6"
                >
                  <motion.button
                    aria-label="Notifications"
                    className="relative p-2 rounded-full hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NotificationIcon />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </motion.button>

                  <motion.button
                    aria-label="Shopping cart"
                    onClick={() => router.push("/keranjang")}
                    className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CartIcon />
                  </motion.button>

                  <ProfileCardNav />
                </motion.div>
              )}

              {isLoggedIn === false && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <motion.button
                    onClick={handleLogin}
                    className="px-6 h-10 text-sm font-medium text-amber-500 rounded-lg border-2 border-amber-500 hover:bg-amber-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Masuk
                  </motion.button>

                  <motion.button
                    onClick={handleRegister}
                    className="px-6 h-10 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Daftar
                  </motion.button>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden h-14">
        {isLoggedIn === null ? (
          <MobileLoadingSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between px-4 h-14"
          >
            <div className="flex-1">
              <Searchbar />
            </div>
            {isLoggedIn ? (
              <div className="flex items-center gap-3 ml-3">
                <motion.button
                  aria-label="Cart"
                  onClick={() => router.push("/keranjang")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CartIcon />
                </motion.button>
                <ProfileCardNav />
              </div>
            ) : (
              <motion.button
                onClick={handleLogin}
                className="whitespace-nowrap px-4 h-9 text-sm font-medium text-amber-500 rounded-lg border border-amber-500"
                whileHover={{ backgroundColor: "rgba(251, 146, 60, 0.05)" }}
              >
                Masuk
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;
