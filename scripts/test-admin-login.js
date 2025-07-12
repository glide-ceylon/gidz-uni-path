const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function testAdminLogin() {
  console.log("🔐 Testing Admin Login and Session Creation...\n");

  let sessionToken = null;
  let sessionCookie = null;

  try {
    // Test admin login
    console.log("1. Testing admin login...");
    const loginResponse = await axios.post(`${BASE_URL}/api/admin-auth/login`, {
      email: "thushanjana@gmail.com",
      password: "Thush@1111",
      remember_me: false,
    });

    if (loginResponse.status === 200) {
      console.log("✅ Admin login successful");
      console.log("📧 Admin email:", loginResponse.data.data.admin.email);
      console.log("🎭 Admin role:", loginResponse.data.data.admin.role);
      console.log(
        "🔑 Session token received:",
        loginResponse.data.data.session.token ? "Yes" : "No"
      );
      console.log(
        "📅 Session expires at:",
        loginResponse.data.data.session.expires_at
      );

      // Check if Set-Cookie header is present
      const cookies = loginResponse.headers["set-cookie"];
      if (cookies) {
        console.log(
          "🍪 Session cookie set:",
          cookies.find((c) => c.includes("admin_session")) ? "Yes" : "No"
        );
      }

      // Test accessing admin endpoint with session
      console.log("\n2. Testing admin endpoint access with session...");

      // Safely extract session token
      try {
        sessionToken = loginResponse.data?.data?.session?.token;
        if (!sessionToken) {
          console.log("⚠️  No session token found in response");
        }
      } catch (tokenError) {
        console.log("⚠️  Error extracting session token:", tokenError.message);
      }

      // Extract session cookie for subsequent requests
      sessionCookie = cookies
        ? cookies.find((c) => c.includes("admin_session"))
        : null;

      try {
        const timelineResponse = await axios.get(
          `${BASE_URL}/api/timeline-events`,
          {
            headers: {
              Cookie: sessionCookie || "",
              "x-session-token": sessionToken, // Fallback to header
            },
          }
        );

        if (timelineResponse.status === 200) {
          console.log("✅ Admin endpoint access successful with session");
          console.log(
            "📊 Retrieved",
            timelineResponse.data.count,
            "timeline events"
          );
        }
      } catch (accessError) {
        console.log("❌ Admin endpoint access failed:");
        console.log("   Status:", accessError.response?.status);
        console.log("   Error:", accessError.response?.data?.error);
      }

      // Only proceed with session tests if we have a valid session token
      if (sessionToken) {
        // Test session validation by creating an event
        console.log("\n3. Testing timeline event creation with session...");
        try {
          const createResponse = await axios.post(
            `${BASE_URL}/api/timeline-events`,
            {
              application_id: "550e8400-e29b-41d4-a716-446655440000", // Example UUID - using application_id to match database
              event_type: "admin_custom", // Valid event type for the database
              title: "Test Event - Session Validation",
              description: "This event was created to test session validation",
              status: "upcoming", // Valid status for the database
            },
            {
              headers: {
                Cookie: sessionCookie || "",
                "x-session-token": sessionToken,
                "Content-Type": "application/json",
              },
            }
          );

          if (createResponse.status === 201) {
            console.log("✅ Timeline event creation successful with session");
            console.log("📝 Created event:", createResponse.data.data.title);
            console.log("🆔 Event ID:", createResponse.data.data.id);
          }
        } catch (createError) {
          console.log("❌ Timeline event creation failed:");
          console.log("   Status:", createError.response?.status);
          console.log("   Error:", createError.response?.data?.error);
        }

        // Test logout
        console.log("\n4. Testing admin logout...");
        try {
          const logoutResponse = await axios.delete(
            `${BASE_URL}/api/admin-auth/login`,
            {
              headers: {
                Cookie: sessionCookie || "",
                "x-session-token": sessionToken,
              },
            }
          );

          if (logoutResponse.status === 200) {
            console.log("✅ Admin logout successful");
            console.log("💬 Message:", logoutResponse.data.message);
          }
        } catch (logoutError) {
          console.log("❌ Admin logout failed:");
          console.log("   Status:", logoutError.response?.status);
          console.log("   Error:", logoutError.response?.data?.error);
        }

        // Test accessing endpoint after logout
        console.log("\n5. Testing admin endpoint access after logout...");
        try {
          const postLogoutResponse = await axios.get(
            `${BASE_URL}/api/timeline-events`,
            {
              headers: {
                Cookie: sessionCookie || "",
                "x-session-token": sessionToken,
              },
            }
          );

          console.log(
            "❌ Admin endpoint still accessible after logout (this should not happen)"
          );
        } catch (postLogoutError) {
          if (postLogoutError.response?.status === 401) {
            console.log("✅ Admin endpoint properly blocked after logout");
          } else {
            console.log("❓ Unexpected response after logout:");
            console.log("   Status:", postLogoutError.response?.status);
            console.log("   Error:", postLogoutError.response?.data?.error);
          }
        }
      } else {
        console.log(
          "\n⚠️  No session token available, skipping session-dependent tests"
        );
      }
    } else {
      console.log("❌ Admin login failed with status:", loginResponse.status);
    }
  } catch (error) {
    console.log("❌ Admin login failed:");
    console.log("   Status:", error.response?.status);
    console.log("   Error:", error.response?.data?.error || error.message);

    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Make sure your Next.js development server is running:");
      console.log("   npm run dev");
    }
  }
}

// Run the test
if (require.main === module) {
  testAdminLogin()
    .then(() => {
      console.log("\n🏁 Admin login session test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Test failed with error:", error.message);
      process.exit(1);
    });
}

module.exports = { testAdminLogin };
