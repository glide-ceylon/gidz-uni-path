import { NextResponse } from "next/server";
import { validateAdminSession } from "../../../../lib/adminAuth";
import { createClient } from "@supabase/supabase-js";

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/admin/staff - Get all staff members for assignment
export async function GET(request) {
  try {
    // Validate admin session
    const { isValid, adminData } = await validateAdminSession(request);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("🔍 Admin session valid, fetching staff members...");

    // Fetch all active admin users who can be assigned
    const { data: staffMembers, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, first_name, last_name, role, department")
      .eq("is_active", true)
      .order("first_name", { ascending: true });

    console.log("📊 Database query result:", { staffMembers, error });

    if (error) {
      console.error("❌ Error fetching staff members:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch staff members" },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${staffMembers?.length || 0} staff members`);

    return NextResponse.json({
      success: true,
      staff: staffMembers || [],
    });
  } catch (error) {
    console.error("❌ Staff fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
