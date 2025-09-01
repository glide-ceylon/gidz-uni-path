// Test if feedbacks table exists and create it if needed
// This script should be run after starting your development server

const testFeedbacksTable = async () => {
  console.log("🔍 Testing feedbacks table...");

  try {
    // Test 1: Try to read from the table
    console.log("Testing API GET endpoint...");
    const getResponse = await fetch("http://localhost:3000/api/feedbacks");
    const getData = await getResponse.text();
    console.log("GET Response status:", getResponse.status);
    console.log("GET Response:", getData);

    if (
      getResponse.status === 500 &&
      getData.includes('relation "feedbacks" does not exist')
    ) {
      console.log("❌ Table does not exist. Please create it in Supabase.");
      console.log("📋 SQL to run in Supabase SQL Editor:");
      console.log(`
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID,
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

-- Disable RLS for testing
ALTER TABLE feedbacks DISABLE ROW LEVEL SECURITY;
      `);
      return false;
    }

    // Test 2: Try to create a feedback
    console.log("Testing API POST endpoint...");
    const postResponse = await fetch("http://localhost:3000/api/feedbacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        application_id: "test-" + Date.now(),
        client_name: "Test User",
        rating: 5,
        title: "Test Feedback",
        message: "This is a test feedback message from the diagnostic script.",
        program_type: "Computer Science",
        university: "Test University",
        allow_display_name: true,
      }),
    });

    const postData = await postResponse.json();
    console.log("POST Response status:", postResponse.status);
    console.log("POST Response:", postData);

    if (postResponse.status === 201) {
      console.log(
        "✅ Table exists and working! Feedback created successfully."
      );
      return true;
    } else {
      console.log("❌ Error creating feedback:", postData);
      return false;
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error);
    return false;
  }
};

// Run the test
testFeedbacksTable().then((success) => {
  if (success) {
    console.log("🎉 All tests passed! Your feedback system is ready.");
  } else {
    console.log("💡 Next steps:");
    console.log("1. Go to your Supabase project dashboard");
    console.log("2. Navigate to SQL Editor");
    console.log("3. Run the SQL provided above");
    console.log("4. Run this script again to verify");
  }
});
