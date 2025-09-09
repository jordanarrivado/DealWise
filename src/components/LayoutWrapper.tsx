"use client";

import { usePathname } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import GetCurrentYear from "@/app/hooks/getYear";
import Navbar from "./Navbar";
import Link from "next/link";

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
        <footer className="bg-gray-900 text-gray-400 mt-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-sm">
            <GetCurrentYear />

            <div className="flex space-x-6 mt-3 sm:mt-0">
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
