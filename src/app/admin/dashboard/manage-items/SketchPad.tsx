"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import Image from "next/image";

interface Offer {
  merchant: string;
  price: number;
  url: string;
  rating: number;
  reviews: number;
}

interface SketchPad {
  _id: string;
  title: string;
  size: string;
  pageCount: number;
  paperGSM: number;
  binding: string;
  type: string;
  image?: string;
  offers: Offer[];
}

type SortOption = "priceLow" | "rating";

export default function SketchPads() {
  const [items, setItems] = useState<SketchPad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("priceLow");

  // Edit state
  const [editingItem, setEditingItem] = useState<SketchPad | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Fetch SketchPads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<SketchPad[]>("/api/sketchpad");
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch sketchpads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Delete
  const handleDelete = async (id: string) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "This sketchpad will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/sketchpad?id=${id}`);
          setItems((prev) => prev.filter((p) => p._id !== id));
          Swal.fire("Deleted!", "Sketchpad removed.", "success");
        } catch (err) {
          console.error("Failed to delete:", err);
          Swal.fire("Error", "Failed to delete sketchpad", "error");
        }
      }
    });
  };

  // Edit
  const handleEdit = (item: SketchPad) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      const { data } = await axios.put("/api/sketchpad", {
        id: editingItem._id,
        ...formData,
      });
      setItems((prev) =>
        prev.map((p) => (p._id === editingItem._id ? data : p))
      );
      Swal.fire("Success", "Sketchpad updated successfully", "success");
      setEditingItem(null);
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", "Failed to update sketchpad", "error");
    }
  };

  // Offers
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

  // Filter + Sort
  const filtered = useMemo(() => {
    return (items || [])
      .filter((i) =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
      .map((i) => ({
        ...i,
        minPrice: i.offers.length
          ? Math.min(...i.offers.map((o) => o.price))
          : 0,
        maxRating: i.offers.length
          ? Math.max(...i.offers.map((o) => o.rating))
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
      <div className="text-center mt-10 text-gray-500">
        Loading sketchpads...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Manage SketchPads
      </h2>

      <div className="flex justify-center mb-6 gap-2">
        <input
          type="text"
          placeholder="Search sketchpads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-md px-4 py-3 border rounded-lg shadow-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-4 py-3 border rounded-lg"
        >
          <option value="priceLow">Price (Lowest)</option>
          <option value="rating">Rating (Highest)</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">
          No sketchpads found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col justify-between rounded-xl border shadow-md p-4 bg-white"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  width={120}
                  height={120}
                  className="rounded-lg mb-3"
                />
                <h3 className="font-bold text-lg text-center">{item.title}</h3>
                <span className="text-xs text-gray-500">
                  {item.size} • {item.binding}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                {item.offers.length} offers • Min ₱
                {item.minPrice?.toLocaleString()}
              </div>

              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
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
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg overflow-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">Edit {editingItem.title}</h3>

            {/* Image Upload */}
            <div className="flex flex-col items-center mb-4">
              <img
                src={formData.image || "/placeholder.png"}
                alt={formData.title}
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
                    });
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </div>

            {/* Basic fields */}
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Title"
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="number"
              value={formData.pageCount}
              onChange={(e) =>
                setFormData({ ...formData, pageCount: Number(e.target.value) })
              }
              placeholder="Page Count"
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="number"
              value={formData.paperGSM}
              onChange={(e) =>
                setFormData({ ...formData, paperGSM: Number(e.target.value) })
              }
              placeholder="Paper GSM"
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              value={formData.size}
              onChange={(e) =>
                setFormData({ ...formData, size: e.target.value })
              }
              placeholder="Size"
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              value={formData.binding}
              onChange={(e) =>
                setFormData({ ...formData, binding: e.target.value })
              }
              placeholder="Binding"
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              placeholder="Type"
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
                onClick={() => setEditingItem(null)}
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
