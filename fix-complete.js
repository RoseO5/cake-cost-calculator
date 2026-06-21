const fs = require('fs');
const file = 'components/CakeCalculator.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add state variables
if (!code.includes('pendingReference')) {
  code = code.replace(
    'const [quoteUnlocked, setQuoteUnlocked] = useState(false);',
    'const [quoteUnlocked, setQuoteUnlocked] = useState(false);\n  const [pendingReference, setPendingReference] = useState<string | null>(null);'
  );
}

// 2. Store reference in callback
if (!code.includes('setPendingReference(response.reference)')) {
  code = code.replace(
    'callback: function (response: any) {',
    'callback: function (response: any) {\n      setPendingReference(response.reference);'
  );
}

// 3. Add verify button with proper error typing
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
            } catch (err: any) {
              alert("❌ Error: " + (err.message || "Unknown error"));
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
  console.log("✅ Complete fix applied!");
} else {
  console.log("❌ Could not find button pattern");
}
