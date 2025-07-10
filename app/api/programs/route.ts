import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: ReturnType<typeof createClient> | null = null

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Supabase environment variables are not set for /api/programs. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured.",
  )
} else {
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Supabase client not initialized due to missing environment variables." },
      { status: 500 },
    )
  }
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      programs: data,
    })
  } catch (error) {
    console.error("Error fetching programs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch programs" }, { status: 500 })
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
    const { name, description } = await request.json()

    const { data, error } = await supabase
      .from("programs")
      .insert([
        {
          name,
          description,
          is_active: true,
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      program: data,
    })
  } catch (error) {
    console.error("Error creating program:", error)
    return NextResponse.json({ success: false, error: "Failed to create program" }, { status: 500 })
  }
}
