import BudgetPhonesRanking from "@/app/guides/top-10-budget-phone-below-10000/BudgetPhonesRanking";
import { Product } from "@/types/product";

type BudgetPhonesSectionProps = {
  products: Product[];
};

export default function BudgetPhonesSection({
  products,
}: BudgetPhonesSectionProps) {
  return (
    <BudgetPhonesRanking
      title="Top Budget Phones under ₱10,000"
      products={products}
    />
  );
}
