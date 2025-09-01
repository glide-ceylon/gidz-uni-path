const { createClient } = require("@supabase/supabase-js");

// Load environment variables
require("dotenv").config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("🔧 Supabase URL:", supabaseUrl ? "Set" : "Not Set");
console.log("🔧 Supabase Service Key:", supabaseServiceKey ? "Set" : "Not Set");

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugStaffLookup() {
  try {
    console.log("🔍 Starting staff lookup debug...");

    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from("admin_users")
      .select("count")
      .single();

    if (testError) {
      console.log("🔍 Connection test result:", { error: testError });
    } else {
      console.log("✅ Supabase connection working");
    }

    // Get all admin users
    const { data: allStaff, error: allError } = await supabase
      .from("admin_users")
      .select("*");

    if (allError) {
      console.error("❌ Error fetching all staff:", allError);
      return;
    }

    console.log(`📊 Total admin users found: ${allStaff.length}`);

    if (allStaff.length > 0) {
      console.log("📊 All admin users in database:");
      allStaff.forEach((staff, index) => {
        console.log(`  ${index + 1}. ID: ${staff.id}`);
        console.log(`     Name: ${staff.first_name} ${staff.last_name}`);
        console.log(`     Role: ${staff.role}`);
        console.log("");
      });

      // Check the specific ID
      const targetId = "9128d9f5-e7e4-48ae-8985-1abd93be455a";
      console.log(`🎯 Looking for specific ID: ${targetId}`);

      const exactMatch = allStaff.find((staff) => staff.id === targetId);
      console.log("🔍 Exact match found:", exactMatch ? "YES" : "NO");

      if (exactMatch) {
        console.log("✅ Match details:", exactMatch);
      }

      // Test query methods on the first staff member (to see if queries work)
      const firstStaffId = allStaff[0].id;
      console.log(`\n🔍 Testing query with first staff ID: ${firstStaffId}`);

      const { data: testQuery, error: testQueryError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", firstStaffId)
        .single();

      console.log("Test query result:", {
        hasData: !!testQuery,
        hasError: !!testQueryError,
        errorMessage: testQueryError?.message,
      });

      if (testQuery) {
        console.log(
          "✅ Query works! Found:",
          testQuery.first_name,
          testQuery.last_name
        );
      }
    } else {
      console.log("❌ No admin users found in database!");
    }
  } catch (err) {
    console.error("❌ Caught error:", err);
  }
}

debugStaffLookup()
  .then(() => {
    console.log("✅ Debug complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Final error:", err);
    process.exit(1);
  });
