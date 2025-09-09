export async function fetchGamingPhones() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/phones?category=gaming-phones&limit=10`,
    { cache: "no-store" }
  );
  return res.json();
}

export async function fetchBudgetLaptops() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/laptops?category=budget-laptops&limit=10`,
    { cache: "no-store" }
  );
  return res.json();
}

export async function fetchAffordableHeadphones() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/products?category=affordable-headphones&limit=10`,
    { cache: "no-store" }
  );
  return res.json();
}

export async function fetchSketchPad() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/sketchpad?limit=10`,
    { cache: "no-store" }
  );
  return res.json();
}

export async function fetchPencil() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/pencils?limit=10`,
    { cache: "no-store" }
  );
  return res.json();
}

