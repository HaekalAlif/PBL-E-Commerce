import Link from "next/link";
import { ChevronRight, Home, Store } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbProps {
  storeName: string;
}

export function Breadcrumb({ storeName }: BreadcrumbProps) {
  const breadcrumbItems = [
    { href: "/", label: "Beranda", icon: Home },
    { label: storeName, icon: Store, isActive: true },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center space-x-2 text-sm bg-white/90 backdrop-blur-md rounded-xl px-6 py-4 shadow-sm border border-gray-200/50"
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center"
        >
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}

          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors duration-200 font-medium hover:bg-amber-50 px-3 py-1.5 rounded-lg"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.label}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-amber-600 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg">
              {item.icon && <item.icon className="h-4 w-4" />}
              <span className="truncate max-w-[200px] sm:max-w-[300px]">
                {item.label}
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </motion.nav>
  );
}
