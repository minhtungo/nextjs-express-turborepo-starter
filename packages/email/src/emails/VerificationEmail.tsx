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
} from "@react-email/components";
import React from "react";
import { env } from "../env";

interface VerificationEmailProps {
  username: string;
  token: string;
}

const VerificationEmail = ({ username, token }: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 px-4 max-w-[600px]">
            <Heading className="text-2xl font-semibold text-gray-800 my-0">
              Welcome to {env.APP_ORIGIN}!
            </Heading>
            <Text className="text-gray-700 text-base leading-6 mt-4">
              Hi {username},
            </Text>
            <Text className="text-gray-700 text-base leading-6">
              Thank you for signing up! Please verify your email address by
              clicking the button below:
            </Text>
            <Section className="text-center my-8">
              <Button
                className="bg-green-500 text-white px-7 py-4 rounded-md font-semibold text-base no-underline inline-block hover:bg-green-600"
                href={`${env.APP_ORIGIN}/verify-email/${token}`}
              >
                Verify Email Address
              </Button>
            </Section>
            <Text className="text-gray-700 text-base leading-6">
              This verification link will expire in 24 hours.
            </Text>
            <Text className="text-gray-700 text-base leading-6">
              If you didn't create an account, you can safely ignore this email.
            </Text>
            <Hr className="border-gray-200 my-6" />
            <Text className="text-gray-500 text-sm">
              This is an automated message, please do not reply.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
