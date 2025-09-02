"use client";

import { motion } from "framer-motion";
import { FileText, ExternalLink, ShieldAlert, Scale } from "lucide-react";

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 mt-2">Last updated: {lastUpdated}</p>
        </motion.div>

        <Card
          title="1. Acceptance of Terms"
          icon={<FileText className="w-6 h-6" />}
        >
          By accessing and using <strong>Your Store Name</strong> (the “Site”),
          you agree to these Terms & Conditions. If you do not agree, please
          discontinue use of the Site.
        </Card>

        <Card
          title="2. Affiliate Disclosure"
          icon={<Scale className="w-6 h-6" />}
        >
          We may earn a commission when you purchase products through links on
          our Site. This does not affect the price you pay on the partner
          platform and helps us keep the service free.
        </Card>

        <Card
          title="3. Use of the Site"
          icon={<FileText className="w-6 h-6" />}
        >
          You agree to use the Site for personal, non-commercial purposes and
          not to copy, scrape, or misuse content. We reserve the right to
          suspend access for misuse or abuse of the Site.
        </Card>

        <Card
          title="4. External Links & Platforms"
          icon={<ExternalLink className="w-6 h-6" />}
        >
          Our product links redirect to third-party platforms (e.g., Shopee,
          TikTok Shop, Amazon). We are not responsible for their content,
          policies, pricing, availability, or actions. Purchases, payments,
          shipping, and returns are handled by those platforms.
        </Card>

        <Card
          title="5. No Warranties; Limitation of Liability"
          icon={<ShieldAlert className="w-6 h-6" />}
        >
          The Site is provided “as is.” We make no warranties regarding products
          listed, pricing accuracy, availability, or platform reliability. To
          the fullest extent permitted by law, we shall not be liable for any
          damages arising from your use of the Site or purchases on third-party
          platforms.
        </Card>

        <Card
          title="6. Intellectual Property"
          icon={<FileText className="w-6 h-6" />}
        >
          All Site content, including text, layout, and graphics, is owned by or
          licensed to us and protected by applicable laws. Product images and
          trademarks belong to their respective owners.
        </Card>

        <Card
          title="7. Changes to Terms"
          icon={<FileText className="w-6 h-6" />}
        >
          We may update these Terms at any time. Continued use of the Site after
          updates constitutes acceptance of the revised Terms. Please review
          this page periodically.
        </Card>

        <Card title="8. Contact" icon={<FileText className="w-6 h-6" />}>
          For questions about these Terms, contact{" "}
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
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
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
