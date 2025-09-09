import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminDashboard from "../admin/dashboard/AdminDashboard";
import Link from "next/link";

export default async function ProtectedAdminDashboard() {
  const session = await getServerSession(authOptions);

  const emailOne = process.env.ALLOWED_EMAIL1;
  const emailTwo = process.env.ALLOWED_EMAIL2;
  if (
    !session ||
    (session.user?.email !== emailOne && session.user?.email !== emailTwo)
  ) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-red-50 space-y-4">
        <p className="text-lg font-semibold text-red-600">
          ⛔ Access Denied – You’re not authorized to access DealWise Admin
        </p>
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return <AdminDashboard />;
}
