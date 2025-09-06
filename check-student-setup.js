require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStudentTable() {
  console.log("=== Checking Student Application Database Setup ===");

  try {
    // Check if student_visa table exists
    const { data: studentTableData, error: studentTableError } = await supabase
      .from("student_visa")
      .select("*")
      .limit(1);

    if (studentTableError) {
      console.log("❌ student_visa table does not exist");
      console.log("Error:", studentTableError.message);
    } else {
      console.log("✅ student_visa table exists");
      console.log("Sample data structure available");
    }

    // Check available storage buckets
    console.log("\n📁 Checking available storage buckets...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("❌ Error listing buckets:", bucketsError);
    } else {
      console.log("✅ Available storage buckets:");
      buckets.forEach((bucket) => {
        console.log(
          `   - ${bucket.name} (${bucket.public ? "public" : "private"})`
        );
      });

      // Check if there's a student_visa_files bucket
      const studentBucket = buckets?.find(
        (bucket) => bucket.name === "student_visa_files"
      );

      if (studentBucket) {
        console.log("\n✅ student_visa_files bucket found");
        console.log(
          `   - ${studentBucket.name} (${
            studentBucket.public ? "public" : "private"
          })`
        );

        // Try to list folders in the bucket to verify access
        console.log("\n📁 Checking bucket contents...");
        const { data: folders, error: folderError } = await supabase.storage
          .from("student_visa_files")
          .list("", { limit: 10 });

        if (!folderError && folders) {
          console.log("✅ Bucket folders available:");
          folders.forEach((folder) => {
            if (folder.name) {
              console.log(`   - ${folder.name}/`);
            }
          });
        } else {
          console.log(
            "⚠️  Could not list bucket contents (may be empty or access restricted)"
          );
          if (folderError) {
            console.log("   Error:", folderError.message);
          }
        }
      } else {
        console.log("\n❌ student_visa_files bucket not found");
        console.log(
          "   Note: User confirmed it exists - bucket may be case-sensitive or access restricted"
        );
        console.log("   Available buckets:");
        buckets.forEach((bucket) => console.log(`   - ${bucket.name}`));
      }
    }

    // Check what table structure is expected
    if (!studentTableError && studentTableData) {
      console.log("\n📊 Checking student_visa table structure...");
      const { data: tableData, error: structureError } = await supabase
        .from("student_visa")
        .select("*")
        .limit(3);

      if (structureError) {
        console.error("❌ Error checking table structure:", structureError);
      } else {
        console.log(
          `✅ Found ${tableData.length} records in student_visa table`
        );
        if (tableData.length > 0) {
          console.log("\n📋 Sample record structure:");
          console.log(JSON.stringify(tableData[0], null, 2));
        }
      }
    }
  } catch (error) {
    console.error("❌ Script failed:", error.message);
  }
}

checkStudentTable();
