import { FunctionTool } from '@google/adk';
import z from 'zod';

export const sendEmailSchema = z.object({
    youtube_description: z.string().describe("YouTube video description"),
    youtube_timeline: z.string().describe("YouTube video timeline"),
    youtube_hashtags: z.string().describe("YouTube video hashtags"),
    email: z.string().describe("Recipient email address"),
});

type SendEmailInput = z.infer<typeof sendEmailSchema>;

export const SEND_EMAIL_TOOL_NAME = 'send_email_tool';

export const SendEmailTool = new FunctionTool({
  name: SEND_EMAIL_TOOL_NAME,
  description: 'Sends an email with the provided details.',
  parameters: sendEmailSchema,
  execute: async ({ 
    youtube_description: description, 
    youtube_timeline: timeline, 
    youtube_hashtags: hashtags, 
    email 
  }: SendEmailInput) => {
    const metadata = {
      description,
      timeline,
      hashtags,
    };

    return {
      status: 'success',
      message: `Email sent to ${email} with metadata ${JSON.stringify(metadata)}`,
    };
  }
});
