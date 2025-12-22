import { LlmAgent } from '@google/adk';
import { DESCRIPTION_KEY, HASHTAGS_KEY, RECIPIENT_EMAIL_KEY, TIMELINE_KEY } from '../output-key.const';
import { SEND_EMAIL_TOOL_NAME, SendEmailTool } from './send-email.tool';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

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
        - Use the '${SEND_EMAIL_TOOL_NAME}' to send an email with the retrieved metadata.
    `,
    tools: [SendEmailTool],
 });
