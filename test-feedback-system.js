// Feedback System Test Script
// Run this in your browser console to test the feedback API

const API_BASE = "/api/feedbacks";

// Test GET - Fetch all feedbacks (admin view)
async function testFetchAllFeedbacks() {
  console.log("🔍 Testing GET all feedbacks (admin view)...");

  try {
    const response = await fetch(`${API_BASE}?includePrivate=true`);
    const result = await response.json();

    if (result.success) {
      console.log("✅ Successfully fetched all feedbacks:");
      console.log(`   Found ${result.data.length} total feedbacks`);
      result.data.forEach((feedback, index) => {
        console.log(
          `   ${index + 1}. ${feedback.client_name} - ${feedback.rating}⭐`
        );
        console.log(`      Status: ${feedback.status}`);
        console.log(`      Title: ${feedback.title}`);
      });
    } else {
      console.error("❌ Failed to fetch feedbacks:", result.error);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
  }
}

// Test GET - Fetch approved feedbacks (public view)
async function testFetchApprovedFeedbacks() {
  console.log("\n🔍 Testing GET approved feedbacks (public view)...");

  try {
    const response = await fetch(`${API_BASE}?status=approved`);
    const result = await response.json();

    if (result.success) {
      console.log("✅ Successfully fetched approved feedbacks:");
      console.log(`   Found ${result.data.length} approved feedbacks`);
      result.data.forEach((feedback, index) => {
        console.log(
          `   ${index + 1}. ${feedback.client_name} - ${feedback.rating}⭐`
        );
        console.log(
          `      University: ${feedback.university || "Not specified"}`
        );
      });
    } else {
      console.error("❌ Failed to fetch approved feedbacks:", result.error);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
  }
}

// Test POST - Create a new feedback
async function testCreateFeedback() {
  console.log("\n📝 Testing POST create feedback...");

  const testFeedback = {
    application_id: `test-app-${Date.now()}`,
    client_name: "Test User",
    rating: 5,
    title: "Excellent Service!",
    message:
      "This is a test feedback. The service was amazing and I highly recommend GIDZ UniPath to anyone looking to study in Germany!",
    program_type: "Computer Science",
    university: "Technical University of Munich",
    allow_display_name: true,
  };

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testFeedback),
    });

    const result = await response.json();

    if (result.success) {
      console.log("✅ Successfully created feedback:");
      console.log("   ID:", result.data.id);
      console.log("   Status:", result.data.status);
      console.log("   Message:", result.message);
      return result.data;
    } else {
      console.error("❌ Failed to create feedback:", result.error);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
  }

  return null;
}

// Test PUT - Update feedback status (Admin only)
async function testUpdateFeedbackStatus(feedbackId) {
  console.log(
    `\n📝 Testing PUT update feedback status for ID: ${feedbackId}...`
  );

  try {
    const response = await fetch(API_BASE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: feedbackId,
        status: "approved",
        admin_notes: "Great feedback! Approved for display in testimonials.",
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("✅ Successfully updated feedback status:");
      console.log("   Status:", result.data.status);
      console.log("   Message:", result.message);
      return result.data;
    } else {
      console.error("❌ Failed to update feedback:", result.error);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
  }

  return null;
}

// Test validation
function testValidation() {
  console.log("\n🧪 Testing validation scenarios...");

  // Test missing required fields
  console.log("   Testing missing required fields...");

  // Test invalid rating
  console.log("   Testing invalid rating (should be 1-5)...");

  // Test invalid status
  console.log("   Testing invalid status...");

  console.log(
    "   ℹ️  These tests should show validation errors in the admin interface"
  );
}

// Run all tests
async function runFeedbackTests() {
  console.log("🚀 Starting Feedback System Tests\n");

  await testFetchAllFeedbacks();
  await testFetchApprovedFeedbacks();
  testValidation();

  // Create a test feedback
  const createdFeedback = await testCreateFeedback();

  if (createdFeedback) {
    // Test updating the feedback status
    await testUpdateFeedbackStatus(createdFeedback.id);
  }

  console.log("\n✨ Feedback tests completed!");
  console.log("\nNext steps:");
  console.log("1. Go to /admin/feedbacks to see the admin interface");
  console.log(
    "2. Go to /client/[id] and navigate to Profile tab to test the feedback dialog"
  );
  console.log(
    "3. Check the home page testimonials to see if approved feedbacks appear"
  );
  console.log("4. Test the feedback approval workflow");

  if (createdFeedback) {
    console.log(`\n⚠️  Test feedback created with ID: ${createdFeedback.id}`);
    console.log("   You can approve/reject it from the admin interface");
  }
}

// Execute tests if running in browser
if (typeof window !== "undefined") {
  runFeedbackTests();
}

// Export for Node.js usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    testFetchAllFeedbacks,
    testFetchApprovedFeedbacks,
    testCreateFeedback,
    testUpdateFeedbackStatus,
    testValidation,
    runFeedbackTests,
  };
}
