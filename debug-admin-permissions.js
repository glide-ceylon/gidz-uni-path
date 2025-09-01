// Debug script to check admin permissions
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAdminPermissions() {
  try {
    console.log("Checking admin users and their permissions...");

    const { data: adminUsers, error } = await supabaseAdmin
      .from("admin_users")
      .select(
        `
        id,
        email,
        first_name,
        last_name,
        role,
        permissions,
        is_active
      `
      )
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching admin users:", error);
      return;
    }

    console.log(`Found ${adminUsers.length} active admin users:`);

    adminUsers.forEach((admin) => {
      console.log(`\n--- ${admin.first_name} ${admin.last_name} ---`);
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
      console.log(`Permissions:`, admin.permissions);

      // Check for admin creation permissions
      const canCreateAdmin =
        admin.permissions?.["admin.create"] ||
        admin.permissions?.can_manage_admins;
      console.log(`Can create admins: ${canCreateAdmin ? "YES" : "NO"}`);
    });

    console.log("\n--- Active Sessions ---");
    const { data: sessions, error: sessionError } = await supabaseAdmin
      .from("admin_sessions")
      .select(
        `
        id,
        admin_id,
        expires_at,
        is_active,
        admin_users (
          email,
          first_name,
          last_name
        )
      `
      )
      .eq("is_active", true);

    if (sessionError) {
      console.error("Error fetching sessions:", sessionError);
      return;
    }

    sessions.forEach((session) => {
      const now = new Date();
      const expiresAt = new Date(session.expires_at);
      const isExpired = now > expiresAt;

      console.log(
        `Session for: ${session.admin_users.first_name} ${session.admin_users.last_name}`
      );
      console.log(`Expires: ${session.expires_at}`);
      console.log(`Is Expired: ${isExpired ? "YES" : "NO"}`);
      console.log(`Current time: ${now.toISOString()}`);
      console.log("---");
    });
  } catch (error) {
    console.error("Script error:", error);
  }
}

checkAdminPermissions();
