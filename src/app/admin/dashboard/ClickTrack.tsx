"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Click = {
  _id: string;
  phoneName: string;
  merchant: string;
  count: number;
  url: string;
};

export default function ClickAnalytics() {
  const [clicks, setClicks] = useState<Click[]>([]);

  useEffect(() => {
    const fetchClicks = async () => {
      try {
        const res = await fetch("/api/trackClick");
        if (!res.ok) throw new Error("Failed to fetch");
        setClicks(await res.json());
      } catch (err) {
        console.error(err);
      }
    };

    fetchClicks();
    const interval = setInterval(fetchClicks, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Analytics Calculations ---
  const totalClicks = clicks.reduce((sum, c) => sum + c.count, 0);
  const uniquePhones = new Set(clicks.map((c) => c.phoneName)).size;
  const uniqueMerchants = new Set(clicks.map((c) => c.merchant)).size;
  const topPhone = clicks.reduce(
    (prev, curr) => (curr.count > prev.count ? curr : prev),
    clicks[0] || { phoneName: "N/A" }
  );

  // Data for charts
  const phoneData = clicks.map((c) => ({ name: c.phoneName, clicks: c.count }));
  const merchantData = Array.from(
    clicks.reduce((map, c) => {
      map.set(c.merchant, (map.get(c.merchant) || 0) + c.count);
      return map;
    }, new Map<string, number>()),
    ([merchant, clicks]) => ({ name: merchant, value: clicks })
  );

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <CardContent>
            <p>Total Clicks</p>
            <h2 className="text-2xl font-bold">{totalClicks}</h2>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent>
            <p>Unique Phones</p>
            <h2 className="text-2xl font-bold">{uniquePhones}</h2>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent>
            <p>Unique Merchants</p>
            <h2 className="text-2xl font-bold">{uniqueMerchants}</h2>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent>
            <p>Top Phone</p>
            <h2 className="text-xl font-bold">{topPhone.phoneName}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart: Clicks per Phone */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Clicks per Phone</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={phoneData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart: Clicks per Merchant */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Clicks per Merchant</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={merchantData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {merchantData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
