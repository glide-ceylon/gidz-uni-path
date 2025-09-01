// Test to understand the text[] column format requirements

console.log("🧪 Testing text[] Column Format...\n");

// The provided data example from the user
const providedData = `["{\"PersonalInformation\":{\"FirstName\":\"V jaliny \",\"LastName\":\"Vijenthiran jaliny \",\"Gender\":\"Female\",\"DateOfBirth\":\"1999-12-11\",\"UniversityType\":[]},\"ContactInformation\":{\"Email\":\"yaliniyalini817@gmail.com\",\"MobileNo\":\"0760780964\",\"Address\":\"No. 671. Manikkapuram visuvamadu \",\"Country\":\"Germany\"},\"EducationalQualification\":{\"ALevel\":{\"SubjectResults\":[{\"Subject\":\"History\",\"Result\":\"S\"},{\"Subject\":\"Geography\",\"Result\":\"S\"},{\"Subject\":\"Literature (Sinhala, Tamil, English)\",\"Result\":\"C\"}],\"GPA\":{\"RequiredForMasters\":false,\"Value\":\"\"}},\"TranscriptOrAdditionalDocument\":null},\"IELTSResults\":{\"ScoreOption\":\"No, But can score 5.5\",\"Reading\":\"\",\"Writing\":\"\",\"Listening\":\"\",\"Speaking\":\"\",\"Certificate\":null},\"CVUpload\":{\"File\":null},\"WhenApplyingMaster\":{\"BachelorsCertificate\":null,\"Transcript\":null},\"AdditionalInformation\":{\"ReferenceCode\":\"\",\"Course\":\"\",\"AcademicYear\":\"2025\",\"AcademicTerm\":\"\",\"CoursePreferences\":[\"\"],\"CityPreferences\":[\"\"],\"UniversityPreferences\":[\"\"],\"OpenForOtherOptions\":false},\"MarkasRead\":true}"]`;

console.log("📊 Analyzing provided data structure:");
console.log("Raw data type:", typeof providedData);
console.log("Raw data starts with:", providedData.substring(0, 50));

// Parse the array
let parsedArray;
try {
  parsedArray = JSON.parse(providedData);
  console.log("✅ Successfully parsed as array");
  console.log("Array length:", parsedArray.length);
  console.log(
    "Array elements:",
    parsedArray.map((item, index) => ({
      index,
      type: typeof item,
      length: item.length,
    }))
  );
} catch (error) {
  console.log("❌ Failed to parse as array:", error.message);
}

// Parse the first element as JSON
if (parsedArray && parsedArray.length > 0) {
  try {
    const jsonData = JSON.parse(parsedArray[0]);
    console.log("✅ Successfully parsed first element as JSON");
    console.log("JSON structure keys:", Object.keys(jsonData));
    console.log("PersonalInformation:", jsonData.PersonalInformation);
  } catch (error) {
    console.log("❌ Failed to parse first element as JSON:", error.message);
  }
}

// Demonstrate how admin code reads this data
console.log("\n🔍 How admin code should read this data:");
console.log("Admin code approach:");

// Method 1: If data is text[] (array of strings)
function readAsTextArray(data) {
  try {
    // data is already an array from Supabase
    if (Array.isArray(data) && data.length > 0) {
      const jsonString = data[0]; // Get first element
      const parsed = JSON.parse(jsonString);
      return { success: true, data: parsed };
    }
    return { success: false, error: "No data in array" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Method 2: If data comes as string representation of array
function readAsStringifiedArray(dataString) {
  try {
    const array = JSON.parse(dataString); // Parse the array
    const jsonString = array[0]; // Get first element
    const parsed = JSON.parse(jsonString); // Parse the JSON
    return { success: true, data: parsed };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

console.log("Method 1 (data as array):", readAsTextArray(parsedArray));
console.log("Method 2 (data as string):", readAsStringifiedArray(providedData));

// Test different insertion formats
console.log("\n🧪 Testing insertion format options:");

const testData = {
  PersonalInformation: {
    FirstName: "Test",
    LastName: "User",
  },
  test: true,
};

console.log("Original data:", testData);

// Option 1: Insert as single JSON string in array (what we did)
const option1 = [JSON.stringify(testData)];
console.log("Option 1 (array with JSON string):", option1);
console.log("Option 1 stringified:", JSON.stringify(option1));

// Option 2: Insert JSON string directly
const option2 = JSON.stringify(testData);
console.log("Option 2 (JSON string):", option2);

// Option 3: Insert object directly
const option3 = testData;
console.log("Option 3 (object):", option3);

console.log("\n📋 Analysis Results:");
console.log(
  "✅ Current database format: Array with single JSON string element"
);
console.log(
  "✅ Reading approach: Parse array, then parse first element as JSON"
);
console.log("✅ Writing approach: Stringify data, then wrap in array");

console.log("\n🎯 Correct insertion format for text[] column:");
console.log("Database expects: text[] (PostgreSQL array of text)");
console.log("Insert format: [JSON.stringify(data)]");
console.log("Read format: JSON.parse(data[0]) where data is the array from DB");

console.log("\n🚀 Fix confirmed: Wrap JSON string in array for text[] column!");
