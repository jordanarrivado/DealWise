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
  FaMobile,
  FaLaptop,
  FaBook,
  FaPencilAlt,
  FaHeadphones,
} from "react-icons/fa";
import { useProductCounts } from "../../hooks/useProductCounts";
import PhoneForm from "../add-product/PhoneForm";
import AddPhone from "../add-phone/AddPhone";
import AddSketchbook from "../add-sketchpad/SketchpadForm";
import PencilForm from "../add-pencil/PencilForm";
import Items from "./manage-items/Items";
import ClickTrack from "./ClickTrack";
import LaptopForm from "../add-laptop/LaptopForm";
import HeadphoneForm from "../add-headphone/HeadphoneForm";

// ---- New types ----
interface ChartData {
  merchant: string;
  count: number;
}

type ClickData = { merchant: string; count: number };

// ---- Sidebar links config ----
const sidebarLinks = [
  { id: "dashboard", label: "Dashboard", icon: <FaBox /> },
  { id: "products", label: "Products", icon: <FaBox /> },
  { id: "addItems", label: "Add Items", icon: <FaPlus /> },
  { id: "clickTrack", label: "Click Tracking", icon: <FaClipboardList /> },
  { id: "settings", label: "Settings", icon: <FaCog /> },
];

// ---- Add Items Sub-tabs ----
const addTabs = [
  {
    id: "phoneForm",
    label: "Normal Product",
    icon: <FaBox />,
    component: <PhoneForm />,
  },
  {
    id: "addPhone",
    label: "Add Phone",
    icon: <FaMobile />,
    component: <AddPhone />,
  },
  {
    id: "addLaptop",
    label: "Add Laptop",
    icon: <FaLaptop />,
    component: <LaptopForm />,
  },
  {
    id: "addSketchbook",
    label: "Add Sketchbook",
    icon: <FaBook />,
    component: <AddSketchbook />,
  },
  {
    id: "addPencil",
    label: "Add Pencil",
    icon: <FaPencilAlt />,
    component: <PencilForm />,
  },
  {
    id: "addHeadphone",
    label: "Add Headphone",
    icon: <FaHeadphones />,
    component: <HeadphoneForm />,
  },
];

// ---- User Dropdown ----
function UserDropdown({
  session,
  onLogout,
}: {
  session: any;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        <FaBell className="text-gray-600 dark:text-gray-300" />
        <div className="w-9 h-9 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white font-bold">
          {session?.user?.email?.[0]?.toUpperCase() || "A"}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-600">
            {session?.user?.email || "No Email"}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 rounded-b"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

// ---- Main Dashboard ----
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "addItems" | "clickTrack" | "settings" | "orders"
  >("dashboard");
  const [activeAddTab, setActiveAddTab] = useState("phoneForm");

  const [chartData, setChartData] = useState<ChartData[]>([]);
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
      icon: <FaMobile />,
    },
    {
      title: "Headphones Only",
      value: loading ? "..." : counts.headphones,
      icon: <FaHeadphones />,
    },
    {
      title: "Sketchbook Only",
      value: loading ? "..." : counts.sketchPad,
      icon: <FaBook />,
    },
    {
      title: "Pencil Only",
      value: loading ? "..." : counts.pencil,
      icon: <FaPencilAlt />,
    },
    { title: "Total Orders", value: 87, icon: <FaClipboardList /> },
    { title: "Revenue", value: "₱250,000", icon: <FaBox /> },
  ];

  useEffect(() => {
    const fetchClicks = async () => {
      try {
        const res = await fetch("/api/trackClick");
        const data: ClickData[] = await res.json();

        if (Array.isArray(data)) {
          const grouped = data.reduce<Record<string, number>>(
            (acc, { merchant, count }) => {
              acc[merchant] = (acc[merchant] || 0) + count;
              return acc;
            },
            {}
          );

          setChartData(
            Object.entries(grouped).map(([merchant, count]) => ({
              merchant,
              count,
            }))
          );
        }
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
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id as typeof activeTab)}
              className={`flex items-center gap-3 px-4 py-2 rounded ${
                activeTab === link.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {link.icon} {link.label}
            </button>
          ))}
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

          <UserDropdown
            session={session}
            onLogout={() => signOut({ callbackUrl: "/" })}
          />
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {/* ---- Dashboard ---- */}
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

              {/* Chart with Recharts */}
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

          {/* ---- Add Items (with sub-tabs) ---- */}
          {activeTab === "addItems" && (
            <div className="max-w-4xl mx-auto">
              {/* Sub-tab navigation */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {addTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAddTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      activeAddTab === tab.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Active form */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                {addTabs.find((tab) => tab.id === activeAddTab)?.component}
              </div>
            </div>
          )}

          {/* ---- Products ---- */}
          {activeTab === "products" && <Items />}

          {/* ---- Click Tracking ---- */}
          {activeTab === "clickTrack" && <ClickTrack />}

          {/* ---- Orders ---- */}
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
