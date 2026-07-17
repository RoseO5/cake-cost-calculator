"use client"

import { useState } from "react";
import CakeCalculator from "./CakeCalculator";
import DoughnutCalculator from "./DoughnutCalculator";
import MeatPieCalculator from "./MeatPieCalculator";
import PuffPuffCalculator from "./PuffPuffCalculator";
import ShawarmaCalculator from "./ShawarmaCalculator";

export default function ProductSelector() {
  const [activeTab, setActiveTab] = useState<"cake" | "doughnut" | "meatpie" | "puffpuff" | "shawarma">("cake");

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex space-x-2 mb-6 bg-gray-100 p-2 rounded-xl w-fit mx-auto">
        <button
          onClick={() => setActiveTab("cake")}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "cake" ? "bg-[#5c3d2e] text-white shadow-lg" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          🎂 Cake Calculator
        </button>
                <button
          onClick={() => setActiveTab("doughnut")}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "doughnut" ? "bg-[#5c3d2e] text-white shadow-lg" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          🍩 Doughnut Calculator
        </button>
                <button
          onClick={() => setActiveTab("meatpie")}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "meatpie" ? "bg-[#5c3d2e] text-white shadow-lg" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          🥟 Meat Pie Calculator
        </button>
        <button
          onClick={() => setActiveTab("puffpuff")}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "puffpuff" ? "bg-[#5c3d2e] text-white shadow-lg" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          🍘 Puff Puff Calculator
        </button>
        <button
          onClick={() => setActiveTab("shawarma")}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "shawarma" ? "bg-[#5c3d2e] text-white shadow-lg" : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          🌯 Shawarma Calculator
        </button>
      </div>

      {activeTab === "cake" ? <CakeCalculator /> : activeTab === "doughnut" ? <DoughnutCalculator /> : activeTab === "meatpie" ? <MeatPieCalculator /> : activeTab === "puffpuff" ? <PuffPuffCalculator /> : <ShawarmaCalculator />}
    </div>
  );
}