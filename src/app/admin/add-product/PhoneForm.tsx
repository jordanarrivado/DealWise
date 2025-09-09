"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";

interface Offer {
  merchant: string;
  price: string;
  url: string;
  rating: string;
  reviews: string;
}

interface ProductForm {
  title: string;
  category: string;
  desc: string[];
  offers: Offer[];
  imageBase64: string;
}

interface OfferFormProps {
  offer: Offer;
  index: number;
  onChange: (index: number, field: keyof Offer, value: string) => void;
}

// Suggestions for common fields (optional)
const suggestions: Record<string, string[]> = {
  category: [
    "Electronics",
    "Clothing",
    "Home",
    "Books",
    "Beauty",
    "Sports",
    "Toys",
    "Accessory",
  ],
};

const offerSuggestions: Record<string, string[]> = {
  merchant: ["TikTok", "Shopee", "Lazada", "Amazon", "eBay"],
  rating: ["5", "4.5", "4", "3.5"],
  reviews: ["1000", "500", "100", "50"],
};

// Child component for offers
function OfferForm({ offer, index, onChange }: OfferFormProps) {
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
    <div className="grid grid-cols-2 gap-3 border p-3 rounded-lg">
      {fields.map(({ name, full, ...rest }) => (
        <div key={name} className={full ? "col-span-2" : ""}>
          <input
            list={offerSuggestions[name] ? `${name}-list-${index}` : undefined}
            {...rest}
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
  const [form, setForm] = useState<ProductForm>({
    title: "",
    category: "",
    desc: [""],
    offers: [{ merchant: "", price: "", url: "", rating: "", reviews: "" }],
    imageBase64: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value } as ProductForm);
  };

  const handleDescChange = (index: number, value: string) => {
    const updated = [...form.desc];
    updated[index] = value;
    setForm({ ...form, desc: updated });
  };

  const addDesc = () => setForm({ ...form, desc: [...form.desc, ""] });

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
        offers: form.offers.map((offer) => ({
          ...offer,
          price: Number(offer.price) || 0,
          rating: Number(offer.rating) || 0,
          reviews: Number(offer.reviews) || 0,
        })),
      };

      const res = await fetch("/api/products", {
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
        category: "",
        desc: [""],
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

  const handleAutofill = async () => {
    if (!form.title.trim()) {
      return Swal.fire("Error", "Enter a phone name first", "error");
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/fill-product", {
        productName: form.title,
      });

      setForm((prev) => ({
        ...prev,
        ...data,
        offers: prev.offers,
        imageBase64: prev.imageBase64,
      }));

      Swal.fire("Success", "Specs autofilled!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to autofill specs", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Add Product</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title & Category */}
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />
        <button
          type="button"
          onClick={handleAutofill}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          disabled={loading}
        >
          {loading ? "Autofilling..." : "Autofill Specs"}
        </button>
        <input
          type="text"
          name="category"
          list="category-list"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />
        <datalist id="category-list">
          {suggestions.category.map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-semibold">Description</h3>
          {form.desc.map((d, idx) => (
            <textarea
              key={idx}
              className="w-full border p-2 rounded-lg"
              placeholder={`Description line ${idx + 1}`}
              value={d}
              onChange={(e) => handleDescChange(idx, e.target.value)}
              required
            />
          ))}
          <button
            type="button"
            onClick={addDesc}
            className="text-blue-600 font-medium underline"
          >
            + Add Another Description
          </button>
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
            />
          ))}
          <button
            type="button"
            onClick={addOffer}
            className="text-blue-600 font-medium underline"
          >
            + Add Another Offer
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
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg"
        >
          {loading ? "Saving..." : "Add Product"}
        </motion.button>
      </form>
    </div>
  );
}
