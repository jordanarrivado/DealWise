import {
  fetchGamingPhones,
  fetchBudgetLaptops,
  fetchAffordableHeadphones,
  fetchPencil,
  fetchSketchPad,
} from "@/lib/getDeals";
import DealsClient from "./DealsClient";

export default async function Deals() {
  const [
    gamingPhones,
    budgetLaptops,
    affordableHeadphones,
    topPencils,
    topSketchPads,
  ] = await Promise.all([
    fetchGamingPhones(),
    fetchBudgetLaptops(),
    fetchAffordableHeadphones(),
    fetchPencil(),
    fetchSketchPad(),
  ]);

  return (
    <DealsClient
      gamingPhones={gamingPhones}
      budgetLaptops={budgetLaptops}
      affordableHeadphones={affordableHeadphones}
      topPencils={topPencils}
      topSketchPads={topSketchPads}
    />
  );
}
