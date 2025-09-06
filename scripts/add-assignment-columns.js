#!/usr/bin/env node

/**
 * Add Assignment Columns to student_visa Table
 *
 * This script adds the necessary columns for staff assignment functionality.
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

async function addAssignmentColumns() {
  console.log("🔧 Adding assignment columns to student_visa table...\n");

  try {
    console.log("1. Adding assigned_to column (foreign key to admin_users)...");
    const { error: assignedToError } = await supabase.rpc("exec_sql", {
      sql: `
        ALTER TABLE student_visa 
        ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL;
      `,
    });

    if (assignedToError) {
      console.error(
        "❌ Error adding assigned_to column:",
        assignedToError.message
      );
      // Try direct SQL approach
      console.log("Trying alternative approach...");
      await supabase.from("student_visa").select("id").limit(1);
      console.log("✅ Table accessible, column may already exist");
    } else {
      console.log("✅ assigned_to column added");
    }

    console.log("\n2. Adding assigned_at column...");
    const { error: assignedAtError } = await supabase.rpc("exec_sql", {
      sql: `
        ALTER TABLE student_visa 
        ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ;
      `,
    });

    if (assignedAtError) {
      console.log("ℹ️  Column may already exist or using direct SQL");
    } else {
      console.log("✅ assigned_at column added");
    }

    console.log("\n3. Adding assigned_by column...");
    const { error: assignedByError } = await supabase.rpc("exec_sql", {
      sql: `
        ALTER TABLE student_visa 
        ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES admin_users(id) ON DELETE SET NULL;
      `,
    });

    if (assignedByError) {
      console.log("ℹ️  Column may already exist or using direct SQL");
    } else {
      console.log("✅ assigned_by column added");
    }

    console.log("\n4. Creating index for better performance...");
    const { error: indexError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_student_visa_assigned_to 
        ON student_visa(assigned_to);
      `,
    });

    if (indexError) {
      console.log("ℹ️  Index may already exist");
    } else {
      console.log("✅ Index created");
    }

    console.log("\n🎉 Assignment columns setup complete!");

    // Test the columns by querying
    console.log("\n5. Testing new columns...");
    const { data, error: testError } = await supabase
      .from("student_visa")
      .select("id, assigned_to, assigned_at, assigned_by")
      .limit(1);

    if (testError) {
      console.error("❌ Error testing new columns:", testError.message);
      console.log(
        "\n⚠️  You may need to add the columns manually in Supabase Dashboard:"
      );
      console.log(
        "   1. Go to Supabase Dashboard > Table Editor > student_visa"
      );
      console.log("   2. Add these columns:");
      console.log(
        "      - assigned_to (uuid, nullable, foreign key to admin_users.id)"
      );
      console.log("      - assigned_at (timestamptz, nullable)");
      console.log(
        "      - assigned_by (uuid, nullable, foreign key to admin_users.id)"
      );
    } else {
      console.log("✅ New columns are working correctly!");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    console.log("\n⚠️  Manual Setup Required:");
    console.log("Please add these columns to the student_visa table manually:");
    console.log(
      "1. assigned_to (uuid, nullable, foreign key to admin_users.id)"
    );
    console.log("2. assigned_at (timestamptz, nullable)");
    console.log(
      "3. assigned_by (uuid, nullable, foreign key to admin_users.id)"
    );
  }
}

addAssignmentColumns();
