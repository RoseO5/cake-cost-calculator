"use client"

import { useState } from "react"

export default function CakeCalculator() {
  const [cakeDetails, setCakeDetails] = useState({
    size: "6 Inches",
    flavor: "Vanilla",
    layers: 1,
    quantity: 1,
  })

  const [ingredients, setIngredients] = useState({
    flour: 0,
    sugar: 0,
    butter: 0,
    eggs: 0,
  })

  const [businessCosts, setBusinessCosts] = useState({
    transport: 0,
    labor: 0,
    electricity: 0,
  })

  const [decorations, setDecorations] = useState({
    fondant: 0,
    toppers: 0,
    flowers: 0,
  })

  const [profitPercentage, setProfitPercentage] = useState(20)

  const ingredientTotal =
    Number(ingredients.flour) +
    Number(ingredients.sugar) +
    Number(ingredients.butter) +
    Number(ingredients.eggs)

  const businessTotal =
    Number(businessCosts.transport) +
    Number(businessCosts.labor) +
    Number(businessCosts.electricity)

  const decorationTotal =
    Number(decorations.fondant) +
    Number(decorations.toppers) +
    Number(decorations.flowers)

  const totalCost =
    (
      ingredientTotal +
      businessTotal +
      decorationTotal
    ) * cakeDetails.quantity

  const expectedProfit =
    (profitPercentage / 100) * totalCost

  const sellingPrice =
    totalCost + expectedProfit

  const downloadSummary = async () => {
  try {
    const element = document.getElementById("summary")

    if (!element) {
      alert("Summary not found")
      return
    }

    const html2pdfModule = await import("html2pdf.js")
    const html2pdf = html2pdfModule.default ?? html2pdfModule

    html2pdf()
      .set({
        margin: 0.5,
        filename: "cake-summary.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save()
  } catch (err) {
    console.error("PDF error:", err)
    alert("PDF generation failed")
  }
}

  const saveCalculation = async () => {
    try {
      const response = await fetch("/api/save-calculation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cakeDetails,
          ingredients,
          businessCosts,
          decorations,
          totalCost,
          expectedProfit,
          sellingPrice,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Calculation saved successfully!")
      } else {
        alert("Failed to save calculation")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-10">

      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="text-2xl font-bold mb-4">
          Cake Costs
        </h2>

        <div className="space-y-4">

          <select
            className="w-full border p-3 rounded-lg"
            value={cakeDetails.size}
            onChange={(e) =>
              setCakeDetails({
                ...cakeDetails,
                size: e.target.value,
              })
            }
          >
            <option>6 Inches</option>
            <option>8 Inches</option>
            <option>10 Inches</option>
            <option>12 Inches</option>
            <option>2 Tier Cake</option>
            <option>3 Tier Cake</option>
          </select>

          <select
            className="w-full border p-3 rounded-lg"
            value={cakeDetails.flavor}
            onChange={(e) =>
              setCakeDetails({
                ...cakeDetails,
                flavor: e.target.value,
              })
            }
          >
            <option>Vanilla</option>
            <option>Chocolate</option>
            <option>Red Velvet</option>
            <option>Fruit Cake</option>
          </select>

          <select
            className="w-full border p-3 rounded-lg"
            value={cakeDetails.layers}
            onChange={(e) =>
              setCakeDetails({
                ...cakeDetails,
                layers: Number(e.target.value),
              })
            }
          >
            <option value={1}>1 Layer</option>
            <option value={2}>2 Layers</option>
            <option value={3}>3 Layers</option>
            <option value={4}>4 Layers</option>
          </select>

          <input
            type="number"
            placeholder="Quantity"
            className="w-full border p-3 rounded-lg"
            value={cakeDetails.quantity}
            min={1}
            onChange={(e) =>
              setCakeDetails({
                ...cakeDetails,
                quantity: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Flour Cost"
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setIngredients({
                ...ingredients,
                flour: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Sugar Cost"
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setIngredients({
                ...ingredients,
                sugar: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Butter Cost"
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setIngredients({
                ...ingredients,
                butter: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Eggs Cost"
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setIngredients({
                ...ingredients,
                eggs: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Transport Cost"
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setBusinessCosts({
                ...businessCosts,
                transport: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Labor Cost"
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setBusinessCosts({
                ...businessCosts,
                labor: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Electricity/Gas"
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setBusinessCosts({
                ...businessCosts,
                electricity: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Fondant Cost"
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setDecorations({
                ...decorations,
                fondant: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Cake Topper Cost"
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setDecorations({
                ...decorations,
                toppers: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Flowers Decoration Cost"
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setDecorations({
                ...decorations,
                flowers: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Profit %"
            className="w-full border p-3 rounded-lg"
            value={profitPercentage}
            onChange={(e) =>
              setProfitPercentage(Number(e.target.value))
            }
          />

          <button
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:opacity-90"
            onClick={() => {
              setIngredients({
                flour: 0,
                sugar: 0,
                butter: 0,
                eggs: 0,
              })

              setBusinessCosts({
                transport: 0,
                labor: 0,
                electricity: 0,
              })

              setDecorations({
                fondant: 0,
                toppers: 0,
                flowers: 0,
              })

              setProfitPercentage(20)

              setCakeDetails({
                size: "6 Inches",
                flavor: "Vanilla",
                layers: 1,
                quantity: 1,
              })
            }}
          >
            Reset Calculator
          </button>

        </div>
      </div>

      <div
        id="summary"
        className="bg-[#5c3d2e] text-white p-6 rounded-2xl shadow"
      >

        <h2 className="text-2xl font-bold mb-6">
          Pricing Summary
        </h2>

        <div className="space-y-4 text-lg">

          <p>
            Cake Size: {cakeDetails.size}
          </p>

          <p>
            Flavor: {cakeDetails.flavor}
          </p>

          <p>
            Layers: {cakeDetails.layers}
          </p>

          <p>
            Quantity: {cakeDetails.quantity}
          </p>

          <p>
            Ingredient Total: ₦
            {ingredientTotal.toLocaleString()}
          </p>

          <p>
            Business Costs: ₦
            {businessTotal.toLocaleString()}
          </p>

          <p>
            Decoration Costs: ₦
            {decorationTotal.toLocaleString()}
          </p>

          <p>
            Production Cost: ₦
            {totalCost.toLocaleString()}
          </p>

          <p>
            Expected Profit: ₦
            {expectedProfit.toLocaleString()}
          </p>

          <p className="text-2xl font-bold">
            Selling Price: ₦
            {sellingPrice.toLocaleString()}
          </p>

          <div className="space-y-3">

            <button
              className="w-full bg-white text-[#5c3d2e] font-bold p-3 rounded-lg"
              onClick={async () => { alert("Function started"); await downloadSummary(); }}
            >
              Download Summary
            </button>

            <button
              className="w-full bg-green-500 text-white font-bold p-3 rounded-lg"
              onClick={saveCalculation}
            >
              Save Calculation
            </button>

          </div>

        </div>
      </div>

    </div>
  )
}
