import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DealWise",
              url: "https://deal-wise.vercel.app/",
              logo: "https://deal-wise.vercel.app/logo.png",
              sameAs: [
                "https://twitter.com/DealWisePH",
                "https://facebook.com/DealWisePH",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
