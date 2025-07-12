import { NextResponse } from "next/server";
import { validateAdminSession } from "../../../../lib/adminAuth";
import { createClient } from "@supabase/supabase-js";

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/admin/assign-student - Assign student to staff member
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

    const { studentId, staffId } = await request.json();

    if (!studentId || !staffId) {
      return NextResponse.json(
        { success: false, error: "Student ID and Staff ID are required" },
        { status: 400 }
      );
    }

    // Verify staff member exists
    const { data: staffMember, error: staffError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, first_name, last_name")
      .eq("id", staffId)
      .eq("is_active", true)
      .single();

    if (staffError || !staffMember) {
      return NextResponse.json(
        { success: false, error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Update student record with assigned staff member
    const { error: updateError } = await supabaseAdmin
      .from("student_visa")
      .update({
        assigned_to: staffId,
        assigned_at: new Date().toISOString(),
        assigned_by: adminData.id,
      })
      .eq("id", studentId);

    if (updateError) {
      console.error("Error assigning student:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to assign student" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Student assigned to ${staffMember.first_name} ${staffMember.last_name}`,
      assignedStaff: staffMember,
    });
  } catch (error) {
    console.error("Assignment error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/assign-student - Unassign student from staff member
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

    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Remove assignment from student record
    const { error: updateError } = await supabaseAdmin
      .from("student_visa")
      .update({
        assigned_to: null,
        assigned_at: null,
        assigned_by: null,
      })
      .eq("id", studentId);

    if (updateError) {
      console.error("Error unassigning student:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to unassign student" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student unassigned successfully",
    });
  } catch (error) {
    console.error("Unassignment error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
