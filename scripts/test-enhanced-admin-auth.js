const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function testEnhancedAdminAuth() {
  console.log("🔐 Testing Enhanced Admin Authentication...\n");

  const testCases = [
    {
      name: "Hardcoded Demo Admin",
      email: "admin@gidz-uni-path.com",
      password: "admin123",
      shouldSucceed: true,
      description: "Should authenticate using hardcoded validPasswords",
    },
    {
      name: "Hardcoded Demo Manager",
      email: "manager@gidz-uni-path.com",
      password: "manager123",
      shouldSucceed: true,
      description: "Should authenticate using hardcoded validPasswords",
    },
    {
      name: "Hardcoded Demo Staff",
      email: "staff@gidz-uni-path.com",
      password: "staff123",
      shouldSucceed: true,
      description: "Should authenticate using hardcoded validPasswords",
    },
    {
      name: "Non-hardcoded User (Supabase Auth)",
      email: "test-admin@example.com",
      password: "testpassword123",
      shouldSucceed: false, // Will succeed only if this user exists in Supabase Auth
      description: "Should fallback to Supabase Auth validation",
    },
    {
      name: "Invalid Credentials",
      email: "nonexistent@example.com",
      password: "wrongpassword",
      shouldSucceed: false,
      description: "Should fail authentication for invalid credentials",
    },
    {
      name: "Valid Email Wrong Password",
      email: "admin@gidz-uni-path.com",
      password: "wrongpassword",
      shouldSucceed: false,
      description: "Should fail authentication for wrong password",
    },
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.name}`);
    console.log(`📝 Description: ${testCase.description}`);
    console.log(`📧 Email: ${testCase.email}`);
    console.log(`🔑 Password: ${"*".repeat(testCase.password.length)}`);
    console.log(
      `🎯 Expected: ${testCase.shouldSucceed ? "SUCCESS" : "FAILURE"}`
    );

    try {
      const response = await axios.post(`${BASE_URL}/api/admin-auth/login`, {
        email: testCase.email,
        password: testCase.password,
        remember_me: false,
      });

      if (testCase.shouldSucceed) {
        if (response.status === 200) {
          console.log("✅ PASS - Authentication succeeded as expected");
          console.log(
            `   Admin: ${response.data.data.admin.first_name} ${response.data.data.admin.last_name}`
          );
          console.log(`   Role: ${response.data.data.admin.role}`);
          console.log(
            `   Permissions: ${response.data.data.permissions.length} permissions`
          );
          passedTests++;

          // Test logout for successful logins
          try {
            const sessionToken = response.data.data.session.token;
            await axios.delete(`${BASE_URL}/api/admin-auth/login`, {
              headers: {
                "x-session-token": sessionToken,
              },
            });
            console.log("   Logout successful");
          } catch (logoutError) {
            console.log("   Logout failed (not critical for this test)");
          }
        } else {
          console.log(
            `❌ FAIL - Expected success but got status ${response.status}`
          );
        }
      } else {
        console.log(`❌ FAIL - Expected failure but authentication succeeded`);
      }
    } catch (error) {
      if (!testCase.shouldSucceed) {
        if (error.response?.status === 401) {
          console.log(
            "✅ PASS - Authentication failed as expected (401 Unauthorized)"
          );
          passedTests++;
        } else if (error.response?.status === 400) {
          console.log(
            "✅ PASS - Authentication failed as expected (400 Bad Request)"
          );
          passedTests++;
        } else {
          console.log(
            `❓ PARTIAL - Authentication failed but with unexpected status: ${error.response?.status}`
          );
          console.log(
            `   Error: ${error.response?.data?.error || error.message}`
          );
        }
      } else {
        console.log(`❌ FAIL - Expected success but got error:`);
        console.log(`   Status: ${error.response?.status}`);
        console.log(
          `   Error: ${error.response?.data?.error || error.message}`
        );

        if (error.code === "ECONNREFUSED") {
          console.log(
            "\n💡 Make sure your Next.js development server is running:"
          );
          console.log("   npm run dev");
          break;
        }
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log(
      "🎉 All tests passed! Enhanced authentication is working correctly."
    );
  } else {
    console.log(
      "⚠️  Some tests failed. Check the implementation or test conditions."
    );
  }

  console.log("\n📖 Authentication Flow Summary:");
  console.log("1. Check if admin exists in admin_users table");
  console.log("2. Try hardcoded validPasswords first (demo users)");
  console.log("3. If not in validPasswords, fallback to Supabase Auth");
  console.log("4. Create session if authentication succeeds");
  console.log("5. Return admin data, session token, and permissions");
}

// Run the test
if (require.main === module) {
  testEnhancedAdminAuth()
    .then(() => {
      console.log("\n🏁 Enhanced admin authentication test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Test failed with error:", error.message);
      process.exit(1);
    });
}

module.exports = { testEnhancedAdminAuth };
