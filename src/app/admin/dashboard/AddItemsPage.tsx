import { useState } from "react";
import PhoneForm from "../add-product/PhoneForm";
import AddPhone from "../add-phone/AddPhone";
import LaptopForm from "../add-laptop/LaptopForm";
import AddSketchbook from "../add-sketchpad/SketchpadForm";
import PencilForm from "../add-pencil/PencilForm";
import HeadphoneForm from "../add-headphone/HeadphoneForm"; // <-- import HeadphoneForm
import {
  FaMobile,
  FaLaptop,
  FaBook,
  FaPencilAlt,
  FaBox,
  FaHeadphones,
} from "react-icons/fa"; // <-- icon for headphone

const addTabs = [
  {
    id: "phoneForm",
    label: "Phone Form",
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
    id: "addHeadphone", // <-- new tab id
    label: "Add Headphone", // <-- tab label
    icon: <FaHeadphones />, // <-- tab icon
    component: <HeadphoneForm />, // <-- the headphone form component
  },
];

export default function AddItemsPage() {
  const [activeAddTab, setActiveAddTab] = useState("phoneForm");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab Navigation */}
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

      {/* Active Form */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        {addTabs.find((tab) => tab.id === activeAddTab)?.component}
      </div>
    </div>
  );
}
