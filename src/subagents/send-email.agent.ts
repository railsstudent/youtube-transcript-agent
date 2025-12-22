import { FunctionTool, LlmAgent } from '@google/adk';
import z from 'zod';
import { DESCRIPTION_KEY, HASHTAGS_KEY, RECIPIENT_EMAIL_KEY, TIMELINE_KEY } from '../output-key.const';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

const sendEmailSchema = z.object({
    metadata: z.object({
        youtube_description: z.string().describe("YouTube video description"),
        youtube_timeline: z.string().describe("YouTube video timeline"),
        youtube_hashtags: z.string().describe("YouTube video hashtags"),
    }),
    email: z.string().describe("Recipient email address"),
});

type SendEmailInput = z.infer<typeof sendEmailSchema>;

export const SendEmailTool = new FunctionTool({
  name: 'send_email_tool',
  description: 'Sends an email with the provided details.',
  parameters: sendEmailSchema,
  execute: async ({ metadata, email }: SendEmailInput) => {
    return {
      status: 'success',
      message: `Email sent to ${email} with metadata ${JSON.stringify(metadata)}`,
    };
  }
});

export const SendEmailAgent =  new LlmAgent({
    name: "send_email_agent",
    model,
    description: 'Send an email to a recipient with the provided metadata.',
    instruction: `
        You are an email automation specialist. Your job is to take processed video metadata and send an email to a recipient with the provided details.

        ### INPUT DATA
        Retrieve the following from the shared context:
        1. Description: Found at '${DESCRIPTION_KEY}'
        2. Timeline: Found at '${TIMELINE_KEY}'
        3. Hashtags: Found at '${HASHTAGS_KEY}'
        4. Recipient Email Address: Found at '${RECIPIENT_EMAIL_KEY}'

        ### EMAIL REQUIREMENTS
        - Use the 'send_email_tool' to send an email with the retrieved metadata.
    `,
    tools: [SendEmailTool],
 });
