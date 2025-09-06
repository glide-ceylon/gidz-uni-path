// Test admin creation with email notification
require("dotenv").config();

async function testAdminCreationWithEmail() {
  try {
    console.log("🧪 Testing admin creation with email notification...");

    const testAdminData = {
      email: "test.admin@example.com",
      first_name: "Test",
      last_name: "Admin",
      role: "staff",
      department: "Testing",
      create_auth_user: false, // Start with false to avoid auth complications
    };

    console.log("📝 Creating admin with data:", testAdminData);

    // Test the API endpoint
    const response = await fetch("http://localhost:3000/api/admin-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Note: In real scenario, this would need proper session cookies
      },
      body: JSON.stringify(testAdminData),
    });

    console.log("📥 Response status:", response.status);

    const responseData = await response.json();
    console.log("📥 Response data:", responseData);

    if (response.ok) {
      console.log("✅ Admin creation successful!");
      console.log("📧 Check if email was sent to:", testAdminData.email);

      // Clean up - delete the test admin (in real scenario)
      console.log("🧹 Remember to clean up test admin if created");
    } else {
      console.log("❌ Admin creation failed:", responseData.error);
    }
  } catch (error) {
    console.error("💥 Test failed:", error.message);
  }
}

console.log("🔧 To test this properly:");
console.log("1. Start the development server: npm run dev");
console.log("2. Login as an admin with proper permissions");
console.log("3. Try creating an admin through the UI");
console.log("4. Check the server logs for email sending status");
console.log("5. Check the recipient's email inbox");

console.log("\n📋 Email features implemented:");
console.log("✅ Welcome email template with admin details");
console.log("✅ Role-specific information in email");
console.log("✅ Auth account status notification");
console.log("✅ Getting started instructions");
console.log("✅ Professional HTML email template");
console.log("✅ Error handling (email failure won't break admin creation)");
console.log("✅ UI notification about email being sent");
console.log("✅ Success/error message display improvements");

testAdminCreationWithEmail();
