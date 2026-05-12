export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f0] p-6">
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-5xl font-bold text-[#5c3d2e] mb-6">
          Cake Cost Calculator
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Calculate your cake production cost, profit,
          and selling price instantly.
        </p>

        <button className="bg-[#5c3d2e] text-white px-6 py-3 rounded-xl text-lg hover:opacity-90">
          Start Calculating
        </button>
      </div>
    </main>
  )
}
