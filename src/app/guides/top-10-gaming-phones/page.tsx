import TopProducts from "@/components/TopProducts";
import { fetchProducts } from "@/lib/mongodb";
import { Product } from "../../../types/product";

export default async function GamingPhonesPage() {
  const products: Product[] = await fetchProducts(
    { category: "gaming-phones" },
    10
  );
  return (
    <TopProducts title="🔥 Top 10 Budget Gaming Phones" products={products} />
  );
}
