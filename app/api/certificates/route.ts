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

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Supabase client not initialized due to missing environment variables." },
      { status: 500 },
    )
  }
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const program = searchParams.get("program")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply search filter
    if (search) {
      query = query.or(`student_name.ilike.%${search}%,verification_code.ilike.%${search}%`)
    }

    // Apply program filter
    if (program) {
      query = query.eq("program", program)
    }

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase.from("certificates").select("*", { count: "exact", head: true })

    return NextResponse.json({
      success: true,
      certificates:
        data?.map((cert) => ({
          id: cert.id,
          studentName: cert.student_name,
          program: cert.program,
          completionDate: cert.completion_date,
          verificationCode: cert.verification_code,
          createdAt: cert.created_at,
        })) || [],
      pagination: {
        total: totalCount || 0,
        limit,
        offset,
        hasMore: offset + limit < (totalCount || 0),
      },
    })
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch certificates" }, { status: 500 })
  }
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
