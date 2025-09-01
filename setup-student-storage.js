require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables");
  console.log("Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStudentVisaBucket() {
  console.log("=== Setting up student_visa_files bucket ===");

  try {
    // Create the bucket
    console.log("🗂️ Creating student_visa_files bucket...");
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('student_visa_files', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log("✅ Bucket already exists");
      } else {
        console.error("❌ Error creating bucket:", bucketError);
        return;
      }
    } else {
      console.log("✅ Bucket created successfully");
    }

    // Create folder structure by uploading placeholder files
    const folders = ["ol", "al", "transcript", "ielts", "cv", "bachelors", "financial"];
    
    console.log("📁 Creating folder structure...");
    for (const folder of folders) {
      try {
        // Create a small placeholder file to establish the folder structure
        const placeholderContent = `This folder is for ${folder} documents`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('student_visa_files')
          .upload(`${folder}/.placeholder`, placeholderContent);

        if (uploadError) {
          console.log(`⚠️ Could not create folder ${folder}:`, uploadError.message);
        } else {
          console.log(`✅ Created folder: ${folder}/`);
        }
      } catch (error) {
        console.log(`⚠️ Folder ${folder} will be created on first upload`);
      }
    }

    console.log("\n🎉 Setup complete!");
    console.log("✅ student_visa_files bucket is ready");
    console.log("✅ Folder structure created");
    console.log("\n📋 You can now:");
    console.log("  1. Test the student form with file uploads");
    console.log("  2. Files will be organized in appropriate folders");
    console.log("  3. URLs will be stored in the database");

  } catch (error) {
    console.error("❌ Setup failed:", error.message);
  }
}

setupStudentVisaBucket();
