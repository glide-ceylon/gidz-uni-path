// Quick bucket verification
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function quickTest() {
  console.log("=== Quick Bucket Test ===");

  // Test different bucket names that might exist
  const bucketsToTest = [
    "work_visa_files",
    "work-visa-files",
    "workvisa",
    "files",
    "uploads",
    "documents",
  ];

  for (const bucketName of bucketsToTest) {
    try {
      console.log(`Testing bucket: ${bucketName}`);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .list("", { limit: 1 });

      if (error) {
        console.log(`  ❌ ${bucketName}: ${error.message}`);
      } else {
        console.log(`  ✅ ${bucketName}: EXISTS and accessible`);
        break; // Found working bucket
      }
    } catch (err) {
      console.log(`  ❌ ${bucketName}: ${err.message}`);
    }
  }
}

// Set timeout to prevent hanging
setTimeout(() => {
  console.log("⏰ Test timed out after 10 seconds");
  process.exit(1);
}, 10000);

quickTest()
  .then(() => {
    console.log("✅ Test completed");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Test failed:", err.message);
    process.exit(1);
  });
