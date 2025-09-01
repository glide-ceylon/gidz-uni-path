// Check table structure
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableStructure() {
  try {
    console.log("Checking admin_users table structure...");

    // Check if we can query the table at all
    const { data, error, count } = await supabaseAdmin
      .from("admin_users")
      .select("*", { count: "exact" })
      .limit(1);

    if (error) {
      console.error("❌ Error querying table:", error);
      return;
    }

    console.log(`✅ Table accessible, has ${count} records`);

    if (data && data.length > 0) {
      console.log("Sample record structure:");
      console.log(Object.keys(data[0]));
    }

    // Try to get table info from information_schema
    const { data: columns, error: columnsError } = await supabaseAdmin
      .rpc("get_table_columns", { table_name: "admin_users" })
      .catch(() => null);

    if (columns) {
      console.log("Table columns:", columns);
    }
  } catch (error) {
    console.error("Script error:", error);
  }
}

checkTableStructure();
