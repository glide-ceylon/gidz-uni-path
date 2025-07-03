import { NextResponse } from "next/server";
import { validateAdminSession } from "../../../../lib/adminAuth";

// GET /api/admin-auth/validate - Validate current admin session
export async function GET(request) {
  try {
    const { isValid, adminData, permissions } = await validateAdminSession(
      request
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: adminData.id,
        email: adminData.email,
        first_name: adminData.first_name,
        last_name: adminData.last_name,
        role: adminData.role,
        department: adminData.department,
      },
      permissions: permissions,
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
