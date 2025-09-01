// Test email sending functionality
async function testEmailSending() {
  try {
    console.log("📧 Testing email sending functionality...");

    const testEmailData = {
      senderEmail: "admin@gidz-uni-path.com",
      recipientEmail: "test@example.com", // Change this to your test email
      subject: "🧪 Test Email from Gidz Uni Path",
      template: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Test Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #0ea5e9;">Test Email</h1>
            <p>This is a test email to verify the email sending functionality works correctly.</p>
            <p><strong>If you receive this email, the email system is working! ✅</strong></p>
          </body>
        </html>
      `,
    };

    console.log("📤 Sending test email to:", testEmailData.recipientEmail);

    const response = await fetch("http://localhost:3000/api/send_email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testEmailData),
    });

    console.log("📥 Response status:", response.status);

    const responseData = await response.json();
    console.log("📥 Response data:", responseData);

    if (response.ok) {
      console.log("✅ Test email sent successfully!");
      console.log("📧 Check the inbox for:", testEmailData.recipientEmail);
    } else {
      console.log("❌ Email sending failed:", responseData.error);
    }
  } catch (error) {
    console.error("💥 Email test failed:", error.message);
  }
}

console.log("🔧 To test email functionality:");
console.log("1. Make sure your .env file has the correct email credentials:");
console.log("   - BREVO_HOST");
console.log("   - BREVO_PORT");
console.log("   - BREVO_USER");
console.log("   - BREVO_PASS");
console.log("2. Start the development server: npm run dev");
console.log("3. Change recipientEmail above to your test email");
console.log("4. Run this test");

// Uncomment the line below to run the test
// testEmailSending();
