import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminAuth } from "../../../lib/adminAuth";

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

// GET /api/admin-users - Get all admin users
export async function GET(request) {
  try {
    // Verify admin authentication and permissions
    const adminAuth = await requireAdminAuth(request, [
      "admin.read",
      "can_manage_admins",
    ]);

    if (!adminAuth.isAuthorized) {
      return adminAuth.response;
    }

    const { data: adminUsers, error } = await supabaseAdmin
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
        created_at,
        last_login,
        permissions
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin users:", error);
      return NextResponse.json(
        { error: "Failed to fetch admin users" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: adminUsers,
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin-users - Create new admin user
export async function POST(request) {
  try {
    // Verify admin authentication and permissions
    const adminAuth = await requireAdminAuth(request, [
      "admin.create",
      "can_manage_admins",
    ]);

    if (!adminAuth.isAuthorized) {
      return adminAuth.response;
    }

    const body = await request.json();
    const {
      email,
      first_name,
      last_name,
      role,
      department,
      password,
      permissions,
      create_auth_user = false,
    } = body;

    // Validate required fields
    if (!email || !first_name || !last_name || !role) {
      return NextResponse.json(
        { error: "Email, first name, last name, and role are required" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin user with this email already exists" },
        { status: 400 }
      );
    }

    // Default permissions based on role
    const defaultPermissions = {
      super_admin: {
        "timeline.read": true,
        "timeline.create": true,
        "timeline.update": true,
        "timeline.delete": true,
        "admin.read": true,
        "admin.create": true,
        "admin.update": true,
        "admin.delete": true,
        can_manage_admins: true,
        can_access_all_data: true,
      },
      admin: {
        "timeline.read": true,
        "timeline.create": true,
        "timeline.update": true,
        "timeline.delete": true,
        "admin.read": true,
        can_manage_timeline: true,
      },
      manager: {
        "timeline.read": true,
        "timeline.create": true,
        "timeline.update": true,
        "admin.read": true,
        can_manage_timeline: true,
      },
      staff: {
        "timeline.read": true,
        can_view_basic_data: true,
      },
    };

    const adminData = {
      email: email.toLowerCase().trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      role: role,
      department: department?.trim() || null,
      is_active: true,
      permissions:
        permissions || defaultPermissions[role] || defaultPermissions.staff,
      created_at: new Date().toISOString(),
    };

    // Create Supabase Auth user if requested and password provided
    let authUserId = null;
    if (create_auth_user && password) {
      try {
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.admin.createUser({
            email: email.toLowerCase().trim(),
            password: password,
            email_confirm: true,
          });

        if (authError) {
          console.error("Failed to create auth user:", authError);
          return NextResponse.json(
            {
              error: `Failed to create authentication account: ${authError.message}`,
            },
            { status: 400 }
          );
        }

        authUserId = authData.user.id;
        adminData.auth_user_id = authUserId;
      } catch (authCreateError) {
        console.error("Auth user creation error:", authCreateError);
        return NextResponse.json(
          { error: "Failed to create authentication account" },
          { status: 500 }
        );
      }
    }

    // Create admin user record
    const { data: newAdmin, error: createError } = await supabaseAdmin
      .from("admin_users")
      .insert([adminData])
      .select(
        `
        id,
        email,
        first_name,
        last_name,
        role,
        department,
        is_active,
        created_at,
        permissions
      `
      )
      .single();

    if (createError) {
      console.error("Error creating admin user:", createError);

      // If admin creation failed but auth user was created, clean up auth user
      if (authUserId) {
        try {
          await supabaseAdmin.auth.admin.deleteUser(authUserId);
        } catch (cleanupError) {
          console.error("Failed to cleanup auth user:", cleanupError);
        }
      }

      return NextResponse.json(
        { error: "Failed to create admin user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newAdmin,
      message: "Admin user created successfully",
    });
  } catch (error) {
    console.error("Admin user creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
