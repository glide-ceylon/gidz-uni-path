import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to validate UUID
const isValidUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to validate admin authentication with database
const validateAdminAuth = async (request) => {
  const adminAuth = request.headers.get("x-admin-auth");
  const adminData = request.headers.get("x-admin-data");

  if (!adminAuth || adminAuth !== "true" || !adminData) {
    return { isValid: false, adminData: null, permissions: [] };
  }

  try {
    const parsedAdminData = JSON.parse(adminData);
    const adminEmail = parsedAdminData.email;

    if (!adminEmail) {
      return { isValid: false, adminData: null, permissions: [] };
    }

    // Check if admin exists and is active in database
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from("admin_users")
      .select(
        "id, email, first_name, last_name, role, department, is_active, permissions"
      )
      .eq("email", adminEmail)
      .eq("is_active", true)
      .single();

    if (adminError || !adminUser) {
      return { isValid: false, adminData: null, permissions: [] };
    }

    // Get admin permissions
    const { data: permissions, error: permError } = await supabaseAdmin.rpc(
      "get_admin_permissions",
      { admin_email: adminEmail }
    );

    if (permError) {
      console.error("Error fetching admin permissions:", permError);
      return { isValid: false, adminData: null, permissions: [] };
    }

    return {
      isValid: true,
      adminData: {
        ...adminUser,
        ...parsedAdminData,
      },
      permissions: permissions || [],
    };
  } catch (error) {
    console.error("Admin validation error:", error);
    return { isValid: false, adminData: null, permissions: [] };
  }
};

// Helper function to check specific permission
const hasPermission = (permissions, permissionName) => {
  return permissions.some((p) => p.permission_name === permissionName);
};

// GET /api/admin-users/[adminId] - Get specific admin user
export async function GET(request, { params }) {
  try {
    const { adminId } = params;

    if (!isValidUUID(adminId)) {
      return NextResponse.json(
        { error: "Invalid admin ID format" },
        { status: 400 }
      );
    }

    const adminAuth = await validateAdminAuth(request);

    if (!adminAuth.isValid) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }

    // Check if admin has permission to view admin users or is viewing their own profile
    const isOwnProfile = adminAuth.adminData.id === adminId;
    if (!isOwnProfile && !hasPermission(adminAuth.permissions, "admins.read")) {
      return NextResponse.json(
        { error: "Insufficient permissions to view admin user" },
        { status: 403 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .select(
        `
        id,
        email,
        first_name,
        last_name,
        role,
        department,
        is_active,
        permissions,
        last_login,
        created_at,
        updated_at
      `
      )
      .eq("id", adminId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Admin user not found" },
          { status: 404 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch admin user" },
        { status: 500 }
      );
    }

    // Get admin permissions for this user
    const { data: userPermissions, error: permError } = await supabaseAdmin.rpc(
      "get_admin_permissions",
      { admin_email: data.email }
    );

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        user_permissions: userPermissions || [],
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin-users/[adminId] - Update admin user
export async function PUT(request, { params }) {
  try {
    const { adminId } = params;

    if (!isValidUUID(adminId)) {
      return NextResponse.json(
        { error: "Invalid admin ID format" },
        { status: 400 }
      );
    }

    const adminAuth = await validateAdminAuth(request);

    if (!adminAuth.isValid) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }

    // Check if admin has permission to update admin users or is updating their own profile
    const isOwnProfile = adminAuth.adminData.id === adminId;
    if (
      !isOwnProfile &&
      !hasPermission(adminAuth.permissions, "admins.update")
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions to update admin user" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { first_name, last_name, role, department, permissions, is_active } =
      body;

    // Build update object with only provided fields
    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name.trim();
    if (last_name !== undefined) updateData.last_name = last_name.trim();
    if (department !== undefined) updateData.department = department?.trim();
    if (permissions !== undefined) updateData.permissions = permissions;

    // Only allow role/is_active changes if not updating own profile and has permission
    if (!isOwnProfile) {
      if (role !== undefined) {
        const validRoles = ["super_admin", "admin", "manager", "staff"];
        if (!validRoles.includes(role)) {
          return NextResponse.json(
            { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
            { status: 400 }
          );
        }
        updateData.role = role;
      }
      if (is_active !== undefined) updateData.is_active = is_active;
    }

    // Verify admin exists
    const { data: existingAdmin, error: checkError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email")
      .eq("id", adminId)
      .single();

    if (checkError || !existingAdmin) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Update the admin user
    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .update(updateData)
      .eq("id", adminId)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update admin user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Admin user updated successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin-users/[adminId] - Delete admin user (super admin only)
export async function DELETE(request, { params }) {
  try {
    const { adminId } = params;

    if (!isValidUUID(adminId)) {
      return NextResponse.json(
        { error: "Invalid admin ID format" },
        { status: 400 }
      );
    }

    const adminAuth = await validateAdminAuth(request);

    if (!adminAuth.isValid) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }

    // Check if admin has permission to delete admin users
    if (!hasPermission(adminAuth.permissions, "admins.delete")) {
      return NextResponse.json(
        { error: "Insufficient permissions to delete admin user" },
        { status: 403 }
      );
    }

    // Prevent self-deletion
    if (adminAuth.adminData.id === adminId) {
      return NextResponse.json(
        { error: "Cannot delete your own admin account" },
        { status: 400 }
      );
    }

    // Verify admin exists
    const { data: existingAdmin, error: checkError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, role")
      .eq("id", adminId)
      .single();

    if (checkError || !existingAdmin) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Delete the admin user
    const { error } = await supabaseAdmin
      .from("admin_users")
      .delete()
      .eq("id", adminId);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete admin user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin user deleted successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
