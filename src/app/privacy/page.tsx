"use client";

import { motion } from "framer-motion";
import { Lock, Cookie, Mail, Server } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "August 29, 2025";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: {lastUpdated}</p>
        </motion.div>

        <Card icon={<Lock className="w-6 h-6" />} title="1. Overview">
          This Privacy Policy explains how <strong>Your Store Name</strong>{" "}
          (“we,” “us,” or “our”) handles information when you use our Site. We
          are an affiliate store and do not process payments on our Site.
        </Card>

        <Card
          icon={<Server className="w-6 h-6" />}
          title="2. Information We Collect"
        >
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Usage & Analytics Data:</strong> e.g., pages viewed and
              interactions, to improve the Site (via tools like Google
              Analytics).
            </li>
            <li>
              <strong>Voluntary Data:</strong> If you contact us, we may store
              your name, email, and message.
            </li>
            <li>
              <strong>No Payment Data:</strong> Purchases happen on third-party
              platforms; we do not collect payment information.
            </li>
          </ul>
        </Card>

        <Card
          icon={<Cookie className="w-6 h-6" />}
          title="3. Cookies & Tracking"
        >
          We may use cookies or similar technologies for analytics and affiliate
          tracking. You can manage cookie settings in your browser. Some
          features may not function without cookies.
        </Card>

        <Card
          icon={<Lock className="w-6 h-6" />}
          title="4. How We Use Information"
        >
          We use data to operate and improve the Site, personalize content,
          analyze performance, and ensure proper functioning of affiliate links.
        </Card>

        <Card
          icon={<Server className="w-6 h-6" />}
          title="5. Sharing with Third Parties"
        >
          We may share non-identifying analytics information with service
          providers (e.g., analytics, hosting). When you click a product link,
          third-party platforms may collect and process your data according to
          their own policies.
        </Card>

        <Card icon={<Lock className="w-6 h-6" />} title="6. Data Security">
          We take reasonable measures to protect information. However, no method
          of transmission or storage is 100% secure.
        </Card>

        <Card icon={<Mail className="w-6 h-6" />} title="7. Your Choices">
          You can disable cookies in your browser. If we offer a newsletter in
          the future, you’ll be able to unsubscribe at any time via an opt-out
          link.
        </Card>

        <Card
          icon={<Server className="w-6 h-6" />}
          title="8. Children’s Privacy"
        >
          Our Site is not directed to children under 13. We do not knowingly
          collect personal information from children.
        </Card>

        <Card
          icon={<Server className="w-6 h-6" />}
          title="9. Changes to this Policy"
        >
          We may update this Privacy Policy periodically. Continued use of the
          Site after changes signifies acceptance of the updated Policy. Please
          check this page from time to time.
        </Card>

        <Card icon={<Mail className="w-6 h-6" />} title="10. Contact Us">
          For privacy questions, contact{" "}
          <a
            href="mailto:youremail@yourdomain.com"
            className="text-blue-600 hover:underline"
          >
            youremail@yourdomain.com
          </a>
          .
        </Card>
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35 }}
      className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-gray-800">{icon}</div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </motion.div>
  );
}
