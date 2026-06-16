import { NextResponse } from "next/server"
import axios from "axios"
import connectDB from "@/lib/mongodb"
import QuoteAccess from "@/models/QuoteAccess"

export async function POST(req: Request) {
try {
await connectDB()

const { reference, email } = await req.json()

const response = await axios.get(
  `https://api.paystack.co/transaction/verify/${reference}`,
  {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  }
)

if (response.data?.data?.status === "success") {
  const accessUntil = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  )

  await QuoteAccess.findOneAndUpdate(
    { email },
    {
      email,
      paymentReference: reference,
      accessUntil,
    },
    {
      upsert: true,
      new: true,
    }
  )

  return NextResponse.json({
    success: true,
    accessUntil,
  })
}

return NextResponse.json(
  { success: false },
  { status: 400 }
)

} catch (error) {
return NextResponse.json(
{
success: false,
error: String(error),
},
{ status: 500 }
)
}
}
