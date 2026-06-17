"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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
const [quoteUnlocked, setQuoteUnlocked] = useState(false)
  const { data: session } = useSession()
const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", eventDate: "" })
  useEffect(() => {


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
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Cake Pricing Summary", 20, 20);

  doc.setFontSize(12);
  doc.text(`Cake Size: ${cakeDetails.size}`, 20, 40);
  doc.text(`Flavor: ${cakeDetails.flavor}`, 20, 50);
  doc.text(`Layers: ${cakeDetails.layers}`, 20, 60);
  doc.text(`Quantity: ${cakeDetails.quantity}`, 20, 70);
  doc.text(`Ingredient Total: NGN ${ingredientTotal.toLocaleString()}`, 20, 90);
  doc.text(`Business Costs: NGN ${businessTotal.toLocaleString()}`, 20, 100);
  doc.text(`Decoration Costs: NGN ${decorationTotal.toLocaleString()}`, 20, 110);
  doc.text(`Production Cost: NGN ${totalCost.toLocaleString()}`, 20, 120);
  doc.text(`Expected Profit: NGN ${expectedProfit.toLocaleString()}`, 20, 130);
  doc.text(`Selling Price: NGN ${sellingPrice.toLocaleString()}`, 20, 150);

  doc.save(`cake-summary-${Date.now()}.pdf`);
};

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

const handleQuotePayment = () => {
  const handler = (window as any).PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: session?.user?.email || "baker@cakeapp.com",
    amount: 500 * 100,
    currency: "NGN",
    callback: function (response: any) {
        localStorage.setItem("paystack_reference", response.reference)
      setQuoteUnlocked(true)
      
      alert("Payment successful!")
    },
    onClose: function () {
      alert("Payment cancelled")
    },
  })

  handler.openIframe()
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
            value={ingredients.flour === 0 ? "" : ingredients.flour}
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setIngredients({
                ...ingredients,
                flour: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Sugar Cost"
            value={ingredients.sugar === 0 ? "" : ingredients.sugar}
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setIngredients({
                ...ingredients,
                sugar: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Butter Cost"
            value={ingredients.butter === 0 ? "" : ingredients.butter}
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setIngredients({
                ...ingredients,
                butter: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Eggs Cost"
            value={ingredients.eggs === 0 ? "" : ingredients.eggs}
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setIngredients({
                ...ingredients,
                eggs: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Transport Cost"
            value={businessCosts.transport || ""}
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setBusinessCosts({
                ...businessCosts,
                transport: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Labor Cost"
            value={businessCosts.labor || ""}
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setBusinessCosts({
                ...businessCosts,
                labor: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Electricity/Gas"
            value={businessCosts.electricity || ""}
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setBusinessCosts({
                ...businessCosts,
                electricity: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Fondant Cost"
            value={decorations.fondant || ""}
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setDecorations({
                ...decorations,
                fondant: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Cake Topper Cost"
            value={decorations.toppers || ""}
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setDecorations({
                ...decorations,
                toppers: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Flowers Decoration Cost"
            value={decorations.flowers || ""}
            className="w-full border p-3 rounded-lg"
            onChange={(e) =>
              setDecorations({
                ...decorations,
                flowers: e.target.value === "" ? 0 : Number(e.target.value),
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
            type="button"
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:opacity-90"
            onClick={(e) => {
              e.preventDefault()
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
              type="button"
              className="w-full bg-white text-[#5c3d2e] font-bold p-3 rounded-lg"
              onClick={downloadSummary}
            >
              Download Summary
              </button>

<div className="mt-6 border-t pt-6">
  <h3 className="text-xl font-bold mb-3">Customer Quote Generator</h3>

  {!quoteUnlocked ? (
    <button onClick={handleQuotePayment} className="w-full bg-blue-600 text-white p-3 rounded-lg">
      Generate Quote (₦500 - 24hr Access)
    </button>
  ) : (
    <div className="space-y-3">
      <input className="w-full border p-2 rounded" placeholder="Customer Name" onChange={(e)=>setCustomerInfo({...customerInfo,name:e.target.value})}/>
      <input className="w-full border p-2 rounded" placeholder="Phone" onChange={(e)=>setCustomerInfo({...customerInfo,phone:e.target.value})}/>
      <input type="date" className="w-full border p-2 rounded" onChange={(e)=>setCustomerInfo({...customerInfo,eventDate:e.target.value})}/>

      <button className="w-full bg-green-600 text-white p-3 rounded-lg"
        onClick={() => {
          const message = `Hello ${customerInfo.name || "Customer"},\n\nCake: ${cakeDetails.size} / ${cakeDetails.flavor}\nLayers: ${cakeDetails.layers}\nQuantity: ${cakeDetails.quantity}\n\nTotal: ₦${sellingPrice.toLocaleString()}`

          const url = `https://wa.me/${customerInfo.phone}?text=${encodeURIComponent(message)}`
          window.open(url, "_blank")
        }}
      >Send WhatsApp Quote</button>
    </div>
  )}
</div>

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
