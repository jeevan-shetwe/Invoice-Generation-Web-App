import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Debug: Log if API key exists
if (!BREVO_API_KEY) {
  console.error("❌ ERROR: BREVO_API_KEY is not set in environment variables!");
} else {
  console.log("✅ BREVO_API_KEY loaded successfully");
}

export const EmailService = {
  sendInvoiceEmail: async (toEmail, invoiceNumber, pdfBuffer) => {
    try {
      // Convert buffer to base64 for API
      const base64Pdf = pdfBuffer.toString("base64");

      const response = await axios.post(
        BREVO_API_URL,
        {
          sender: {
            name: "Invoice",
            email: "noreply@example.com",
          },
          to: [
            {
              email: toEmail,
            },
          ],
          subject: `Invoice #${invoiceNumber}`,
          htmlContent: `<p>Your invoice #${invoiceNumber} is attached.</p>`,
          attachment: [
            {
              name: `Invoice_${invoiceNumber}.pdf`,
              content: base64Pdf,
            },
          ],
        },
        {
          headers: {
            "api-key": BREVO_API_KEY, // ✅ Correct header name
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("✅ Invoice email sent:", response.data.messageId);
      return {
        success: true,
        messageId: response.data.messageId,
      };
    } catch (error) {
      console.error(
        "❌ Failed to send invoice email:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  sendMagicLink: async (toEmail, resetToken) => {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const response = await axios.post(
        BREVO_API_URL,
        {
          sender: {
            name: "App",
            email: "noreply@example.com",
          },
          to: [
            {
              email: toEmail,
            },
          ],
          subject: "Reset your password",
          htmlContent: `
            <h2>Password Reset</h2>
            <p>Click the link to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
            <p>Link expires in 24 hours.</p>
          `,
        },
        {
          headers: {
            "api-key": BREVO_API_KEY, // ✅ Correct header name
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("✅ Magic link email sent:", response.data.messageId);
      return {
        success: true,
        messageId: response.data.messageId,
      };
    } catch (error) {
      console.error(
        "❌ Failed to send magic link:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};