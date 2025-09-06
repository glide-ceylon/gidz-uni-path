// Test what fields we need
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testFieldRequirements() {
  try {
    console.log("Testing required fields...");

    // First, let's see what an existing record looks like
    const { data: sample, error: sampleError } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .limit(1)
      .single();

    if (sampleError) {
      console.error("Error getting sample:", sampleError);
      return;
    }

    console.log("Sample admin record:");
    console.log(JSON.stringify(sample, null, 2));

    // Test minimal insert
    const minimalAdmin = {
      email: "minimal-test@example.com",
      first_name: "Minimal",
      last_name: "Test",
      role: "staff",
      is_active: true,
      created_at: new Date().toISOString(),
    };

    console.log("\nTrying minimal insert...");
    const { data: newAdmin, error: insertError } = await supabaseAdmin
      .from("admin_users")
      .insert([minimalAdmin])
      .select()
      .single();

    if (insertError) {
      console.error("❌ Insert error:", insertError);
    } else {
      console.log("✅ Minimal insert successful:", newAdmin.id);

      // Clean up
      await supabaseAdmin.from("admin_users").delete().eq("id", newAdmin.id);
      console.log("✅ Cleaned up test record");
    }
  } catch (error) {
    console.error("Script error:", error);
  }
}

testFieldRequirements();
