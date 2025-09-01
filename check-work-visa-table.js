const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkWorkVisaTable() {
  try {
    console.log("🔍 Checking work_visa table structure...");

    // Get first record to see structure
    const { data, error } = await supabase
      .from("work_visa")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Error:", error);
      return;
    }

    if (data && data.length > 0) {
      console.log("📊 Work visa table columns:");
      Object.keys(data[0]).forEach((key) => {
        console.log(`  - ${key}: ${typeof data[0][key]}`);
      });

      // Check if assignment columns exist
      const hasAssignmentCols = [
        "assigned_to",
        "assigned_at",
        "assigned_by",
      ].some((col) => Object.keys(data[0]).includes(col));

      console.log(
        `\n🎯 Assignment columns exist: ${hasAssignmentCols ? "YES" : "NO"}`
      );

      if (!hasAssignmentCols) {
        console.log("❌ Need to add assignment columns to work_visa table");
      }
    } else {
      console.log("📊 No records found in work_visa table");
    }
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

checkWorkVisaTable().then(() => process.exit(0));
