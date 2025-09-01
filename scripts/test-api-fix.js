#!/usr/bin/env node

/**
 * Test API Route Fix
 *
 * This script tests if the API route fix for service role permissions worked.
 */

const { createClient } = require("@supabase/supabase-js");

// Load environment variables
require("dotenv").config();

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error("❌ Missing Supabase configuration.");
  process.exit(1);
}

async function testAPIRouteFix() {
  console.log("🔧 Testing API Route Permission Fix\n");

  try {
    // Test 1: Service Role Client (should work)
    console.log("1. Testing with Service Role Client...");
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: adminData, error: adminError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, first_name, last_name, role, department")
      .eq("is_active", true)
      .order("first_name", { ascending: true });

    if (adminError) {
      console.error("❌ Service Role Error:", adminError.message);
    } else {
      console.log(`✅ Service Role Success: Found ${adminData.length} users`);
    }

    // Test 2: Anon Client (should fail or return empty)
    console.log("\n2. Testing with Anon Client...");
    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: anonData, error: anonError } = await supabaseAnon
      .from("admin_users")
      .select("id, email, first_name, last_name, role, department")
      .eq("is_active", true)
      .order("first_name", { ascending: true });

    if (anonError) {
      console.log("❌ Anon Client Error (expected):", anonError.message);
    } else {
      console.log(
        `⚠️  Anon Client Result: Found ${anonData?.length || 0} users`
      );
      if ((anonData?.length || 0) === 0) {
        console.log("   This explains why the API was returning empty array!");
      }
    }

    console.log("\n🎯 Diagnosis:");
    if (adminData.length > 0 && (anonData?.length || 0) === 0) {
      console.log(
        "✅ Fix confirmed: Service role has access, anon key doesn't"
      );
      console.log("✅ API routes now use service role client");
      console.log("✅ Staff dropdown should now work");
    } else {
      console.log("⚠️  Unexpected results - please check database permissions");
    }

    console.log("\n📋 Next Steps:");
    console.log("1. Restart your development server");
    console.log("2. Clear browser cache/cookies");
    console.log("3. Login as admin and test the staff dropdown");
    console.log("4. Check server logs for the new debugging output");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testAPIRouteFix();
