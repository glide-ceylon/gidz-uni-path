/**
 * Quick Database Fix for Finance Manager Role
 * Run this in Node.js with your environment variables properly set
 */

const { createClient } = require("@supabase/supabase-js");

// Replace these with your actual values or load from environment
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL_HERE";
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_SERVICE_KEY_HERE";

async function fixRoleConstraint() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  console.log("🔧 Attempting to fix role constraint...");

  try {
    // Test current constraint by trying to insert finance_manager
    const testResult = await supabase
      .from("admin_users")
      .select("role")
      .eq("role", "finance_manager")
      .limit(1);

    console.log(
      "📋 Current finance_manager users:",
      testResult.data?.length || 0
    );

    if (testResult.error) {
      console.log("❌ Database access error:", testResult.error.message);
      console.log("\n📋 Manual SQL to run in Supabase Dashboard:");
      console.log("=" * 60);
      console.log(`
-- Drop existing role constraint
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;

-- Add new constraint with finance_manager included  
ALTER TABLE admin_users 
ADD CONSTRAINT admin_users_role_check 
CHECK (role IN ('super_admin', 'admin', 'manager', 'staff', 'finance_manager'));
      `);
      console.log("=" * 60);
    } else {
      console.log("✅ Database constraint appears to be working!");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

fixRoleConstraint();
