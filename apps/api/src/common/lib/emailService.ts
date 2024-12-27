import { env } from "@/common/lib/env";
import { render } from "@repo/email";
import { PasswordResetEmail, VerificationEmail } from "@repo/email/templates";
import nodemailer from "nodemailer";

// Configure MailHog transport
const transporter = nodemailer.createTransport({
  host: "mailhog", // Docker service name
  port: env.EMAIL_SERVER_PORT, // MailHog SMTP port
  secure: false,
  ignoreTLS: true, // MailHog doesn't support TLS
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export const emailService = {
  async sendEmail({ to, subject, html }: EmailOptions) {
    try {
      const info = await transporter.sendMail({
        from: env.EMAIL_FROM,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject,
        html,
      });

      console.log("Email sent:", info);

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },

  async verifyConnection() {
    try {
      await transporter.verify();
      return true;
    } catch (error) {
      console.error("Error verifying email connection:", error);
      return false;
    }
  },

  async sendVerificationEmail(to: string, username: string, token: string) {
    const html = await render(
      VerificationEmail({
        username,
        token,
      }),
    );
    return this.sendEmail({
      to,
      subject: "Verify Your Email Address",
      html,
    });
  },

  async sendPasswordResetEmail(to: string, username: string, token: string) {
    const html = await render(
      PasswordResetEmail({
        username,
        token,
      }),
    );
    return this.sendEmail({
      to,
      subject: "Reset Your Password",
      html,
    });
  },
};
