const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function testSessionToken() {
  console.log("Testing session token handling...\n");

  let sessionToken = null;
  let sessionCookie = null;

  try {
    console.log("Attempting admin login...");
    const response = await axios.post(`${BASE_URL}/api/admin-auth/login`, {
      email: "thushanjana@gmail.com",
      password: "Thush@1111",
      remember_me: false,
    });

    console.log("Login response status:", response.status);

    if (response.status === 200) {
      console.log("Login successful!");

      // Safely extract session token
      try {
        sessionToken = response.data?.data?.session?.token;
        console.log(
          "Session token extracted:",
          sessionToken ? "✅ Yes" : "❌ No"
        );

        if (sessionToken) {
          console.log("Token length:", sessionToken.length);
          console.log("Token preview:", sessionToken.substring(0, 10) + "...");
        }
      } catch (tokenError) {
        console.log("Error extracting token:", tokenError.message);
      }

      // Check for session cookie
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        sessionCookie = cookies.find((c) => c.includes("admin_session"));
        console.log(
          "Session cookie found:",
          sessionCookie ? "✅ Yes" : "❌ No"
        );
      }

      // Test using the session token in a header
      if (sessionToken) {
        console.log("\nTesting API call with session token...");
        try {
          const testCall = await axios.get(`${BASE_URL}/api/timeline-events`, {
            headers: {
              "x-session-token": sessionToken,
              Cookie: sessionCookie || "",
            },
          });
          console.log("API call with session token: ✅ Success");
        } catch (apiError) {
          console.log(
            "API call failed:",
            apiError.response?.status,
            apiError.response?.data?.error
          );
        }
      }
    }
  } catch (error) {
    console.log(
      "Login failed:",
      error.response?.status,
      error.response?.data?.error || error.message
    );

    if (error.code === "ECONNREFUSED") {
      console.log("\nThe development server might not be running.");
      console.log("Try: npm run dev");
    }
  }
}

testSessionToken()
  .then(() => {
    console.log("\nTest completed");
  })
  .catch((error) => {
    console.error("Test failed:", error.message);
  });
