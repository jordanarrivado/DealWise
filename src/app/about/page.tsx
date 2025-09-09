import MotionSection from "@/components/MotionSection";
import {
  Info,
  ShieldCheck,
  ShoppingCart,
  Globe,
  Star,
  SearchCheck,
  TrendingUp,
  BadgeCheck,
  Mail,
  Phone,
} from "lucide-react";
import { Metadata } from "next";

// SEO metadata
export const metadata: Metadata = {
  title: "About Us - DealWise",
  description:
    "Learn about DealWise, the platform that curates top deals from Shopee, TikTok Shop, Amazon, and more. Save time and money with verified and trustworthy product listings.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <MotionSection>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-center">
            About Us
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed text-center">
            We curate the best deals across top platforms so you spend less time
            searching and more time saving.{" "}
            <span className="font-semibold text-gray-800">
              All links are 100% legit and sourced directly from official
              platforms.
            </span>
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full shadow-sm">
              <BadgeCheck className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Verified & Secure</span>
            </div>
          </div>
        </MotionSection>

        {/* Mission */}
        <Section
          icon={<Info className="w-6 h-6 text-blue-600 text-center" />}
          title="Our Mission"
          body="At DealWise, our mission is simple: make shopping smarter. We bring together products from Shopee, TikTok Shop, Amazon, and other trusted platforms organized, comparable, and easy to browse."
        />

        {/* Review Process */}
        <Section
          icon={<SearchCheck className="w-6 h-6 text-indigo-600" />}
          title="Our Review Process"
          body="We evaluate every product using verified ratings, technical specs, and real pricing data. No paid placements rankings are purely data-driven and updated regularly to reflect new deals."
        />

        {/* How It Works */}
        <Section
          icon={<ShoppingCart className="w-6 h-6 text-emerald-600" />}
          title="How It Works"
          body="We’re an affiliate store. When you click “View Offer,” you’ll be redirected to the official platform to complete your purchase. Payments, shipping, returns, and customer support are handled by that platform."
        />

        {/* Why Choose Us */}
        <MotionSection delay={0.1}>
          <WhyChooseUs />
        </MotionSection>

        {/* Affiliate Disclosure */}
        <MotionSection delay={0.15}>
          <AffiliateDisclosure />
        </MotionSection>

        {/* Disclaimer */}
        <MotionSection delay={0.2}>
          <Disclaimer />
        </MotionSection>

        {/* Contact Section */}
        <MotionSection delay={0.25}>
          <ContactSection />
        </MotionSection>
      </div>

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "DealWise",
            url: "https://www.deal-wise.vercel.app",
            logo: "https://www.dealwise.com/logo.png",
            contactPoint: [
              {
                "@type": "ContactPoint",
                email: "dealwise@gmail.com",
                telephone: "+63 999 857 1234",
                contactType: "customer service",
              },
            ],
          }),
        }}
      />
    </div>
  );
}

// Components
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
      <div className="bg-white shadow-sm rounded-2xl p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">{body}</p>
      </div>
    </MotionSection>
  );
}

function WhyChooseUs() {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-semibold text-gray-900">Why Choose Us</h2>
      </div>
      <ul className="grid sm:grid-cols-2 gap-3 text-gray-700">
        {[
          "Hand-picked, relevant products",
          "Side-by-side price awareness",
          "Clean filters by platform & price",
          "Zero extra fees for you",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Star className="w-5 h-5 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
          Updated monthly • No paid rankings
        </span>
      </div>
    </div>
  );
}

function AffiliateDisclosure() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp className="w-6 h-6 text-blue-700" />
        <h3 className="text-xl font-semibold text-gray-900">
          Affiliate Disclosure
        </h3>
      </div>
      <p className="text-gray-800 text-sm leading-relaxed">
        Some links on DealWise are affiliate links. This means we may earn a
        small commission when you make a purchase at no extra cost to you. These
        commissions help keep our service free and updated. We never accept
        payment to alter product rankings.
      </p>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="w-6 h-6 text-yellow-700" />
        <h3 className="text-xl font-semibold text-gray-900">
          Important Disclaimer
        </h3>
      </div>
      <p className="text-gray-800 text-sm leading-relaxed">
        We do not sell or ship products ourselves. All purchases are completed
        on third-party platforms. Any issues regarding orders, shipping,
        returns, or warranties are handled by the seller/platform.
      </p>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Mail className="w-6 h-6 text-blue-600" /> Contact Us
      </h2>
      <p className="text-gray-700 mb-4">
        Have questions, suggestions, or issues? Reach out to us anytime!
      </p>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          <a
            href="mailto:iodev404@gmail.com"
            className="hover:underline text-blue-600"
          >
            dealwise@gmail.com
          </a>
        </li>

        <li className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-600" />
          <a
            href="https://www.dealwise.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-purple-600"
          >
            www.deal-wise.vercel.app
          </a>
        </li>
      </ul>
    </div>
  );
}
