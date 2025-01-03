import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { env } from '../env';
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
          <Container className="mx-auto max-w-[600px] px-4 py-5">
            <Heading className="my-0 text-2xl font-semibold text-gray-800">Password Reset Request</Heading>
            <Text className="mt-4 text-base leading-6 text-gray-700">Hi {username},</Text>
            <Text className="text-base leading-6 text-gray-700">
              We received a request to reset your password. Click the button below to create a new password:
            </Text>
            <Section className="my-8 text-center">
              <Button
                className="inline-block rounded-md bg-green-500 px-7 py-4 text-base font-semibold text-white no-underline hover:bg-green-600"
                href={`${env.APP_ORIGIN}/reset-password/${token}`}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-base leading-6 text-gray-700">This reset link will expire in 1 hour.</Text>
            <Text className="text-base leading-6 text-gray-700">
              If you didn't request a password reset, you can safely ignore this email.
            </Text>
            <Hr className="my-6 border-gray-200" />
            <Text className="text-sm text-gray-500">This is an automated message, please do not reply.</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
