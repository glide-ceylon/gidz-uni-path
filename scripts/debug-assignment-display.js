#!/usr/bin/env node

/**
 * Debug Assignment Display Issue
 *
 * This script checks the database and API to debug why assigned staff isn't showing in frontend
 */

const { createClient } = require("@supabase/supabase-js");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error(
    "❌ Missing Supabase configuration. Please check your environment variables."
  );
  console.log("🔧 Try running this after starting the dev server.");
  process.exit(1);
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugAssignmentDisplay() {
  console.log("🔍 Debug: Assignment Display Issue\n");

  try {
    // 1. Check raw student_visa data
    console.log("1️⃣ Checking raw student_visa table data...");
    const { data: rawStudents, error: rawError } = await supabaseAdmin
      .from("student_visa")
      .select("id, assigned_to, assigned_at, assigned_by, created_at");

    if (rawError) {
      console.error("❌ Error fetching raw data:", rawError);
      return;
    }

    console.log(`Found ${rawStudents.length} student records:`);
    rawStudents.forEach((student) => {
      console.log(`  - ID: ${student.id}`);
      console.log(`    assigned_to: ${student.assigned_to || "NULL"}`);
      console.log(`    assigned_at: ${student.assigned_at || "NULL"}`);
      console.log(`    assigned_by: ${student.assigned_by || "NULL"}`);
      console.log(`    created_at: ${student.created_at}`);
      console.log("");
    });

    // 2. Check the query with JOIN that frontend uses
    console.log("2️⃣ Testing frontend query with JOIN...");
    const { data: joinedData, error: joinError } = await supabaseAdmin.from(
      "student_visa"
    ).select(`
        *,
        assigned_staff:admin_users!assigned_to(
          id,
          email,
          first_name,
          last_name,
          role,
          department
        )
      `);

    if (joinError) {
      console.error("❌ Error with JOIN query:", joinError);
      return;
    }

    console.log(`JOIN query returned ${joinedData.length} records:`);
    joinedData.forEach((student) => {
      console.log(`  - Student ID: ${student.id}`);
      console.log(`    assigned_to: ${student.assigned_to || "NULL"}`);
      console.log(`    assigned_staff:`, student.assigned_staff || "NULL");
      console.log("");
    });

    // 3. Check admin_users table
    console.log("3️⃣ Checking admin_users table...");
    const { data: adminUsers, error: adminError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, first_name, last_name, role, department");

    if (adminError) {
      console.error("❌ Error fetching admin users:", adminError);
      return;
    }

    console.log(`Found ${adminUsers.length} admin users:`);
    adminUsers.forEach((user) => {
      console.log(`  - ID: ${user.id}`);
      console.log(`    Name: ${user.first_name} ${user.last_name}`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Role: ${user.role}`);
      console.log("");
    });

    // 4. Check for assignment mismatches
    console.log("4️⃣ Checking for assignment mismatches...");
    const assignedStudents = rawStudents.filter((s) => s.assigned_to);
    console.log(`Students with assigned_to: ${assignedStudents.length}`);

    for (const student of assignedStudents) {
      const assignedUser = adminUsers.find((u) => u.id === student.assigned_to);
      if (assignedUser) {
        console.log(
          `✅ Student ${student.id} assigned to ${assignedUser.first_name} ${assignedUser.last_name}`
        );
      } else {
        console.log(
          `❌ Student ${student.id} assigned to ${student.assigned_to} but user not found!`
        );
      }
    }

    // 5. Test the exact query frontend would make
    console.log("\n5️⃣ Testing exact frontend query simulation...");
    const frontendQuery = supabaseAdmin.from("student_visa").select(`
        *,
        assigned_staff:admin_users!assigned_to(
          id,
          email,
          first_name,
          last_name,
          role,
          department
        )
      `);

    const { data: frontendData, error: frontendError } = await frontendQuery;

    if (frontendError) {
      console.error("❌ Frontend query error:", frontendError);
      return;
    }

    console.log("Frontend query results:");
    frontendData.forEach((student) => {
      if (student.assigned_to) {
        console.log(`✅ Student ${student.id}:`);
        console.log(`   assigned_to: ${student.assigned_to}`);
        console.log(
          `   assigned_staff:`,
          JSON.stringify(student.assigned_staff, null, 2)
        );
      }
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

debugAssignmentDisplay();
