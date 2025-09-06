// Simple test script for Gidz Buddy Checklist API (Simplified Version)
// Run this in your browser console

const API_BASE = "/api/gidz-buddy-checklist";

// Test GET - Fetch all checklist items
async function testFetchItems() {
  console.log("🔍 Testing GET checklist items...");

  try {
    const response = await fetch(API_BASE);
    const result = await response.json();

    if (result.success) {
      console.log("✅ Successfully fetched items:");
      console.log(`   Found ${result.data.length} items`);
      result.data.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title}`);
        console.log(
          `      Description: ${item.description.substring(0, 50)}...`
        );
        console.log(`      YouTube: ${item.youtubeLink ? "Yes" : "No"}`);
      });
    } else {
      console.error("❌ Failed to fetch items:", result.error);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
  }
}

// Test POST - Create a new item
async function testCreateItem() {
  console.log("\n📝 Testing POST new item...");

  const newItem = {
    title: "Test Item - Simple Version",
    description: "This is a test item for the simplified checklist system",
    youtube_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    display_order: 999,
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
      console.log("✅ Successfully created item:");
      console.log("   ID:", result.data.id);
      console.log("   Title:", result.data.title);
      return result.data;
    } else {
      console.error("❌ Failed to create item:", result.error);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
  }

  return null;
}

// Test database structure
async function testStructure() {
  console.log("\n🗄️  Testing simplified structure...");

  try {
    const response = await fetch(API_BASE);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      const item = result.data[0];
      const expectedFields = [
        "id",
        "title",
        "description",
        "youtubeLink",
        "displayOrder",
      ];

      console.log("✅ Structure validation:");
      expectedFields.forEach((field) => {
        if (item.hasOwnProperty(field)) {
          console.log(`   ✓ ${field}: ${typeof item[field]}`);
        } else {
          console.log(`   ✗ Missing field: ${field}`);
        }
      });

      // Check that complex fields are gone
      const removedFields = [
        "priority",
        "category",
        "icon",
        "nextSteps",
        "impact",
      ];
      console.log("\n🚫 Removed fields check:");
      removedFields.forEach((field) => {
        if (!item.hasOwnProperty(field)) {
          console.log(`   ✓ ${field}: Removed (as expected)`);
        } else {
          console.log(`   ✗ ${field}: Still present (unexpected)`);
        }
      });
    } else {
      console.log("⚠️  No data available for structure test");
    }
  } catch (error) {
    console.error("❌ Structure test failed:", error);
  }
}

// Run all tests
async function runSimpleTests() {
  console.log("🚀 Starting Simplified Gidz Buddy Checklist Tests\n");

  await testFetchItems();
  await testStructure();

  // Create a test item
  const createdItem = await testCreateItem();

  console.log("\n✨ Simple test completed!");
  console.log("\nWhat you should see:");
  console.log(
    "- ✅ Only 4 fields per item: id, title, description, youtubeLink, displayOrder"
  );
  console.log("- ✅ No complex fields like priority, category, icon, etc.");
  console.log("- ✅ Clean and simple UI structure");

  if (createdItem) {
    console.log(`\n⚠️  Test item created with ID: ${createdItem.id}`);
    console.log("   You can delete it from the admin interface");
  }
}

// Execute tests
runSimpleTests();
