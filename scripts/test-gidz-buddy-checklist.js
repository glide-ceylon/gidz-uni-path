// Test script for Gidz Buddy Checklist API
// Run this in your browser console or as a Node.js script

const API_BASE = "http://localhost:3000/api/gidz-buddy-checklist";

// Test GET - Fetch all checklist items
async function testFetchChecklistItems() {
  console.log("🔍 Testing GET /api/gidz-buddy-checklist...");

  try {
    const response = await fetch(API_BASE);
    const result = await response.json();

    if (result.success) {
      console.log("✅ Successfully fetched checklist items:");
      console.log(`   Found ${result.data.length} items`);
      result.data.forEach((item, index) => {
        console.log(
          `   ${index + 1}. ${item.title} (Priority: ${item.priority})`
        );
      });
    } else {
      console.error("❌ Failed to fetch checklist items:", result.error);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
  }
}

// Test POST - Create a new checklist item
async function testCreateChecklistItem() {
  console.log("\n📝 Testing POST /api/gidz-buddy-checklist...");

  const newItem = {
    item_id: `test-item-${Date.now()}`,
    title: "Test Checklist Item",
    description: "This is a test item created by the test script",
    priority: 2,
    category: "preparation",
    icon: "FaLightbulb",
    action_text: "Test Action",
    estimated_time: "15 minutes",
    impact: "Medium",
    youtube_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtube_title: "Test Video Guide",
    next_steps: ["Test step 1", "Test step 2", "Test step 3"],
    display_order: 999,
    is_active: true,
  };

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    });

    const result = await response.json();

    if (result.success) {
      console.log("✅ Successfully created checklist item:");
      console.log("   ID:", result.data.id);
      console.log("   Title:", result.data.title);
      return result.data;
    } else {
      console.error("❌ Failed to create checklist item:", result.error);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
  }

  return null;
}

// Test database table structure
async function testDatabaseStructure() {
  console.log("\n🗄️  Testing database structure...");

  try {
    const response = await fetch(API_BASE);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      const item = result.data[0];
      const expectedFields = [
        "id",
        "title",
        "description",
        "priority",
        "category",
        "icon",
        "action",
        "estimatedTime",
        "impact",
        "youtubeLink",
        "youtubeTitle",
        "nextSteps",
        "displayOrder",
      ];

      console.log("✅ Database structure test:");
      expectedFields.forEach((field) => {
        if (item.hasOwnProperty(field)) {
          console.log(`   ✓ ${field}: ${typeof item[field]}`);
        } else {
          console.log(`   ✗ Missing field: ${field}`);
        }
      });

      // Test data types
      console.log("\n📊 Data type validation:");
      console.log(`   nextSteps is array: ${Array.isArray(item.nextSteps)}`);
      console.log(
        `   priority is number: ${typeof item.priority === "number"}`
      );
      console.log(
        `   displayOrder is number: ${typeof item.displayOrder === "number"}`
      );
    } else {
      console.log("⚠️  No data available for structure test");
    }
  } catch (error) {
    console.error("❌ Database structure test failed:", error);
  }
}

// Test YouTube link validation
function testYouTubeLinkValidation() {
  console.log("\n🎥 Testing YouTube link validation...");

  const testLinks = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ",
    "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
    "invalid-url",
    "https://example.com/video",
  ];

  const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//;

  testLinks.forEach((link) => {
    const isValid = youtubeRegex.test(link);
    console.log(`   ${isValid ? "✅" : "❌"} ${link}`);
  });
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting Gidz Buddy Checklist API Tests\n");

  await testFetchChecklistItems();
  await testDatabaseStructure();
  testYouTubeLinkValidation();

  // Create a test item
  const createdItem = await testCreateChecklistItem();

  console.log("\n✨ Test completed!");
  console.log("\nNext steps:");
  console.log("1. Run the SQL migration in Supabase");
  console.log(
    "2. Check that the SmartRecommendations component loads correctly"
  );
  console.log("3. Test the admin interface for managing checklist items");
  console.log("4. Verify YouTube video links open correctly");

  if (createdItem) {
    console.log(
      `\n⚠️  Don't forget to delete the test item with ID: ${createdItem.id}`
    );
  }
}

// Execute tests if running in browser
if (typeof window !== "undefined") {
  runAllTests();
}

// Export for Node.js usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    testFetchChecklistItems,
    testCreateChecklistItem,
    testDatabaseStructure,
    testYouTubeLinkValidation,
    runAllTests,
  };
}
