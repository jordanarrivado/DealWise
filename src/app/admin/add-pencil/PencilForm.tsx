"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

interface Offer {
  merchant: string;
  price: string;
  url: string;
  rating: string;
  reviews: string;
}

interface OfferFormProps {
  offer: Offer;
  index: number;
  onChange: (index: number, field: keyof Offer, value: string) => void;
  onRemove: (index: number) => void;
}

// 🔹 Offer field suggestions
const offerSuggestions: Record<string, string[]> = {
  merchant: ["Shopee", "Lazada", "Amazon", "eBay", "TikTok"],
  rating: ["5", "4.5", "4", "3.5"],
  reviews: ["1000", "500", "100", "50"],
};

// 🔹 Pencil field suggestions
const pencilSuggestions: Record<string, string[]> = {
  hardness: ["HB", "2B", "4B", "6B", "H", "2H"],
  material: ["Wood", "Mechanical", "Charcoal", "Plastic"],
  shape: ["Hexagonal", "Round", "Triangular"],
  color: ["Graphite", "Red", "Blue", "Green", "Black"],
  erasable: ["Yes", "No"],
};

// 🔹 Child component for offers
function OfferForm({ offer, index, onChange, onRemove }: OfferFormProps) {
  const fields: {
    name: keyof Offer;
    type: string;
    placeholder: string;
    step?: string;
    full?: boolean;
  }[] = [
    { name: "merchant", type: "text", placeholder: "Merchant" },
    { name: "price", type: "number", placeholder: "Price" },
    { name: "url", type: "url", placeholder: "URL", full: true },
    { name: "rating", type: "number", step: "0.1", placeholder: "Rating" },
    { name: "reviews", type: "number", placeholder: "Reviews" },
  ];

  return (
    <div className="relative grid grid-cols-2 gap-3 border p-3 rounded-lg">
      {/* ❌ Remove button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 text-red-600 font-bold"
      >
        ✕
      </button>

      {fields.map(({ name, full, ...rest }) => (
        <div key={name} className={full ? "col-span-2" : ""}>
          <input
            list={offerSuggestions[name] ? `${name}-list-${index}` : undefined}
            {...rest}
            className="border p-2 rounded w-full"
            value={offer[name]} // ✅ Uses current state
            onChange={(e) => onChange(index, name, e.target.value)}
            required
          />
          {offerSuggestions[name] && (
            <datalist id={`${name}-list-${index}`}>
              {offerSuggestions[name].map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AddPencil() {
  const [form, setForm] = useState({
    title: "",
    hardness: "2B",
    material: "Graphite",
    shape: "Round",
    color: "",
    erasable: "",
    // ✅ first offer defaults to Shopee
    offers: [
      { merchant: "Shopee", price: "", url: "", rating: "", reviews: "" },
    ],
    imageBase64: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🔹 Offer change handler
  const handleOfferChange = (
    index: number,
    field: keyof Offer,
    value: string
  ) => {
    const updatedOffers = [...form.offers];
    updatedOffers[index][field] = value;
    setForm({ ...form, offers: updatedOffers });
  };

  const removeOffer = (index: number) => {
    setForm({ ...form, offers: form.offers.filter((_, i) => i !== index) });
  };

  const addOffer = () => {
    setForm({
      ...form,
      offers: [
        ...form.offers,
        // ✅ new offers also default to Shopee
        { merchant: "Shopee", price: "", url: "", rating: "", reviews: "" },
      ],
    });
  };

  // 🔹 Handle image upload
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm({ ...form, imageBase64: reader.result as string });
    reader.readAsDataURL(file);
  };

  // 🔹 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formatted = {
        ...form,
        offers: form.offers.map((offer) => ({
          ...offer,
          price: Number(offer.price) || 0,
          rating: Number(offer.rating) || 0,
          reviews: Number(offer.reviews) || 0,
        })),
      };

      const res = await fetch("/api/pencils", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatted),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      Swal.fire({
        icon: "success",
        title: "Pencil Added",
        text: "The pencil has been added successfully!",
        confirmButtonColor: "#2563eb",
      });

      // ✅ reset to default again
      setForm({
        title: "",
        hardness: "",
        material: "",
        shape: "",
        color: "",
        erasable: "",
        offers: [
          { merchant: "Shopee", price: "", url: "", rating: "", reviews: "" },
        ],
        imageBase64: "",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Add Pencil</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Pencil Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        {/* Specs for Pencils */}
        <div className="grid grid-cols-2 gap-4">
          {(["hardness", "material", "shape", "color"] as const).map(
            (field) => (
              <div key={field}>
                <input
                  type="text"
                  name={field}
                  list={`${field}-list`}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                  required={field === "hardness"}
                />
                <datalist id={`${field}-list`}>
                  {pencilSuggestions[field].map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
              </div>
            )
          )}

          {/* Erasable */}
          <div className="col-span-2">
            <input
              type="text"
              name="erasable"
              list="erasable-list"
              placeholder="Erasable?"
              value={form.erasable}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              required
            />
            <datalist id="erasable-list">
              {pencilSuggestions.erasable.map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Offers */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Offers</h3>
          {form.offers.map((offer, idx) => (
            <OfferForm
              key={idx}
              offer={offer}
              index={idx}
              onChange={handleOfferChange}
              onRemove={removeOffer}
            />
          ))}
          <button
            type="button"
            onClick={addOffer}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + Add Offer
          </button>
        </div>

        {/* Image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="w-full"
        />
        {form.imageBase64 && (
          <img
            src={form.imageBase64}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
        )}

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg shadow-lg"
        >
          {loading ? "Saving..." : "Add Pencil"}
        </motion.button>
      </form>
    </div>
  );
}
