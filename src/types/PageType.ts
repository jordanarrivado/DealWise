export type Metadata = {
  title?: string;
  description?: string;
  keywords?: string[];
  authors?: { name: string; url?: string }[];
  openGraph?: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: { url: string; width: number; height: number; alt: string }[];
    locale: string;
    type: string;
  };
  twitter?: {
    card: "summary" | "summary_large_image" | "app" | "player";
    site: string;
    creator?: string;
    title: string;
    description: string;
    images: string[];
  };
};