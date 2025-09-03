"use client";
import { signOut } from "next-auth/react";
import { FaBell } from "react-icons/fa";

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ toggleSidebar, sidebarOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          {sidebarOpen ? "Collapse" : "Expand"}
        </button>
      </div>
      <div className="flex items-center gap-4">
        <FaBell className="text-gray-600 dark:text-gray-300" />
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
