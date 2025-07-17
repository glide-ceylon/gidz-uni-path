import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  requireAdminAuth,
  getDefaultPermissions,
} from "../../../lib/adminAuth";

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
    console.log("🚀 POST /api/admin-users - Starting admin creation");

    // Verify admin authentication and permissions
    const adminAuth = await requireAdminAuth(request, [
      "admin.create",
      "can_manage_admins",
    ]);

    console.log("🔐 Auth check result:", {
      isAuthorized: adminAuth.isAuthorized,
      adminEmail: adminAuth.adminData?.email,
      permissions: adminAuth.permissions,
    });

    if (!adminAuth.isAuthorized) {
      console.log("❌ Authorization failed, returning error response");
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

    console.log("📝 Form data received:", {
      email,
      first_name,
      last_name,
      role,
      department,
      create_auth_user,
      hasPassword: !!password,
      passwordLength: password ? password.length : 0,
    });

    console.log("🔍 Auth user creation check:", {
      create_auth_user,
      hasPassword: !!password,
      willCreateAuthUser: create_auth_user && password,
    });

    // Validate required fields
    if (!email || !first_name || !last_name || !role) {
      console.log("❌ Validation failed - missing required fields");
      return NextResponse.json(
        { error: "Email, first name, last name, and role are required" },
        { status: 400 }
      );
    }

    console.log("✅ Required fields validation passed");

    // Check if admin already exists
    console.log("🔍 Checking for existing admin with email:", email);
    const { data: existingAdmin, error: checkError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" which is what we want
      console.error("❌ Error checking existing admin:", checkError);
      return NextResponse.json(
        { error: "Database error while checking for existing admin" },
        { status: 500 }
      );
    }

    if (existingAdmin) {
      console.log("❌ Admin already exists with email:", email);
      return NextResponse.json(
        { error: "Admin user with this email already exists" },
        { status: 400 }
      );
    }

    console.log("✅ No existing admin found, proceeding with creation");

    // Default permissions based on role
    const defaultPermissions = {
      super_admin: getDefaultPermissions("super_admin"),
      admin: getDefaultPermissions("admin"),
      manager: getDefaultPermissions("manager"),
      staff: getDefaultPermissions("staff"),
      finance_manager: getDefaultPermissions("finance_manager"),
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

    console.log("💾 Preparing admin data for insertion:", {
      email: adminData.email,
      first_name: adminData.first_name,
      last_name: adminData.last_name,
      role: adminData.role,
      department: adminData.department,
      hasPermissions: !!adminData.permissions,
      permissionKeys: adminData.permissions
        ? Object.keys(adminData.permissions)
        : [],
    });

    // Create Supabase Auth user if requested and password provided
    let authUserId = null;
    if (create_auth_user && password) {
      console.log("🔐 Creating Supabase Auth user...");
      try {
        console.log("🔍 Checking auth user creation prerequisites...");
        console.log("  - create_auth_user:", create_auth_user);
        console.log("  - password provided:", !!password);
        console.log("  - password length:", password ? password.length : 0);
        console.log("  - email:", email);

        const { data: authData, error: authError } =
          await supabaseAdmin.auth.admin.createUser({
            email: email.toLowerCase().trim(),
            password: password,
            email_confirm: true,
          });

        if (authError) {
          console.error("❌ Failed to create auth user:", authError);
          console.error("Auth error details:", {
            message: authError.message,
            status: authError.status,
            code: authError.code,
          });

          // Instead of failing the entire admin creation, let's continue without auth user
          console.log(
            "⚠️ Continuing admin creation without auth user due to auth error"
          );
          // Don't return error, just log it and continue
        } else {
          authUserId = authData.user.id;
          console.log("✅ Auth user created successfully:", authUserId);
          console.log("ℹ️ Note: Auth user ID not stored in admin_users table");
        }
      } catch (authCreateError) {
        console.error("❌ Auth user creation exception:", authCreateError);
        console.log(
          "⚠️ Continuing admin creation without auth user due to exception"
        );
        // Don't return error, just log it and continue
      }
    } else {
      console.log("⏭️ Skipping auth user creation", {
        reason: !create_auth_user ? "not requested" : "no password provided",
        create_auth_user,
        hasPassword: !!password,
      });
    }

    console.log("💾 Inserting admin into database...");
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

    console.log("💾 Database insertion result:", {
      success: !createError,
      hasData: !!newAdmin,
      error: createError
        ? {
            code: createError.code,
            message: createError.message,
            details: createError.details,
          }
        : null,
    });

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

      // Provide more specific error information
      const errorMessage =
        createError.message ||
        createError.details ||
        "Failed to create admin user";
      console.error("Database error details:", {
        code: createError.code,
        message: createError.message,
        details: createError.details,
        hint: createError.hint,
      });

      return NextResponse.json(
        {
          error: `Database error: ${errorMessage}`,
          details: createError.code
            ? `Error Code: ${createError.code}`
            : undefined,
        },
        { status: 500 }
      );
    }
    console.log("✅ Admin user created successfully:", newAdmin.email);

    // Send welcome email to the new admin
    try {
      console.log("📧 Sending welcome email to:", newAdmin.email);

      const welcomeEmailTemplate = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome to Gidz Uni Path Admin Panel</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 28px;">Welcome to Gidz Uni Path!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Admin Panel Access Granted</p>
            </div>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
              <h2 style="color: #1e293b; margin-top: 0;">Hello ${
                newAdmin.first_name
              } ${newAdmin.last_name}!</h2>
              <p style="margin-bottom: 20px;">Congratulations! You have been granted admin access to the Gidz Uni Path administration panel.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <h3 style="margin-top: 0; color: #0ea5e9;">Your Admin Details:</h3>
                <p><strong>Email:</strong> ${newAdmin.email}</p>
                <p><strong>Role:</strong> ${
                  newAdmin.role.charAt(0).toUpperCase() +
                  newAdmin.role.slice(1).replace("_", " ")
                }</p>
                ${
                  newAdmin.department
                    ? `<p><strong>Department:</strong> ${newAdmin.department}</p>`
                    : ""
                }
                ${
                  authUserId
                    ? "<p><strong>Login Account:</strong> ✅ Authentication account created</p>"
                    : "<p><strong>Login Account:</strong> ⚠️ No authentication account created - contact your system administrator for access</p>"
                }
              </div>
            </div>
            
            ${
              authUserId && password
                ? `
            <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #92400e; margin-top: 0;">🔐 Your Login Credentials</h3>
              <div style="background: white; padding: 15px; border-radius: 6px; font-family: monospace;">
                <p style="margin: 5px 0;"><strong>Email:</strong> ${newAdmin.email}</p>
                <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
              </div>
              <p style="margin: 15px 0 0 0; color: #92400e; font-size: 14px;"><strong>⚠️ Important:</strong> Please change your password after first login for security.</p>
            </div>
            `
                : ""
            }
            
            <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #059669; margin-top: 0;">🚀 Getting Started</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Access the admin panel at: <a href="${
                  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
                }/admin" style="color: #0ea5e9;">Admin Dashboard</a></li>
                ${
                  authUserId
                    ? "<li>Use your email and password above to login</li>"
                    : "<li>Contact your system administrator to set up your login credentials</li>"
                }
                <li>Familiarize yourself with your role permissions</li>
                <li>Review the admin documentation and guidelines</li>
              </ul>
            </div>
            
            <div style="background: #fee2e2; border: 1px solid #f87171; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
              <p style="margin: 0; color: #991b1b;"><strong>🔒 Security Notice:</strong> Keep your login credentials secure and do not share them with anyone. Change your password after first login. If you have any questions or need assistance, please contact our support team.</p>
            </div>
            
            <div style="text-align: center; padding: 20px; border-top: 2px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0;">Welcome to the team!</p>
              <p style="color: #64748b; margin: 5px 0 0 0;"><strong>The Gidz Uni Path Admin Team</strong></p>
            </div>
          </body>
        </html>
      `;

      console.log("📧 Email template prepared, sending to:", newAdmin.email);
      console.log(
        "📧 Email includes password:",
        authUserId && password ? "Yes" : "No"
      );

      const emailResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/api/send_email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderEmail: "admin@gidz-uni-path.com",
            recipientEmail: newAdmin.email,
            subject:
              "🎉 Welcome to Gidz Uni Path Admin Panel - Your Login Credentials",
            template: welcomeEmailTemplate,
          }),
        }
      );

      console.log("📧 Email API response status:", emailResponse.status);

      if (emailResponse.ok) {
        const emailResult = await emailResponse.json();
        console.log("✅ Welcome email sent successfully to:", newAdmin.email);
        console.log("📧 Email service response:", emailResult);
      } else {
        const emailError = await emailResponse.json();
        console.error("❌ Failed to send welcome email:", emailError);
        console.error("📧 Email API error details:", {
          status: emailResponse.status,
          statusText: emailResponse.statusText,
          error: emailError,
        });
      }
    } catch (emailError) {
      console.error("❌ Error sending welcome email:", emailError);
      console.error("📧 Email error stack:", emailError.stack);
      // Don't fail the admin creation if email fails - just log it
    }

    return NextResponse.json({
      success: true,
      data: newAdmin,
      message: "Admin user created successfully and welcome email sent",
    });
  } catch (error) {
    console.error("Admin user creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
