import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

// Initialize SendGrid
sgMail.setApiKey(SENDGRID_API_KEY);

// Debug logging
if (!SENDGRID_API_KEY) {
  console.error("❌ ERROR: SENDGRID_API_KEY is not set in environment variables!");
} else {
  console.log("✅ SendGrid API Key loaded successfully");
}

export const EmailService = {
  sendInvoiceEmail: async (toEmail, invoiceNumber, pdfBuffer) => {
    try {
      // Convert buffer to base64
      const base64Pdf = pdfBuffer.toString("base64");

      const msg = {
        to: toEmail,
        from: process.env.SENDER_EMAIL || "noreply@invoiceapp.com",
        subject: `Invoice #${invoiceNumber}`,
        html: `
          <h2>Invoice #${invoiceNumber}</h2>
          <p>Your invoice is attached below.</p>
          <p>Thank you!</p>
        `,
        attachments: [
          {
            content: base64Pdf,
            filename: `Invoice_${invoiceNumber}.pdf`,
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      };

      const result = await sgMail.send(msg);

      console.log(`✅ Invoice email sent to ${toEmail}`);
      console.log(`   Message ID: ${result[0].headers["x-message-id"]}`);

      return {
        success: true,
        messageId: result[0].headers["x-message-id"],
        recipient: toEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send invoice email to ${toEmail}:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  sendMagicLink: async (toEmail, resetToken) => {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const msg = {
        to: toEmail,
        from: process.env.SENDER_EMAIL || "noreply@invoiceapp.com",
        subject: "Reset Your Password",
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Or copy this link: <a href="${resetUrl}">${resetUrl}</a>
          </p>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            This link expires in 24 hours.
          </p>
        `,
      };

      const result = await sgMail.send(msg);

      console.log(`✅ Magic link email sent to ${toEmail}`);
      console.log(`   Message ID: ${result[0].headers["x-message-id"]}`);

      return {
        success: true,
        messageId: result[0].headers["x-message-id"],
        recipient: toEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send magic link to ${toEmail}:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};