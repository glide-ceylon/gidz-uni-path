const { supabase } = require("./lib/supabase");

async function debugStaffLookup() {
  try {
    console.log("🔍 Starting staff lookup debug...");

    // First, get all admin users
    const { data: allStaff, error: allError } = await supabase
      .from("admin_users")
      .select("*");

    if (allError) {
      console.error("❌ Error fetching all staff:", allError);
      return;
    }

    console.log(`📊 Total admin users found: ${allStaff.length}`);

    if (allStaff.length > 0) {
      console.log("📊 All admin users in database:");
      allStaff.forEach((staff, index) => {
        console.log(`  ${index + 1}. ID: ${staff.id}`);
        console.log(`     Name: ${staff.first_name} ${staff.last_name}`);
        console.log(`     Role: ${staff.role}`);
        console.log("");
      });

      // Check the specific ID we're looking for
      const targetId = "9128d9f5-e7e4-48ae-8985-1abd93be455a";
      console.log(`🎯 Looking for specific ID: ${targetId}`);

      const exactMatch = allStaff.find((staff) => staff.id === targetId);
      console.log("🔍 Exact match found:", exactMatch ? "YES" : "NO");

      if (exactMatch) {
        console.log("✅ Match details:", exactMatch);
      } else {
        console.log("❌ No exact match found. Let's check similar IDs:");
        allStaff.forEach((staff) => {
          if (
            staff.id.includes("9128d9f5") ||
            staff.id.includes("e7e4") ||
            staff.id.includes("455a")
          ) {
            console.log(
              `  Similar: ${staff.id} - ${staff.first_name} ${staff.last_name}`
            );
          }
        });
      }

      // Test query methods
      console.log("\n🔍 Testing query methods:");

      // Method 1: Using .single()
      const { data: single, error: singleError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", targetId)
        .single();

      console.log("Method 1 (.single()):", {
        hasData: !!single,
        hasError: !!singleError,
        errorCode: singleError?.code,
        errorMessage: singleError?.message,
      });

      // Method 2: Without .single()
      const { data: array, error: arrayError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", targetId);

      console.log("Method 2 (array):", {
        dataLength: array?.length || 0,
        hasError: !!arrayError,
        errorMessage: arrayError?.message,
      });
    } else {
      console.log("❌ No admin users found in database!");
    }

    // Also check the student assignments
    console.log("\n🔍 Checking student assignments:");
    const { data: assignments, error: assignError } = await supabase
      .from("student_visa")
      .select("id, first_name, last_name, assigned_to, assigned_at")
      .not("assigned_to", "is", null);

    if (assignError) {
      console.error("❌ Error fetching assignments:", assignError);
    } else {
      console.log(`📋 Students with assignments: ${assignments.length}`);
      assignments.forEach((student) => {
        console.log(
          `  - ${student.first_name} ${student.last_name} assigned to: ${student.assigned_to}`
        );
      });
    }
  } catch (err) {
    console.error("❌ Caught error:", err);
  }
}

debugStaffLookup()
  .then(() => {
    console.log("✅ Debug complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Final error:", err);
    process.exit(1);
  });
