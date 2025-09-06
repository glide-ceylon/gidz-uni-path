// Email debugging and testing script
require("dotenv").config();

async function debugEmailIssues() {
  console.log("🔍 Email Configuration Debug");
  console.log("============================");

  // Check environment variables
  console.log("\n📋 Environment Variables:");
  console.log("BREVO_HOST:", process.env.BREVO_HOST ? "✅ Set" : "❌ Missing");
  console.log("BREVO_PORT:", process.env.BREVO_PORT ? "✅ Set" : "❌ Missing");
  console.log("BREVO_USER:", process.env.BREVO_USER ? "✅ Set" : "❌ Missing");
  console.log("BREVO_PASS:", process.env.BREVO_PASS ? "✅ Set" : "❌ Missing");
  console.log(
    "NEXT_PUBLIC_SITE_URL:",
    process.env.NEXT_PUBLIC_SITE_URL || "Using default (localhost:3000)"
  );

  if (
    !process.env.BREVO_HOST ||
    !process.env.BREVO_PORT ||
    !process.env.BREVO_USER ||
    !process.env.BREVO_PASS
  ) {
    console.log("\n❌ Missing email configuration!");
    console.log("Please check your environment variables in .env.local file");
    console.log("\nExpected format:");
    console.log("BREVO_HOST=smtp-relay.brevo.com");
    console.log("BREVO_PORT=587");
    console.log("BREVO_USER=your-brevo-email@example.com");
    console.log("BREVO_PASS=your-brevo-password");
    return;
  }

  console.log("\n✅ All email environment variables are set!");

  // Test email sending
  console.log("\n📧 Testing Email Sending...");
  console.log("============================");

  try {
    const testEmailData = {
      senderEmail: "admin@gidz-uni-path.com",
      recipientEmail: "test@example.com", // Change this to your email for testing
      subject: "🧪 Test Email - Admin Creation System",
      template: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Test Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
              <h1 style="margin: 0;">Email System Test</h1>
            </div>
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
              <h2 style="color: #1e293b;">Email System Working! ✅</h2>
              <p>If you receive this email, your Gidz Uni Path email system is working correctly.</p>
              <p><strong>Test Details:</strong></p>
              <ul>
                <li>Sent at: ${new Date().toLocaleString()}</li>
                <li>From: admin@gidz-uni-path.com</li>
                <li>System: Admin Creation Email Notification</li>
              </ul>
            </div>
            <div style="text-align: center; padding: 20px; border-top: 2px solid #e2e8f0; margin-top: 20px;">
              <p style="color: #64748b; margin: 0;">Gidz Uni Path Admin System</p>
            </div>
          </body>
        </html>
      `,
    };

    console.log("📤 Sending test email to:", testEmailData.recipientEmail);
    console.log("📤 From:", testEmailData.senderEmail);

    const response = await fetch("http://localhost:3000/api/send_email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testEmailData),
    });

    console.log("📥 Response status:", response.status);
    console.log("📥 Response ok:", response.ok);

    const responseData = await response.json();
    console.log("📥 Response data:", JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log("\n✅ Test email sent successfully!");
      console.log("📧 Check your inbox for the test email");
      console.log("📧 Check spam/junk folder if not in inbox");
    } else {
      console.log("\n❌ Email sending failed!");
      console.log("Error details:", responseData);
    }
  } catch (error) {
    console.error("\n💥 Email test failed with error:", error.message);
    console.error("Stack trace:", error.stack);
  }

  console.log("\n🔧 Troubleshooting Tips:");
  console.log("1. Make sure your development server is running (npm run dev)");
  console.log("2. Check that your Brevo/Sendinblue credentials are correct");
  console.log("3. Verify that your email service is active and not suspended");
  console.log("4. Check spam/junk folders for test emails");
  console.log("5. Make sure the recipient email address is valid");
  console.log("6. Check server logs for detailed error messages");
}

// Run the debug
debugEmailIssues()
  .then(() => {
    console.log("\n🏁 Email debug complete");
  })
  .catch((err) => {
    console.error("Debug failed:", err);
  });
