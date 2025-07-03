const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addAdminUser() {
  console.log("🔧 Adding admin user to admin_users table...\n");

  const adminData = {
    email: "thushanjana@gmail.com",
    first_name: "Thushan",
    last_name: "Jana",
    role: "super_admin",
    department: "IT",
    is_active: true,
    created_at: new Date().toISOString(),
  };

  try {
    // Check if user already exists
    console.log("1. Checking if admin user already exists...");
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("email", adminData.email)
      .single();

    if (existingUser) {
      console.log("✅ Admin user already exists:", existingUser);
      console.log("   ID:", existingUser.id);
      console.log("   Name:", existingUser.first_name, existingUser.last_name);
      console.log("   Role:", existingUser.role);
      console.log("   Active:", existingUser.is_active);
      return existingUser;
    }

    // Create new admin user
    console.log("2. Creating new admin user...");
    const { data: newUser, error: createError } = await supabaseAdmin
      .from("admin_users")
      .insert([adminData])
      .select()
      .single();

    if (createError) {
      console.log("❌ Failed to create admin user:", createError.message);
      return null;
    }

    console.log("✅ Admin user created successfully:", newUser);

    // Add permissions for super_admin role
    console.log("\n3. Checking role permissions...");
    const { data: rolePerms, error: roleError } = await supabaseAdmin
      .from("admin_role_permissions")
      .select("*")
      .eq("role_name", "super_admin");

    if (roleError || !rolePerms || rolePerms.length === 0) {
      console.log("⚠️  No permissions found for super_admin role");
      console.log("💡 Adding default permissions...");

      const defaultPermissions = [
        "timeline.read",
        "timeline.create",
        "timeline.update",
        "timeline.delete",
        "admin.read",
        "admin.create",
        "admin.update",
        "admin.delete",
      ];

      for (const permission of defaultPermissions) {
        // Check if permission exists
        const { data: permExists } = await supabaseAdmin
          .from("admin_permissions")
          .select("id")
          .eq("permission_name", permission)
          .single();

        if (!permExists) {
          // Create permission
          await supabaseAdmin.from("admin_permissions").insert([
            {
              permission_name: permission,
              description: `Permission for ${permission.replace(".", " ")}`,
            },
          ]);
        }

        // Add role permission
        await supabaseAdmin
          .from("admin_role_permissions")
          .insert([
            {
              role_name: "super_admin",
              permission_name: permission,
            },
          ])
          .select();
      }

      console.log("✅ Default permissions added for super_admin role");
    } else {
      console.log(
        "✅ Role permissions already exist:",
        rolePerms.length,
        "permissions"
      );
    }

    return newUser;
  } catch (error) {
    console.log("❌ Error:", error.message);
    return null;
  }
}

// Run the script
if (require.main === module) {
  addAdminUser()
    .then((result) => {
      if (result) {
        console.log("\n🏁 Admin user setup completed successfully");
      } else {
        console.log("\n❌ Admin user setup failed");
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Setup failed:", error.message);
      process.exit(1);
    });
}

module.exports = { addAdminUser };
