/**
 * Client-side test for staff API
 *
 * Open this in browser console after logging in as admin
 */

async function testStaffAPI() {
  console.log("🧪 Testing Staff API from browser...");

  try {
    const response = await fetch("/api/admin/staff", {
      method: "GET",
      credentials: "include", // Include cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response headers:", response.headers);

    if (!response.ok) {
      console.error(
        "❌ Response not ok:",
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      return;
    }

    const data = await response.json();
    console.log("📊 Response data:", data);

    if (data.success) {
      console.log(`✅ Success! Found ${data.staff.length} staff members:`);
      data.staff.forEach((staff, index) => {
        console.log(
          `   ${index + 1}. ${staff.first_name} ${staff.last_name} (${
            staff.role
          })`
        );
      });
    } else {
      console.error("❌ API returned success: false", data);
    }
  } catch (error) {
    console.error("❌ Fetch error:", error);
  }
}

// To run: testStaffAPI()
