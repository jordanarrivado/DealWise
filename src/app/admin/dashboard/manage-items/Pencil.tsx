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

interface Pencil {
  _id: string;
  title: string;
  hardness: string;
  material: string;
  shape: string;
  color: string;
  erasable: boolean;
  image?: string;
  offers: Offer[];
}

type SortOption = "priceLow" | "rating";

export default function Pencils() {
  const [items, setItems] = useState<Pencil[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("priceLow");

  // Form types
  type PencilForm = Omit<Pencil, "_id"> & {
    offers: Offer[];
    imageBase64?: string;
  };
  const [editingItem, setEditingItem] = useState<Pencil | null>(null);
  const [formData, setFormData] = useState<PencilForm | null>(null);

  // Fetch Pencils
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<Pencil[]>("/api/pencils");
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch pencils:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This pencil will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/pencils?id=${id}`);
        setItems((prev) => prev.filter((p) => p._id !== id));
        Swal.fire("Deleted!", "Pencil removed.", "success");
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "Failed to delete pencil", "error");
      }
    }
  };

  // Edit
  const handleEdit = (item: Pencil) => {
    setEditingItem(item);
    const { _id, ...rest } = item;
    setFormData(rest); // remove _id for the form
  };

  const handleUpdate = async () => {
    if (!editingItem || !formData) return;
    try {
      const { data } = await axios.put("/api/pencils", {
        id: editingItem._id,
        ...formData,
      });
      setItems((prev) =>
        prev.map((p) => (p._id === editingItem._id ? data : p))
      );
      Swal.fire("Success", "Pencil updated successfully", "success");
      setEditingItem(null);
      setFormData(null);
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", "Failed to update pencil", "error");
    }
  };

  // Offers
  const handleOfferChange = (
    index: number,
    field: keyof Offer,
    value: string | number
  ) => {
    if (!formData) return;
    const newOffers = [...formData.offers];
    if (field === "price" || field === "rating" || field === "reviews") {
      newOffers[index][field] = Number(value);
    } else {
      newOffers[index][field] = String(value);
    }
    setFormData({ ...formData, offers: newOffers });
  };

  const addOffer = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      offers: [
        ...formData.offers,
        { merchant: "", price: 0, url: "", rating: 0, reviews: 0 },
      ],
    });
  };

  const removeOffer = (index: number) => {
    if (!formData) return;
    const newOffers = [...formData.offers];
    newOffers.splice(index, 1);
    setFormData({ ...formData, offers: newOffers });
  };

  // Filter + Sort
  const filtered = useMemo(() => {
    return items
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
      <div className="text-center mt-10 text-gray-500">Loading pencils...</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Manage Pencils
      </h2>

      {/* Search + Sort */}
      <div className="flex justify-center mb-6 gap-2">
        <input
          type="text"
          placeholder="Search pencils..."
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

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">No pencils found.</div>
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
                  {item.hardness} • {item.material} • {item.shape} •{" "}
                  {item.color} • {item.erasable ? "Erasable" : "Non-erasable"}
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
      {editingItem && formData && (
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
                      imageBase64: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </div>

            {/* Fields */}
            {(["title", "hardness", "material", "shape", "color"] as const).map(
              (key) => (
                <input
                  key={key}
                  type="text"
                  value={formData[key]}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="w-full mb-2 border px-3 py-2 rounded"
                />
              )
            )}

            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={formData.erasable}
                onChange={(e) =>
                  setFormData({ ...formData, erasable: e.target.checked })
                }
              />
              Erasable
            </label>

            {/* Offers */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Offers</h4>
              {formData.offers.map((offer, idx) => (
                <div key={idx} className="mb-2 border p-2 rounded">
                  {(
                    ["merchant", "price", "url", "rating", "reviews"] as const
                  ).map((key) => (
                    <input
                      key={key}
                      type={
                        key === "price" || key === "rating" || key === "reviews"
                          ? "number"
                          : "text"
                      }
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={offer[key]}
                      onChange={(e) =>
                        handleOfferChange(
                          idx,
                          key,
                          key === "price" ||
                            key === "rating" ||
                            key === "reviews"
                            ? Number(e.target.value)
                            : e.target.value
                        )
                      }
                      className="w-full mb-1 border px-2 py-1 rounded"
                    />
                  ))}
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
                onClick={() => {
                  setEditingItem(null);
                  setFormData(null);
                }}
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
