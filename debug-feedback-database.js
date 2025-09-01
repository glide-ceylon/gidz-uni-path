// Database Test Script for Feedbacks Table
// Run this in browser console to test database connection

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection and feedbacks table...");

  try {
    // Test 1: Check if we can connect to the API
    console.log("\n1. Testing API endpoint connectivity...");
    const response = await fetch("/api/feedbacks?includePrivate=true");
    console.log("Response status:", response.status);

    if (response.status === 500) {
      console.error(
        "❌ 500 Internal Server Error - Database table might not exist"
      );
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return;
    }

    const result = await response.json();
    console.log("API Response:", result);

    if (result.success) {
      console.log("✅ API connection successful");
      console.log(`   Found ${result.count} existing feedbacks`);
    } else {
      console.error("❌ API returned error:", result.error);
    }

    // Test 2: Try to create a minimal test feedback
    console.log("\n2. Testing feedback creation...");
    const testFeedback = {
      application_id: "test-123-456",
      client_name: "Database Test User",
      rating: 5,
      title: "Database Connection Test",
      message:
        "This is a test message to verify the database table exists and works correctly.",
    };

    const createResponse = await fetch("/api/feedbacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testFeedback),
    });

    console.log("Create response status:", createResponse.status);
    const createResult = await createResponse.json();
    console.log("Create response:", createResult);

    if (createResult.success) {
      console.log("✅ Feedback creation successful!");
      console.log("   Created feedback ID:", createResult.data.id);

      // Clean up test data
      console.log("\n3. Cleaning up test data...");
      try {
        await fetch(`/api/feedbacks?id=${createResult.data.id}`, {
          method: "DELETE",
        });
        console.log("✅ Test data cleaned up");
      } catch (cleanupError) {
        console.warn("⚠️  Could not clean up test data:", cleanupError);
      }
    } else {
      console.error("❌ Feedback creation failed:", createResult.error);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
}

// Check Supabase table structure
async function checkSupabaseTable() {
  console.log("\n🗄️  Checking Supabase table structure...");

  // This is what the table should look like
  const expectedStructure = {
    table_name: "feedbacks",
    columns: [
      "id (UUID, PRIMARY KEY)",
      "application_id (UUID, FOREIGN KEY)",
      "client_name (TEXT, NOT NULL)",
      "rating (INTEGER, 1-5)",
      "title (TEXT, NOT NULL)",
      "message (TEXT, NOT NULL)",
      "program_type (TEXT)",
      "university (TEXT)",
      "allow_display_name (BOOLEAN)",
      "status (TEXT, DEFAULT 'pending')",
      "admin_notes (TEXT)",
      "created_at (TIMESTAMP)",
      "updated_at (TIMESTAMP)",
    ],
  };

  console.log("Expected table structure:", expectedStructure);
  console.log("\nTo create the table, run this SQL in Supabase:");
  console.log(`
-- Create feedbacks table
CREATE TABLE feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  program_type TEXT,
  university TEXT,
  allow_display_name BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_feedbacks_application_id ON feedbacks(application_id);
CREATE INDEX idx_feedbacks_status ON feedbacks(status);
CREATE INDEX idx_feedbacks_created_at ON feedbacks(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
  `);
}

// Run all tests
async function runFeedbackDatabaseTests() {
  console.log("🚀 Starting Feedback Database Tests\n");

  await testDatabaseConnection();
  await checkSupabaseTable();

  console.log("\n✨ Database tests completed!");
  console.log("\nNext steps if tests failed:");
  console.log("1. Check if the 'feedbacks' table exists in Supabase");
  console.log(
    "2. Run the SQL from checkSupabaseTable() in Supabase SQL editor"
  );
  console.log("3. Verify Supabase connection in lib/supabase.js");
  console.log("4. Check server console logs for detailed error messages");
}

// Auto-run tests
runFeedbackDatabaseTests();
