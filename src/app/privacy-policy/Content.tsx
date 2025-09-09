"use client";

import MotionSection from "@/components/MotionSection";
import { ShieldCheck, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <MotionSection>
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg text-gray-600 text-center leading-relaxed">
          Your privacy matters to us. This page explains how DealWise collects,
          uses, and protects your information when you visit our website.
        </p>
      </MotionSection>

      {/* Information We Collect */}
      <Section
        icon={<FileText className="w-6 h-6 text-blue-600" />}
        title="Information We Collect"
        body="We do not require you to create an account. If you contact us, we may
          collect your email. We also use cookies and tools like Google Analytics
          to understand website traffic and improve your experience."
      />

      {/* How We Use Your Information */}
      <Section
        icon={<ShieldCheck className="w-6 h-6 text-green-600" />}
        title="How We Use Your Information"
        body="We use the information to improve our site, show relevant deals, and
          display ads. Affiliate links may place cookies to track purchases so we
          can earn commissions, at no extra cost to you."
      />

      {/* Third Parties */}
      <Section
        icon={<FileText className="w-6 h-6 text-purple-600" />}
        title="Third-Party Services"
        body="We work with Shopee, TikTok Shop, Amazon, and Google AdSense. These
          services may collect data (like cookies or device info) when you click
          their links or ads. Please review their privacy policies for details."
      />

      {/* User Rights */}
      <Section
        icon={<FileText className="w-6 h-6 text-indigo-600" />}
        title="Your Choices"
        body="You can turn off cookies in your browser if you do not want tracking.
          For questions or data concerns, you may contact us at dealwise@gmail.com."
      />

      {/* Contact */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Contact Us
        </h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please reach out:
        </p>
        <ul className="mt-3 space-y-2 text-gray-700">
          <li>
            Email:{" "}
            <a
              href="mailto:dealwise@gmail.com"
              className="text-blue-600 hover:underline"
            >
              dealwise@gmail.com
            </a>
          </li>
          <li>
            Website:{" "}
            <a
              href="https://deal-wise.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              www.deal-wise.vercel.app
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Reusable section
function Section({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <MotionSection>
      <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">{body}</p>
      </div>
    </MotionSection>
  );
}
