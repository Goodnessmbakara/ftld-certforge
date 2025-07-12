import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: ReturnType<typeof createClient> | null = null

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Supabase environment variables are not set for /api/verify. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured.",
  )
} else {
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
}

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Supabase client not initialized due to missing environment variables." },
      { status: 500 },
    )
  }
  try {
    const { searchParams } = new URL(request.url)
    const verificationCode = searchParams.get("code")

    if (!verificationCode) {
      return NextResponse.json({ success: false, error: "Verification code is required" }, { status: 400 })
    }

    // Query certificate by verification code
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("verification_code", verificationCode)
      .single()

    if (error || !data) {
      return NextResponse.json({
        success: true,
        valid: false,
      })
    }

    return NextResponse.json({
      success: true,
      valid: true,
      certificate: {
        studentName: data.student_name,
        program: data.program,
        completionDate: data.completion_date,
        verificationCode: data.verification_code,
      },
    })
  } catch (error) {
    console.error("Error verifying certificate:", error)
    return NextResponse.json({ success: false, error: "Failed to verify certificate" }, { status: 500 })
  }
}
