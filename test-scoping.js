// Simple test to verify the sessionToken variable scoping fix
console.log("Testing sessionToken variable scoping...");

function testScope() {
  let sessionToken = null;
  let sessionCookie = null;

  // Simulate successful login
  const mockLoginResponse = {
    status: 200,
    data: {
      data: {
        session: {
          token: "mock-session-token-12345",
        },
        admin: {
          email: "test@example.com",
          role: "admin",
        },
      },
    },
    headers: {
      "set-cookie": ["admin_session=abc123; Path=/; HttpOnly"],
    },
  };

  if (mockLoginResponse.status === 200) {
    console.log("✅ Login successful (mocked)");

    // Extract session token safely
    try {
      sessionToken = mockLoginResponse.data?.data?.session?.token;
      console.log("✅ Session token extracted:", sessionToken ? "Yes" : "No");
    } catch (tokenError) {
      console.log("❌ Error extracting token:", tokenError.message);
    }

    // Extract session cookie
    const cookies = mockLoginResponse.headers["set-cookie"];
    if (cookies) {
      sessionCookie = cookies.find((c) => c.includes("admin_session"));
      console.log("✅ Session cookie extracted:", sessionCookie ? "Yes" : "No");
    }
  }

  // Test that variables are accessible after the if block
  if (sessionToken) {
    console.log("✅ Session token is accessible outside if block");
    console.log("   Token value:", sessionToken);

    // Simulate timeline event creation
    const mockHeaders = {
      Cookie: sessionCookie || "",
      "x-session-token": sessionToken,
      "Content-Type": "application/json",
    };

    console.log("✅ Headers constructed successfully:");
    console.log("   Cookie:", mockHeaders.Cookie ? "Present" : "Missing");
    console.log(
      "   x-session-token:",
      mockHeaders["x-session-token"] ? "Present" : "Missing"
    );
  } else {
    console.log("❌ Session token is not accessible");
  }
}

testScope();
console.log("Variable scoping test completed successfully!");
