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

// GET /api/admin-users - Get all admin users (super admin only)
export async function GET(request) {
  try {
    const adminAuth = await validateAdminAuth(request);

    if (!adminAuth.isValid) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }

    // Check if admin has permission to view admin users
    if (!hasPermission(adminAuth.permissions, "admins.read")) {
      return NextResponse.json(
        { error: "Insufficient permissions to view admin users" },
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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch admin users" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        total: data.length,
        requestedBy: adminAuth.adminData.email,
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

// POST /api/admin-users - Create new admin user (super admin only)
export async function POST(request) {
  try {
    const adminAuth = await validateAdminAuth(request);

    if (!adminAuth.isValid) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }

    // Check if admin has permission to create admin users
    if (!hasPermission(adminAuth.permissions, "admins.create")) {
      return NextResponse.json(
        { error: "Insufficient permissions to create admin users" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const {
      email,
      first_name,
      last_name,
      role = "staff",
      department,
      permissions = {},
      is_active = true,
    } = body;

    if (!email || !first_name || !last_name) {
      return NextResponse.json(
        { error: "email, first_name, and last_name are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["super_admin", "admin", "manager", "staff"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingAdmin, error: checkError } = await supabaseAdmin
      .from("admin_users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin user with this email already exists" },
        { status: 409 }
      );
    }

    // Create the admin user
    const adminData = {
      email: email.toLowerCase().trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      role,
      department: department?.trim(),
      permissions,
      is_active,
    };

    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .insert([adminData])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create admin user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: "Admin user created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
