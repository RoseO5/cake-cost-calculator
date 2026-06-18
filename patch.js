const fs = require('fs');
const file = 'components/CakeCalculator.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add States and Upload Function
const newCode = `
  const [cakePhotoUrl, setCakePhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('https://api.imgbb.com/1/upload?key=33e1efbd19d3d9299b5f33c88748566f&expiration=300', { 
        method: 'POST', 
        body: formData 
      });
      const data = await res.json();
      if (data.success) {
        setCakePhotoUrl(data.data.url);
        localStorage.setItem('cake_photo_url', data.data.url);
      }
    } catch (err) { console.error(err); }
    finally { setIsUploading(false); }
  };
`;

if (!code.includes('handlePhotoUpload')) {
  code = code.replace(/const handleQuotePayment/, newCode + '\n  const handleQuotePayment');
  console.log('✅ Injected Upload Function');
}

// 2. Add UI (File Input) right before the WhatsApp button
const uiCode = `
              {session?.user && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label className="block text-sm font-semibold mb-2 text-blue-800">📸 Upload Cake Photo (Auto-deletes in 5 mins)</label>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="block w-full text-sm" />
                  {isUploading && <p className="text-blue-500 text-xs mt-1">Uploading to secure server...</p>}
                  {cakePhotoUrl && <p className="text-green-600 text-xs mt-1 font-bold">✅ Photo ready to share!</p>}
                </div>
              )}
`;

if (!code.includes('Upload Cake Photo')) {
  // Finds the WhatsApp link and injects the UI right above it
  code = code.replace(/(href=\{`https:\/\/wa\.me\/)/, uiCode + '\n              $1');
  console.log('✅ Injected Photo Upload UI');
}

// 3. Update the WhatsApp Message to include the Photo URL
if (!code.includes('Cake Photo:')) {
  code = code.replace(/(order!`;)/, '\\n\\n📸 Cake Photo: ${cakePhotoUrl || "No photo attached"}$1');
  console.log('✅ Updated WhatsApp Message');
}

fs.writeFileSync(file, code);
console.log('🎉 Patch applied successfully!');
