import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Calculation from "@/models/Calculation"

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const calculation = await Calculation.create(body)

    return NextResponse.json({
      success: true,
      calculation,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status: 500 }
    )
  }
}
