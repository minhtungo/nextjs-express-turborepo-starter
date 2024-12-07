import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import { env } from '@/common/config/env';
import { emailTemplates } from './emailTemplates';

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
  text?: string;
  html?: string;
}

export const emailService = {
  async sendEmail({ to, subject, text, html }: EmailOptions) {
    try {
      const info = await transporter.sendMail({
        from: env.EMAIL_FROM,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        text,
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
    const template = emailTemplates.verificationEmail({ username, verificationLink });
    return this.sendEmail({
      to,
      ...template,
    });
  },

  async sendPasswordResetEmail(to: string, username: string, resetLink: string) {
    const template = emailTemplates.passwordResetEmail({ username, resetLink });
    return this.sendEmail({
      to,
      ...template,
    });
  },
};
