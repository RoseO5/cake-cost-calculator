const fs = require('fs');
const file = 'components/CakeCalculator.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/localStorage\.setItem\("quoteAccessUntil".*\n?/g, '');
console.log('✅ Removed fake localStorage unlock');

const accessCheck = `
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
`;

if (!code.includes('/api/check-access')) {
  code = code.replace(/return \(/, accessCheck + '\n  return (');
  console.log('✅ Injected backend access check');
}

fs.writeFileSync(file, code);
console.log('🎉 Payment fix applied safely!');
