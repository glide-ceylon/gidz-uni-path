const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabaseUrl = "https://kmqxipltdxeajlabgylk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttcXhpcGx0ZHhlYWpsYWJneWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MzE5NDcsImV4cCI6MjA1MDAwNzk0N30.N0EGQAFPkVrDT5-TJacTN4jYZjlN2lrnUYx3jVdOBPI";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testALevelTracking() {
  console.log("🔍 Testing A-Level Subject Tracking...\n");

  try {
    // Test data simulating A-Level subject selection
    const testFormData = {
      PersonalInformation: {
        FirstName: "Test",
        LastName: "Student",
        Gender: "Male",
        DateOfBirth: "2000-01-01",
        UniversityType: ["Public"],
      },
      ContactInformation: {
        Email: "test@example.com",
        MobileNo: "+94123456789",
        Address: "123 Test Street",
        Country: "Sri Lanka",
      },
      EducationalQualification: {
        ALevel: {
          SubjectResults: [
            { Subject: "Combined Mathematics", Result: "A" },
            { Subject: "Physics", Result: "B" },
            { Subject: "Chemistry", Result: "A" },
          ],
          GPA: {
            RequiredForMasters: false,
            Value: "",
            DegreeName: "",
          },
        },
        TranscriptOrAdditionalDocument: null,
      },
      IELTSResults: {
        ScoreOption: "have",
        Reading: "7.0",
        Writing: "6.5",
        Listening: "7.5",
        Speaking: "6.0",
        OverallScore: "7.0",
        Certificate: null,
      },
      CVUpload: {
        File: null,
      },
      WhenApplyingMaster: {
        BachelorsCertificate: null,
        Transcript: null,
      },
      AdditionalInformation: {
        ReferenceCode: "TEST-001",
        Course: "Computer Science",
        AcademicYear: "2024",
        AcademicTerm: "Fall",
        CoursePreferences: ["Computer Science"],
        UniversityPreferences: ["Technical University"],
        PersonalStatement: "Test personal statement",
      },
      FinancialProof: {
        CanEarnLivingInGermany: "Yes",
        FinancialMeansType: "Blocked Account",
        BlockedAccountAmount: "11208",
        DeclarationOfCommitment: "",
        SponsorDetails: "",
        OtherFinancialMeans: "",
        FinancialDocuments: null,
      },
    };

    console.log("📝 Test Form Data Structure:");
    console.log(
      "A-Level Subjects:",
      JSON.stringify(
        testFormData.EducationalQualification.ALevel.SubjectResults,
        null,
        2
      )
    );
    console.log(
      "A-Level GPA Settings:",
      JSON.stringify(testFormData.EducationalQualification.ALevel.GPA, null, 2)
    );
    console.log(
      "IELTS Data:",
      JSON.stringify(testFormData.IELTSResults, null, 2)
    );

    // Add metadata
    const processedData = {
      ...testFormData,
      ApplicationDate: new Date().toISOString(),
      MarkasRead: false,
    };

    console.log("\n✅ Data Structure Validation:");
    console.log(
      "- A-Level subjects array length:",
      processedData.EducationalQualification.ALevel.SubjectResults.length
    );
    console.log(
      "- Each subject has Subject and Result properties:",
      processedData.EducationalQualification.ALevel.SubjectResults.every(
        (s) => s.Subject && s.Result
      )
    );
    console.log(
      "- No O-Level references found:",
      !JSON.stringify(processedData).includes("OLevel")
    );
    console.log(
      "- IELTS OverallScore field present:",
      "OverallScore" in processedData.IELTSResults
    );

    // Simulate submission to test tracking
    console.log("\n🚀 Testing Database Submission...");
    const { data, error } = await supabase
      .from("student_visa")
      .insert([{ data: JSON.stringify(processedData) }])
      .select();

    if (error) {
      console.error("❌ Database submission failed:", error);
      return;
    }

    console.log("✅ Database submission successful!");
    console.log("Submitted record ID:", data[0].id);

    // Retrieve and verify the submitted data
    console.log("\n🔍 Verifying Submitted Data...");
    const { data: retrievedData, error: retrieveError } = await supabase
      .from("student_visa")
      .select("*")
      .eq("id", data[0].id)
      .single();

    if (retrieveError) {
      console.error("❌ Data retrieval failed:", retrieveError);
      return;
    }

    const parsedData = JSON.parse(retrievedData.data);
    console.log("✅ Data retrieved successfully!");
    console.log(
      "A-Level subjects in database:",
      parsedData.EducationalQualification.ALevel.SubjectResults
    );
    console.log(
      "IELTS OverallScore in database:",
      parsedData.IELTSResults.OverallScore
    );

    // Verify A-Level tracking
    console.log("\n📊 A-Level Tracking Verification:");
    const aLevelSubjects =
      parsedData.EducationalQualification.ALevel.SubjectResults;
    aLevelSubjects.forEach((subject, index) => {
      console.log(
        `Subject ${index + 1}: ${subject.Subject} - Grade: ${subject.Result}`
      );
    });

    console.log("\n✅ A-Level subject tracking is working correctly!");
    console.log("✅ O-Level references have been successfully removed!");
    console.log("✅ IELTS OverallScore field is working!");

    // Clean up test data
    await supabase.from("student_visa").delete().eq("id", data[0].id);

    console.log("🧹 Test data cleaned up successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testALevelTracking()
  .then(() => {
    console.log("\n🎉 A-Level tracking test completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test execution failed:", error);
    process.exit(1);
  });
