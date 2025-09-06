// Debug script to test Supabase connection and create storage bucket
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("=== Supabase Configuration Check ===");
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey ? "✓ Set" : "✗ Not Set");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase configuration!");
  console.log("Please check your .env.local file contains:");
  console.log("NEXT_PUBLIC_SUPABASE_URL=your_supabase_url");
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  try {
    console.log("\n=== Testing Supabase Connection ===");

    // Test basic connection
    const { data, error } = await supabase
      .from("work_applications")
      .select("count")
      .limit(1);

    if (error) {
      console.log("❌ Database connection failed:", error.message);
      if (
        error.message.includes('relation "work_applications" does not exist')
      ) {
        console.log(
          "📝 Note: work_applications table doesn't exist yet - this is normal for a new setup"
        );
      }
    } else {
      console.log("✅ Database connection successful");
    }

    // Test storage bucket
    console.log("\n=== Testing Storage Bucket ===");

    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.log("❌ Storage connection failed:", bucketsError.message);
      return;
    }

    console.log(
      "Available buckets:",
      buckets.map((b) => b.name)
    );

    const workVisaBucket = buckets.find(
      (bucket) => bucket.name === "work_visa_files"
    );

    if (!workVisaBucket) {
      console.log("⚠️  work_visa_files bucket not found");
      console.log("Creating work_visa_files bucket...");

      const { data: newBucket, error: createError } =
        await supabase.storage.createBucket("work_visa_files", {
          public: true,
          allowedMimeTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/png",
          ],
          fileSizeLimit: 10485760, // 10MB
        });

      if (createError) {
        console.log("❌ Failed to create bucket:", createError.message);
        console.log(
          "💡 You may need to create this bucket manually in your Supabase dashboard"
        );
        console.log("   - Go to Storage in your Supabase dashboard");
        console.log("   - Create a new bucket named 'work_visa_files'");
        console.log("   - Make it public");
        console.log("   - Set file size limit to 10MB");
      } else {
        console.log("✅ work_visa_files bucket created successfully");
      }
    } else {
      console.log("✅ work_visa_files bucket exists");
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

testSupabaseConnection();
