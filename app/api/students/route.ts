import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
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
