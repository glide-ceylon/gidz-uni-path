#!/usr/bin/env node

/**
 * Add Assignment Columns to Work Visa Table
 *
 * This script adds the assignment columns to the work_visa table
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
  console.log(
    "🔧 You can run this script after setting up the development server."
  );
  process.exit(1);
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addAssignmentColumns() {
  console.log("🔧 Adding assignment columns to work_visa table...\n");

  try {
    // Check if work_visa table exists
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "work_visa")
      .eq("table_schema", "public");

    if (tablesError) {
      console.error(
        "❌ Error checking if work_visa table exists:",
        tablesError
      );
      return;
    }

    if (!tables || tables.length === 0) {
      console.log("❌ work_visa table does not exist. Please create it first.");
      return;
    }

    console.log("✅ work_visa table exists");

    // Check existing columns
    const { data: columns, error: columnsError } = await supabaseAdmin
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_name", "work_visa")
      .eq("table_schema", "public");

    if (columnsError) {
      console.error("❌ Error checking existing columns:", columnsError);
      return;
    }

    const existingColumns = columns.map((col) => col.column_name);
    console.log("📋 Existing columns:", existingColumns.join(", "));

    // Check which assignment columns need to be added
    const assignmentColumns = [
      { name: "assigned_to", type: "UUID", nullable: true },
      { name: "assigned_at", type: "TIMESTAMP WITH TIME ZONE", nullable: true },
      { name: "assigned_by", type: "UUID", nullable: true },
    ];

    const columnsToAdd = assignmentColumns.filter(
      (col) => !existingColumns.includes(col.name)
    );

    if (columnsToAdd.length === 0) {
      console.log("✅ All assignment columns already exist in work_visa table");
      return;
    }

    console.log(
      "🔧 Adding missing columns:",
      columnsToAdd.map((col) => col.name).join(", ")
    );

    // Note: We can't use supabase-js to alter table structure directly
    // This would need to be done through SQL in the Supabase dashboard
    console.log("\n📝 SQL Commands to run in Supabase Dashboard:");
    console.log("   Go to: Supabase Dashboard > SQL Editor");
    console.log("   Run the following commands:\n");

    columnsToAdd.forEach((col) => {
      const nullableClause = col.nullable ? "NULL" : "NOT NULL";
      console.log(
        `   ALTER TABLE work_visa ADD COLUMN ${col.name} ${col.type} ${nullableClause};`
      );
    });

    // Add foreign key constraints
    if (columnsToAdd.some((col) => col.name === "assigned_to")) {
      console.log("\n   -- Add foreign key constraint for assigned_to");
      console.log(
        "   ALTER TABLE work_visa ADD CONSTRAINT fk_work_visa_assigned_to"
      );
      console.log("   FOREIGN KEY (assigned_to) REFERENCES admin_users(id);");
    }

    if (columnsToAdd.some((col) => col.name === "assigned_by")) {
      console.log("\n   -- Add foreign key constraint for assigned_by");
      console.log(
        "   ALTER TABLE work_visa ADD CONSTRAINT fk_work_visa_assigned_by"
      );
      console.log("   FOREIGN KEY (assigned_by) REFERENCES admin_users(id);");
    }

    console.log("\n✅ Assignment columns setup instructions provided!");
    console.log(
      "🔧 After running the SQL commands, the work_visa table will support staff assignment."
    );
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

addAssignmentColumns();
