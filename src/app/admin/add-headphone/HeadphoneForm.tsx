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

const defaultMerchants = ["TikTok", "Shopee", "Lazada", "Amazon", "eBay"];

export default function HeadphoneForm() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    connectivity: "",
    frequencyResponse: "",
    overallScore: "",
    impedance: "",
    imageBase64: "",
    offers: [
      { merchant: "", url: "", priceStr: "", ratingStr: "", reviewsStr: "" },
    ],
  });

  const [nameExists, setNameExists] = useState(false);
  const [checkingName, setCheckingName] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

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

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm({ ...form, imageBase64: reader.result as string });
    reader.readAsDataURL(file);
  };

  // Check if headphone name exists
  useEffect(() => {
    const normalized = form.name.trim();
    if (!normalized) return setNameExists(false);

    const timeout = setTimeout(async () => {
      setCheckingName(true);
      try {
        const { data } = await axios.get(
          `/api/headphone/checkName?name=${encodeURIComponent(normalized)}`
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim())
      return Swal.fire("Error", "Headphone name is required", "error");
    if (nameExists)
      return Swal.fire("Error", "Headphone name already exists!", "error");
    if (!form.imageBase64)
      return Swal.fire("Error", "Headphone image is required", "error");

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

      const payload = { ...form, offers: formattedOffers };

      const res = await fetch("/api/headphone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      Swal.fire("Success", "Headphone added successfully!", "success");

      setForm({
        name: "",
        type: "",
        connectivity: "",
        frequencyResponse: "",
        overallScore: "",
        impedance: "",
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
    } catch (err: unknown) {
      if (err instanceof Error) Swal.fire("Error", err.message, "error");
      else Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = async () => {
    if (!form.name.trim())
      return Swal.fire("Error", "Enter a headphone name first", "error");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/fill-headphone", {
        headphoneName: form.name,
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
    <form className="max-w-3xl mx-auto p-4 space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center">Add New Headphone</h2>

      <input
        type="text"
        name="name"
        placeholder="Headphone Name"
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
          <span className="text-red-600">⚠️ Name already exists!</span>
        )}
        {!checkingName && form.name.trim() && !nameExists && (
          <span className="text-green-600">✅ Name is available</span>
        )}
      </div>

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
        name="type"
        placeholder="Type (Over-ear, In-ear, etc.)"
        value={form.type}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        name="connectivity"
        placeholder="Connectivity (Wired/Wireless)"
        value={form.connectivity}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        name="frequencyResponse"
        placeholder="Frequency Response"
        value={form.frequencyResponse}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="text"
        name="overallScore"
        placeholder="overallScore"
        value={form.overallScore}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="text"
        name="impedance"
        placeholder="Impedance"
        value={form.impedance}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
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
        {loading ? "Submitting..." : "Submit Headphone"}
      </button>
    </form>
  );
}
