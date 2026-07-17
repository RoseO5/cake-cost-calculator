"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ShawarmaCalculator() {
  const [shawarmaDetails, setShawarmaDetails] = useState({ type: "Standard", quantity: 1 })
  const [ingredients, setIngredients] = useState({ breadWrap: 0, protein: 0, vegetables: 0, sauces: 0 })
  const [businessCosts, setBusinessCosts] = useState({ transport: 0, labor: 0, electricity: 0 })
  const [packaging, setPackaging] = useState({ foilPaper: 0, boxes: 0 })

  const [profitPercentage, setProfitPercentage] = useState(20)
  const [quoteUnlocked, setQuoteUnlocked] = useState(false)
  const [pendingReference, setPendingReference] = useState<string | null>(null);
  const { data: session } = useSession()
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", eventDate: "" })

  const ingredientTotal = Number(ingredients.breadWrap) + Number(ingredients.protein) + Number(ingredients.vegetables) + Number(ingredients.sauces)
  const businessTotal = Number(businessCosts.transport) + Number(businessCosts.labor) + Number(businessCosts.electricity)
  const packagingTotal = Number(packaging.foilPaper) + Number(packaging.boxes)

  const totalCost = (ingredientTotal + businessTotal + packagingTotal) * shawarmaDetails.quantity
  const expectedProfit = (profitPercentage / 100) * totalCost
  const sellingPrice = totalCost + expectedProfit

  const downloadSummary = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Shawarma Pricing Summary", 20, 20);
    doc.setFontSize(12);
    doc.text(`Type: ${shawarmaDetails.type}`, 20, 40);
    doc.text(`Quantity: ${shawarmaDetails.quantity}`, 20, 50);
    doc.text(`Ingredient Total: NGN ${ingredientTotal.toLocaleString()}`, 20, 70);
    doc.text(`Business Costs: NGN ${businessTotal.toLocaleString()}`, 20, 80);
    doc.text(`Packaging: NGN ${packagingTotal.toLocaleString()}`, 20, 90);
    doc.text(`Production Cost: NGN ${totalCost.toLocaleString()}`, 20, 100);
    doc.text(`Expected Profit: NGN ${expectedProfit.toLocaleString()}`, 20, 110);
    doc.text(`Selling Price: NGN ${sellingPrice.toLocaleString()}`, 20, 130);
    doc.save(`shawarma-summary-${Date.now()}.pdf`);
  };

  const saveCalculation = async () => {
    try {
      const response = await fetch("/api/save-calculation", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shawarmaDetails, ingredients, businessCosts, packaging, totalCost, expectedProfit, sellingPrice }),
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
        <h2 className="text-2xl font-bold mb-4">🌯 Shawarma Costs</h2>
        <div className="space-y-4">
          <select className="w-full border p-3 rounded-lg" value={shawarmaDetails.type} onChange={(e) => setShawarmaDetails({ ...shawarmaDetails, type: e.target.value })}>
            <option>Standard</option><option>Jumbo</option><option>Mini / Party Size</option>
          </select>
          <label className="block text-sm font-semibold mb-2">Quantity (e.g., number of wraps)</label>
          <input type="number" placeholder="Quantity" className="w-full border p-3 rounded-lg" value={shawarmaDetails.quantity} min={1} onChange={(e) => setShawarmaDetails({ ...shawarmaDetails, quantity: Number(e.target.value) })} />

          <h3 className="font-bold text-gray-700 mt-4">Ingredients Cost (₦)</h3>
          <input type="number" placeholder="Bread/Wrap Cost (Arabic/Tortilla)" value={ingredients.breadWrap === 0 ? "" : ingredients.breadWrap} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, breadWrap: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Protein Cost (Chicken/Beef/Sausage)" value={ingredients.protein === 0 ? "" : ingredients.protein} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, protein: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Vegetables Cost (Cabbage, Carrot, etc.)" value={ingredients.vegetables === 0 ? "" : ingredients.vegetables} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, vegetables: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Sauces Cost (Mayo, Ketchup, etc.)" value={ingredients.sauces === 0 ? "" : ingredients.sauces} className="w-full border p-3 rounded-lg" onChange={(e) => setIngredients({ ...ingredients, sauces: e.target.value === "" ? 0 : Number(e.target.value) })} />

          <h3 className="font-bold text-gray-700 mt-4">Business Costs (₦)</h3>
          <input type="number" placeholder="Transport Cost" value={businessCosts.transport || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setBusinessCosts({ ...businessCosts, transport: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Labor Cost" value={businessCosts.labor || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setBusinessCosts({ ...businessCosts, labor: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Electricity/Gas" value={businessCosts.electricity || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setBusinessCosts({ ...businessCosts, electricity: e.target.value === "" ? 0 : Number(e.target.value) })} />

          <h3 className="font-bold text-gray-700 mt-4">Packaging (₦)</h3>
          <input type="number" placeholder="Foil/Paper Wrap Cost" value={packaging.foilPaper || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setPackaging({ ...packaging, foilPaper: e.target.value === "" ? 0 : Number(e.target.value) })} />
          <input type="number" placeholder="Boxes Cost" value={packaging.boxes || ""} className="w-full border p-3 rounded-lg" onChange={(e) => setPackaging({ ...packaging, boxes: e.target.value === "" ? 0 : Number(e.target.value) })} />

          <input type="number" placeholder="Profit %" className="w-full border p-3 rounded-lg" value={profitPercentage} onChange={(e) => setProfitPercentage(Number(e.target.value))} />

          <button type="button" className="w-full bg-red-500 text-white p-3 rounded-lg hover:opacity-90" onClick={() => {
            setIngredients({ breadWrap: 0, protein: 0, vegetables: 0, sauces: 0 });
            setBusinessCosts({ transport: 0, labor: 0, electricity: 0 });
            setPackaging({ foilPaper: 0, boxes: 0 });
            setProfitPercentage(20);
            setShawarmaDetails({ type: "Standard", quantity: 1 });
          }}>Reset Calculator</button>
        </div>
      </div>

      <div id="summary" className="bg-[#5c3d2e] text-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Pricing Summary</h2>
        <div className="space-y-4 text-lg">
          <p>Type: {shawarmaDetails.type}</p>
          <p>Quantity: {shawarmaDetails.quantity}</p>
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
                    const message = `Hello ${customerInfo.name || "Customer"},\n\nShawarma: ${shawarmaDetails.type}\nQuantity: ${shawarmaDetails.quantity}\n\nTotal: ₦${sellingPrice.toLocaleString()}\n\n📸 Photo: ${cakePhotoUrl || "No photo attached"}\n\nThank you for your order!`;
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
