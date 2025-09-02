"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        {/* Logo / Brand */}
        <h1 className="text-3xl font-bold text-indigo-700">DealWise</h1>
        <p className="text-gray-600">Sign in to continue</p>

        {/* Google Sign In */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-gray-300 shadow-sm hover:shadow-md bg-white text-gray-700 font-medium transition"
        >
          <FcGoogle size={24} />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-500">
          Only the authorized DealWise account can log in.
        </p>
      </div>
    </div>
  );
}
