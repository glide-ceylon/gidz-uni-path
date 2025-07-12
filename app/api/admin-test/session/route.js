import { NextResponse } from "next/server";
import { requireAdminAuth } from "../../../../lib/adminAuth";

// GET /api/admin-test/session - Test admin session
export async function GET(request) {
  try {
    console.log("🧪 Testing admin session...");

    const adminAuth = await requireAdminAuth(request, []);

    if (!adminAuth.isAuthorized) {
      console.log("❌ Session test failed - not authorized");
      return adminAuth.response;
    }

    console.log("✅ Session test passed");

    return NextResponse.json({
      success: true,
      message: "Session is valid",
      admin: {
        id: adminAuth.adminData.id,
        email: adminAuth.adminData.email,
        role: adminAuth.adminData.role,
        permissions: adminAuth.permissions,
      },
    });
  } catch (error) {
    console.error("Session test error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin-test/session - Test admin creation permissions
export async function POST(request) {
  try {
    console.log("🧪 Testing admin creation permissions...");

    const adminAuth = await requireAdminAuth(request, [
      "admin.create",
      "can_manage_admins",
    ]);

    if (!adminAuth.isAuthorized) {
      console.log("❌ Creation permissions test failed");
      return adminAuth.response;
    }

    console.log("✅ Creation permissions test passed");

    return NextResponse.json({
      success: true,
      message: "Admin has permission to create admins",
      admin: {
        id: adminAuth.adminData.id,
        email: adminAuth.adminData.email,
        role: adminAuth.adminData.role,
      },
      permissions: adminAuth.permissions,
    });
  } catch (error) {
    console.error("Creation permissions test error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
