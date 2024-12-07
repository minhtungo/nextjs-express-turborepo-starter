import { env } from '@/common/config/env';

interface VerificationEmailData {
  username: string;
  verificationLink: string;
}

interface PasswordResetEmailData {
  username: string;
  resetLink: string;
}

export const emailTemplates = {
  verificationEmail: ({ username, verificationLink }: VerificationEmailData) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to ${env.SITE_BASE_URL}!</h2>
        <p>Hi ${username},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666;">${verificationLink}</p>
        <p>This verification link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `,
    text: `
      Welcome to ${env.SITE_BASE_URL}!
      
      Hi ${username},
      
      Thank you for signing up! Please verify your email address by clicking the link below:
      
      ${verificationLink}
      
      This verification link will expire in 24 hours.
      
      If you didn't create an account, you can safely ignore this email.
    `,
  }),

  passwordResetEmail: ({ username, resetLink }: PasswordResetEmailData) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${username},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666;">${resetLink}</p>
        <p>This reset link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `,
    text: `
      Password Reset Request
      
      Hi ${username},
      
      We received a request to reset your password. Please click the link below to create a new password:
      
      ${resetLink}
      
      This reset link will expire in 1 hour.
      
      If you didn't request a password reset, you can safely ignore this email.
    `,
  }),
};
