"use client";

import { SessionProvider } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            {/* Admin-specific header */}
            <header className="p-4 bg-gray-800 text-white">
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
