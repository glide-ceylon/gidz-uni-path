// Test admin creation with password email
async function testAdminCreationWithPassword() {
  console.log("🧪 Testing Admin Creation with Password Email");
  console.log("==============================================");

  // Test data for admin creation
  const testAdminData = {
    email: "test.password.admin@example.com", // Change this to your email for testing
    first_name: "Test",
    last_name: "PasswordAdmin",
    role: "staff",
    department: "Testing",
    create_auth_user: true,
    password: "TestPassword123",
  };

  console.log("📝 Creating admin with data:", {
    ...testAdminData,
    password: "***hidden***", // Don't log actual password
  });

  try {
    console.log("📤 Sending request to admin creation API...");

    const response = await fetch("http://localhost:3000/api/admin-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Note: In production, this would need proper authentication headers
      },
      body: JSON.stringify(testAdminData),
    });

    console.log("📥 Response status:", response.status);
    console.log("📥 Response ok:", response.ok);

    const responseData = await response.json();
    console.log("📥 Response data:", responseData);

    if (response.ok) {
      console.log("\n✅ Admin creation successful!");
      console.log("📧 Check the email:", testAdminData.email);
      console.log("📧 The email should contain:");
      console.log("  - Welcome message");
      console.log("  - Admin details (name, role, department)");
      console.log("  - Login credentials section with email and password");
      console.log("  - Admin panel link");
      console.log("  - Security instructions");

      console.log("\n🧹 Remember to clean up the test admin from the database");
    } else {
      console.log("\n❌ Admin creation failed:", responseData.error);

      if (response.status === 401 || response.status === 403) {
        console.log(
          "🔐 Authentication required - you need to be logged in as an admin"
        );
      }
    }
  } catch (error) {
    console.error("\n💥 Test failed:", error.message);
  }

  console.log("\n🎯 What the email should include:");
  console.log("1. ✅ Welcome header with Gidz Uni Path branding");
  console.log("2. ✅ Personalized greeting with admin's name");
  console.log("3. ✅ Admin details (email, role, department)");
  console.log("4. ✅ Login credentials section (email + password)");
  console.log("5. ✅ Getting started instructions");
  console.log("6. ✅ Security notice about changing password");
  console.log("7. ✅ Admin panel link");
}

console.log("🚀 To run this test:");
console.log("1. Make sure your development server is running: npm run dev");
console.log("2. Make sure you're logged in as an admin with permissions");
console.log("3. Change the email address above to your email");
console.log("4. Uncomment the line below to run the test");
console.log("");

// Uncomment to run the test:
// testAdminCreationWithPassword();
