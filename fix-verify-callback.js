const fs = require('fs');
const file = 'components/CakeCalculator.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the callback to verify with backend
const oldCallback = `    callback: function (response: any) {
        localStorage.setItem("paystack_reference", response.reference)
      setQuoteUnlocked(true)

      alert("Payment successful!")
    },`;

const newCallback = `    callback: async function (response: any) {
      try {
        // Verify payment with backend
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: response.reference })
        });
        
        const verifyData = await verifyRes.json();
        
        if (verifyData.success) {
          localStorage.setItem("paystack_reference", response.reference);
          setQuoteUnlocked(true);
          alert("Payment successful! Quote unlocked.");
        } else {
          alert("Payment verification failed. Please contact support.");
        }
      } catch (err) {
        console.error('Verification error:', err);
        alert("Payment verification error. Please refresh and try again.");
      }
    },`;

if (code.includes(oldCallback)) {
  code = code.replace(oldCallback, newCallback);
  fs.writeFileSync(file, code);
  console.log('✅ Callback updated to verify with backend');
} else {
  console.log('❌ Could not find exact callback pattern');
}
