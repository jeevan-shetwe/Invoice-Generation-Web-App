import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const EmailService = {
  sendInvoiceEmail: async (toEmail, invoiceNumber, pdfBuffer) => {
    return await resend.emails.send({
      from: "onboarding@resend.dev", // keep this for now
      to: toEmail,
      subject: `Invoice #${invoiceNumber}`,
      html: `<p>Your invoice #${invoiceNumber} is attached.</p>`,
      attachments: [
        {
          filename: `Invoice_${invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  },

  sendMagicLink: async (toEmail, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    return await resend.emails.send({
      from: "onboarding@resend.dev",
      to: toEmail,
      subject: "Reset your password",
      html: `<a href="${resetUrl}">Reset Password</a>`,
    });
  },
};