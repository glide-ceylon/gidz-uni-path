const { createClient } = require("@supabase/supabase-js");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error(
    "❌ Missing Supabase configuration. Please set up your .env.local file first."
  );
  process.exit(1);
}

// Using service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkWorkVisaStructure() {
  console.log("🔍 Checking work_visa table structure...");

  try {
    // Check if work_visa table exists and get structure
    const { data: columns, error } = await supabaseAdmin
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_name", "work_visa")
      .eq("table_schema", "public");

    if (error) {
      console.error("❌ Error checking table structure:", error);
      return;
    }

    console.log("✅ work_visa table columns:");
    columns.forEach((col) => {
      console.log(
        `  - ${col.column_name} (${col.data_type}) ${
          col.is_nullable === "YES" ? "(nullable)" : "(not null)"
        }`
      );
    });

    // Check if assignment columns exist
    const assignmentColumns = ["assigned_to", "assigned_at", "assigned_by"];
    const existingColumns = columns.map((col) => col.column_name);

    console.log("\n🔍 Assignment columns check:");
    assignmentColumns.forEach((col) => {
      const exists = existingColumns.includes(col);
      console.log(`  - ${col}: ${exists ? "✅ EXISTS" : "❌ MISSING"}`);
    });

    // Sample a few records to see the structure
    const { data: sample, error: sampleError } = await supabaseAdmin
      .from("work_visa")
      .select("*")
      .limit(2);

    if (sampleError) {
      console.error("❌ Error fetching sample data:", sampleError);
      return;
    }

    console.log("\n📄 Sample records:");
    if (sample && sample.length > 0) {
      console.log(`Found ${sample.length} records`);
      sample.forEach((record, index) => {
        console.log(`Record ${index + 1}:`);
        console.log(`  - ID: ${record.id}`);
        console.log(`  - Created: ${record.created_at}`);
        console.log(`  - Assigned to: ${record.assigned_to || "Not assigned"}`);
        console.log(`  - Assigned at: ${record.assigned_at || "Not assigned"}`);
        console.log(`  - Assigned by: ${record.assigned_by || "Not assigned"}`);
        console.log(
          `  - Data preview: ${JSON.stringify(record.data).substring(
            0,
            100
          )}...`
        );
      });
    } else {
      console.log("No records found in work_visa table");
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

checkWorkVisaStructure();
