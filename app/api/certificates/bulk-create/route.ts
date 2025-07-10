import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: ReturnType<typeof createClient> | null = null

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Supabase environment variables are not set for /api/certificates/bulk-create. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured.",
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
    const certificatesData = await request.json() // Expects an array of { studentName, program, completionDate }

    if (!Array.isArray(certificatesData) || certificatesData.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid or empty data array provided" }, { status: 400 })
    }

    const results = []
    for (const certData of certificatesData) {
      const { studentName, program, completionDate } = certData

      if (!studentName || !program || !completionDate) {
        results.push({
          success: false,
          error: "Missing required fields for a certificate",
          data: certData,
        })
        continue
      }

      // Generate verification code
      const verificationCode = `FTLD-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

      try {
        // Check if program exists
        const { data: programExists, error: programError } = await supabase
          .from("programs")
          .select("id")
          .eq("name", program)
          .single()

        if (programError || !programExists) {
          results.push({
            success: false,
            error: `Program '${program}' not found or inactive.`,
            data: certData,
          })
          continue
        }

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

        results.push({
          success: true,
          certificate: {
            id: data.id,
            studentName: data.student_name,
            program: data.program,
            completionDate: data.completion_date,
            verificationCode: data.verification_code,
          },
        })
      } catch (error: any) {
        console.error("Error creating certificate for", studentName, ":", error)
        results.push({
          success: false,
          error: error.message || "Failed to create certificate",
          data: certData,
        })
      }
    }

    const successfulCreations = results.filter((r) => r.success).length
    const failedCreations = results.filter((r) => !r.success).length
    const errors = results.filter((r) => !r.success).map((r) => `${r.data.studentName}: ${r.error}`)

    return NextResponse.json({
      success: true,
      summary: {
        total: certificatesData.length,
        successful: successfulCreations,
        failed: failedCreations,
        errors: errors,
      },
      results: results,
    })
  } catch (error) {
    console.error("Error in bulk certificate creation API:", error)
    return NextResponse.json({ success: false, error: "Failed to process bulk upload" }, { status: 500 })
  }
}
