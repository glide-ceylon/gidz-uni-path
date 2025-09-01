#!/usr/bin/env node

/**
 * Demo Assignment System
 *
 * This script demonstrates the assignment functionality by creating a test assignment.
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

async function demoAssignment() {
  console.log("🎯 Assignment System Demo\n");

  try {
    // Get first student
    console.log("1. Finding a student to assign...");
    const { data: students, error: studentsError } = await supabase
      .from("student_visa")
      .select("id, data")
      .limit(1);

    if (studentsError || !students || students.length === 0) {
      console.error("❌ No students found:", studentsError?.message);
      return;
    }

    const student = students[0];
    const studentData = JSON.parse(student.data);
    console.log(
      `✅ Found student: ${studentData.PersonalInformation?.FirstName} ${studentData.PersonalInformation?.LastName}`
    );

    // Get a staff member
    console.log("\n2. Finding a staff member...");
    const { data: staffMembers, error: staffError } = await supabase
      .from("admin_users")
      .select("id, first_name, last_name, role")
      .eq("role", "staff")
      .eq("is_active", true)
      .limit(1);

    if (staffError || !staffMembers || staffMembers.length === 0) {
      console.log("ℹ️  No staff members found, using any admin user...");

      const { data: adminUsers, error: adminError } = await supabase
        .from("admin_users")
        .select("id, first_name, last_name, role")
        .eq("is_active", true)
        .limit(1);

      if (adminError || !adminUsers || adminUsers.length === 0) {
        console.error("❌ No admin users found");
        return;
      }

      staffMembers[0] = adminUsers[0];
    }

    const staffMember = staffMembers[0];
    console.log(
      `✅ Found staff member: ${staffMember.first_name} ${staffMember.last_name} (${staffMember.role})`
    );

    // Create assignment
    console.log("\n3. Creating assignment...");
    const { error: assignError } = await supabase
      .from("student_visa")
      .update({
        assigned_to: staffMember.id,
        assigned_at: new Date().toISOString(),
        assigned_by: staffMember.id, // In real scenario, this would be the admin making the assignment
      })
      .eq("id", student.id);

    if (assignError) {
      console.error("❌ Error creating assignment:", assignError.message);
      return;
    }

    console.log("✅ Assignment created successfully!");

    // Verify assignment
    console.log("\n4. Verifying assignment...");
    const { data: assignedStudent, error: verifyError } = await supabase
      .from("student_visa")
      .select(
        `
        id,
        assigned_to,
        assigned_at,
        assigned_by,
        assigned_staff:admin_users!assigned_to(
          id,
          first_name,
          last_name,
          role
        )
      `
      )
      .eq("id", student.id)
      .single();

    if (verifyError) {
      console.error("❌ Error verifying assignment:", verifyError.message);
      return;
    }

    console.log("✅ Assignment verified:");
    console.log(`   📋 Student ID: ${assignedStudent.id}`);
    console.log(
      `   👤 Assigned to: ${assignedStudent.assigned_staff.first_name} ${assignedStudent.assigned_staff.last_name}`
    );
    console.log(
      `   📅 Assigned at: ${new Date(
        assignedStudent.assigned_at
      ).toLocaleString()}`
    );

    console.log("\n🎉 Demo completed successfully!");
    console.log("\n📋 Next Steps:");
    console.log("   1. Login as an admin user in the web interface");
    console.log("   2. Navigate to Student Visa Applications");
    console.log("   3. You should see the assignment in the interface");
    console.log("   4. Try assigning/unassigning students through the UI");
    console.log(
      "   5. Login as the assigned staff member to see filtered view"
    );
  } catch (error) {
    console.error("❌ Demo failed:", error);
  }
}

demoAssignment();
