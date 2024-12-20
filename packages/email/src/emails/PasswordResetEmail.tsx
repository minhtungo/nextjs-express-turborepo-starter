import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { config } from '@repo/lib/config';
import React from 'react';

interface PasswordResetEmailProps {
  username: string;
  token: string;
}

const PasswordResetEmail = ({ username, token }: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 px-4 max-w-[600px]">
            <Heading className="text-2xl font-semibold text-gray-800 my-0">Password Reset Request</Heading>
            <Text className="text-gray-700 text-base leading-6 mt-4">Hi {username},</Text>
            <Text className="text-gray-700 text-base leading-6">
              We received a request to reset your password. Click the button below to create a new password:
            </Text>
            <Section className="text-center my-8">
              <Button
                className="bg-green-500 text-white px-7 py-4 rounded-md font-semibold text-base no-underline inline-block hover:bg-green-600"
                href={`${config.app.url}/reset-password?token=${token}`}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-gray-700 text-base leading-6">This reset link will expire in 1 hour.</Text>
            <Text className="text-gray-700 text-base leading-6">
              If you didn't request a password reset, you can safely ignore this email.
            </Text>
            <Hr className="border-gray-200 my-6" />
            <Text className="text-gray-500 text-sm">This is an automated message, please do not reply.</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
