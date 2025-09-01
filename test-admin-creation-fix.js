// Test admin creation without auth_user_id field
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminCreation() {
  try {
    console.log("🧪 Testing admin creation without auth_user_id...");

    const adminData = {
      email: "test-fix@example.com",
      first_name: "Test",
      last_name: "Fix",
      role: "staff",
      department: "Testing",
      is_active: true,
      permissions: {
        "timeline.read": true,
        can_view_basic_data: true,
      },
      created_at: new Date().toISOString(),
    };

    console.log("📝 Admin data to insert:", adminData);

    // Test insertion
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
      console.error("❌ Admin creation failed:", createError);
      console.error("Error details:", {
        code: createError.code,
        message: createError.message,
        details: createError.details,
        hint: createError.hint,
      });
    } else {
      console.log("✅ Admin created successfully!");
      console.log("Created admin:", newAdmin);

      // Clean up test record
      console.log("🧹 Cleaning up test record...");
      await supabaseAdmin
        .from("admin_users")
        .delete()
        .eq("email", "test-fix@example.com");
      console.log("✅ Test record cleaned up");
    }
  } catch (error) {
    console.error("💥 Test failed:", error);
  }
}

testAdminCreation()
  .then(() => {
    console.log("🎯 Test complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("💥 Test error:", err);
    process.exit(1);
  });
