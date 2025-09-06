// Test the API endpoint directly with mock session
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAPICall() {
  try {
    console.log("Testing API call flow...");

    // First, let's check what active sessions exist
    console.log("🔍 Checking active sessions...");
    const { data: sessions, error: sessionError } = await supabaseAdmin
      .from("admin_sessions")
      .select(
        `
        id,
        admin_id,
        session_token,
        expires_at,
        is_active,
        admin_users (
          email,
          first_name,
          last_name,
          role,
          permissions
        )
      `
      )
      .eq("is_active", true);

    if (sessionError) {
      console.error("❌ Error fetching sessions:", sessionError);
      return;
    }

    console.log(`Found ${sessions.length} active sessions:`);

    // Find a valid session for a super admin
    let validSession = null;
    sessions.forEach((session, index) => {
      const now = new Date();
      const expiresAt = new Date(session.expires_at);
      const isExpired = now > expiresAt;

      console.log(`Session ${index + 1}:`);
      console.log(
        `  Admin: ${session.admin_users.first_name} ${session.admin_users.last_name}`
      );
      console.log(`  Email: ${session.admin_users.email}`);
      console.log(`  Role: ${session.admin_users.role}`);
      console.log(`  Expired: ${isExpired ? "YES" : "NO"}`);
      console.log(`  Token: ${session.session_token.substring(0, 20)}...`);

      if (
        !isExpired &&
        session.admin_users.role === "super_admin" &&
        !validSession
      ) {
        validSession = session;
        console.log(`  ✅ Using this session for test`);
      }
      console.log("");
    });

    if (!validSession) {
      console.error("❌ No valid super admin session found");
      return;
    }

    console.log("🧪 Testing admin creation with valid session...");

    // Simulate the API call
    const formData = {
      email: "api-test-admin@example.com",
      first_name: "API",
      last_name: "Test",
      role: "staff",
      department: "Testing",
      create_auth_user: false,
    };

    console.log("📤 Making API call with session token...");
    console.log("Form data:", formData);
    console.log(
      "Session token:",
      validSession.session_token.substring(0, 20) + "..."
    );

    // Test the actual API endpoint
    const response = await fetch("http://localhost:3000/api/admin-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `admin_session=${validSession.session_token}`,
      },
      body: JSON.stringify(formData),
    });

    console.log("📥 Response status:", response.status);
    const responseData = await response.json();
    console.log("📥 Response data:", responseData);

    if (response.ok) {
      console.log("✅ Admin creation successful via API!");

      // Clean up the created admin
      if (responseData.data && responseData.data.id) {
        await supabaseAdmin
          .from("admin_users")
          .delete()
          .eq("id", responseData.data.id);
        console.log("✅ Test admin cleaned up");
      }
    } else {
      console.log("❌ Admin creation failed via API");
    }
  } catch (error) {
    console.error("Script error:", error);
  }
}

testAPICall();
