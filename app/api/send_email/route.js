import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { senderEmail, recipientEmail, subject, template } = body;

    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: process.env.BREVO_PORT,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: subject || "Hello from Brevo SMTP",
      html: template || "<h1>Default Email Content</h1>",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.messageId);

    return new Response(JSON.stringify({ success: true, info }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
