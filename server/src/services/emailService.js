// ========================================
// SENDGRID EMAIL SERVICE - PRODUCTION READY
// Uses HTTP API (not SMTP) — works on Render
// ========================================

import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// ========================================
// SENDGRID HTTP API CONFIGURATION
// ========================================

if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY is not set in environment variables");
  console.error("💡 Add it to your Render environment variables dashboard");
} else if (!process.env.SENDGRID_API_KEY.startsWith("SG.")) {
  console.error("❌ SENDGRID_API_KEY does not start with 'SG.' — check your key");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("✅ SendGrid HTTP API is ready!");
}

// ========================================
// CONFIGURATION VARIABLES
// ========================================

const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@invoiceapp.com";
const SENDER_NAME  = process.env.SENDER_NAME  || "Invoice App";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ========================================
// INTERNAL HELPER
// ========================================

/**
 * Sends a mail object via SendGrid HTTP API.
 * Returns { success, messageId } or { success: false, error }.
 */
async function send(mailOptions) {
  const msg = {
    from: { name: SENDER_NAME, email: SENDER_EMAIL },
    to:   mailOptions.to,
    subject: mailOptions.subject,
    html: mailOptions.html,
    ...(mailOptions.attachments ? { attachments: mailOptions.attachments } : {}),
  };

  const [response] = await sgMail.send(msg);
  return {
    success:   true,
    messageId: response.headers["x-message-id"] ?? null,
  };
}

// ========================================
// EMAIL SERVICE WITH ALL FUNCTIONS
// ========================================

export const EmailService = {

  // 1. SEND MAGIC LINK (PASSWORD RESET)
  sendMagicLink: async (toEmail, resetToken) => {
    try {
      if (!toEmail || !resetToken) throw new Error("Email and reset token are required");

      const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

      const result = await send({
        to: toEmail,
        subject: "🔐 Reset Your Password",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
            <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1f4788; margin: 0; font-size: 28px;">Password Reset</h1>
              </div>
              <p style="color: #333; line-height: 1.6; font-size: 16px;">
                We received a request to reset your password. Click the button below to proceed:
              </p>
              <div style="margin: 40px 0; text-align: center;">
                <a href="${resetUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 8px rgba(0,123,255,0.3);">
                  Reset Password
                </a>
              </div>
              <p style="color: #666; line-height: 1.6; font-size: 14px; word-break: break-all;">
                Or copy and paste this link in your browser:<br>
                <a href="${resetUrl}" style="color: #007bff; text-decoration: none;">${resetUrl}</a>
              </p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 5px 0;">⏱️ This link expires in 24 hours.</p>
                <p style="color: #999; font-size: 12px; margin: 5px 0;">🔒 If you didn't request this, please ignore this email.</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© 2025 ${SENDER_NAME}. All rights reserved.</p>
            </div>
          </div>
        `,
      });

      console.log(`✅ Magic link sent to ${toEmail} | ID: ${result.messageId}`);
      return { ...result, recipient: toEmail, timestamp: new Date() };

    } catch (error) {
      console.error(`❌ Failed to send magic link to ${toEmail}:`, error.message);
      return { success: false, error: error.message, recipient: toEmail };
    }
  },

  // 2. SEND OTP EMAIL
  sendOTPEmail: async (toEmail, otp, expiryMinutes = 10) => {
    try {
      if (!toEmail || !otp) throw new Error("Email and OTP are required");

      const result = await send({
        to: toEmail,
        subject: `📧 Your OTP Code: ${otp}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
            <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1f4788; margin: 0; font-size: 28px;">Email Verification</h1>
              </div>
              <p style="color: #333; line-height: 1.6; font-size: 16px;">Your One-Time Password (OTP) is:</p>
              <div style="background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%); padding: 30px; border-radius: 8px; margin: 30px 0; text-align: center; border: 2px solid #ddd;">
                <div style="color: #1f4788; font-size: 48px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px;"><strong>⏱️ Valid for ${expiryMinutes} minutes only</strong></p>
              </div>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px;">🔒 Do not share this code with anyone, including staff members.</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© 2025 ${SENDER_NAME}. All rights reserved.</p>
            </div>
          </div>
        `,
      });

      console.log(`✅ OTP sent to ${toEmail}`);
      return { ...result, recipient: toEmail, expiresIn: expiryMinutes };

    } catch (error) {
      console.error(`❌ Failed to send OTP:`, error.message);
      return { success: false, error: error.message, recipient: toEmail };
    }
  },

  // 3. SEND INVOICE EMAIL
  sendInvoiceEmail: async (toEmail, invoiceNumber, pdfBuffer, invoiceData = {}) => {
    try {
      if (!toEmail || !invoiceNumber || !pdfBuffer) {
        throw new Error("Email, invoice number, and PDF buffer are required");
      }

      const result = await send({
        to: toEmail,
        subject: `📄 Invoice #${invoiceNumber}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
            <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="border-bottom: 3px solid #007bff; padding-bottom: 20px; margin-bottom: 20px;">
                <h1 style="color: #1f4788; margin: 0; font-size: 28px;">Invoice #${invoiceNumber}</h1>
              </div>
              <p style="color: #333; line-height: 1.6; font-size: 16px;">Your invoice is ready and attached below.</p>
              ${invoiceData.amount ? `
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="color: #666; margin: 8px 0;"><strong>Amount Due:</strong> ₹${invoiceData.amount}</p>
                ${invoiceData.dueDate ? `<p style="color: #666; margin: 8px 0;"><strong>Due Date:</strong> ${invoiceData.dueDate}</p>` : ""}
              </div>` : ""}
              <div style="margin: 30px 0; text-align: center;">
                <a href="${FRONTEND_URL}/invoices/${invoiceNumber}" style="display: inline-block; padding: 12px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  View Invoice
                </a>
              </div>
              <p style="color: #666; font-size: 14px; line-height: 1.6;">If you have any questions, please don't hesitate to contact us.</p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0;">Thank you for your business!</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© 2025 ${SENDER_NAME}. All rights reserved.</p>
            </div>
          </div>
        `,
        // SendGrid HTTP API expects base64-encoded content for attachments
        attachments: [
          {
            content:     Buffer.isBuffer(pdfBuffer) ? pdfBuffer.toString("base64") : pdfBuffer,
            filename:    `Invoice_${invoiceNumber}.pdf`,
            type:        "application/pdf",
            disposition: "attachment",
          },
        ],
      });

      console.log(`✅ Invoice email sent to ${toEmail}`);
      return { ...result, recipient: toEmail, invoiceNumber };

    } catch (error) {
      console.error(`❌ Failed to send invoice email:`, error.message);
      return { success: false, error: error.message, recipient: toEmail };
    }
  },

  // 4. SEND WELCOME EMAIL
  sendWelcomeEmail: async (toEmail, userName) => {
    try {
      if (!toEmail || !userName) throw new Error("Email and user name are required");

      const result = await send({
        to: toEmail,
        subject: `🎉 Welcome to ${SENDER_NAME}, ${userName}!`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 40px; color: white; text-align: center; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 32px;">Welcome, ${userName}! 🎉</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">We're excited to have you on board</p>
            </div>
            <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="color: #333; line-height: 1.6; font-size: 16px;">Thank you for signing up with ${SENDER_NAME}!</p>
              <p style="color: #333; line-height: 1.6; font-size: 16px;">You can now log in to your account and start managing your invoices.</p>
              <div style="margin: 30px 0; text-align: center;">
                <a href="${FRONTEND_URL}/login" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Go to Dashboard
                </a>
              </div>
              <div style="background: #f0f7ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #007bff;">
                <p style="color: #004085; margin: 0; font-size: 14px;"><strong>💡 Tip:</strong> Check out our help center for tips on getting started.</p>
              </div>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px;">If you have any questions, feel free to reach out to our support team.</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© 2025 ${SENDER_NAME}. All rights reserved.</p>
            </div>
          </div>
        `,
      });

      console.log(`✅ Welcome email sent to ${toEmail}`);
      return { ...result, recipient: toEmail, userName };

    } catch (error) {
      console.error(`❌ Failed to send welcome email:`, error.message);
      return { success: false, error: error.message, recipient: toEmail };
    }
  },

  // 5. SEND BOOKING CONFIRMATION
  sendBookingConfirmation: async (toEmail, bookingData) => {
    try {
      if (!toEmail || !bookingData) throw new Error("Email and booking data are required");

      const result = await send({
        to: toEmail,
        subject: `✅ Booking Confirmed #${bookingData.bookingId}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
            <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="background: #d4edda; border: 2px solid #28a745; padding: 20px; border-radius: 6px; margin-bottom: 30px; text-align: center;">
                <h2 style="color: #155724; margin: 0; font-size: 24px;">✅ Booking Confirmed!</h2>
              </div>
              <p style="color: #333; line-height: 1.6; font-size: 16px;">Your booking has been confirmed! Here are your details:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: #f8f9fa; border: 1px solid #ddd;">
                  <td style="padding: 12px; font-weight: bold; color: #333; width: 40%;">Booking ID</td>
                  <td style="padding: 12px; color: #666;">${bookingData.bookingId}</td>
                </tr>
                ${bookingData.service ? `<tr style="border: 1px solid #ddd;"><td style="padding: 12px; font-weight: bold; color: #333;">Service</td><td style="padding: 12px; color: #666;">${bookingData.service}</td></tr>` : ""}
                ${bookingData.date    ? `<tr style="background: #f8f9fa; border: 1px solid #ddd;"><td style="padding: 12px; font-weight: bold; color: #333;">Date</td><td style="padding: 12px; color: #666;">${bookingData.date}</td></tr>` : ""}
                ${bookingData.time    ? `<tr style="border: 1px solid #ddd;"><td style="padding: 12px; font-weight: bold; color: #333;">Time</td><td style="padding: 12px; color: #666;">${bookingData.time}</td></tr>` : ""}
                ${bookingData.amount  ? `<tr style="background: #f8f9fa; border: 1px solid #ddd;"><td style="padding: 12px; font-weight: bold; color: #333;">Amount</td><td style="padding: 12px; color: #28a745; font-weight: bold;">₹${bookingData.amount}</td></tr>` : ""}
              </table>
              <p style="color: #666; font-size: 14px; line-height: 1.6;">We will confirm your appointment soon. If you have any questions, please contact us.</p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© 2025 ${SENDER_NAME}. All rights reserved.</p>
            </div>
          </div>
        `,
      });

      console.log(`✅ Booking confirmation sent to ${toEmail}`);
      return { ...result, recipient: toEmail, bookingId: bookingData.bookingId };

    } catch (error) {
      console.error(`❌ Failed to send booking confirmation:`, error.message);
      return { success: false, error: error.message, recipient: toEmail };
    }
  },

  // 6. SEND BULK EMAIL
  sendBulkEmail: async (recipients, subject, htmlContent) => {
    try {
      if (!recipients?.length || !subject || !htmlContent) {
        throw new Error("Recipients, subject, and content are required");
      }

      // SendGrid recommends personalizations for bulk — this keeps it simple
      const result = await send({ to: recipients, subject, html: htmlContent });

      console.log(`✅ Bulk email sent to ${recipients.length} recipients`);
      return { ...result, recipientCount: recipients.length };

    } catch (error) {
      console.error(`❌ Failed to send bulk email:`, error.message);
      return { success: false, error: error.message, recipientCount: recipients?.length ?? 0 };
    }
  },

  // 7. SEND PAYMENT CONFIRMATION
  sendPaymentConfirmation: async (toEmail, paymentData) => {
    try {
      if (!toEmail || !paymentData) throw new Error("Email and payment data are required");

      const result = await send({
        to: toEmail,
        subject: `💰 Payment Received - Receipt #${paymentData.receiptId}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
            <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; color: white; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">✅ Payment Received</h1>
              </div>
              <div style="padding: 30px;">
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr style="background: #f8f9fa; border: 1px solid #ddd;">
                    <td style="padding: 12px; font-weight: bold; color: #333; width: 40%;">Receipt ID</td>
                    <td style="padding: 12px; color: #666;">${paymentData.receiptId}</td>
                  </tr>
                  ${paymentData.amount   ? `<tr style="border: 1px solid #ddd;"><td style="padding: 12px; font-weight: bold; color: #333;">Amount</td><td style="padding: 12px; color: #28a745; font-weight: bold;">₹${paymentData.amount}</td></tr>` : ""}
                  ${paymentData.method   ? `<tr style="background: #f8f9fa; border: 1px solid #ddd;"><td style="padding: 12px; font-weight: bold; color: #333;">Payment Method</td><td style="padding: 12px; color: #666;">${paymentData.method}</td></tr>` : ""}
                  ${paymentData.dateTime ? `<tr style="border: 1px solid #ddd;"><td style="padding: 12px; font-weight: bold; color: #333;">Date & Time</td><td style="padding: 12px; color: #666;">${paymentData.dateTime}</td></tr>` : ""}
                </table>
                <p style="color: #666; font-size: 14px; line-height: 1.6;">Thank you for your payment. Your receipt is attached below.</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© 2025 ${SENDER_NAME}. All rights reserved.</p>
            </div>
          </div>
        `,
      });

      console.log(`✅ Payment confirmation sent to ${toEmail}`);
      return { ...result, recipient: toEmail, receiptId: paymentData.receiptId };

    } catch (error) {
      console.error(`❌ Failed to send payment confirmation:`, error.message);
      return { success: false, error: error.message, recipient: toEmail };
    }
  },
};

export default EmailService;