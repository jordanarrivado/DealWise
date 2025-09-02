
export interface Phone {
  name: string;
  gamingScore: number;
  antutu: number;
  camera: string;
  battery: string;
  display: string;
  chipset: string;
  offers: {
    merchant: string;
    price: number;
    url: string;
    rating: number;
    reviews: number;
  }[];
}
export const phones: Phone[] = [
  {
    name: "Itel P55 5G",
    gamingScore: 7,
    antutu: 350000,
    camera: "50MP Dual",
    battery: "5000mAh",
    display: '6.6" HD+ 90Hz',
    chipset: "Dimensity 6080",
    offers: [
      {
        merchant: "Shopee",
        price: 4999,
        url: "#",
        rating: 4.8,
        reviews: 3200,
      },
      {
        merchant: "TikTok Shop",
        price: 4799,
        url: "#",
        rating: 4.9,
        reviews: 2100,
      },
    ],
  },
  {
    name: "Itel RS4",
    gamingScore: 8,
    antutu: 410000,
    camera: "64MP Triple",
    battery: "5000mAh",
    display: '6.78" FHD+ 120Hz',
    chipset: "Helio G99",
    offers: [
      {
        merchant: "Shopee",
        price: 4899,
        url: "#",
        rating: 4.9,
        reviews: 5000,
      },
      {
        merchant: "TikTok Shop",
        price: 4750,
        url: "#",
        rating: 4.8,
        reviews: 3000,
      },
    ],
  },
  {
    name: "Infinix Hot 50",
    gamingScore: 7,
    antutu: 370000,
    camera: "50MP AI Dual",
    battery: "5000mAh",
    display: '6.78" FHD+ 90Hz',
    chipset: "Helio G88",
    offers: [
      {
        merchant: "Shopee",
        price: 4599,
        url: "#",
        rating: 4.7,
        reviews: 4200,
      },
      {
        merchant: "TikTok Shop",
        price: 4499,
        url: "#",
        rating: 4.8,
        reviews: 3800,
      },
    ],
  },
  {
    name: "Nubia Neo 3 4G",
    gamingScore: 7,
    antutu: 380000,
    camera: "50MP Dual",
    battery: "6000mAh",
    display: '6.6" FHD+ 120Hz',
    chipset: "Unisoc T760",
    offers: [
      {
        merchant: "Shopee",
        price: 5999,
        url: "#",
        rating: 4.7,
        reviews: 2100,
      },
      {
        merchant: "TikTok Shop",
        price: 5799,
        url: "#",
        rating: 4.8,
        reviews: 1800,
      },
    ],
  },
  {
    name: "Tecno Spark 30 Pro",
    gamingScore: 7,
    antutu: 390000,
    camera: "108MP Triple",
    battery: "5000mAh",
    display: '6.78" FHD+ 120Hz AMOLED',
    chipset: "Helio G99",
    offers: [
      {
        merchant: "Shopee",
        price: 7999,
        url: "#",
        rating: 4.8,
        reviews: 3500,
      },
      {
        merchant: "TikTok Shop",
        price: 7699,
        url: "#",
        rating: 4.9,
        reviews: 2800,
      },
    ],
  },
  {
    name: "Infinix Hot 50 Pro",
    gamingScore: 8,
    antutu: 420000,
    camera: "108MP Triple",
    battery: "5000mAh",
    display: '6.78" FHD+ 120Hz',
    chipset: "Helio G99 Ultra",
    offers: [
      {
        merchant: "Shopee",
        price: 8999,
        url: "#",
        rating: 4.9,
        reviews: 4800,
      },
      {
        merchant: "TikTok Shop",
        price: 8699,
        url: "#",
        rating: 4.8,
        reviews: 4100,
      },
    ],
  },
  {
    name: "Redmi Note 14 4G",
    gamingScore: 8,
    antutu: 450000,
    camera: "108MP OIS Triple",
    battery: "5000mAh",
    display: '6.67" AMOLED 120Hz',
    chipset: "Snapdragon 685",
    offers: [
      {
        merchant: "Shopee",
        price: 9999,
        url: "#",
        rating: 4.9,
        reviews: 5200,
      },
      {
        merchant: "TikTok Shop",
        price: 9799,
        url: "#",
        rating: 4.9,
        reviews: 4400,
      },
    ],
  },
  {
    name: "Poco M7 Pro 5G",
    gamingScore: 9,
    antutu: 470000,
    camera: "64MP OIS Triple",
    battery: "5000mAh",
    display: '6.67" AMOLED 120Hz',
    chipset: "Dimensity 7025 Ultra",
    offers: [
      {
        merchant: "Shopee",
        price: 7712,
        url: "#",
        rating: 4.9,
        reviews: 1200,
      },
      {
        merchant: "TikTok Shop",
        price: 9999,
        url: "https://vt.tiktok.com/ZSHtRXxwPUMfj-49Gjv/",
        rating: 4.9,
        reviews: 259,
      },
    ],
  },
  {
    name: "Nubia Neo 3 5G",
    gamingScore: 8,
    antutu: 520000,
    camera: "50MP Dual",
    battery: "6000mAh",
    display: '6.78" FHD+ 120Hz',
    chipset: "Dimensity 810",
    offers: [
      {
        merchant: "Shopee",
        price: 8999,
        url: "#",
        rating: 4.7,
        reviews: 2700,
      },
      {
        merchant: "TikTok Shop",
        price: 8799,
        url: "#",
        rating: 4.8,
        reviews: 2300,
      },
    ],
  },
  {
    name: "Tecno Camon 40",
    gamingScore: 8,
    antutu: 510000,
    camera: "64MP OIS Quad",
    battery: "5000mAh",
    display: '6.8" AMOLED 120Hz',
    chipset: "Helio G99 Ultra",
    offers: [
      {
        merchant: "Shopee",
        price: 10999,
        url: "#",
        rating: 4.8,
        reviews: 3500,
      },
      {
        merchant: "TikTok Shop",
        price: 10699,
        url: "#",
        rating: 4.9,
        reviews: 2900,
      },
    ],
  },
  {
    name: "Infinix Note 50",
    gamingScore: 9,
    antutu: 600000,
    camera: "108MP OIS Quad",
    battery: "5000mAh",
    display: '6.9" AMOLED 120Hz',
    chipset: "Dimensity 7020",
    offers: [
      {
        merchant: "Shopee",
        price: 13999,
        url: "#",
        rating: 4.9,
        reviews: 6800,
      },
      {
        merchant: "TikTok Shop",
        price: 13499,
        url: "#",
        rating: 4.9,
        reviews: 5400,
      },
    ],
  },
];