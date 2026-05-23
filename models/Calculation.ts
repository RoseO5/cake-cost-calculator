import mongoose from "mongoose"

const CalculationSchema = new mongoose.Schema(
  {
    cakeDetails: Object,
    ingredients: Object,
    businessCosts: Object,
    decorations: Object,
    totalCost: Number,
    expectedProfit: Number,
    sellingPrice: Number,
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Calculation ||
  mongoose.model("Calculation", CalculationSchema)
