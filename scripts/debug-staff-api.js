#!/usr/bin/env node

/**
 * Debug Staff API Endpoint
 *
 * This script tests the staff API endpoint to see if it's returning data correctly.
 */

const { createClient } = require("@supabase/supabase-js");

// Load environment variables
require("dotenv").config();

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error(
    "❌ Missing Supabase configuration. Please set up your .env.local file first."
  );
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugStaffAPI() {
  console.log("🔍 Debug Staff API Endpoint\n");

  try {
    // Test direct database query (simulating the API)
    console.log("1. Testing direct database query...");
    const { data: staffMembers, error } = await supabase
      .from("admin_users")
      .select("id, email, first_name, last_name, role, department, is_active")
      .eq("is_active", true)
      .order("first_name", { ascending: true });

    if (error) {
      console.error("❌ Database error:", error.message);
      return;
    }

    console.log(`✅ Found ${staffMembers.length} staff members:`);
    staffMembers.forEach((staff, index) => {
      console.log(`   ${index + 1}. ${staff.first_name} ${staff.last_name}`);
      console.log(`      📧 Email: ${staff.email}`);
      console.log(`      👤 Role: ${staff.role}`);
      console.log(
        `      🏢 Department: ${staff.department || "Not specified"}`
      );
      console.log(`      ✅ Active: ${staff.is_active}`);
      console.log(`      🆔 ID: ${staff.id}`);
      console.log("");
    });

    // Test the API response format
    console.log("2. Testing API response format...");
    const apiResponse = {
      success: true,
      staff: staffMembers || [],
    };

    console.log("✅ API Response structure:");
    console.log(`   - success: ${apiResponse.success}`);
    console.log(`   - staff.length: ${apiResponse.staff.length}`);

    if (apiResponse.staff.length > 0) {
      console.log("   - First staff member structure:");
      const firstStaff = apiResponse.staff[0];
      console.log(`     * id: ${firstStaff.id}`);
      console.log(`     * first_name: ${firstStaff.first_name}`);
      console.log(`     * last_name: ${firstStaff.last_name}`);
      console.log(`     * role: ${firstStaff.role}`);
      console.log(`     * department: ${firstStaff.department}`);
    }

    // Test what would be rendered in the dropdown
    console.log("\n3. Testing dropdown options...");
    console.log("Dropdown options that should appear:");
    apiResponse.staff.forEach((staff, index) => {
      const optionText = `${staff.first_name} ${staff.last_name} - ${
        staff.role
      }${staff.department ? ` (${staff.department})` : ""}`;
      console.log(`   Option ${index + 1}: ${optionText} (value: ${staff.id})`);
    });

    // Test for potential issues
    console.log("\n4. Checking for potential issues...");

    const issues = [];

    if (staffMembers.length === 0) {
      issues.push("No active admin users found");
    }

    staffMembers.forEach((staff, index) => {
      if (!staff.first_name)
        issues.push(`Staff ${index + 1} missing first_name`);
      if (!staff.last_name) issues.push(`Staff ${index + 1} missing last_name`);
      if (!staff.role) issues.push(`Staff ${index + 1} missing role`);
      if (!staff.id) issues.push(`Staff ${index + 1} missing id`);
    });

    if (issues.length > 0) {
      console.log("⚠️  Issues found:");
      issues.forEach((issue) => console.log(`   - ${issue}`));
    } else {
      console.log("✅ No issues found with staff data");
    }

    console.log("\n🎯 Troubleshooting Steps:");
    console.log(
      "1. Check browser Network tab when opening the assignment modal"
    );
    console.log("2. Look for /api/admin/staff request and its response");
    console.log("3. Check browser console for JavaScript errors");
    console.log("4. Verify user is logged in as admin/super_admin (not staff)");
    console.log("5. Ensure cookies are being sent with the request");
  } catch (error) {
    console.error("❌ Debug failed:", error);
  }
}

debugStaffAPI();
