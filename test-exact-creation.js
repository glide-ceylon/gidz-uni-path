// Test admin creation with the exact same data structure
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminCreationWithSameData() {
  try {
    console.log("Testing admin creation with form data structure...");

    // Simulate the exact form data structure from the frontend
    const createForm = {
      email: "test-new-admin@example.com",
      first_name: "Test",
      last_name: "NewAdmin",
      role: "staff",
      department: "Testing",
      password: "",
      create_auth_user: false,
    };

    console.log("Form data:", createForm);

    // Default permissions based on role (copied from API)
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

    // Create admin data exactly like the API does
    const adminData = {
      email: createForm.email.toLowerCase().trim(),
      first_name: createForm.first_name.trim(),
      last_name: createForm.last_name.trim(),
      role: createForm.role,
      department: createForm.department?.trim() || null,
      is_active: true,
      permissions:
        defaultPermissions[createForm.role] || defaultPermissions.staff,
      created_at: new Date().toISOString(),
    };

    console.log("Admin data to insert:", adminData);
    console.log("Permissions:", JSON.stringify(adminData.permissions, null, 2));

    // Try to insert
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
      console.error("❌ Database error:", createError);
      console.error("Error details:", {
        code: createError.code,
        message: createError.message,
        details: createError.details,
        hint: createError.hint,
      });
    } else {
      console.log("✅ Admin created successfully:", newAdmin);

      // Clean up - delete the test admin
      await supabaseAdmin.from("admin_users").delete().eq("id", newAdmin.id);
      console.log("✅ Test admin cleaned up");
    }
  } catch (error) {
    console.error("Script error:", error);
  }
}

testAdminCreationWithSameData();
