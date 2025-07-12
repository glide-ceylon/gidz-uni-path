import { NextResponse } from "next/server";
import { validateAdminSession } from "../../../../../lib/adminAuth";
import { createClient } from "@supabase/supabase-js";

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/admin/staff/by-ids - Get staff members by their IDs
export async function POST(request) {
  try {
    // Validate admin session
    const { isValid, adminData } = await validateAdminSession(request);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { staffIds } = await request.json();

    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid staff IDs provided" },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching staff members by IDs:", staffIds);

    // Fetch staff members by IDs
    const { data: staffMembers, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, first_name, last_name, role, department")
      .in("id", staffIds);

    if (error) {
      console.error("❌ Error fetching staff members by IDs:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch staff members" },
        { status: 500 }
      );
    }

    console.log(
      `✅ Found ${staffMembers?.length || 0} staff members for ${
        staffIds.length
      } requested IDs`
    );

    return NextResponse.json({
      success: true,
      staff: staffMembers || [],
    });
  } catch (error) {
    console.error("❌ Staff fetch by IDs error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
