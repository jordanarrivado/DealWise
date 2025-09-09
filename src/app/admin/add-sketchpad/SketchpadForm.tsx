"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { X } from "lucide-react"; // for X icon

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

const offerSuggestions: Record<string, string[]> = {
  merchant: ["Shopee", "Lazada", "Amazon", "eBay", "TikTok"],
  rating: ["5", "4.5", "4", "3.5"],
  reviews: ["1000", "500", "100", "50"],
};

// Child component for offers
function OfferForm({ offer, index, onChange, onRemove }: OfferFormProps) {
  const fields: {
    name: keyof Offer;
    placeholder: string;
    type?: string;
    step?: string;
    full?: boolean;
  }[] = [
    { name: "merchant", placeholder: "Merchant" },
    { name: "price", type: "number", placeholder: "Price" },
    { name: "url", type: "url", placeholder: "URL", full: true },
    { name: "rating", type: "number", step: "0.1", placeholder: "Rating" },
    { name: "reviews", type: "number", placeholder: "Reviews" },
  ];

  return (
    <div className="relative grid grid-cols-2 gap-3 border p-3 rounded-lg">
      {/* Remove Button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
      >
        <X size={16} />
      </button>

      {fields.map(({ name, type, placeholder, step, full }) => (
        <div key={name} className={full ? "col-span-2" : ""}>
          <input
            list={offerSuggestions[name] ? `${name}-list-${index}` : undefined}
            type={type || "text"}
            step={step}
            placeholder={placeholder}
            className="border p-2 rounded w-full"
            value={offer[name]}
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

export default function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    size: "A4",
    pageCount: "80",
    paperGSM: "70",
    binding: "Spiral",
    type: "Sketchbook",
    offers: [{ merchant: "", price: "", url: "", rating: "", reviews: "" }],
    imageBase64: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleOfferChange = (
    index: number,
    field: keyof Offer,
    value: string
  ) => {
    const updatedOffers = [...form.offers];
    updatedOffers[index][field] = value;
    setForm({ ...form, offers: updatedOffers });
  };

  const addOffer = () => {
    setForm({
      ...form,
      offers: [
        ...form.offers,
        { merchant: "", price: "", url: "", rating: "", reviews: "" },
      ],
    });
  };

  const removeOffer = (index: number) => {
    const updated = form.offers.filter((_, i) => i !== index);
    setForm({ ...form, offers: updated });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm({ ...form, imageBase64: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formatted = {
        ...form,
        pageCount: Number(form.pageCount) || 0,
        paperGSM: Number(form.paperGSM) || 0,
        offers: form.offers.map((offer) => ({
          ...offer,
          price: Number(offer.price) || 0,
          rating: Number(offer.rating) || 0,
          reviews: Number(offer.reviews) || 0,
        })),
      };

      const res = await fetch("/api/sketchpad", {
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
        title: "Product Added",
        text: "The product has been added successfully!",
        confirmButtonColor: "#2563eb",
      });

      setForm({
        title: "",
        size: "A4",
        pageCount: "80",
        paperGSM: "70",
        binding: "Spiral",
        type: "Sketchbook",
        offers: [{ merchant: "", price: "", url: "", rating: "", reviews: "" }],
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
      <h2 className="text-3xl font-bold mb-6 text-center">Add SketchPad</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        {/* Common Specs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Size */}
          <input
            list="size-options"
            name="size"
            value={form.size}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            placeholder="Size"
          />
          <datalist id="size-options">
            <option value="A4" />
            <option value="A5" />
            <option value="Large" />
          </datalist>

          {/* Page Count */}
          <input
            list="page-options"
            name="pageCount"
            value={form.pageCount}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            placeholder="Page Count"
          />
          <datalist id="page-options">
            <option value="50" />
            <option value="60" />
            <option value="70" />
            <option value="80" />
          </datalist>

          {/* Paper GSM */}
          <input
            list="gsm-options"
            name="paperGSM"
            value={form.paperGSM}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            placeholder="Paper GSM"
          />
          <datalist id="gsm-options">
            <option value="50" />
            <option value="60" />
            <option value="70" />
            <option value="80" />
          </datalist>

          {/* Binding */}
          <input
            list="binding-options"
            name="binding"
            value={form.binding}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            placeholder="Binding"
          />
          <datalist id="binding-options">
            <option value="Spiral" />
            <option value="Glue" />
            <option value="Stapled" />
            <option value="Hardbound" />
          </datalist>

          {/* Type */}
          <input
            list="type-options"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            placeholder="Type"
          />
          <datalist id="type-options">
            <option value="Sketchbook" />
            <option value="Paint" />
            <option value="Pencil" />
            <option value="Marker" />
          </datalist>
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

        {/* Image Upload */}
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
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg"
        >
          {loading ? "Saving..." : "Add Product"}
        </motion.button>
      </form>
    </div>
  );
}
