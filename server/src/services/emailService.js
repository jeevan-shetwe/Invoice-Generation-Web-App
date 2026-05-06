import nodemailer from "nodemailer";

// ========================================
// NODEMAILER SMTP CONFIGURATION
// ========================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true" || false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "your-email@gmail.com",
    pass: process.env.SMTP_PASSWORD || "your-app-password",
  },
});

// Debug logging
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ SMTP Connection Error:", error.message);
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@invoiceapp.com";
const SENDER_NAME = process.env.SENDER_NAME || "Invoice App";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ========================================
// EMAIL SERVICE WITH ALL FUNCTIONS
// ========================================

export const EmailService = {
  // 1. SEND SIMPLE EMAIL
  sendSimpleEmail: async (toEmail, subject, htmlContent) => {
    try {
      const mailOptions = {
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: toEmail,
        subject: subject,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Simple email sent to ${toEmail}`);
      console.log(`   Message ID: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: toEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send email to ${toEmail}:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 2. SEND INVOICE EMAIL WITH PDF
  sendInvoiceEmail: async (toEmail, invoiceNumber, pdfBuffer) => {
    try {
      const mailOptions = {
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: toEmail,
        subject: `Invoice #${invoiceNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0;">Invoice #${invoiceNumber}</h2>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Your invoice is ready and attached below.
            </p>
            <p style="color: #666; line-height: 1.6;">
              If you have any questions, please don't hesitate to contact us.
            </p>
            <p style="margin-top: 30px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
              Thank you for your business!
            </p>
          </div>
        `,
        attachments: [
          {
            content: pdfBuffer,
            filename: `Invoice_${invoiceNumber}.pdf`,
            contentType: "application/pdf",
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Invoice email sent to ${toEmail}`);
      console.log(`   Message ID: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: toEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send invoice email:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 3. SEND PASSWORD RESET / MAGIC LINK
  sendPasswordResetEmail: async (toEmail, resetToken) => {
    try {
      const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: toEmail,
        subject: "Reset Your Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0;">Password Reset Request</h2>
            </div>
            <p style="color: #666; line-height: 1.6;">
              We received a request to reset your password. Click the button below to proceed:
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${resetUrl}" style="display: inline-block; padding: 12px 32px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; line-height: 1.6; word-break: break-all;">
              Or copy this link: <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
            </p>
            <p style="margin-top: 20px; color: #999; font-size: 12px;">
              ⏱️ This link expires in 24 hours.
            </p>
            <p style="margin-top: 20px; color: #999; font-size: 12px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${toEmail}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: toEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send password reset email:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 4. SEND OTP EMAIL
  sendOTPEmail: async (toEmail, otp, expiryMinutes = 10) => {
    try {
      const mailOptions = {
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: toEmail,
        subject: `Your OTP Code: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
              <h2 style="color: #333; margin: 0;">Email Verification</h2>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Your One-Time Password (OTP) is:
            </p>
            <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h1 style="color: #333; margin: 0; letter-spacing: 5px; font-size: 32px; font-weight: bold;">
                ${otp}
              </h1>
            </div>
            <p style="color: #666; line-height: 1.6;">
              ⏱️ This code is valid for ${expiryMinutes} minutes.
            </p>
            <p style="color: #999; font-size: 12px;">
              🔒 Do not share this code with anyone, including staff.
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent to ${toEmail}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: toEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send OTP email:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 5. SEND WELCOME EMAIL
  sendWelcomeEmail: async (toEmail, userName) => {
    try {
      const mailOptions = {
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: toEmail,
        subject: `Welcome ${userName}! 🎉`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 5px; margin-bottom: 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">Welcome, ${userName}! 🎉</h1>
            </div>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              We're thrilled to have you on board! Thank you for signing up with us.
            </p>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              You can now log in to your account and start using our services.
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${FRONTEND_URL}/login" style="display: inline-block; padding: 12px 32px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Go to Dashboard
              </a>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              If you have any questions, feel free to reach out to our support team.
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${toEmail}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: toEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send welcome email:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 6. SEND BOOKING CONFIRMATION
  sendBookingConfirmation: async (toEmail, bookingData) => {
    try {
      const mailOptions = {
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: toEmail,
        subject: `Booking Confirmed #${bookingData.bookingId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="color: #28a745; margin: 0;">✅ Booking Confirmed</h2>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Your booking has been confirmed! Here are your details:
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #f8f9fa; border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Booking ID</td>
                <td style="padding: 12px; color: #666;">${bookingData.bookingId}</td>
              </tr>
              <tr style="border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Service</td>
                <td style="padding: 12px; color: #666;">${bookingData.service}</td>
              </tr>
              <tr style="background: #f8f9fa; border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Date</td>
                <td style="padding: 12px; color: #666;">${bookingData.date}</td>
              </tr>
              <tr style="border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Time</td>
                <td style="padding: 12px; color: #666;">${bookingData.time}</td>
              </tr>
              <tr style="background: #f8f9fa; border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Amount</td>
                <td style="padding: 12px; color: #28a745; font-weight: bold;">₹${bookingData.amount}</td>
              </tr>
            </table>
            <p style="color: #666; line-height: 1.6;">
              We will confirm your appointment soon. In the meantime, if you have any questions, please contact us.
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Booking confirmation sent to ${toEmail}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: toEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send booking confirmation:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 7. SEND EMAIL WITH MULTIPLE ATTACHMENTS
  sendEmailWithAttachments: async (toEmail, subject, htmlContent, attachments) => {
    try {
      const processedAttachments = attachments.map((file) => ({
        filename: file.filename,
        content: file.buffer,
        contentType: file.contentType || "application/octet-stream",
      }));

      const mailOptions = {
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: toEmail,
        subject: subject,
        html: htmlContent,
        attachments: processedAttachments,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email with ${attachments.length} attachments sent to ${toEmail}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: toEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send email with attachments:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 8. SEND BULK EMAIL
  sendBulkEmail: async (recipients, subject, htmlContent) => {
    try {
      const mailOptions = {
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: recipients.join(", "),
        subject: subject,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Bulk email sent to ${recipients.length} recipients`);

      return {
        success: true,
        messageId: info.messageId,
        recipientCount: recipients.length,
      };
    } catch (error) {
      console.error(`❌ Failed to send bulk email:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 9. SEND CONTACT FORM REPLY
  sendContactFormReply: async (userEmail, userName, message) => {
    try {
      const mailOptions = {
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: userEmail,
        subject: "We received your message! 📬",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0;">Thank you, ${userName}!</h2>
            </div>
            <p style="color: #666; line-height: 1.6;">
              We received your message:
            </p>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
              <p style="color: #666; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              We'll get back to you as soon as possible, typically within 24 hours.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              Thank you for reaching out!
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Contact form reply sent to ${userEmail}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: userEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send contact form reply:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 10. SEND PAYMENT CONFIRMATION
  sendPaymentConfirmation: async (toEmail, paymentData) => {
    try {
      const mailOptions = {
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: toEmail,
        subject: `Payment Received - Receipt #${paymentData.receiptId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #28a745; padding: 20px; border-radius: 5px; margin-bottom: 20px; text-align: center; color: white;">
              <h2 style="margin: 0;">✅ Payment Received</h2>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #f8f9fa; border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Receipt ID</td>
                <td style="padding: 12px; color: #666;">${paymentData.receiptId}</td>
              </tr>
              <tr style="border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Amount</td>
                <td style="padding: 12px; color: #666;">₹${paymentData.amount}</td>
              </tr>
              <tr style="background: #f8f9fa; border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Payment Method</td>
                <td style="padding: 12px; color: #666;">${paymentData.method}</td>
              </tr>
              <tr style="border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Date & Time</td>
                <td style="padding: 12px; color: #666;">${paymentData.dateTime}</td>
              </tr>
            </table>
            <p style="color: #666; line-height: 1.6;">
              Thank you for your payment. Your receipt is attached below.
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Payment confirmation sent to ${toEmail}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: toEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send payment confirmation:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default EmailService;