// Test the updated visa steps function with better error handling
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Mock the visa steps function from the React component
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

// Updated visa steps function with enhanced error handling
async function testFetchVisaStepsStatus(applicationId) {
  try {
    // Check if applicationId is valid
    if (!applicationId) {
      console.warn("No applicationId provided to fetchVisaStepsStatus");
      return [];
    }

    console.log(
      "Starting fetchVisaStepsStatus for applicationId:",
      applicationId
    );

    const steps = getVisaSteps();
    console.log(
      "Visa steps to check:",
      steps.map((s) => s.dbOptionName)
    );

    const stepsWithStatus = await Promise.all(
      steps.map(async (step) => {
        try {
          console.log(`Querying database for step: ${step.dbOptionName}`);

          const { data, error } = await supabase
            .from("options")
            .select("option")
            .eq("application_id", applicationId)
            .eq("name", step.dbOptionName);

          if (error) {
            console.error(`Error fetching status for ${step.dbOptionName}:`, {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code,
              fullError: error,
            });
            return { ...step, status: "pending" };
          }

          console.log(`Fetched status for ${step.dbOptionName}:`, data);

          // If the option exists in database, it's completed
          const status =
            data && data.length > 0 && data[0].option ? "completed" : "pending";
          return { ...step, status };
        } catch (stepError) {
          console.error(
            `Exception while fetching status for ${step.dbOptionName}:`,
            {
              message: stepError.message,
              stack: stepError.stack,
              fullError: stepError,
            }
          );
          return { ...step, status: "pending" };
        }
      })
    );

    console.log("All steps processed:", stepsWithStatus);

    // Determine current step: first step that is not completed
    let currentStepFound = false;
    const finalSteps = stepsWithStatus.map((step) => {
      if (step.status === "pending" && !currentStepFound) {
        currentStepFound = true;
        return { ...step, status: "current" };
      }
      return step;
    });

    // If all steps are completed, make the last step current (for any final actions)
    if (!currentStepFound) {
      const lastIndex = finalSteps.length - 1;
      if (lastIndex >= 0) {
        finalSteps[lastIndex] = {
          ...finalSteps[lastIndex],
          status: "current",
        };
      }
    }

    console.log("Final steps with status:", finalSteps);
    return finalSteps;
  } catch (error) {
    console.error("Error fetching visa steps status:", {
      message: error.message,
      stack: error.stack,
      fullError: error,
    });
    // Set default visa steps with pending status on error
    const steps = getVisaSteps();
    const defaultSteps = steps.map((step, index) => ({
      ...step,
      status: index === 0 ? "current" : "pending",
    }));
    return defaultSteps;
  }
}

// Test with a known good application ID
async function runTest() {
  const testAppId = "b1f2cb73-6f24-4c31-9b14-787f1a2a723c"; // From our inspection
  console.log("=".repeat(50));
  console.log("Testing visa steps fetch with applicationId:", testAppId);
  console.log("=".repeat(50));

  const result = await testFetchVisaStepsStatus(testAppId);

  console.log("\n" + "=".repeat(50));
  console.log("FINAL RESULT:");
  console.log("=".repeat(50));
  console.log(JSON.stringify(result, null, 2));

  // Test with invalid ID to see error handling
  console.log("\n" + "=".repeat(50));
  console.log("Testing with invalid application ID:");
  console.log("=".repeat(50));

  const invalidResult = await testFetchVisaStepsStatus("invalid-id-123");
  console.log("Result for invalid ID:", JSON.stringify(invalidResult, null, 2));
}

runTest().catch(console.error);
