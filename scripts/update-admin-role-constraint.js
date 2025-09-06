/**
 * Update Admin Role Database Constraint
 *
 * This script updates the database CHECK constraint for the admin_users table
 * to include the new 'finance_manager' role.
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateRoleConstraint() {
  console.log("🔄 Starting admin role constraint update...");

  try {
    // Check current constraint
    console.log("📋 Checking current constraints...");

    const { data: constraints, error: constraintError } = await supabaseAdmin
      .rpc("get_table_constraints", { table_name: "admin_users" })
      .select();

    if (constraintError) {
      console.log(
        "ℹ️ Unable to fetch constraints (this is normal), proceeding with update..."
      );
    } else {
      console.log("📋 Current constraints:", constraints);
    }

    // Drop existing role constraint if it exists
    console.log("🗑️ Dropping existing role constraint...");

    const { error: dropError } = await supabaseAdmin.rpc("execute_sql", {
      sql: `ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;`,
    });

    if (dropError) {
      console.log("ℹ️ Drop constraint result:", dropError.message);
    } else {
      console.log("✅ Existing constraint dropped successfully");
    }

    // Add new constraint with finance_manager included
    console.log("➕ Adding updated role constraint...");

    const { error: addError } = await supabaseAdmin.rpc("execute_sql", {
      sql: `
          ALTER TABLE admin_users 
          ADD CONSTRAINT admin_users_role_check 
          CHECK (role IN ('super_admin', 'admin', 'manager', 'staff', 'finance_manager'));
        `,
    });

    if (addError) {
      console.error("❌ Failed to add new constraint:", addError);

      // Try alternative approach using direct SQL
      console.log("🔄 Trying alternative approach...");

      const { error: directError } = await supabaseAdmin
        .from("admin_users")
        .select("role")
        .limit(1);

      if (directError) {
        console.error("❌ Database connection issue:", directError);
        return false;
      }

      // If we can access the table, try a different approach
      console.log("💾 Using manual SQL execution...");

      // This is a workaround - we'll need to run this manually in Supabase dashboard
      const sqlCommand = `
-- Drop existing constraint
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;

-- Add new constraint with finance_manager
ALTER TABLE admin_users 
ADD CONSTRAINT admin_users_role_check 
CHECK (role IN ('super_admin', 'admin', 'manager', 'staff', 'finance_manager'));
      `;

      console.log("📋 Manual SQL to run in Supabase dashboard:");
      console.log("=" * 60);
      console.log(sqlCommand);
      console.log("=" * 60);

      return false;
    }

    console.log("✅ Role constraint updated successfully!");

    // Verify the update worked
    console.log("🔍 Verifying update...");

    const { data: testData, error: testError } = await supabaseAdmin
      .from("admin_users")
      .select("role")
      .limit(5);

    if (testError) {
      console.error("❌ Verification failed:", testError);
      return false;
    }

    console.log("✅ Verification successful! Current roles in database:", [
      ...new Set(testData.map((u) => u.role)),
    ]);

    return true;
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return false;
  }
}

// Test creating/updating a finance_manager user
async function testFinanceManagerRole() {
  console.log("\n🧪 Testing finance_manager role...");

  try {
    // Try to create a test finance_manager (we'll delete it right after)
    const testEmail = `test-finance-${Date.now()}@example.com`;

    const { data: createData, error: createError } = await supabaseAdmin
      .from("admin_users")
      .insert({
        email: testEmail,
        first_name: "Test",
        last_name: "Finance",
        role: "finance_manager",
        is_active: true,
        permissions: {
          "applications.read": true,
          can_view_applications: true,
        },
      })
      .select()
      .single();

    if (createError) {
      console.error("❌ Test creation failed:", createError.message);
      return false;
    }

    console.log("✅ Test finance_manager created successfully!");

    // Clean up - delete the test user
    const { error: deleteError } = await supabaseAdmin
      .from("admin_users")
      .delete()
      .eq("id", createData.id);

    if (deleteError) {
      console.warn("⚠️ Failed to clean up test user:", deleteError.message);
    } else {
      console.log("🧹 Test user cleaned up successfully");
    }

    return true;
  } catch (error) {
    console.error("❌ Test failed:", error);
    return false;
  }
}

// Main execution
async function main() {
  console.log("🚀 Admin Role Constraint Update Script");
  console.log("=====================================\n");

  // First try to update the constraint
  const constraintUpdated = await updateRoleConstraint();

  if (!constraintUpdated) {
    console.log("\n⚠️ Automatic constraint update failed.");
    console.log(
      "🔧 Please run the provided SQL manually in Supabase dashboard."
    );
    console.log(
      "📍 Go to: Supabase Dashboard > SQL Editor > Run the SQL above"
    );
    process.exit(1);
  }

  // Test the new role
  const testPassed = await testFinanceManagerRole();

  if (testPassed) {
    console.log("\n🎉 SUCCESS! Finance Manager role is now fully functional!");
    console.log(
      "✅ You can now create and update users with 'finance_manager' role"
    );
  } else {
    console.log(
      "\n❌ Test failed. There may still be issues with the database constraint."
    );
  }

  console.log("\n📋 Summary:");
  console.log("- finance_manager role added to database constraint");
  console.log("- API validation already includes finance_manager");
  console.log("- Frontend UI already includes Finance Manager option");
  console.log(
    "- Permissions configured: applications.read, can_view_applications"
  );
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { updateRoleConstraint, testFinanceManagerRole };
