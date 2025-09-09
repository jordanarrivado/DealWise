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

interface Phone {
  _id: string;
  name: string;
  image: string;
  chipset: string;
  gamingScore: number;
  antutu: number;
  camera: string;
  battery: string;
  display: string;
  offers: Offer[];
}

interface PhoneWithMinMax extends Phone {
  minPrice: number;
  maxRating: number;
}

interface FormData extends Omit<Phone, "_id"> {
  imageBase64?: string | ArrayBuffer | null;
  imagePreview?: string | ArrayBuffer | null;
}

type SortOption = "priceLow" | "rating";

export default function Phones() {
  const [sortBy, setSortBy] = useState<SortOption>("priceLow");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingPhone, setEditingPhone] = useState<Phone | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    image: "",
    chipset: "",
    gamingScore: 0,
    antutu: 0,
    camera: "",
    battery: "",
    display: "",
    offers: [],
  });

  // Fetch phones
  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const { data } = await axios.get<Phone[]>("/api/phones");
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch phones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhones();
  }, []);

  // Delete handler
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This phone will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/phones?id=${id}`);
          setItems((prev) => prev.filter((p) => p._id !== id));
          Swal.fire("Deleted!", "The phone has been removed.", "success");
        } catch (err) {
          console.error("Failed to delete phone:", err);
          Swal.fire("Error", "Failed to delete phone", "error");
        }
      }
    });
  };

  // Edit handlers
  const handleEdit = (phone: Phone) => {
    setEditingPhone(phone);
    setFormData({ ...phone });
  };

  const handleOfferChange = <K extends keyof Offer>(
    index: number,
    field: K,
    value: string | number
  ) => {
    const newOffers = [...formData.offers];
    (newOffers[index][field] as Offer[K]) =
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
    if (!editingPhone) return;

    try {
      const { data } = await axios.put("/api/phones", {
        id: editingPhone._id,
        ...formData,
      });
      setItems((prev) =>
        prev.map((p) => (p._id === editingPhone._id ? data : p))
      );
      Swal.fire("Success", "Phone updated successfully", "success");
      setEditingPhone(null);
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", "Failed to update phone", "error");
    }
  };

  // Filter + sort
  const filteredAndSortedPhones = useMemo((): PhoneWithMinMax[] => {
    return (items || [])
      .filter((phone) =>
        phone.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
      .map(
        (phone): PhoneWithMinMax => ({
          ...phone,
          minPrice: phone.offers.length
            ? Math.min(...phone.offers.map((o) => o.price))
            : 0,
          maxRating: phone.offers.length
            ? Math.max(...phone.offers.map((o) => o.rating))
            : 0,
        })
      )
      .sort((a, b) => {
        if (sortBy === "priceLow") return a.minPrice - b.minPrice;
        if (sortBy === "rating") return b.maxRating - a.maxRating;
        return 0;
      });
  }, [items, searchQuery, sortBy]);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">Loading phones...</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8">
        📱 Manage Phones
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search phones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-md px-4 py-3 border rounded-lg shadow-sm"
        />
      </div>

      {filteredAndSortedPhones.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">No phones found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPhones.map((phone) => (
            <motion.div
              key={phone._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col justify-between rounded-xl border shadow-md p-4 bg-white dark:bg-gray-900"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={phone.image || "/placeholder.png"}
                  alt={phone.name}
                  width={120}
                  height={120}
                  className="rounded-lg mb-3"
                />
                <h3 className="font-bold text-lg text-center">{phone.name}</h3>
                <span className="text-xs text-gray-500">{phone.chipset}</span>
              </div>

              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {phone.offers.length} offers • Min ₱
                {phone.minPrice?.toLocaleString()}
              </div>

              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(phone)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(phone._id)}
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
      {editingPhone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg overflow-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">Edit {editingPhone.name}</h3>

            {/* Image Preview & Upload */}
            <div className="flex flex-col items-center mb-4">
              <img
                src={
                  (typeof formData.imagePreview === "string"
                    ? formData.imagePreview
                    : null) ||
                  formData.image ||
                  "/placeholder.png"
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

            {/* Phone Details */}
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
              type="number"
              placeholder="Gaming Score"
              value={formData.gamingScore}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gamingScore: Number(e.target.value),
                })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Antutu"
              value={formData.antutu}
              onChange={(e) =>
                setFormData({ ...formData, antutu: Number(e.target.value) })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Camera"
              value={formData.camera}
              onChange={(e) =>
                setFormData({ ...formData, camera: e.target.value })
              }
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Battery"
              value={formData.battery}
              onChange={(e) =>
                setFormData({ ...formData, battery: e.target.value })
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
              type="text"
              placeholder="Chipset"
              value={formData.chipset}
              onChange={(e) =>
                setFormData({ ...formData, chipset: e.target.value })
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
                onClick={() => setEditingPhone(null)}
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
