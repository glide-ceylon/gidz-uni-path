import { NextResponse } from "next/server";
import { validateAdminSession } from "../../../../lib/adminAuth";
import { createClient } from "@supabase/supabase-js";

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST - Assign work visa application to staff
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

    // Only admin and super_admin can assign
    if (!["admin", "super_admin"].includes(adminData.role)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { workId, staffId } = await request.json();

    if (!workId || !staffId) {
      return NextResponse.json(
        { success: false, error: "Work ID and Staff ID are required" },
        { status: 400 }
      );
    }

    // Get staff member details
    const { data: staffMember, error: staffError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, first_name, last_name, role, department")
      .eq("id", staffId)
      .eq("role", "staff")
      .single();

    if (staffError || !staffMember) {
      return NextResponse.json(
        { success: false, error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Update work visa application with assignment
    const { data, error } = await supabaseAdmin
      .from("work_visa")
      .update({
        assigned_to: staffId,
        assigned_at: new Date().toISOString(),
        assigned_by: adminData.id,
      })
      .eq("id", workId)
      .select("*")
      .single();

    if (error) {
      console.error("Error assigning work visa:", error);
      return NextResponse.json(
        { success: false, error: "Failed to assign work visa application" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Work visa application assigned successfully",
      assignedStaff: staffMember,
      assignment: {
        work_id: workId,
        assigned_to: staffId,
        assigned_at: data.assigned_at,
        assigned_by: adminData.id,
      },
    });
  } catch (error) {
    console.error("Error in work assignment:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Unassign work visa application from staff
export async function DELETE(request) {
  try {
    // Validate admin session
    const { isValid, adminData } = await validateAdminSession(request);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admin and super_admin can unassign
    if (!["admin", "super_admin"].includes(adminData.role)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { workId } = await request.json();

    if (!workId) {
      return NextResponse.json(
        { success: false, error: "Work ID is required" },
        { status: 400 }
      );
    }

    // Update work visa application to remove assignment
    const { data, error } = await supabaseAdmin
      .from("work_visa")
      .update({
        assigned_to: null,
        assigned_at: null,
        assigned_by: null,
      })
      .eq("id", workId)
      .select("*")
      .single();

    if (error) {
      console.error("Error unassigning work visa:", error);
      return NextResponse.json(
        { success: false, error: "Failed to unassign work visa application" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Work visa application unassigned successfully",
      unassignment: {
        work_id: workId,
        unassigned_by: adminData.id,
        unassigned_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in work unassignment:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
