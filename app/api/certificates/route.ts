import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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
    const { data, error } = await supabase.from("certificates").select("*").order("created_at", { ascending: false })

    if (error) {
      throw error
    }

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
    );
  }
  try {
    // Get user from request (assume JWT in Authorization header)
    const authHeader = request.headers.get("authorization");
    const jwt = authHeader?.split(" ")[1];
    if (!jwt) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    // Get user email from JWT
    const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !userData?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    // Check role in users table
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("email", userData.user.email)
      .single();
    if (profileError || !profile || profile.role !== "admin") {
      return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 });
    }
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
