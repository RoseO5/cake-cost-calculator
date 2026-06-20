const fs = require('fs');
const file = 'components/CakeCalculator.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldBlock = `    callback: function (response: any) {
        localStorage.setItem("paystack_reference", response.reference)
      setQuoteUnlocked(true)
      fetch("/api/verify-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference: response.reference, email: session?.user?.email }) }).catch(() => {});

      alert("Payment successful!")
    },`;

const newBlock = `    callback: async function (response: any) {
      const userEmail = session?.user?.email;
      if (!userEmail) {
        alert("❌ Error: Please log in with a valid email first.");
        return;
      }
      try {
        alert("⏳ Verifying payment with backend...");
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: response.reference, email: userEmail })
        });
        const data = await res.json();
        if (data.success) {
          setQuoteUnlocked(true);
          alert("✅ Payment verified! Quote unlocked.");
        } else {
          alert("❌ Verification failed: " + (data.error || "Check Paystack logs"));
        }
      } catch (err) {
        alert("❌ Network/Server error: " + err.message);
      }
    },`;

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync(file, code);
  console.log("✅ Async callback applied successfully!");
} else {
  console.log("❌ Could not find exact block. Check formatting or restore backup.");
}
