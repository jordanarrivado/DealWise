"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FaBox,
  FaClipboardList,
  FaCog,
  FaBell,
  FaSearch,
  FaPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaLayerGroup,
} from "react-icons/fa";
import { useProductCounts } from "../../hooks/useProductCounts";
import PhoneForm from "../add-product/PhoneForm";
import AddPhone from "../add-phone/AddPhone";
import Items from "./Items";
import ClickTrack from "./ClickTrack";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "phones"
    | "orders"
    | "addProduct"
    | "addRank"
    | "products"
    | "clickTrack"
  >("dashboard");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const { counts, loading } = useProductCounts();
  const { data: session } = useSession();

  const summaryCards = [
    {
      title: "Total Products",
      value: loading ? "..." : counts.total,
      icon: <FaBox />,
    },
    {
      title: "Products Only",
      value: loading ? "..." : counts.products,
      icon: <FaBox />,
    },
    {
      title: "Phones Only",
      value: loading ? "..." : counts.phones,
      icon: <FaBox />,
    },
    { title: "Total Orders", value: 87, icon: <FaClipboardList /> },
    { title: "Revenue", value: "₱250,000", icon: <FaBox /> },
  ];

  useEffect(() => {
    const fetchClicks = async () => {
      try {
        const res = await fetch("/api/trackClick");
        const data = await res.json();
        // group by merchant for chart
        const grouped = data.reduce((acc: any, item: any) => {
          acc[item.merchant] = (acc[item.merchant] || 0) + item.count;
          return acc;
        }, {});
        setChartData(
          Object.entries(grouped).map(([merchant, count]) => ({
            merchant,
            count,
          }))
        );
      } catch (err) {
        console.error("Failed to load chart data:", err);
      }
    };
    fetchClicks();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300
        ${
          sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        } lg:translate-x-0`}
      >
        <div className="p-4 font-bold text-lg text-center border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          DealWise Admin
          <button
            className="lg:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col mt-4 gap-2 h-[calc(100%-4rem)]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-4 py-2 rounded ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FaBox /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-3 px-4 py-2 rounded ${
              activeTab === "products"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FaBox /> Products
          </button>

          <button
            onClick={() => setActiveTab("addRank")}
            className={`flex items-center gap-3 px-4 py-2 rounded ${
              activeTab === "addRank"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FaLayerGroup /> <FaPlus />
            Add Ranking
          </button>

          <button
            onClick={() => setActiveTab("addProduct")}
            className={`flex items-center gap-3 px-4 py-2 rounded ${
              activeTab === "addProduct"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FaPlus /> Add Product
          </button>
          <button
            onClick={() => setActiveTab("clickTrack")}
            className={`flex items-center gap-3 px-4 py-2 rounded ${
              activeTab === "clickTrack"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FaClipboardList /> Click Tracking
          </button>

          <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <FaCog /> Settings
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              <FaBars />
            </button>

            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 w-40 sm:w-64"
              />
              <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
            >
              <FaBell className="text-gray-600 dark:text-gray-300" />
              <div className="w-9 h-9 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white font-bold">
                {session?.user?.email?.[0]?.toUpperCase() || "A"}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-600">
                  {session?.user?.email || "No Email"}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 rounded-b"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {summaryCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                  >
                    <div className="text-3xl text-blue-600">{card.icon}</div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {card.title}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {card.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ Chart with Recharts */}
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow h-80">
                <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-300">
                  Click Analytics
                </h2>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="merchant" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === "addProduct" && (
            <div className="max-w-3xl mx-auto">
              <PhoneForm />
            </div>
          )}

          {activeTab === "addRank" && (
            <div className="max-w-3xl mx-auto">
              <AddPhone />
            </div>
          )}

          {activeTab === "products" && <Items />}

          {activeTab === "clickTrack" && <ClickTrack />}

          {activeTab === "orders" && (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="p-4 text-center text-gray-500 dark:text-gray-300">
                Orders table goes here
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
