const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyAssignments() {
  try {
    console.log("🔍 Verifying student assignments and staff data...\n");

    // Check student assignments
    const { data: assignments, error: assignError } = await supabaseAdmin
      .from("student_visa")
      .select("id, assigned_to, assigned_at, assigned_by")
      .not("assigned_to", "is", null);

    if (assignError) {
      console.error("❌ Error fetching assignments:", assignError);
      return;
    }

    console.log(`📋 Found ${assignments.length} student assignments:`);
    for (const assignment of assignments) {
      console.log(
        `  Student ${assignment.id} assigned to ${assignment.assigned_to}`
      );

      // Verify the staff member exists
      const { data: staff, error: staffError } = await supabaseAdmin
        .from("admin_users")
        .select("id, first_name, last_name, role")
        .eq("id", assignment.assigned_to)
        .single();

      if (staffError || !staff) {
        console.log(`    ❌ Staff member ${assignment.assigned_to} not found!`);
      } else {
        console.log(
          `    ✅ Staff: ${staff.first_name} ${staff.last_name} (${staff.role})`
        );
      }
    }

    console.log("\n🎯 Key insights:");
    console.log(
      "- If staff members are found above, the API should work correctly"
    );
    console.log(
      "- The frontend will now use /api/admin/staff/by-ids to fetch this data"
    );
    console.log(
      "- This resolves the permission issue with direct Supabase queries"
    );
  } catch (error) {
    console.error("❌ Error verifying assignments:", error);
  }
}

verifyAssignments()
  .then(() => {
    console.log("\n✅ Verification complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Verification failed:", err);
    process.exit(1);
  });
