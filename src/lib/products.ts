export interface Product {
  name: string;
  image: string; // new field
  desc: string[];
  offers: {
    merchant: string;
    price: number;
    rating: number;
    reviews: number;
    url: string;
  }[];
}

export const products: Product[] = [
  {
    name: "Wireless Bluetooth Headphones",
    image: "/images/products/headphones.jpg",
    desc: [
      "40mm drivers with deep bass",
      "20-hour battery life",
      "Noise-cancelling microphone",
    ],
    offers: [
      {
        merchant: "Shopee",
        price: 1499,
        rating: 4.7,
        reviews: 3200,
        url: "https://shopee.ph/product1",
      },
      {
        merchant: "Lazada",
        price: 1599,
        rating: 4.6,
        reviews: 1800,
        url: "https://lazada.com.ph/product1",
      },
    ],
  },
  {
    name: "Mechanical Gaming Keyboard",
    image: "/images/products/keyboard.jpg",
    desc: [
      "Blue switches with tactile feedback",
      "RGB backlighting with custom modes",
      "Detachable wrist rest",
    ],
    offers: [
      {
        merchant: "Amazon",
        price: 2899,
        rating: 4.8,
        reviews: 1200,
        url: "https://amazon.com/product2",
      },
      {
        merchant: "Shopee",
        price: 2750,
        rating: 4.7,
        reviews: 950,
        url: "https://shopee.ph/product2",
      },
    ],
  },
  {
    name: "Smart Fitness Band",
    image: "/images/products/fitness-band.jpg",
    desc: [
      "Heart rate & SpO₂ monitoring",
      "1.4-inch AMOLED display",
      "14-day battery life",
    ],
    offers: [
      {
        merchant: "Lazada",
        price: 999,
        rating: 4.5,
        reviews: 4200,
        url: "https://lazada.com.ph/product3",
      },
      {
        merchant: "Shopee",
        price: 1050,
        rating: 4.6,
        reviews: 3600,
        url: "https://shopee.ph/product3",
      },
    ],
  },
  {
    name: "Portable Power Bank 20000mAh",
    image: "/images/products/power-bank.jpg",
    desc: [
      "Quick Charge 3.0 + USB-C PD",
      "Dual USB output",
      "Slim, lightweight design",
    ],
    offers: [
      {
        merchant: "Shopee",
        price: 899,
        rating: 4.4,
        reviews: 5100,
        url: "https://shopee.ph/product4",
      },
      {
        merchant: "Lazada",
        price: 950,
        rating: 4.5,
        reviews: 4800,
        url: "https://lazada.com.ph/product4",
      },
    ],
  },
  {
    name: "4K Action Camera",
    image: "/images/products/action-camera.jpg",
    desc: [
      "Waterproof up to 30m",
      "4K 30fps recording",
      "Wi-Fi remote control included",
    ],
    offers: [
      {
        merchant: "Amazon",
        price: 3199,
        rating: 4.6,
        reviews: 700,
        url: "https://amazon.com/product5",
      },
      {
        merchant: "Shopee",
        price: 2999,
        rating: 4.5,
        reviews: 890,
        url: "https://shopee.ph/product5",
      },
    ],
  },
];
