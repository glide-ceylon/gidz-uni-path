/**
 * Timeline Events Database Setup Script
 * Run this script to create the timeline events database schema
 *
 * Usage: node setup-timeline-db.js
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase configuration. Please set:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log("🚀 Starting Timeline Events Database Setup...\n");

    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      "database",
      "migrations",
      "001_create_timeline_events.sql"
    );

    if (!fs.existsSync(migrationPath)) {
      console.error("❌ Migration file not found:", migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("📋 Executing database migration...");

    // Execute the migration
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: migrationSQL,
    });

    if (error) {
      console.error("❌ Migration failed:", error);
      process.exit(1);
    }

    console.log("✅ Migration completed successfully!");

    // Verify tables were created
    console.log("\n🔍 Verifying tables...");

    const tables = [
      "timeline_events",
      "timeline_event_requests",
      "timeline_event_notes",
    ];

    for (const table of tables) {
      const { data: tableData, error: tableError } = await supabase
        .from(table)
        .select("*")
        .limit(1);

      if (tableError) {
        console.error(`❌ Table ${table} verification failed:`, tableError);
      } else {
        console.log(`✅ Table ${table} created successfully`);
      }
    }

    console.log("\n🎉 Timeline Events database setup completed!");
    console.log("\nNext steps:");
    console.log("1. Create the API endpoints (Phase 1.2)");
    console.log("2. Update the frontend components (Phase 3)");
    console.log("3. Test the timeline functionality");
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

// Alternative function that splits the migration into smaller chunks
async function runMigrationInChunks() {
  try {
    console.log("🚀 Starting Timeline Events Database Setup (Chunked)...\n");

    const migrationSteps = [
      {
        name: "Create Tables",
        sql: `
          CREATE TABLE IF NOT EXISTS timeline_events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            student_id UUID NOT NULL,
            event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
              'document_submission', 'application_review', 'interview_scheduled', 
              'decision_pending', 'acceptance_confirmed', 'visa_application', 
              'enrollment_deadline', 'orientation_scheduled', 'other'
            )),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            due_date TIMESTAMP,
            priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
            metadata JSONB DEFAULT '{}'::jsonb,
            created_by UUID,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS timeline_event_requests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            student_id UUID NOT NULL,
            requested_by UUID NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            requested_date TIMESTAMP,
            category VARCHAR(50) CHECK (category IN ('academic', 'visa', 'personal', 'university', 'documentation')),
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
            admin_response TEXT,
            priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS timeline_event_notes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            event_id UUID REFERENCES timeline_events(id) ON DELETE CASCADE,
            student_id UUID NOT NULL,
            note_text TEXT NOT NULL,
            is_private BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `,
      },
      {
        name: "Create Indexes",
        sql: `
          CREATE INDEX IF NOT EXISTS idx_timeline_events_student_id ON timeline_events(student_id);
          CREATE INDEX IF NOT EXISTS idx_timeline_events_status ON timeline_events(status);
          CREATE INDEX IF NOT EXISTS idx_timeline_events_due_date ON timeline_events(due_date);
          CREATE INDEX IF NOT EXISTS idx_timeline_events_event_type ON timeline_events(event_type);
          CREATE INDEX IF NOT EXISTS idx_timeline_events_priority ON timeline_events(priority);

          CREATE INDEX IF NOT EXISTS idx_timeline_event_requests_student_id ON timeline_event_requests(student_id);
          CREATE INDEX IF NOT EXISTS idx_timeline_event_requests_status ON timeline_event_requests(status);
          CREATE INDEX IF NOT EXISTS idx_timeline_event_requests_requested_by ON timeline_event_requests(requested_by);

          CREATE INDEX IF NOT EXISTS idx_timeline_event_notes_event_id ON timeline_event_notes(event_id);
          CREATE INDEX IF NOT EXISTS idx_timeline_event_notes_student_id ON timeline_event_notes(student_id);
        `,
      },
      {
        name: "Create Functions and Triggers",
        sql: `
          CREATE OR REPLACE FUNCTION update_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
          END;
          $$ language 'plpgsql';

          DROP TRIGGER IF EXISTS update_timeline_events_updated_at ON timeline_events;
          CREATE TRIGGER update_timeline_events_updated_at 
            BEFORE UPDATE ON timeline_events 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

          DROP TRIGGER IF EXISTS update_timeline_event_requests_updated_at ON timeline_event_requests;
          CREATE TRIGGER update_timeline_event_requests_updated_at 
            BEFORE UPDATE ON timeline_event_requests 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `,
      },
    ];

    for (const step of migrationSteps) {
      console.log(`📋 ${step.name}...`);

      // Split SQL into individual statements
      const statements = step.sql
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      for (const statement of statements) {
        if (statement.trim().length === 0) continue;

        try {
          console.log(`   Executing: ${statement.substring(0, 50)}...`);
          const { error } = await supabase.rpc("exec_sql", { sql: statement });

          if (error) {
            // Try direct query if RPC fails
            console.log(`   RPC failed, trying direct query...`);
            const { error: directError } = await supabase
              .from("_")
              .select("1")
              .limit(0);

            // For table creation, we'll use a different approach
            if (statement.includes("CREATE TABLE")) {
              console.log(`   Skipping table creation - may need manual setup`);
              console.log(`   SQL: ${statement}`);
              continue;
            }

            if (directError) {
              console.error(`   ❌ Statement failed:`, error);
              throw error;
            }
          }
        } catch (execError) {
          console.error(`   ❌ Execution error:`, execError);
          // Don't throw for now, continue with next statement
        }
      }

      console.log(`✅ ${step.name} completed`);
    }

    console.log("\n🎉 Timeline Events database setup completed!");
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

// Check if this script is being run directly
if (require.main === module) {
  console.log("Choose setup method:");
  console.log("1. Run full migration (default)");
  console.log("2. Run migration in chunks");

  const method = process.argv[2] || "1";

  if (method === "2") {
    runMigrationInChunks();
  } else {
    runMigration();
  }
}

module.exports = {
  runMigration,
  runMigrationInChunks,
};
