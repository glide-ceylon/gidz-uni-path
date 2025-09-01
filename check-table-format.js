// Check student_visa table structure to understand data column type

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://cpzkzyokznbrayxnyfin.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwemt6eW9rem5icmF5eG55ZmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMjU0MDYsImV4cCI6MjA0OTYwMTQwNn0.LXLcZUOKm9OJ-J-f-TygDAVGpMQRVAYNxFZs5n7uyK8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log("🔍 Checking student_visa table structure...\n");

  try {
    // Try to get table schema information
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_name", "student_visa");

    if (tablesError) {
      console.log(
        "❌ Could not fetch schema directly. Error:",
        tablesError.message
      );
      console.log("🔄 Trying alternative approach...\n");

      // Alternative: Try to fetch a sample record to understand structure
      const { data: sampleData, error: sampleError } = await supabase
        .from("student_visa")
        .select("*")
        .limit(1);

      if (sampleError) {
        console.log(
          "❌ Could not fetch sample data. Error:",
          sampleError.message
        );
        return;
      }

      if (sampleData && sampleData.length > 0) {
        console.log("📋 Sample record structure:");
        const record = sampleData[0];
        Object.entries(record).forEach(([key, value]) => {
          console.log(
            `  ${key}: ${typeof value} ${Array.isArray(value) ? "(array)" : ""}`
          );
          if (key === "data") {
            console.log(`    Sample data type: ${typeof value}`);
            if (typeof value === "string") {
              try {
                const parsed = JSON.parse(value);
                console.log("    ✅ Data is stored as JSON string");
                console.log(
                  "    📄 Parsed data keys:",
                  Object.keys(parsed).join(", ")
                );
              } catch (e) {
                console.log("    ❌ Data is not valid JSON string");
              }
            } else if (typeof value === "object") {
              console.log("    ✅ Data is stored as JSON object");
              console.log("    📄 Object keys:", Object.keys(value).join(", "));
            }
          }
        });
      } else {
        console.log("📭 No records found in table");
      }
    } else {
      console.log("📋 Table schema:");
      tables.forEach((col) => {
        console.log(
          `  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`
        );
      });
    }

    // Test with a simple insert to see what format works
    console.log("\n🧪 Testing data insertion formats...");

    const testData = {
      test: "value",
      number: 123,
      array: ["item1", "item2"],
      nested: { key: "value" },
    };

    // Test 1: Insert as JSON object
    console.log("Test 1: Inserting as JSON object...");
    const { data: result1, error: error1 } = await supabase
      .from("student_visa")
      .insert([{ data: testData }])
      .select();

    if (error1) {
      console.log("❌ JSON object insert failed:", error1.message);
    } else {
      console.log("✅ JSON object insert succeeded");
      console.log("   Inserted data type:", typeof result1[0].data);

      // Clean up test record
      await supabase.from("student_visa").delete().eq("id", result1[0].id);
    }

    // Test 2: Insert as JSON string
    console.log("\nTest 2: Inserting as JSON string...");
    const { data: result2, error: error2 } = await supabase
      .from("student_visa")
      .insert([{ data: JSON.stringify(testData) }])
      .select();

    if (error2) {
      console.log("❌ JSON string insert failed:", error2.message);
    } else {
      console.log("✅ JSON string insert succeeded");
      console.log("   Inserted data type:", typeof result2[0].data);

      // Clean up test record
      await supabase.from("student_visa").delete().eq("id", result2[0].id);
    }
  } catch (error) {
    console.error("❌ Error checking table structure:", error.message);
  }
}

checkTableStructure();
