"use client"

import { useState } from "react"

export default function CustomerQuotePage() {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    eventDate: "",
  })

  const cakeDetails = {
    size: "6 Inches",
    flavor: "Vanilla",
    layers: 1,
    quantity: 1,
  }

  const sellingPrice = 0 // TEMP (later we will pass real data or fetch)

  const [unlocked, setUnlocked] = useState(false)

  const handlePayment = () => {
    alert("Paystack integration will go here (₦200 unlock)")
    setUnlocked(true)
  }

  const sendWhatsApp = () => {
    const message = `
Hello ${customerInfo.name || "Customer"},

Here is your cake quote:

Cake: ${cakeDetails.size} / ${cakeDetails.flavor}
Layers: ${cakeDetails.layers}
Quantity: ${cakeDetails.quantity}

Total: ₦${sellingPrice}

Thank you!
    `

    const url = `https://wa.me/${customerInfo.phone}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">

      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">

        <h1 className="text-2xl font-bold mb-6">
          Customer Quote Generator
        </h1>

        <input
          className="w-full border p-3 rounded-lg mb-3"
          placeholder="Customer Name"
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, name: e.target.value })
          }
        />

        <input
          className="w-full border p-3 rounded-lg mb-3"
          placeholder="Phone (234...)"
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, phone: e.target.value })
          }
        />

        <input
          type="date"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, eventDate: e.target.value })
          }
        />

        {!unlocked ? (
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Generate Quote (₦200)
          </button>
        ) : (
          <button
            onClick={sendWhatsApp}
            className="w-full bg-green-600 text-white p-3 rounded-lg"
          >
            Send WhatsApp Quote
          </button>
        )}

      </div>
    </div>
  )
}
