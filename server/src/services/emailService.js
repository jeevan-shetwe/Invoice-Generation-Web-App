import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // e.g. you@gmail.com
    pass: process.env.SMTP_PASS, // App password
  },
});

export const EmailService = {
  sendInvoiceEmail: async (toEmail, invoiceNumber, pdfBuffer) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP credentials are not configured in the backend.');
    }

    const mailOptions = {
      from: `"Invoice Generator" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Invoice #${invoiceNumber}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
          <div style="padding: 40px 0; border-bottom: 1px solid #f0f0f0; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: #000;">New Invoice</h1>
            <p style="font-size: 16px; color: #666; margin-top: 8px;">Invoice #${invoiceNumber} is ready for review.</p>
          </div>
          
          <div style="margin-bottom: 40px;">
            <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
              Hello,<br><br>
              A new invoice has been generated for your recent transaction. You can find the full details in the attached PDF document.
            </p>
          </div>

          <div style="padding: 30px; background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 40px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding-bottom: 10px; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Invoice Number</td>
                <td style="padding-bottom: 10px; text-align: right; font-weight: 600;">#${invoiceNumber}</td>
              </tr>
              <tr>
                <td style="color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Document Type</td>
                <td style="text-align: right; font-weight: 600;">PDF Attachment</td>
              </tr>
            </table>
          </div>

          <div style="color: #999; font-size: 12px; line-height: 1.5;">
            <p>If you have any questions, please contact our support team.</p>
            <p style="margin-top: 20px; border-top: 1px solid #f0f0f0; padding-top: 20px;">
              © 2026 Invoice Generator Platform. All rights reserved.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice_${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    return await transporter.sendMail(mailOptions);
  },

  sendMagicLink: async (toEmail, resetToken) => {
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Invoice Generator" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Reset your password',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
          <div style="padding: 40px 0; border-bottom: 1px solid #f0f0f0; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: #000;">Reset your password</h1>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 30px;">
            We received a request to reset the password for your Invoice Generator account. Click the button below to choose a new one.
          </p>

          <div style="margin-bottom: 40px;">
            <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; display: inline-block;">Reset password</a>
          </div>

          <div style="padding: 20px; background-color: #fff8f0; border: 1px solid #ffe8cc; border-radius: 6px; margin-bottom: 40px;">
            <p style="color: #92400e; font-size: 14px; margin: 0;">
              <strong>Security Note:</strong> This link expires in 2 minutes. If you didn't request this, you can safely ignore this email.
            </p>
          </div>

          <div style="color: #999; font-size: 12px; line-height: 1.5; border-top: 1px solid #f0f0f0; padding-top: 20px;">
            <p>Invoice Generator Platform • Professional Billing</p>
          </div>
        </div>
      `,
    };

    return await transporter.sendMail(mailOptions);
  },
};
