const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugAdminSession() {
  console.log("🔍 Debugging Admin Session and Permissions...\n");

  const testEmail = "thushanjana@gmail.com";

  try {
    // 1. Check if admin user exists
    console.log("1. Checking admin user in database...");
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("email", testEmail)
      .single();

    if (adminError) {
      console.log("❌ Admin user not found in database:", adminError.message);
      console.log("💡 You need to add this user to the admin_users table");
      return;
    }

    console.log("✅ Admin user found:", adminUser);
    console.log("   ID:", adminUser.id);
    console.log("   Name:", adminUser.first_name, adminUser.last_name);
    console.log("   Role:", adminUser.role);
    console.log("   Active:", adminUser.is_active);

    // 2. Check admin permissions
    console.log("\n2. Checking admin permissions...");

    // Check if permissions are stored in the user's permissions field
    if (adminUser.permissions && typeof adminUser.permissions === "object") {
      const userPermissions = Object.keys(adminUser.permissions).filter(
        (key) => adminUser.permissions[key] === true
      );
      console.log("✅ Admin permissions from user profile:", userPermissions);
    } else {
      console.log("⚠️  No permissions found in user profile");

      // Show role-based default permissions
      let defaultPermissions = [];
      switch (adminUser.role) {
        case "super_admin":
          defaultPermissions = [
            "timeline.read",
            "timeline.create",
            "timeline.update",
            "timeline.delete",
            "admin.read",
            "admin.create",
            "admin.update",
            "admin.delete",
            "can_manage_admins",
            "can_access_all_data",
          ];
          break;
        case "admin":
          defaultPermissions = [
            "timeline.read",
            "timeline.create",
            "timeline.update",
            "timeline.delete",
            "admin.read",
            "can_manage_timeline",
          ];
          break;
        case "manager":
          defaultPermissions = [
            "timeline.read",
            "timeline.update",
            "can_view_reports",
          ];
          break;
        case "staff":
          defaultPermissions = ["timeline.read", "can_view_basic_data"];
          break;
        default:
          defaultPermissions = ["timeline.read"];
      }
      console.log(
        "💡 Would use default permissions for role:",
        defaultPermissions
      );
    }

    // 3. Check recent sessions
    console.log("\n3. Checking recent sessions...");
    const { data: sessions, error: sessionError } = await supabaseAdmin
      .from("admin_sessions")
      .select("*")
      .eq("admin_id", adminUser.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (sessionError) {
      console.log("❌ Error getting sessions:", sessionError.message);
    } else {
      console.log("✅ Recent sessions:");
      sessions.forEach((session, index) => {
        const isExpired = new Date() > new Date(session.expires_at);
        console.log(`   ${index + 1}. Session ${session.id.slice(0, 8)}...`);
        console.log(`      Token: ${session.session_token.slice(0, 16)}...`);
        console.log(`      Active: ${session.is_active}`);
        console.log(`      Expires: ${session.expires_at}`);
        console.log(`      Expired: ${isExpired}`);
        console.log(`      IP: ${session.ip_address}`);
      });
    }

    // 4. Test session validation function
    console.log("\n4. Testing session validation...");
    if (sessions && sessions.length > 0) {
      const latestSession = sessions[0];
      if (
        latestSession.is_active &&
        new Date() <= new Date(latestSession.expires_at)
      ) {
        console.log(
          "🧪 Testing session validation with latest active session..."
        );

        // Mock request object
        const mockRequest = {
          cookies: {
            get: (name) => {
              if (name === "admin_session") {
                return { value: latestSession.session_token };
              }
              return null;
            },
          },
          headers: {
            get: (name) => {
              if (name === "x-session-token") {
                return latestSession.session_token;
              }
              return null;
            },
          },
        };

        // Test the validation manually
        const { data: sessionData, error: validateError } = await supabaseAdmin
          .from("admin_sessions")
          .select(
            `
            id,
            admin_id,
            expires_at,
            is_active,
            admin_users (
              id,
              email,
              first_name,
              last_name,
              role,
              department,
              is_active
            )
          `
          )
          .eq("session_token", latestSession.session_token)
          .eq("is_active", true)
          .single();

        if (validateError) {
          console.log(
            "❌ Session validation query failed:",
            validateError.message
          );
        } else {
          console.log("✅ Session validation query successful");
          console.log("   Session data:", JSON.stringify(sessionData, null, 2));
        }
      }
    }

    // 5. Check if get_admin_permissions function exists
    console.log("\n5. Checking if get_admin_permissions function exists...");
    const { data: functions, error: funcError } = await supabaseAdmin
      .rpc("get_admin_permissions", { admin_email: testEmail })
      .catch((err) => ({ data: null, error: err }));

    if (funcError) {
      console.log(
        "❌ get_admin_permissions function error:",
        funcError.message
      );
      console.log(
        "💡 You may need to create this function or use a different approach"
      );

      // Try alternative approach
      console.log("\n6. Trying alternative permission check...");
      const { data: rolePerms, error: roleError } = await supabaseAdmin
        .from("admin_role_permissions")
        .select(
          `
          permission_name,
          admin_permissions (
            permission_name,
            description
          )
        `
        )
        .eq("role_name", adminUser.role);

      if (roleError) {
        console.log("❌ Role permissions query failed:", roleError.message);
      } else {
        console.log("✅ Role permissions found:", rolePerms);
      }
    }
  } catch (error) {
    console.log("❌ Debug failed:", error.message);
  }
}

// Run the debug
if (require.main === module) {
  debugAdminSession()
    .then(() => {
      console.log("\n🏁 Debug completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Debug failed:", error.message);
      process.exit(1);
    });
}

module.exports = { debugAdminSession };
