// Load environment variables
require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@supabase/supabase-js");

console.log("Environment check:");
console.log(
  "NEXT_PUBLIC_SUPABASE_URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing"
);
console.log(
  "SUPABASE_SERVICE_ROLE_KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing"
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableStructure() {
  try {
    console.log("🔍 Checking admin_users table structure...");

    // Try to get a sample record to see the columns
    const { data: sampleRecords, error: selectError } = await supabase
      .from("admin_users")
      .select("*")
      .limit(1);

    if (selectError) {
      console.error("❌ Error selecting from admin_users:", selectError);
      return;
    }

    console.log("📊 Number of records found:", sampleRecords.length);

    if (sampleRecords.length > 0) {
      const columns = Object.keys(sampleRecords[0]);
      console.log("🏛️ Available columns in admin_users table:");
      columns.forEach((col) => console.log(`  - ${col}`));

      console.log("\n🔍 Checking for auth_user_id column specifically:");
      console.log("  - auth_user_id exists:", columns.includes("auth_user_id"));
    } else {
      console.log("📝 No records found in admin_users table");

      // Try to insert a test record to see what columns are accepted
      console.log("🧪 Testing insertion to discover schema...");
      const { data, error } = await supabase
        .from("admin_users")
        .insert([
          {
            email: "test@test.com",
            first_name: "Test",
            last_name: "User",
            role: "staff",
          },
        ])
        .select()
        .single();

      if (error) {
        console.log("📋 Schema info from error:", error.message);
      } else {
        console.log("✅ Test record created, columns:", Object.keys(data));

        // Clean up test record
        await supabase
          .from("admin_users")
          .delete()
          .eq("email", "test@test.com");
        console.log("🧹 Test record cleaned up");
      }
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

checkTableStructure()
  .then(() => {
    console.log("✅ Table structure check complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("💥 Failed:", err);
    process.exit(1);
  });
