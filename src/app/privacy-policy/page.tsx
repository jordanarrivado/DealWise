import Content from "./Content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - DealWise",
  description:
    "Read DealWise's Privacy Policy to understand how we collect, use, and protect your information while you browse and shop with us.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <Content />
    </div>
  );
}
