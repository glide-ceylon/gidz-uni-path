#!/usr/bin/env node

/**
 * Admin Users Setup Script
 *
 * This script helps you create initial admin users for your Timeline Events system.
 * Run this after setting up the database schema.
 *
 * Usage: node scripts/setup-admin-users.js
 */

const { createClient } = require("@supabase/supabase-js");
const readline = require("readline");

// Load environment variables
require("dotenv").config();

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error(
    "❌ Missing Supabase configuration. Please set up your .env.local file first."
  );
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createAdminUser() {
  console.log("\n👤 Create Admin User\n");

  const email = await askQuestion("Enter admin email: ");
  const firstName = await askQuestion("Enter first name: ");
  const lastName = await askQuestion("Enter last name: ");
  const department = await askQuestion("Enter department (optional): ");

  console.log("\nAvailable roles:");
  console.log("1. super_admin - Full system access");
  console.log("2. admin - Most permissions except admin management");
  console.log("3. manager - Read/update permissions + request approval");
  console.log("4. staff - Basic read permissions (Student Visa Consultant)");
  console.log("5. finance_manager - Applications read-only access");

  const roleChoice = await askQuestion("Select role (1-5): ");

  const roles = {
    1: "super_admin",
    2: "admin",
    3: "manager",
    4: "staff",
    5: "finance_manager",
  };

  const role = roles[roleChoice] || "staff";

  try {
    // Check if admin already exists
    const { data: existing, error: checkError } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", email.trim())
      .single();

    if (existing) {
      console.log("❌ Admin user with this email already exists");
      return false;
    }

    // Create admin user
    const { data, error } = await supabase
      .from("admin_users")
      .insert([
        {
          email: email.trim().toLowerCase(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          role,
          department: department.trim() || null,
          is_active: true,
          permissions: {},
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Failed to create admin user:", error.message);
      return false;
    }

    console.log("\n✅ Admin user created successfully!");
    console.log(`📧 Email: ${data.email}`);
    console.log(`👤 Name: ${data.first_name} ${data.last_name}`);
    console.log(`🔒 Role: ${data.role}`);
    console.log(`🏢 Department: ${data.department || "Not specified"}`);

    return true;
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    return false;
  }
}

async function listAdminUsers() {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select(
        "id, email, first_name, last_name, role, department, is_active, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Failed to fetch admin users:", error.message);
      return;
    }

    console.log("\n📋 Current Admin Users:\n");

    if (data.length === 0) {
      console.log("No admin users found.");
      return;
    }

    data.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.first_name} ${admin.last_name}`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   🔒 Role: ${admin.role}`);
      console.log(`   🏢 Department: ${admin.department || "Not specified"}`);
      console.log(`   ✅ Active: ${admin.is_active ? "Yes" : "No"}`);
      console.log(
        `   📅 Created: ${new Date(admin.created_at).toLocaleDateString()}`
      );
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error fetching admin users:", error.message);
  }
}

async function createDefaultAdmins() {
  console.log("\n🔧 Creating default admin users...\n");

  const defaultAdmins = [
    {
      email: "admin@gidz-uni-path.com",
      first_name: "System",
      last_name: "Administrator",
      role: "super_admin",
      department: "IT",
    },
    {
      email: "manager@gidz-uni-path.com",
      first_name: "Application",
      last_name: "Manager",
      role: "admin",
      department: "Operations",
    },
    {
      email: "staff@gidz-uni-path.com",
      first_name: "Support",
      last_name: "Staff",
      role: "staff",
      department: "Support",
    },
  ];

  let created = 0;

  for (const admin of defaultAdmins) {
    try {
      // Check if admin already exists
      const { data: existing } = await supabase
        .from("admin_users")
        .select("id")
        .eq("email", admin.email)
        .single();

      if (existing) {
        console.log(`⏭️  ${admin.email} already exists, skipping...`);
        continue;
      }

      const { data, error } = await supabase
        .from("admin_users")
        .insert([
          {
            ...admin,
            is_active: true,
            permissions: {},
          },
        ])
        .select()
        .single();

      if (error) {
        console.error(`❌ Failed to create ${admin.email}:`, error.message);
      } else {
        console.log(`✅ Created ${admin.email} (${admin.role})`);
        created++;
      }
    } catch (error) {
      console.error(`❌ Error creating ${admin.email}:`, error.message);
    }
  }

  console.log(`\n🎉 Created ${created} default admin users!`);

  if (created > 0) {
    console.log(
      "\n⚠️  Important: Please update these default email addresses with real admin emails!"
    );
    console.log(
      "You can update them through the admin API or directly in your Supabase dashboard."
    );
  }
}

async function main() {
  console.log("🔑 Admin Users Setup for Timeline Events System");
  console.log("==============================================\n");

  // Test database connection
  try {
    const { error } = await supabase
      .from("admin_users")
      .select("count")
      .limit(1);
    if (error) {
      console.error("❌ Database connection failed:", error.message);
      console.log(
        "Make sure you have run the database migration first: npm run db:migrate"
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log(
      "Make sure you have run the database migration first: npm run db:migrate"
    );
    process.exit(1);
  }

  while (true) {
    console.log("\nChoose an option:");
    console.log("1. List existing admin users");
    console.log("2. Create new admin user");
    console.log("3. Create default admin users");
    console.log("4. Exit");

    const choice = await askQuestion("\nEnter your choice (1-4): ");

    switch (choice.trim()) {
      case "1":
        await listAdminUsers();
        break;
      case "2":
        await createAdminUser();
        break;
      case "3":
        await createDefaultAdmins();
        break;
      case "4":
        console.log("👋 Goodbye!");
        rl.close();
        return;
      default:
        console.log("❌ Invalid choice. Please select 1-4.");
    }
  }
}

// Handle Ctrl+C
process.on("SIGINT", () => {
  console.log("\n👋 Goodbye!");
  rl.close();
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = { createAdminUser, listAdminUsers, createDefaultAdmins };
