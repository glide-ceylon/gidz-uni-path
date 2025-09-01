require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatestRecord() {
  console.log("=== Checking Latest work_visa Record ===");

  try {
    // Get the most recent record
    const { data: latestRecord, error } = await supabase
      .from("work_visa")
      .select("*")
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      console.error("❌ Error fetching latest record:", error);
      return;
    }

    if (latestRecord.length === 0) {
      console.log("❌ No records found");
      return;
    }

    const record = latestRecord[0];
    console.log(`✅ Latest Record ID: ${record.id}`);

    try {
      const parsedData = JSON.parse(record.data);
      console.log("\n📄 Parsed Data Structure:");
      console.log(JSON.stringify(parsedData, null, 2));

      console.log("\n🔍 Key Fields Check:");
      console.log(`Name: ${parsedData.firstName} ${parsedData.lastName}`);
      console.log(`Email: ${parsedData.email}`);
      console.log(`Application Date: ${parsedData.applicationDate}`);
      console.log(
        `Applying with Spouse: ${
          parsedData.applyingWithSpouse
        } (${typeof parsedData.applyingWithSpouse})`
      );
      console.log(
        `Blocked Account: ${
          parsedData.blockedAccount
        } (${typeof parsedData.blockedAccount})`
      );
      console.log(
        `Mark as Read: ${
          parsedData.MarkasRead
        } (${typeof parsedData.MarkasRead})`
      );
      console.log(
        `Previous Stay in Germany: ${parsedData.previousStayInGermany}`
      );
    } catch (parseError) {
      console.error("❌ Error parsing JSON data:", parseError);
      console.log("Raw data:", record.data);
    }
  } catch (error) {
    console.error("❌ Script failed:", error.message);
  }
}

checkLatestRecord();
