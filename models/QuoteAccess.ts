import mongoose from "mongoose"

const QuoteAccessSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    paymentReference: {
      type: String,
      required: true,
    },
    accessUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.QuoteAccess ||
  mongoose.model("QuoteAccess", QuoteAccessSchema)
