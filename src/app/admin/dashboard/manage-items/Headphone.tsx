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

interface Headphone {
  _id: string;
  name: string;
  image: string;
  type: string; // e.g., Over-ear, In-ear
  connectivity: string; // e.g., Bluetooth, Wired
  batteryLife?: string; // optional
  offers: Offer[];
}

interface HeadphoneForm extends Omit<Headphone, "_id"> {
  imageBase64?: string;
  imagePreview?: string;
}

type SortOption = "priceLow" | "rating";

export default function Headphones() {
  const [sortBy, setSortBy] = useState<SortOption>("priceLow");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Headphone[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingItem, setEditingItem] = useState<Headphone | null>(null);
  const [formData, setFormData] = useState<HeadphoneForm>({
    name: "",
    image: "",
    type: "",
    connectivity: "",
    batteryLife: "",
    offers: [],
  });

  // Fetch headphones
  useEffect(() => {
    const fetchHeadphones = async () => {
      try {
        const { data } = await axios.get<Headphone[]>("/api/headphone");
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch headphones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeadphones();
  }, []);

  // Delete handler
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This headphone will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("/api/headphone", { data: { _id: id } });
          setItems((prev) => prev.filter((h) => h._id !== id));
          Swal.fire("Deleted!", "The headphone has been removed.", "success");
        } catch (err) {
          console.error("Failed to delete headphone:", err);
          Swal.fire("Error", "Failed to delete headphone", "error");
        }
      }
    });
  };

  // Edit handlers
  const handleEdit = (item: Headphone) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleOfferChange = <K extends keyof Offer>(
    index: number,
    field: K,
    value: Offer[K] | string
  ) => {
    const newOffers = [...formData.offers];
    newOffers[index][field] =
      field === "price" || field === "rating" || field === "reviews"
        ? (Number(value) as Offer[K])
        : (value as Offer[K]);
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
    if (!editingItem) return;

    try {
      const { data } = await axios.put("/api/headphone", {
        _id: editingItem._id,
        ...formData,
      });
      setItems((prev) =>
        prev.map((h) => (h._id === editingItem._id ? data : h))
      );
      Swal.fire("Success", "Headphone updated successfully", "success");
      setEditingItem(null);
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", "Failed to update headphone", "error");
    }
  };

  // Filter + sort
  const filteredAndSortedItems = useMemo(() => {
    return (items || [])
      .filter((h) =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
      .map((h) => ({
        ...h,
        minPrice: h.offers.length
          ? Math.min(...h.offers.map((o) => o.price))
          : 0,
        maxRating: h.offers.length
          ? Math.max(...h.offers.map((o) => o.rating))
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
        Loading headphones...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8">
        🎧 Manage Headphones
      </h2>

      {/* Search + Sort */}
      <div className="flex justify-center mb-6 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search headphones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-md px-4 py-3 border rounded-lg shadow-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="border px-2 py-2 rounded"
        >
          <option value="priceLow">Price: Low to High</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {filteredAndSortedItems.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">
          No headphones found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedItems.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col justify-between rounded-xl border shadow-md p-4 bg-white dark:bg-gray-900"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="rounded-lg mb-3"
                />
                <h3 className="font-bold text-lg text-center">{item.name}</h3>
                <span className="text-xs text-gray-500">
                  {item.type} • {item.connectivity}{" "}
                  {item.batteryLife ? `• ${item.batteryLife}` : ""}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
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
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg overflow-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">Edit {editingItem.name}</h3>

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
                      imageBase64: reader.result as string,
                      imagePreview: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }}
                className="text-sm"
              />
            </div>

            {/* Headphone Details */}
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
              placeholder="Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Connectivity"
              value={formData.connectivity}
              onChange={(e) =>
                setFormData({ ...formData, connectivity: e.target.value })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Battery Life"
              value={formData.batteryLife}
              onChange={(e) =>
                setFormData({ ...formData, batteryLife: e.target.value })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />

            {/* Offers */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Offers</h4>
              {formData.offers.map((offer, idx) => (
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
