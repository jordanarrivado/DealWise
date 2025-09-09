"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";

interface Offer {
  merchant: string;
  price: number;
  url: string;
  rating: number;
  reviews: number;
}

interface Laptop {
  _id: string;
  name: string;
  image: string;
  processor: string;
  ram: string;
  storage: string;
  display: string;
  performanceScore: number;
  offers: Offer[];
}

type SortOption = "priceLow" | "rating";

export default function Laptop() {
  const [sortBy, setSortBy] = useState<SortOption>("priceLow");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingLaptop, setEditingLaptop] = useState<Laptop | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Fetch laptops
  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const { data } = await axios.get<Laptop[]>("/api/laptops");
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch laptops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLaptops();
  }, []);

  // Delete handler
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This laptop will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("/api/laptops", { data: { _id: id } });
          setItems((prev) => prev.filter((l) => l._id !== id));
          Swal.fire("Deleted!", "The laptop has been removed.", "success");
        } catch (err) {
          console.error("Failed to delete laptop:", err);
          Swal.fire("Error", "Failed to delete laptop", "error");
        }
      }
    });
  };

  // Edit handlers
  const handleEdit = (laptop: Laptop) => {
    setEditingLaptop(laptop);
    setFormData({ ...laptop });
  };

  const handleOfferChange = (index: number, field: keyof Offer, value: any) => {
    const newOffers = [...formData.offers];
    newOffers[index][field] =
      field === "price" || field === "rating" || field === "reviews"
        ? Number(value)
        : value;
    setFormData({ ...formData, offers: newOffers });
  };

  const addOffer = () => {
    setFormData({
      ...formData,
      offers: [
        ...(formData.offers || []),
        { merchant: "", price: 0, url: "", rating: 0, reviews: 0 },
      ],
    });
  };

  const removeOffer = (index: number) => {
    const newOffers = [...formData.offers];
    newOffers.splice(index, 1);
    setFormData({ ...formData, offers: newOffers });
  };

  const handleUpdate = async () => {
    if (!editingLaptop) return;

    try {
      const { data } = await axios.put("/api/laptops", {
        _id: editingLaptop._id,
        ...formData,
      });
      setItems((prev) =>
        prev.map((l) => (l._id === editingLaptop._id ? data : l))
      );
      Swal.fire("Success", "Laptop updated successfully", "success");
      setEditingLaptop(null);
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", "Failed to update laptop", "error");
    }
  };

  // Filter + sort
  const filteredAndSortedLaptops = useMemo(() => {
    return (items || [])
      .filter((laptop) =>
        laptop.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
      .map((laptop) => ({
        ...laptop,
        minPrice: laptop.offers.length
          ? Math.min(...laptop.offers.map((o) => o.price))
          : 0,
        maxRating: laptop.offers.length
          ? Math.max(...laptop.offers.map((o) => o.rating))
          : 0,
      }))
      .sort((a, b) => {
        if (sortBy === "priceLow") return a.minPrice - b.minPrice;
        if (sortBy === "rating") return b.maxRating - a.maxRating;
        return 0;
      });
  }, [items, searchQuery, sortBy]);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">Loading laptops...</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8">
        💻 Manage Laptops
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search laptops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-md px-4 py-3 border rounded-lg shadow-sm"
        />
      </div>

      {filteredAndSortedLaptops.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">No laptops found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedLaptops.map((laptop) => (
            <motion.div
              key={laptop._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col justify-between rounded-xl border shadow-md p-4 bg-white dark:bg-gray-900"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={laptop.image || "/placeholder.png"}
                  alt={laptop.name}
                  width={120}
                  height={120}
                  className="rounded-lg mb-3"
                />
                <h3 className="font-bold text-lg text-center">{laptop.name}</h3>
                <span className="text-xs text-gray-500">
                  {laptop.processor} • {laptop.ram} • {laptop.storage}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {laptop.offers.length} offers • Min ₱
                {laptop.minPrice?.toLocaleString()}
              </div>

              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(laptop)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(laptop._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingLaptop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg overflow-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">
              Edit {editingLaptop.name}
            </h3>

            {/* Image Preview & Upload */}
            <div className="flex flex-col items-center mb-4">
              <img
                src={
                  formData.imagePreview || formData.image || "/placeholder.png"
                }
                alt={formData.name}
                className="w-32 h-32 object-cover rounded mb-2 border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () => {
                    setFormData({
                      ...formData,
                      imageBase64: reader.result,
                      imagePreview: reader.result,
                    });
                  };
                  reader.readAsDataURL(file);
                }}
                className="text-sm"
              />
            </div>

            {/* Laptop Details */}
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Processor"
              value={formData.processor}
              onChange={(e) =>
                setFormData({ ...formData, processor: e.target.value })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="RAM"
              value={formData.ram}
              onChange={(e) =>
                setFormData({ ...formData, ram: e.target.value })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Storage"
              value={formData.storage}
              onChange={(e) =>
                setFormData({ ...formData, storage: e.target.value })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Display"
              value={formData.display}
              onChange={(e) =>
                setFormData({ ...formData, display: e.target.value })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Performance Score"
              value={formData.performanceScore}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  performanceScore: Number(e.target.value),
                })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />

            {/* Offers */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Offers</h4>
              {formData.offers?.map((offer: Offer, idx: number) => (
                <div key={idx} className="mb-2 border p-2 rounded">
                  <input
                    type="text"
                    placeholder="Merchant"
                    value={offer.merchant}
                    onChange={(e) =>
                      handleOfferChange(idx, "merchant", e.target.value)
                    }
                    className="w-full mb-1 border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={offer.price}
                    onChange={(e) =>
                      handleOfferChange(idx, "price", e.target.value)
                    }
                    className="w-full mb-1 border px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={offer.url}
                    onChange={(e) =>
                      handleOfferChange(idx, "url", e.target.value)
                    }
                    className="w-full mb-1 border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Rating"
                    value={offer.rating}
                    onChange={(e) =>
                      handleOfferChange(idx, "rating", e.target.value)
                    }
                    className="w-full mb-1 border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Reviews"
                    value={offer.reviews}
                    onChange={(e) =>
                      handleOfferChange(idx, "reviews", e.target.value)
                    }
                    className="w-full mb-1 border px-2 py-1 rounded"
                  />
                  <button
                    onClick={() => removeOffer(idx)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addOffer}
                className="px-4 py-2 bg-green-500 text-white rounded mt-2"
              >
                + Add Offer
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingLaptop(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
