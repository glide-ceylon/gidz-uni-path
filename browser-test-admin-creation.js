// Browser console test for admin creation
// Open browser dev tools, go to console, and run this code

async function testAdminCreation() {
  try {
    console.log("🧪 Testing admin creation from browser...");

    const testData = {
      email: "browser-test-admin@example.com",
      first_name: "Browser",
      last_name: "Test",
      role: "staff",
      department: "Testing",
      create_auth_user: false,
    };

    console.log("📤 Sending request with data:", testData);

    const response = await fetch("/api/admin-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(testData),
    });

    console.log("📥 Response status:", response.status);
    console.log("📥 Response ok:", response.ok);

    const responseData = await response.json();
    console.log("📥 Response data:", responseData);

    if (response.ok) {
      console.log("✅ Admin creation successful!");
      return responseData;
    } else {
      console.log("❌ Admin creation failed:", responseData.error);
      return responseData;
    }
  } catch (error) {
    console.error("❌ Network error:", error);
    return { error: error.message };
  }
}

// Run the test
testAdminCreation();
