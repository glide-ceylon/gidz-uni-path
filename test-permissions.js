// Test the exact permission check that the API uses
require("dotenv").config();
const { validateAdminSession, requireAdminAuth } = require("./lib/adminAuth");

async function testPermissionCheck() {
  try {
    console.log("Testing permission validation...");

    // We know from the browser that thushanjana@gmail.com has a valid session
    // Let's find their session token from the database first
    const { createClient } = require("@supabase/supabase-js");

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get the current valid session for thushanjana@gmail.com
    const { data: sessions, error: sessionError } = await supabaseAdmin
      .from("admin_sessions")
      .select(
        `
        id,
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

    // Find thushanjana's valid session
    let validSession = null;
    const now = new Date();

    sessions.forEach((session) => {
      const expiresAt = new Date(session.expires_at);
      const isExpired = now > expiresAt;

      if (!isExpired && session.admin_users.email === "thushanjana@gmail.com") {
        validSession = session;
      }
    });

    if (!validSession) {
      console.error("❌ No valid session found for thushanjana@gmail.com");
      return;
    }

    console.log("✅ Found valid session for:", validSession.admin_users.email);
    console.log("Admin permissions:", validSession.admin_users.permissions);

    // Create a mock request object with the session token
    const mockRequest = {
      cookies: {
        get: (name) => {
          if (name === "admin_session") {
            return { value: validSession.session_token };
          }
          return null;
        },
      },
      headers: {
        get: () => null,
      },
    };

    console.log("🔍 Testing session validation...");
    const sessionResult = await validateAdminSession(mockRequest);

    console.log("Session validation result:", {
      isValid: sessionResult.isValid,
      adminEmail: sessionResult.adminData?.email,
      permissionCount: sessionResult.permissions?.length || 0,
      permissions: sessionResult.permissions,
    });

    if (!sessionResult.isValid) {
      console.log("❌ Session validation failed");
      return;
    }

    console.log("🔍 Testing admin auth with creation permissions...");
    const authResult = await requireAdminAuth(mockRequest, [
      "admin.create",
      "can_manage_admins",
    ]);

    console.log("Admin auth result:", {
      isAuthorized: authResult.isAuthorized,
      adminEmail: authResult.adminData?.email,
      permissionCount: authResult.permissions?.length || 0,
      hasAdminCreate: authResult.permissions?.includes("admin.create"),
      hasCanManageAdmins: authResult.permissions?.includes("can_manage_admins"),
    });

    if (authResult.isAuthorized) {
      console.log("✅ Permission check passed! Admin can create other admins.");
    } else {
      console.log("❌ Permission check failed!");
      if (authResult.response) {
        const responseText = await authResult.response.text();
        console.log("Error response:", responseText);
      }
    }
  } catch (error) {
    console.error("Script error:", error);
  }
}

testPermissionCheck();
