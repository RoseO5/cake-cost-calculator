const fs = require('fs');

console.log("🚀 Starting multi-product setup...\n");

// 1. Clean up duplicate useEffects in CakeCalculator.tsx
let cakeCode = fs.readFileSync('components/CakeCalculator.tsx', 'utf8');
const duplicateBlock = `  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;
    fetch("/api/check-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.unlocked) {
          setQuoteUnlocked(true);
        }
      });
  }, [session]);

  useEffect(() => {
    const savedRef = localStorage.getItem("pending_reference");
    if (savedRef) {
      setPendingReference(savedRef);
    }
  }, []);

  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;
    fetch("/api/check-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.unlocked) {
          setQuoteUnlocked(true);
        }
      });
  }, [session]);

  useEffect(() => {
    const savedRef = localStorage.getItem("pending_reference");
    if (savedRef) {
      setPendingReference(savedRef);
    }
  }, []);`;

const cleanBlock = `  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;
    fetch("/api/check-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.unlocked) {
          setQuoteUnlocked(true);
        }
      });
  }, [session]);

  useEffect(() => {
    const savedRef = localStorage.getItem("pending_reference");
    if (savedRef) {
      setPendingReference(savedRef);
    }
  }, []);`;

if (cakeCode.includes(duplicateBlock)) {
  cakeCode = cakeCode.replace(duplicateBlock, cleanBlock);
  fs.writeFileSync('components/CakeCalculator.tsx', cakeCode);
  console.log("✅ Cleaned up duplicate code in CakeCalculator.tsx");
}

// 2. Create DoughnutCalculator.tsx
const doughnutCode = `"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DoughnutCalculator() {
  const [doughnutDetails, setDoughnutDetails] = useState({ size: "Small", flavor: "Plain", quantity: 1 })
  const [ingredients, setIngredients] = useState({ flour: 0, sugar: 0, butter: 0, eggs: 0, yeast: 0, oil: 0, milk: 0 })
  const [businessCosts, setBusinessCosts] = useState({ transport: 0, labor: 0, electricity: 0 })
  const [toppings, setToppings] = useState({ glaze: 0, sprinkles: 0, packaging: 0 })

  const [profitPercentage, setProfitPercentage] = useState(20)
  const [quoteUnlocked, setQuoteUnlocked] = useState(false)
  const [pendingReference, setPendingReference] = useState<string | null>(null);
  const { data: session } = useSession()
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", eventDate: "" })

  const ingredientTotal = Number(ingredients.flour) + Number(ingredients.sugar) + Number(ingredients.butter) + Number(ingredients.eggs) + Number(ingredients.yeast) + Number(ingredients.oil) + Number(ingredients.milk)
  const businessTotal = Number(businessCosts.transport) + Number(businessCosts.labor) + Number(businessCosts.electricity)
  const toppingsTotal = Number(toppings.glaze) + Number(toppings.sprinkles) + Number(toppings.packaging)

  const totalCost = (ingredientTotal + businessTotal + toppingsTotal) * doughnutDetails.quantity
  const expectedProfit = (profitPercentage / 100) * totalCost
  const sellingPrice = totalCost + expectedProfit

  const downloadSummary = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Doughnut Pricing Summary", 20, 20);
    doc.setFontSize(12);
    doc.text(\`Size: \${doughnutDetails.size}\`, 20, 40);
    doc.text(\`Flavor: \${doughnutDetails.flavor}\`, 20, 50);
    doc.text(\`Quantity: \${doughnutDetails.quantity}\`, 20, 60);
    doc.text(\`Ingredient Total: NGN \${ingredientTotal.toLocaleString()}\`, 20, 80);
    doc.text(\`Business Costs: NGN \${businessTotal.toLocaleString()}\`, 20, 90);
    doc.text(\`Toppings/Packaging: NGN \${toppingsTotal.toLocaleString()}\`, 20, 100);
    doc.text(\`Production Cost: NGN \${totalCost.toLocaleString()}\`, 20, 110);
    doc.text(\`Expected Profit: NGN \${expectedProfit.toLocaleString()}\`, 20, 120);
    doc.text(\`Selling Price: NGN \${sellingPrice.toLocaleString()}\`, 20, 140);
    doc.save(\`doughnut-summary-\${Date.now()}.pdf\`);
  };

  const saveCalculation = async () => {
    try {
      const response = await fetch("/api/save-calculation", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doughnutDetails, ingredients, businessCosts, toppings, totalCost, expectedProfit, sellingPrice }),
      })
      const data = await response.json()
      if (data.success) alert("Calculation saved successfully!")
      else alert("Failed to save calculation")
    } catch (error) { console.error(error); alert("Something went wrong") }
  }

  const [cakePhotoUrl, setCakePhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files?.[0]; if (!file) return;
    setIsUploading(true);
    const formData = new FormData(); formData.append('image', file);
    try {
      const res = await fetch('https://api.imgbb.com/1/upload?key=33e1efbd19d3d9299b5f33c88748566f&expiration=300', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) { setCakePhotoUrl(data.data.url); localStorage.setItem('cake_photo_url', data.data.url); }
    } catch (err) { console.error(err); }
    finally { setIsUploading(false); }
  };

  const handleQuotePayment = () => {
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: session?.user?.email || "baker@cakeapp.com",
      amount: 500 * 100, currency: "NGN",
      callback: function (response: any) {
        setPendingReference(response.reference);
        localStorage.setItem("pending_reference", response.reference);
        setQuoteUnlocked(true)
        fetch("/api/verify-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference: response.reference, email: session?.user?.email }) }).catch(() => {});
        alert("Payment successful!")
      },
      onClose: function () { alert("Payment cancelled") },
    })
    handler.openIframe()
  }

  useEffect(() => {
    const email = session?.user?.email; if (!email) return;
    fetch("/api/check-access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      .then((res) => res.json()).then((data) => { if (data.unlocked) setQuoteUnlocked(true); });
  }, [session]);

  useEffect(() => {
    const savedRef = localStorage.getItem("pending_reference"); if (savedRef) setPendingReference(savedRef);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-10">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">🍩 Doughnut Costs</h2>
        <div className="space-y-4">
          <select className="w-full border p-3 rounded-lg" value={doughnutDetails.size} onChange={(e) => setDoughnutDetails({ ...doughnutDetails, size: e.target.value })}>
            <option>Small</option><option>Medium</option><option>Large</option><option>Jumbo</option>
          </select>
          <select className="w-full border p-3 rounded-lg" value={doughnutDetails.flavor} onChange={(e) => setDoughnutDetails({ ...doughnutDetails, flavor: e.target.value })}>
            <option>Plain</option><option>Chocolate</option><option>Vanilla</option><option>Strawberry</option>
          </select>
          <label className="block text-sm font-semibold mb-2">Quantity (e.g., 50 pieces)</label>
          <input type="number" placeholder="Quantity" className="w-full border p-3 rounded-lg" value={doughnutDetails.quantity} min={1} onChange={(e) => setDoughnutDetails({ ...doughnutDetails, quantity: Number(e.target.value) })} />
          
          <h3 className="font-bold text-gray-700 mt-4">Ingredients Cost (₦)</h3>
          <input type="number" placeholder="Flour Cost" value={ingredients.flour === 0 ? "" : ingredients.flour} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, flour: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Sugar Cost" value={ingredients.sugar === 0 ? "" : ingredients.sugar} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, sugar: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Butter Cost" value={ingredients.butter === 0 ? "" : ingredients.butter} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, butter: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Eggs Cost" value={ingredients.eggs === 0 ? "" : ingredients.eggs} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, eggs: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Yeast Cost" value={ingredients.yeast === 0 ? "" : ingredients.yeast} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, yeast: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Frying Oil Cost" value={ingredients.oil === 0 ? "" : ingredients.oil} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, oil: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Milk Cost" value={ingredients.milk === 0 ? "" : ingredients.milk} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, milk: e.target.value === "" ? 0 : Number(e.target.value) })} />

          <h3 className="font-bold text-gray-700 mt-4">Business Costs (₦)</h3>
          <input type="number" placeholder="Transport Cost" value={businessCosts.transport || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setBusinessCosts({ ...businessCosts, transport: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Labor Cost" value={businessCosts.labor || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setBusinessCosts({ ...businessCosts, labor: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Electricity/Gas" value={businessCosts.electricity || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setBusinessCosts({ ...businessCosts, electricity: e.target.value === "" ? 0 : Number(e.target.value) })} />

          <h3 className="font-bold text-gray-700 mt-4">Toppings & Packaging (₦)</h3>
          <input type="number" placeholder="Glaze/Icing Cost" value={toppings.glaze || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setToppings({ ...toppings, glaze: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Sprinkles/Decorations" value={toppings.sprinkles || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setToppings({ ...toppings, sprinkles: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Packaging Cost" value={toppings.packaging || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setToppings({ ...toppings, packaging: e.target.value === "" ? 0 : Number(e.target.value) })} />

          <input type="number" placeholder="Profit %" className="w-full border p-3 rounded-lg" value={profitPercentage} onChange={(e) => setProfitPercentage(Number(e.target.value))} />

          <button type="button" className="w-full bg-red-500 text-white p-3 rounded-lg hover:opacity-90" onClick={() => {
            setIngredients({ flour: 0, sugar: 0, butter: 0, eggs: 0, yeast: 0, oil: 0, milk: 0 });
            setBusinessCosts({ transport: 0, labor: 0, electricity: 0 });
            setToppings({ glaze: 0, sprinkles: 0, packaging: 0 });
            setProfitPercentage(20);
            setDoughnutDetails({ size: "Small", flavor: "Plain", quantity: 1 });
          }}>Reset Calculator</button>
        </div>
      </div>

      <div id="summary" className="bg-[#5c3d2e] text-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Pricing Summary</h2>
        <div className="space-y-4 text-lg">
          <p>Size: {doughnutDetails.size}</p>
          <p>Flavor: {doughnutDetails.flavor}</p>
          <p>Quantity: {doughnutDetails.quantity}</p>
          <p>Ingredient Total: ₦{ingredientTotal.toLocaleString()}</p>
          <p>Business Costs: ₦{businessTotal.toLocaleString()}</p>
          <p>Toppings/Packaging: ₦{toppingsTotal.toLocaleString()}</p>
          <p>Production Cost: ₦{totalCost.toLocaleString()}</p>
          <p>Expected Profit: ₦{expectedProfit.toLocaleString()}</p>
          <p className="text-2xl font-bold">Selling Price: ₦{sellingPrice.toLocaleString()}</p>

          <div className="space-y-3">
            <button type="button" className="w-full bg-white text-[#5c3d2e] font-bold p-3 rounded-lg" onClick={downloadSummary}>Download Summary</button>
            
            <div className="mt-6 border-t pt-6">
              <h3 className="text-xl font-bold mb-3">Customer Quote Generator</h3>
              {!quoteUnlocked ? (
                <div className="space-y-3">
                  <button onClick={handleQuotePayment} className="w-full bg-blue-600 text-white p-3 rounded-lg">Generate Quote (₦500 - 24hr Access)</button>
                  {pendingReference && (
                    <button onClick={async () => {
                      const email = session?.user?.email; if (!email) { alert("Please log in first"); return; }
                      alert("⏳ Verifying payment...");
                      try {
                        const res = await fetch("/api/verify-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference: pendingReference, email }) });
                        const data = await res.json();
                        if (data.success) { setQuoteUnlocked(true); setPendingReference(null); alert("✅ Payment verified! Quote unlocked."); }
                        else { alert("❌ Payment not confirmed yet. Please wait a moment and try again."); }
                      } catch (err: any) { alert("❌ Error: " + (err.message || "Unknown error")); }
                    }} className="w-full bg-green-600 text-white p-3 rounded-lg">I've Made Payment - Verify Now</button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <input className="w-full border p-2 rounded text-black" placeholder="Customer Name" onChange={(e)=>setCustomerInfo({...customerInfo,name:e.target.value})}/>
                  <input className="w-full border p-2 rounded text-black" placeholder="Phone" onChange={(e)=>setCustomerInfo({...customerInfo,phone:e.target.value})}/>
                  <input type="date" className="w-full border p-2 rounded text-black" onChange={(e)=>setCustomerInfo({...customerInfo,eventDate:e.target.value})}/>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full border p-2 rounded text-black" />
                  {isUploading && <p className="text-blue-300">Uploading photo...</p>}
                  {cakePhotoUrl && <p className="text-green-300">✅ Photo uploaded!</p>}
                  <button className="w-full bg-green-600 text-white p-3 rounded-lg" onClick={() => {
                    const message = \`Hello \${customerInfo.name || "Customer"},\\n\\nDoughnut: \${doughnutDetails.size} / \${doughnutDetails.flavor}\\nQuantity: \${doughnutDetails.quantity}\\n\\nTotal: ₦\${sellingPrice.toLocaleString()}\\n\\n📸 Photo: \${cakePhotoUrl || "No photo attached"}\\n\\nThank you for your order!\`;
                    const url = \`https://wa.me/\${customerInfo.phone}?text=\${encodeURIComponent(message)}\`;
                    window.open(url, "_blank");
                  }}>Send WhatsApp Quote</button>
                </div>
              )}
            </div>
            <button className="w-full bg-green-500 text-white font-bold p-3 rounded-lg" onClick={saveCalculation}>Save Calculation</button>
          </div>
        </div>
      </div>
    </div>
  )
}`;

fs.writeFileSync('components/DoughnutCalculator.tsx', doughnutCode);
console.log("✅ Created DoughnutCalculator.tsx");

// 3. Create ProductSelector.tsx
const selectorCode = `"use client"

import { useState } from "react";
import CakeCalculator from "./CakeCalculator";
import DoughnutCalculator from "./DoughnutCalculator";

export default function ProductSelector() {
  const [activeTab, setActiveTab] = useState<"cake" | "doughnut">("cake");

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex space-x-2 mb-6 bg-gray-100 p-2 rounded-xl w-fit mx-auto">
        <button
          onClick={() => setActiveTab("cake")}
          className={\`px-6 py-3 rounded-lg font-bold transition-all \${
            activeTab === "cake" ? "bg-[#5c3d2e] text-white shadow-lg" : "text-gray-600 hover:bg-gray-200"
          }\`}
        >
          🎂 Cake Calculator
        </button>
        <button
          onClick={() => setActiveTab("doughnut")}
          className={\`px-6 py-3 rounded-lg font-bold transition-all \${
            activeTab === "doughnut" ? "bg-[#5c3d2e] text-white shadow-lg" : "text-gray-600 hover:bg-gray-200"
          }\`}
        >
          🍩 Doughnut Calculator
        </button>
      </div>

      {activeTab === "cake" ? <CakeCalculator /> : <DoughnutCalculator />}
    </div>
  );
}`;

fs.writeFileSync('components/ProductSelector.tsx', selectorCode);
console.log("✅ Created ProductSelector.tsx");

// 4. Update app/page.tsx
let pageCode = fs.readFileSync('app/page.tsx', 'utf8');
pageCode = pageCode.replace(/import\s+CakeCalculator\s+from\s+["'][^"']+["'];?/, 'import ProductSelector from "../components/ProductSelector";');
pageCode = pageCode.replace(/<CakeCalculator\s*\/>/, '<ProductSelector />');
fs.writeFileSync('app/page.tsx', pageCode);
console.log("✅ Updated app/page.tsx to use ProductSelector");

console.log("\n🎉 All done! Run 'npx tsc --noEmit' to verify.");
