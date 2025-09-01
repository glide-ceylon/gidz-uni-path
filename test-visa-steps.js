// Test script to verify the visa steps functionality
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "your-supabase-url";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-key";
const supabase = createClient(supabaseUrl, supabaseKey);

// Define visa steps
const getVisaSteps = () => [
  {
    step: 1,
    title: "Application Document",
    description: "Complete and submit your visa application documents",
    dbOptionName: "Application Document",
  },
  {
    step: 2,
    title: "Document Submitted on waiting list",
    description: "Your documents are submitted and in the processing queue",
    dbOptionName: "Submit Documents",
  },
  {
    step: 3,
    title: "Under Preliminary Review",
    description: "Embassy is conducting preliminary review of your application",
    dbOptionName: "Client Review",
  },
  {
    step: 4,
    title: "Interview Preparation",
    description: "Prepare for your visa interview if required",
    dbOptionName: "Interview Preparation",
  },
  {
    step: 5,
    title: "Appointment Date",
    description: "Schedule and attend your visa appointment",
    dbOptionName: "Appointment Date",
  },
];

// Test function to fetch visa steps status
async function testFetchVisaStepsStatus(applicationId) {
  console.log(`Testing visa steps fetch for application ID: ${applicationId}`);

  try {
    const steps = getVisaSteps();
    const stepsWithStatus = await Promise.all(
      steps.map(async (step) => {
        try {
          console.log(`Fetching status for: ${step.dbOptionName}`);

          const { data, error } = await supabase
            .from("options")
            .select("option")
            .eq("application_id", applicationId)
            .eq("name", step.dbOptionName);

          if (error) {
            console.error(
              `Error fetching status for ${step.dbOptionName}:`,
              error.message || error
            );
            return { ...step, status: "pending" };
          }

          console.log(`Data for ${step.dbOptionName}:`, data);

          // If the option exists in database, it's completed
          const status =
            data && data.length > 0 && data[0].option ? "completed" : "pending";
          return { ...step, status };
        } catch (stepError) {
          console.error(
            `Exception while fetching status for ${step.dbOptionName}:`,
            stepError.message || stepError
          );
          return { ...step, status: "pending" };
        }
      })
    );

    console.log("Final steps with status:", stepsWithStatus);
    return stepsWithStatus;
  } catch (error) {
    console.error("Error in testFetchVisaStepsStatus:", error.message || error);
    return [];
  }
}

// Test with a sample application ID (replace with a real one from your database)
async function runTest() {
  // First, let's check if we can connect to the database
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Database connection error:", error.message);
      return;
    }

    if (data && data.length > 0) {
      const testAppId = data[0].id;
      console.log(`Using test application ID: ${testAppId}`);
      await testFetchVisaStepsStatus(testAppId);
    } else {
      console.log("No applications found in database");
    }
  } catch (error) {
    console.error("Error running test:", error.message);
  }
}

// Check if this is being run directly
if (require.main === module) {
  runTest();
}

module.exports = { testFetchVisaStepsStatus, getVisaSteps };
