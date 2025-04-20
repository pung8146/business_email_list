"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="font-bold text-xl text-blue-600 dark:text-blue-400"
              >
                YouTuber Directory
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                  isActive("/")
                    ? "border-blue-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                홈
              </Link>
              <Link
                href="/admin"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                  isActive("/admin")
                    ? "border-blue-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                관리자
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
