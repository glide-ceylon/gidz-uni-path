// Check and create work_applications table
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndCreateTable() {
  console.log("=== Checking Database Tables ===");

  try {
    // Try to check if work_visa table exists by attempting to select from it
    const { data, error } = await supabase
      .from("work_visa")
      .select("*")
      .limit(1);

    if (error) {
      if (error.message.includes('relation "work_visa" does not exist')) {
        console.log("❌ work_visa table does not exist");
        console.log(
          "📝 You need to create this table in your Supabase dashboard"
        );
        console.log("\nSQL to create the table:");
        console.log(`
CREATE TABLE work_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Personal Information
  firstName TEXT,
  lastName TEXT,
  dateOfBirth DATE,
  nationality TEXT,
  passportNumber TEXT,
  
  -- Contact Information
  mobileNumber TEXT,
  email TEXT,
  currentAddress TEXT,
  country TEXT,
  
  -- Qualifications and Experience
  educationType TEXT,
  yearsOfProfessionalExperience TEXT,
  currentJobTitle TEXT,
  
  -- Language Skills
  germanLanguageLevel TEXT,
  englishLanguageLevel TEXT,
  
  -- Germany Experience
  previousStayInGermany TEXT,
  previousVisaType TEXT,
  
  -- Application Details
  applyingWithSpouse BOOLEAN DEFAULT FALSE,
  blockedAccount BOOLEAN DEFAULT FALSE,
  aboutYouAndYourNeeds TEXT,
  
  -- Financial Proof
  CanEarnLivingInGermany TEXT,
  
  -- File URLs
  bachelorOrMasterDegreeCertificateUrl TEXT,
  vocationalTrainingCertificatesUrl TEXT,
  cvUrl TEXT,
  germanCertificateUrl TEXT,
  englishCertificateUrl TEXT,
  
  -- Metadata
  applicationDate TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE work_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for form submissions)
CREATE POLICY "Allow public inserts" ON work_applications FOR INSERT TO anon WITH CHECK (true);

-- Create policy to allow admins to read all data (replace with your admin user ID)
-- CREATE POLICY "Allow admin read" ON work_applications FOR SELECT TO authenticated USING (auth.role() = 'admin');
        `);

        console.log("\nTo create this table:");
        console.log("1. Go to your Supabase dashboard");
        console.log("2. Go to the SQL Editor");
        console.log("3. Copy and paste the SQL above");
        console.log("4. Run the query");
      } else {
        console.log("❌ Database error:", error.message);
      }
    } else {
      console.log("✅ work_visa table exists and is accessible");
      console.log("📊 Sample data structure:", data);
    }
  } catch (err) {
    console.log("❌ Unexpected error:", err.message);
  }
}

checkAndCreateTable();
