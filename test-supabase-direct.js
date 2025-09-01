// Direct Supabase test - bypassing the API
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://cpzkzyokznbrayxnyfin.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwemt6eW9rem5icmF5eG55ZmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2NjI0NzEsImV4cCI6MjA1MjIzODQ3MX0.WkIgbuFDfGUrllI0iZnzYVds-ihDPNi_j214hgQjU-w";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseDirect() {
  console.log("🔍 Testing direct Supabase connection...");

  try {
    // Test 1: Check if feedbacks table exists by trying to select from it
    console.log("1. Testing if feedbacks table exists...");
    const { data, error } = await supabase
      .from("feedbacks")
      .select("id")
      .limit(1);

    if (error) {
      console.log("❌ Error accessing feedbacks table:", error.message);
      if (error.message.includes('relation "feedbacks" does not exist')) {
        console.log(
          "📋 The feedbacks table does not exist. Please create it with this SQL:"
        );
        console.log(`
CREATE TABLE feedbacks (
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
      }
      return false;
    }

    console.log("✅ Feedbacks table exists and is accessible!");
    console.log("Current records count:", data.length);

    // Test 2: Try to insert a test record
    console.log("2. Testing insert operation...");
    const { data: insertData, error: insertError } = await supabase
      .from("feedbacks")
      .insert([
        {
          application_id: "test-" + Date.now(),
          client_name: "Direct Test User",
          rating: 5,
          title: "Direct Test",
          message: "This is a direct Supabase test",
          program_type: "Test Program",
          university: "Test University",
          allow_display_name: true,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.log("❌ Error inserting test record:", insertError.message);
      return false;
    }

    console.log("✅ Test record inserted successfully:", insertData.id);

    // Test 3: Try to select the inserted record
    console.log("3. Testing select operation...");
    const { data: selectData, error: selectError } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("id", insertData.id)
      .single();

    if (selectError) {
      console.log("❌ Error selecting test record:", selectError.message);
      return false;
    }

    console.log("✅ Test record retrieved successfully:", selectData.title);

    // Test 4: Clean up by deleting the test record
    console.log("4. Cleaning up test record...");
    const { error: deleteError } = await supabase
      .from("feedbacks")
      .delete()
      .eq("id", insertData.id);

    if (deleteError) {
      console.log(
        "⚠️ Warning: Could not delete test record:",
        deleteError.message
      );
    } else {
      console.log("✅ Test record cleaned up successfully");
    }

    return true;
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return false;
  }
}

testSupabaseDirect().then((success) => {
  if (success) {
    console.log(
      "🎉 All Supabase tests passed! The issue might be in the API layer."
    );
  } else {
    console.log("💡 Please fix the Supabase issues above before proceeding.");
  }
});
