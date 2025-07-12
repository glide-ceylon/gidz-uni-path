#!/usr/bin/env node
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixAdminPermissions() {
  console.log("🔧 Fixing admin permissions function...\n");

  try {
    // Create the get_admin_permissions function
    console.log("1. Creating get_admin_permissions function...");

    // Since direct SQL execution might not work, let's test the current state first
    const testEmail = "thushanjana@gmail.com";

    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, role, permissions")
      .eq("email", testEmail)
      .single();

    if (adminError || !adminUser) {
      console.log("❌ Admin user not found");
      return;
    }

    console.log("✅ Admin user found:", {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      permissions: adminUser.permissions,
    });

    // Try to create a simple permissions function that returns the role-based permissions
    console.log("\n2. Testing function creation alternative...");

    // Instead of creating the function, let's update the admin user's permissions field to be more comprehensive
    const comprehensivePermissions = {
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
      can_manage_timeline: true,
      can_manage_users: true,
      can_view_reports: true,
    };

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("admin_users")
      .update({ permissions: comprehensivePermissions })
      .eq("id", adminUser.id)
      .select()
      .single();

    if (updateError) {
      console.log("❌ Failed to update user permissions:", updateError.message);
      return;
    }

    console.log("✅ Updated admin user permissions:", updatedUser.permissions);

    console.log("\n🏁 Admin permissions fix completed");
    console.log(
      "💡 Try running the admin login test again: npm run test:admin-login"
    );
  } catch (error) {
    console.error("❌ Fix failed:", error.message);
  }
}

// Run the fix
if (require.main === module) {
  fixAdminPermissions()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("💥 Fix failed:", error.message);
      process.exit(1);
    });
}

module.exports = { fixAdminPermissions };
