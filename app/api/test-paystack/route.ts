export async function GET() {
  return Response.json({
    publicKeyExists: !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    secretKeyExists: !!process.env.PAYSTACK_SECRET_KEY,
  })
}
