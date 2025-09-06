// Test admin creation WITHOUT auth user creation
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminCreationNoAuth() {
  try {
    console.log("🧪 Testing admin creation WITHOUT auth user...");

    // Test data - exactly like form submission with NO auth user creation
    const formData = {
      email: "no-auth-test@example.com",
      first_name: "NoAuth",
      last_name: "Test",
      role: "staff",
      department: "Testing",
      create_auth_user: false, // Explicitly false
      password: "", // Empty password
    };

    console.log("Form data being sent:", formData);

    // Simulate the exact API logic WITHOUT creating auth user
    const defaultPermissions = {
      staff: {
        "timeline.read": true,
        can_view_basic_data: true,
      },
    };

    const adminData = {
      email: formData.email.toLowerCase().trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      role: formData.role,
      department: formData.department?.trim() || null,
      is_active: true,
      permissions: defaultPermissions[formData.role],
      created_at: new Date().toISOString(),
      // Note: NO auth_user_id field since we're not creating auth user
    };

    console.log("Admin data for insertion:", adminData);

    // Check auth user creation logic
    const willCreateAuthUser = formData.create_auth_user && formData.password;
    console.log("Will create auth user?", willCreateAuthUser);

    if (willCreateAuthUser) {
      console.log("❌ Should NOT create auth user in this test!");
      return;
    } else {
      console.log("✅ Correctly skipping auth user creation");
    }

    // Try database insertion
    console.log("🔍 Attempting database insertion...");
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
      console.error("❌ Database insertion failed:", createError);
      console.error("Error details:", {
        code: createError.code,
        message: createError.message,
        details: createError.details,
        hint: createError.hint,
      });
    } else {
      console.log("✅ Admin created successfully without auth user!");
      console.log("New admin:", newAdmin);

      // Clean up
      await supabaseAdmin.from("admin_users").delete().eq("id", newAdmin.id);
      console.log("✅ Test admin cleaned up");
    }
  } catch (error) {
    console.error("❌ Script error:", error);
  }
}

testAdminCreationNoAuth();
