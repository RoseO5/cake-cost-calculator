import CakeCalculator from "@/components/CakeCalculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f0] p-6">
      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-5xl font-bold text-center text-[#5c3d2e]">
          Cake Cost Calculator
        </h1>

        <p className="text-center text-gray-700 mt-4">
          Calculate cake production cost,
          profit, and selling price instantly.
        </p>

        <CakeCalculator />
      </div>
    </main>
  )
}
