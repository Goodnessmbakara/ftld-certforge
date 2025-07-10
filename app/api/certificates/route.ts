import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: ReturnType<typeof createClient> | null = null

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Supabase environment variables are not set for /api/certificates. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured.",
  )
} else {
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Supabase client not initialized due to missing environment variables." },
      { status: 500 },
    )
  }
  try {
    const { studentName, program, completionDate } = await request.json()

    // Generate verification code
    const verificationCode = `FTLD-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Insert certificate into database
    const { data, error } = await supabase
      .from("certificates")
      .insert([
        {
          student_name: studentName,
          program: program,
          completion_date: completionDate,
          verification_code: verificationCode,
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      certificate: {
        id: data.id,
        studentName: data.student_name,
        program: data.program,
        completionDate: data.completion_date,
        verificationCode: data.verification_code,
      },
    })
  } catch (error) {
    console.error("Error creating certificate:", error)
    return NextResponse.json({ success: false, error: "Failed to create certificate" }, { status: 500 })
  }
}
