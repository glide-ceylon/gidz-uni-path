// Test admin creation directly
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminCreation() {
  try {
    console.log("Testing admin creation...");

    // Test data
    const testAdmin = {
      email: "test-admin@example.com",
      first_name: "Test",
      last_name: "Admin",
      role: "staff",
      department: "IT",
      is_active: true,
      permissions: {
        "timeline.read": true,
        can_view_basic_data: true,
      },
      created_at: new Date().toISOString(),
    };

    console.log("Attempting to create admin:", testAdmin);

    // Try to create admin directly
    const { data: newAdmin, error: createError } = await supabaseAdmin
      .from("admin_users")
      .insert([testAdmin])
      .select()
      .single();

    if (createError) {
      console.error("❌ Error creating admin:", createError);
      return;
    }

    console.log("✅ Admin created successfully:", newAdmin);

    // Clean up - delete the test admin
    const { error: deleteError } = await supabaseAdmin
      .from("admin_users")
      .delete()
      .eq("email", "test-admin@example.com");

    if (deleteError) {
      console.error("Warning: Could not delete test admin:", deleteError);
    } else {
      console.log("✅ Test admin cleaned up");
    }
  } catch (error) {
    console.error("Script error:", error);
  }
}

testAdminCreation();
