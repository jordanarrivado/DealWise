"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

interface OfferForm {
  merchant: string;
  url: string;
  priceStr: string;
  ratingStr: string;
  reviewsStr: string;
}

const defaultMerchants = ["Shopee", "Lazada", "Amazon", "eBay"];

export default function PhoneForm() {
  const [form, setForm] = useState({
    name: "",
    gamingScore: "",
    antutu: "",
    camera: "",
    battery: "",
    display: "",
    chipset: "",
    imageBase64: "",
    offers: [
      { merchant: "", url: "", priceStr: "", ratingStr: "", reviewsStr: "" },
    ],
  });
  const [nameExists, setNameExists] = useState(false);
  const [checkingName, setCheckingName] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle offers
  const handleOfferChange = (
    index: number,
    field: keyof OfferForm,
    value: string
  ) => {
    const updated = [...form.offers];
    updated[index][field] = value;
    setForm({ ...form, offers: updated });
  };

  const addOffer = () =>
    setForm({
      ...form,
      offers: [
        ...form.offers,
        { merchant: "", url: "", priceStr: "", ratingStr: "", reviewsStr: "" },
      ],
    });

  const removeOffer = (index: number) =>
    setForm({ ...form, offers: form.offers.filter((_, i) => i !== index) });

  // Handle image
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm({ ...form, imageBase64: reader.result as string });
    reader.readAsDataURL(file);
  };

  // Check if phone name exists
  useEffect(() => {
    const normalized = form.name.trim();
    if (!normalized) return setNameExists(false);

    const timeout = setTimeout(async () => {
      setCheckingName(true);
      try {
        const { data } = await axios.get(
          `/api/phones/checkName?name=${encodeURIComponent(normalized)}`
        );
        setNameExists(data.exists);
      } catch {
        setNameExists(false);
      } finally {
        setCheckingName(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [form.name]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim())
      return Swal.fire("Error", "Phone name is required", "error");
    if (nameExists)
      return Swal.fire("Error", "Phone name already exists!", "error");
    if (!form.imageBase64)
      return Swal.fire("Error", "Phone image is required", "error");

    for (let i = 0; i < form.offers.length; i++) {
      const o = form.offers[i];
      if (!o.merchant || !o.priceStr || !o.url) {
        return Swal.fire(
          "Error",
          `Offer ${i + 1} must have merchant, price, and URL`,
          "error"
        );
      }
    }

    setLoading(true);

    try {
      const formattedOffers = form.offers.map((o) => ({
        merchant: o.merchant,
        url: o.url,
        price: Number(o.priceStr),
        rating: Number(o.ratingStr) || 0,
        reviews: Number(o.reviewsStr) || 0,
      }));

      const payload = {
        ...form,
        offers: formattedOffers,
        gamingScore: Number(form.gamingScore),
        antutu: Number(form.antutu),
      };

      const res = await fetch("/api/phones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      Swal.fire("Success", "Phone added successfully!", "success");

      // Reset form
      setForm({
        name: "",
        gamingScore: "",
        antutu: "",
        camera: "",
        battery: "",
        display: "",
        chipset: "",
        imageBase64: "",
        offers: [
          {
            merchant: "",
            url: "",
            priceStr: "",
            ratingStr: "",
            reviewsStr: "",
          },
        ],
      });
    } catch (err: any) {
      Swal.fire("Error", err.message || "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="max-w-3xl mx-auto p-4 space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center">Add New Phone</h2>

      <input
        type="text"
        name="name"
        placeholder="Phone Name"
        value={form.name}
        onChange={handleChange}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
          nameExists
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
        required
      />
      <div className="mt-1 h-5 text-sm">
        {checkingName && <span className="text-gray-500">Checking...</span>}
        {!checkingName && nameExists && (
          <span className="text-red-600">⚠️ Phone name already exists!</span>
        )}
        {!checkingName && form.name.trim() && !nameExists && (
          <span className="text-green-600">✅ Phone name is available</span>
        )}
      </div>

      <input
        type="number"
        name="gamingScore"
        placeholder="Gaming Score"
        value={form.gamingScore}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="number"
        name="antutu"
        placeholder="Antutu Score"
        value={form.antutu}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        name="camera"
        placeholder="Camera"
        value={form.camera}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        name="battery"
        placeholder="Battery"
        value={form.battery}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        name="display"
        placeholder="Display"
        value={form.display}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        name="chipset"
        placeholder="Chipset"
        value={form.chipset}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />

      {/* Image */}
      <input type="file" accept="image/*" onChange={handleImage} required />
      {form.imageBase64 && (
        <img
          src={form.imageBase64}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg border"
        />
      )}

      {/* Offers */}
      <div className="space-y-4">
        {form.offers.map((offer, idx) => (
          <div key={idx} className="p-4 border rounded-lg relative space-y-2">
            <h3 className="font-semibold">Offer {idx + 1}</h3>
            <input
              list={`merchants-${idx}`}
              placeholder="Merchant"
              value={offer.merchant}
              onChange={(e) =>
                handleOfferChange(idx, "merchant", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <datalist id={`merchants-${idx}`}>
              {defaultMerchants.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <input
              type="text"
              placeholder="Price"
              value={offer.priceStr}
              onChange={(e) =>
                handleOfferChange(idx, "priceStr", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="url"
              placeholder="URL"
              value={offer.url}
              onChange={(e) => handleOfferChange(idx, "url", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Rating"
                value={offer.ratingStr}
                onChange={(e) =>
                  handleOfferChange(idx, "ratingStr", e.target.value)
                }
                className="w-1/2 px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Reviews"
                value={offer.reviewsStr}
                onChange={(e) =>
                  handleOfferChange(idx, "reviewsStr", e.target.value)
                }
                className="w-1/2 px-3 py-2 border rounded-lg"
              />
            </div>
            {form.offers.length > 1 && (
              <button
                type="button"
                onClick={() => removeOffer(idx)}
                className="absolute top-2 right-2 text-red-500 font-bold hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addOffer}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Add Offer
        </button>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Phone"}
      </button>
    </form>
  );
}
