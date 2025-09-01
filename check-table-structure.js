// Check work_visa table structure
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableStructure() {
  console.log("=== Checking work_visa Table Structure ===");

  try {
    // Get a sample record to understand the structure
    const { data, error } = await supabase
      .from("work_visa")
      .select("*")
      .limit(1);

    if (error) {
      console.log("❌ Error:", error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log("✅ Table structure:");
      console.log("Columns:", Object.keys(data[0]));
      console.log("\nSample record:");
      console.log(JSON.stringify(data[0], null, 2));

      // Check if data is stored in a JSON column
      if (data[0].data) {
        console.log("\n📋 Parsed data column:");
        try {
          const parsedData = JSON.parse(data[0].data);
          console.log(JSON.stringify(parsedData, null, 2));
        } catch (e) {
          console.log("Could not parse data column as JSON");
        }
      }
    } else {
      console.log("📝 Table exists but is empty");
    }
  } catch (err) {
    console.log("❌ Unexpected error:", err.message);
  }
}

checkTableStructure();
