"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isLogInPage = pathname.startsWith("/login");

  return (
    <>
      {(!isAdminPage || isLogInPage) && <Navbar />}
      {isAdminPage ? (
        <main>{children}</main>
      ) : (
        <main className="max-w-6xl mx-auto p-6">{children}</main>
      )}

      {(!isAdminPage || !isLogInPage) && (
        <footer className="bg-white border-t mt-10">
          <div className="max-w-6xl mx-auto p-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} DealWise — Built with Next.js
          </div>
        </footer>
      )}
    </>
  );
}
