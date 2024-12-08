import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import { env } from '@/common/config/env';
import { VerificationEmail, PasswordResetEmail } from '@repo/email/templates';
import { render } from '@repo/email';

// Configure Mailgun transport
const mailgunConfig = {
  auth: {
    api_key: env.MAILGUN_API_KEY,
    domain: env.MAILGUN_DOMAIN,
  },
};

const transporter = nodemailer.createTransport(mailgunTransport(mailgunConfig));

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
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
      });

      console.log('Email sent:', info);

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  async verifyConnection() {
    try {
      await transporter.verify();
      return true;
    } catch (error) {
      console.error('Error verifying email connection:', error);
      return false;
    }
  },

  // Template-specific methods
  async sendVerificationEmail(to: string, username: string, verificationLink: string) {
    console.log('sendVerificationEmail', to, username, verificationLink);
    const html = render(
      VerificationEmail({
        username,
        verificationLink,
        siteUrl: env.SITE_BASE_URL,
      })
    );
    return this.sendEmail({
      to,
      subject: 'Verify Your Email Address',
      html,
    });
  },

  async sendPasswordResetEmail(to: string, username: string, resetLink: string) {
    const html = render(
      PasswordResetEmail({
        username,
        resetLink,
      })
    );
    return this.sendEmail({
      to,
      subject: 'Reset Your Password',
      html,
    });
  },
};
