require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStudentTableStructure() {
  console.log("=== Checking student_visa Table Structure ===");

  try {
    // Get the table structure
    const { data: recentRecords, error: fetchError } = await supabase
      .from("student_visa")
      .select("*")
      .order("id", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("❌ Error fetching records:", fetchError);
      return;
    }

    if (recentRecords.length === 0) {
      console.log("❌ No records found in student_visa table");
      return;
    }

    const latestRecord = recentRecords[0];
    console.log(`✅ Latest Record ID: ${latestRecord.id}`);

    // Check the columns
    const columns = Object.keys(latestRecord);
    console.log("📋 Table columns:", columns);

    try {
      if (latestRecord.data) {
        // JSON format like work_visa
        const parsedData = JSON.parse(latestRecord.data);
        console.log("\n✅ Uses JSON format (like work_visa table)");
        console.log("📄 Parsed Data Structure:");
        console.log(JSON.stringify(parsedData, null, 2));
      } else {
        // Direct columns format
        console.log("\n✅ Uses direct columns format");
        console.log("📄 Record structure:");
        console.log(JSON.stringify(latestRecord, null, 2));
      }
    } catch (parseError) {
      console.log("\n⚠️  Could not parse data column - might be direct format");
      console.log("📄 Raw record:");
      console.log(JSON.stringify(latestRecord, null, 2));
    }
  } catch (error) {
    console.error("❌ Script failed:", error.message);
  }
}

checkStudentTableStructure();
