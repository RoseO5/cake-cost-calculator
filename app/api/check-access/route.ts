import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import QuoteAccess from "@/models/QuoteAccess"

export async function POST(req: Request) {
  await connectDB()

  const { email } = await req.json()

  const record = await QuoteAccess.findOne({ email })

  const unlocked =
    record && new Date(record.accessUntil).getTime() > Date.now()

  return NextResponse.json({ unlocked })
}
