"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ChinChinCalculator() {
  const [chinChinDetails, setChinChinDetails] = useState({ type: "Crunchy", quantity: 1 })
  const [ingredients, setIngredients] = useState({ flour: 0, sugar: 0, butter: 0, eggs: 0, milk: 0, nutmeg: 0, oil: 0 })
  const [businessCosts, setBusinessCosts] = useState({ transport: 0, labor: 0, electricity: 0 })
  const [packaging, setPackaging] = useState({ bags: 0, jars: 0 })

  const [profitPercentage, setProfitPercentage] = useState(20)
  const [quoteUnlocked, setQuoteUnlocked] = useState(false)
  const [pendingReference, setPendingReference] = useState<string | null>(null);
  const { data: session } = useSession()
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", eventDate: "" })

  const ingredientTotal = Number(ingredients.flour) + Number(ingredients.sugar) + Number(ingredients.butter) + Number(ingredients.eggs) + Number(ingredients.milk) + Number(ingredients.nutmeg) + Number(ingredients.oil)
  const businessTotal = Number(businessCosts.transport) + Number(businessCosts.labor) + Number(businessCosts.electricity)
  const packagingTotal = Number(packaging.bags) + Number(packaging.jars)

  const totalCost = (ingredientTotal + businessTotal + packagingTotal) * chinChinDetails.quantity
  const expectedProfit = (profitPercentage / 100) * totalCost
  const sellingPrice = totalCost + expectedProfit

  const downloadSummary = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Chin Chin Pricing Summary", 20, 20);
    doc.setFontSize(12);
    doc.text(`Type: ${chinChinDetails.type}`, 20, 40);
    doc.text(`Quantity: ${chinChinDetails.quantity}`, 20, 50);
    doc.text(`Ingredient Total: NGN ${ingredientTotal.toLocaleString()}`, 20, 70);
    doc.text(`Business Costs: NGN ${businessTotal.toLocaleString()}`, 20, 80);
    doc.text(`Packaging: NGN ${packagingTotal.toLocaleString()}`, 20, 90);
    doc.text(`Production Cost: NGN ${totalCost.toLocaleString()}`, 20, 100);
    doc.text(`Expected Profit: NGN ${expectedProfit.toLocaleString()}`, 20, 110);
    doc.text(`Selling Price: NGN ${sellingPrice.toLocaleString()}`, 20, 130);
    doc.save(`chinchin-summary-${Date.now()}.pdf`);
  };

  const saveCalculation = async () => {
    try {
      const response = await fetch("/api/save-calculation", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chinChinDetails, ingredients, businessCosts, packaging, totalCost, expectedProfit, sellingPrice }),
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
        <h2 className="text-2xl font-bold mb-4">🍪 Chin Chin Costs</h2>
        <div className="space-y-4">
          <select className="w-full border p-3 rounded-lg" value={chinChinDetails.type} onChange={(e) => setChinChinDetails({ ...chinChinDetails, type: e.target.value })}>
            <option>Crunchy</option><option>Soft</option><option>Party Size (Mini)</option>
          </select>
          <label className="block text-sm font-semibold mb-2">Quantity (e.g., number of batches or kg)</label>
          <input type="number" placeholder="Quantity" className="w-full border p-3 rounded-lg" value={chinChinDetails.quantity} min={1} onChange={(e) => setChinChinDetails({ ...chinChinDetails, quantity: Number(e.target.value) })} />

          <h3 className="font-bold text-gray-700 mt-4">Ingredients Cost (₦)</h3>
          <input type="number" placeholder="Flour Cost" value={ingredients.flour === 0 ? "" : ingredients.flour} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, flour: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Sugar Cost" value={ingredients.sugar === 0 ? "" : ingredients.sugar} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, sugar: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Butter/Margarine Cost" value={ingredients.butter === 0 ? "" : ingredients.butter} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, butter: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Eggs Cost" value={ingredients.eggs === 0 ? "" : ingredients.eggs} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, eggs: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Milk Cost (Optional)" value={ingredients.milk === 0 ? "" : ingredients.milk} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, milk: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Nutmeg/Vanilla Cost" value={ingredients.nutmeg === 0 ? "" : ingredients.nutmeg} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, nutmeg: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Frying Oil Cost" value={ingredients.oil === 0 ? "" : ingredients.oil} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, oil: e.target.value === "" ? 0 : Number(e.target.value) })} />

          <h3 className="font-bold text-gray-700 mt-4">Business Costs (₦)</h3>
          <input type="number" placeholder="Transport Cost" value={businessCosts.transport || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setBusinessCosts({ ...businessCosts, transport: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Labor Cost" value={businessCosts.labor || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setBusinessCosts({ ...businessCosts, labor: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Electricity/Gas" value={businessCosts.electricity || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setBusinessCosts({ ...businessCosts, electricity: e.target.value === "" ? 0 : Number(e.target.value) })} />

          <h3 className="font-bold text-gray-700 mt-4">Packaging (₦)</h3>
          <input type="number" placeholder="Nylon/Paper Bags Cost" value={packaging.bags || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setPackaging({ ...packaging, bags: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Jars/Containers Cost" value={packaging.jars || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setPackaging({ ...packaging, jars: e.target.value === "" ? 0 : Number(e.target.value) })} />

          <input type="number" placeholder="Profit %" className="w-full border p-3 rounded-lg" value={profitPercentage} onChange={(e) => setProfitPercentage(Number(e.target.value))} />

          <button type="button" className="w-full bg-red-500 text-white p-3 rounded-lg hover:opacity-90" onClick={() => {
            setIngredients({ flour: 0, sugar: 0, butter: 0, eggs: 0, milk: 0, nutmeg: 0, oil: 0 });
            setBusinessCosts({ transport: 0, labor: 0, electricity: 0 });
            setPackaging({ bags: 0, jars: 0 });
            setProfitPercentage(20);
            setChinChinDetails({ type: "Crunchy", quantity: 1 });
          }}>Reset Calculator</button>
        </div>
      </div>

      <div id="summary" className="bg-[#5c3d2e] text-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Pricing Summary</h2>
        <div className="space-y-4 text-lg">
          <p>Type: {chinChinDetails.type}</p>
          <p>Quantity: {chinChinDetails.quantity}</p>
          <p>Ingredient Total: ₦{ingredientTotal.toLocaleString()}</p>
          <p>Business Costs: ₦{businessTotal.toLocaleString()}</p>
          <p>Packaging: ₦{packagingTotal.toLocaleString()}</p>
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
                    const message = `Hello ${customerInfo.name || "Customer"},\n\nChin Chin: ${chinChinDetails.type}\nQuantity: ${chinChinDetails.quantity}\n\nTotal: ₦${sellingPrice.toLocaleString()}\n\n📸 Photo: ${cakePhotoUrl || "No photo attached"}\n\nThank you for your order!`;
                    const url = `https://wa.me/${customerInfo.phone}?text=${encodeURIComponent(message)}`;
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
}
