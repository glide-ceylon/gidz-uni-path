// Test Supabase Auth user creation specifically
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAuthUserCreation() {
  try {
    console.log("🧪 Testing Supabase Auth user creation...");

    const testEmail = "auth-test@example.com";
    const testPassword = "test123456";

    console.log("📧 Test email:", testEmail);
    console.log("🔑 Test password length:", testPassword.length);

    console.log("🔍 Attempting to create auth user...");

    // Try to create a Supabase Auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true,
      });

    if (authError) {
      console.error("❌ Auth user creation failed:", authError);
      console.error("Error details:", {
        message: authError.message,
        status: authError.status,
        code: authError.code,
      });

      // Check if it's a configuration issue
      if (
        authError.message?.includes("service_role") ||
        authError.message?.includes("admin")
      ) {
        console.log("💡 This might be a service role key configuration issue");
      }

      if (authError.message?.includes("email")) {
        console.log("💡 This might be an email configuration issue");
      }
    } else {
      console.log("✅ Auth user created successfully!");
      console.log("Auth user ID:", authData.user.id);
      console.log("Auth user email:", authData.user.email);

      // Clean up - delete the auth user
      console.log("🧹 Cleaning up auth user...");
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
        authData.user.id
      );

      if (deleteError) {
        console.error("⚠️ Could not delete auth user:", deleteError);
      } else {
        console.log("✅ Auth user cleaned up");
      }
    }
  } catch (error) {
    console.error("❌ Script error:", error);

    if (error.message?.includes("fetch")) {
      console.log("💡 This might be a network or URL configuration issue");
    }
  }
}

testAuthUserCreation();
