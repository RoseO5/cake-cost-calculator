const fs = require('fs');
const file = 'components/CakeCalculator.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add state for storing reference
if (!code.includes('pendingReference')) {
  code = code.replace(
    /const \[quoteUnlocked, setQuoteUnlocked\] = useState\(false\);/,
    'const [quoteUnlocked, setQuoteUnlocked] = useState(false);\n  const [pendingReference, setPendingReference] = useState<string | null>(null);'
  );
}

// 2. Store reference when Paystack opens
const oldCallback = `    callback: async function (response: any) {`;
const newCallback = `    callback: async function (response: any) {
      setPendingReference(response.reference);`;

if (code.includes(oldCallback) && !code.includes('setPendingReference(response.reference)')) {
  code = code.replace(oldCallback, newCallback);
}

// 3. Add manual verify button before the Generate Quote button
const oldButton = `  {!quoteUnlocked ? (
    <button onClick={handleQuotePayment} className="w-full bg-blue-600 text-white p-3 rounded-lg">
      Generate Quote (₦500 - 24hr Access)
    </button>`;

const newButton = `  {!quoteUnlocked ? (
    <div className="space-y-3">
      <button onClick={handleQuotePayment} className="w-full bg-blue-600 text-white p-3 rounded-lg">
        Generate Quote (₦500 - 24hr Access)
      </button>
      {pendingReference && (
        <button 
          onClick={async () => {
            const email = session?.user?.email;
            if (!email) {
              alert("Please log in first");
              return;
            }
            alert("⏳ Verifying payment...");
            try {
              const res = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reference: pendingReference, email })
              });
              const data = await res.json();
              if (data.success) {
                setQuoteUnlocked(true);
                setPendingReference(null);
                alert("✅ Payment verified! Quote unlocked.");
              } else {
                alert("❌ Payment not confirmed yet. Please wait a moment and try again.");
              }
            } catch (err) {
              alert("❌ Error: " + err.message);
            }
          }}
          className="w-full bg-green-600 text-white p-3 rounded-lg"
        >
          I've Made Payment - Verify Now
        </button>
      )}
    </div>`;

if (code.includes(oldButton)) {
  code = code.replace(oldButton, newButton);
  fs.writeFileSync(file, code);
  console.log("✅ Manual verify button added successfully!");
} else {
  console.log("❌ Could not find exact button pattern");
}
