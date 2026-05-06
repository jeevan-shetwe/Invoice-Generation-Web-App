// ========================================
// NODEMAILER SMTP - RENDER.COM FIX
// ========================================

import nodemailer from "nodemailer";

// ========================================
// OPTION 1: USE GMAIL WITH APP PASSWORD (RECOMMENDED)
// ========================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true" ? true : false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  pool: {
    maxConnections: 1,
    maxMessages: 5,
    rateDelta: 4000,
    rateLimit: 14,
  },
  connectionUrl: process.env.SMTP_CONNECTION_URL,
});

// ========================================
// OPTION 2: USE SENDGRID SMTP (ALTERNATIVE)
// ========================================

const sendgridTransporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

// ========================================
// OPTION 3: USE MAILTRAP (FOR TESTING)
// ========================================

const mailtrapTransporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

// ========================================
// OPTION 4: USE AWS SES (PRODUCTION)
// ========================================

const awsSesTransporter = nodemailer.createTransport({
  host: `email-smtp.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com`,
  port: 587,
  secure: false,
  auth: {
    user: process.env.AWS_SES_USER,
    pass: process.env.AWS_SES_PASSWORD,
  },
});

// ========================================
// CHOOSE TRANSPORTER BASED ON ENVIRONMENT
// ========================================

let emailTransporter;

if (process.env.EMAIL_PROVIDER === "sendgrid") {
  emailTransporter = sendgridTransporter;
  console.log("📧 Using SendGrid SMTP");
} else if (process.env.EMAIL_PROVIDER === "mailtrap") {
  emailTransporter = mailtrapTransporter;
  console.log("📧 Using Mailtrap SMTP (Testing)");
} else if (process.env.EMAIL_PROVIDER === "aws-ses") {
  emailTransporter = awsSesTransporter;
  console.log("📧 Using AWS SES");
} else {
  emailTransporter = transporter;
  console.log("📧 Using Gmail SMTP");
}

// Verify connection
emailTransporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error.message);
    console.error("💡 Check your .env file and SMTP credentials");
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@invoiceapp.com";
const SENDER_NAME = process.env.SENDER_NAME || "Invoice App";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ========================================
// EMAIL SERVICE
// ========================================

export const EmailService = {
  sendMagicLink: async (toEmail, resetToken) => {
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

      const info = await emailTransporter.sendMail(mailOptions);
      console.log(`✅ Magic link email sent to ${toEmail}`);
      console.log(`   Message ID: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: toEmail,
      };
    } catch (error) {
      console.error(`❌ Failed to send magic link:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

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
              🔒 Do not share this code with anyone.
            </p>
          </div>
        `,
      };

      const info = await emailTransporter.sendMail(mailOptions);
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

      const info = await emailTransporter.sendMail(mailOptions);
      console.log(`✅ Invoice email sent to ${toEmail}`);

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
            <p style="color: #666; line-height: 1.6;">
              Thank you for signing up with us.
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${FRONTEND_URL}/login" style="display: inline-block; padding: 12px 32px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
          </div>
        `,
      };

      const info = await emailTransporter.sendMail(mailOptions);
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
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #f8f9fa; border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold;">Booking ID</td>
                <td style="padding: 12px;">${bookingData.bookingId}</td>
              </tr>
              <tr style="border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold;">Service</td>
                <td style="padding: 12px;">${bookingData.service}</td>
              </tr>
              <tr style="background: #f8f9fa; border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold;">Date</td>
                <td style="padding: 12px;">${bookingData.date}</td>
              </tr>
              <tr style="border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold;">Time</td>
                <td style="padding: 12px;">${bookingData.time}</td>
              </tr>
              <tr style="background: #f8f9fa; border: 1px solid #ddd;">
                <td style="padding: 12px; font-weight: bold;">Amount</td>
                <td style="padding: 12px; color: #28a745;">₹${bookingData.amount}</td>
              </tr>
            </table>
          </div>
        `,
      };

      const info = await emailTransporter.sendMail(mailOptions);
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
};

export default EmailService;