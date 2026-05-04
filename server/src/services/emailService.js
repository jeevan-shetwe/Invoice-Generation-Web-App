



import nodemailer from "nodemailer";

// Create Brevo transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.BREVO_EMAIL, // Your Brevo email
    pass: process.env.BREVO_SMTP_KEY, // Your Brevo SMTP key
  },
});

export const EmailService = {
  sendInvoiceEmail: async (toEmail, invoiceNumber, pdfBuffer) => {
    try {
      const result = await transporter.sendMail({
        from: `"Your App" <noreply@example.com>`, // You can customize this
        to: toEmail,
        subject: `Invoice #${invoiceNumber}`,
        html: `<p>Your invoice #${invoiceNumber} is attached.</p>`,
        attachments: [
          {
            filename: `Invoice_${invoiceNumber}.pdf`,
            content: pdfBuffer, // Buffer works directly with nodemailer
          },
        ],
      });

      return {
        success: true,
        messageId: result.messageId,
        response: result.response,
      };
    } catch (error) {
      console.error("Failed to send invoice email:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  sendMagicLink: async (toEmail, resetToken) => {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const result = await transporter.sendMail({
        from: `"Your App" <noreply@example.com>`,
        to: toEmail,
        subject: "Reset your password",
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link expires in 24 hours.</p>
        `,
      });

      return {
        success: true,
        messageId: result.messageId,
        response: result.response,
      };
    } catch (error) {
      console.error("Failed to send magic link:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};