"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import axios from "axios";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/fetch-product", { url: query });
      console.log("Fetched product:", res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 w-full">
      <div className="flex items-center gap-2 bg-white shadow-md rounded-2xl p-2 border focus-within:ring-2 focus-within:ring-purple-400 transition">
        <Input
          placeholder="Paste Shopee, TikTok, or Lazada link..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border-none focus-visible:ring-0 text-lg px-4 py-3"
        />
        <Button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-600 hover:opacity-90 transition flex items-center gap-2 px-6 py-3 text-base font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              Search
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
