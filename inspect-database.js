// Quick database inspector to check the options table structure
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key exists:", !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  console.log(
    "NEXT_PUBLIC_SUPABASE_URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  console.log(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY exists:",
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectOptionsTable() {
  console.log("Inspecting options table...\n");

  try {
    // Get table structure - try to select all columns
    console.log("1. Checking if options table exists and getting sample data:");
    const { data: sampleData, error: sampleError } = await supabase
      .from("options")
      .select("*")
      .limit(5);

    if (sampleError) {
      console.error("Error accessing options table:", {
        message: sampleError.message,
        details: sampleError.details,
        hint: sampleError.hint,
        code: sampleError.code,
      });
      return;
    }

    console.log(
      "Sample data from options table:",
      JSON.stringify(sampleData, null, 2)
    );

    if (sampleData && sampleData.length > 0) {
      console.log("\n2. Column names found:", Object.keys(sampleData[0]));
    }

    // Check for specific columns we're looking for
    console.log("\n3. Checking for visa-related options:");
    const { data: visaOptions, error: visaError } = await supabase
      .from("options")
      .select("*")
      .in("name", [
        "Application Document",
        "Submit Documents",
        "Client Review",
        "Interview Preparation",
        "Appointment Date",
      ]);

    if (visaError) {
      console.error("Error querying visa options:", visaError);
    } else {
      console.log(
        "Visa-related options found:",
        JSON.stringify(visaOptions, null, 2)
      );
    }

    // Check what applications exist
    console.log("\n4. Checking applications table:");
    const { data: applications, error: appError } = await supabase
      .from("applications")
      .select("id, first_name, last_name")
      .limit(3);

    if (appError) {
      console.error("Error accessing applications:", appError);
    } else {
      console.log(
        "Sample applications:",
        JSON.stringify(applications, null, 2)
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

inspectOptionsTable();
