import { LlmAgent } from '@google/adk';
import { SequentialYoutubeAgent } from './subagents/youtube-agents';
import { SaveUserContextTool } from './tools';
import { RECIPIENT_EMAIL_KEY, YOUTUBE_URL_KEY } from './output-key.const';
import { SAVE_USER_CONTEXT_TOOL_NAME } from './tool-names.constant';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

export const rootAgent = new LlmAgent({
    name: 'youtube_transcript_agent',
    model,
    description: 'Generate details based on YouTube transcript.',
    instruction: `You are a helpful assistant that generates useful details for the YouTube URL provided and sends an email with the results.
        
        INSTRUCTIONS:
        1. Ask user for a public YouTube URL and recipient email address.
          - If the user provides an input, determine it is an URL or an email address.
          - If it is an URL, use the '${SAVE_USER_CONTEXT_TOOL_NAME}' tool to save it to the shared context with key '${YOUTUBE_URL_KEY}'.
          - If it is an email address, use the '${SAVE_USER_CONTEXT_TOOL_NAME}' tool to save it to the shared context with key '${RECIPIENT_EMAIL_KEY}'.
          - If the input is neither, ask the user to provide a valid YouTube URL or email address.
        2. If '${SAVE_USER_CONTEXT_TOOL_NAME}' completes, check the status of the response.
        3. If and only if the status is 'success', and '${YOUTUBE_URL_KEY}' and '${RECIPIENT_EMAIL_KEY}' are present in the shared context,
            - Delegate to 'sequential_youtube_agent'.
            - IMPORTANT: Tell the agent: "Please use the URL to get the transcript."
        4. If '${YOUTUBE_URL_KEY}' is not present in the shared context, ask the user to provide a valid YouTube URL.
        5. Once the 'sequential_youtube_agent' agent completes, check the status of the response.
            - When the status is 'success', confirm the completion of the agent.
            - When the status is 'error', responsd with the error message.
    `,
    subAgents: [SequentialYoutubeAgent],
    tools: [SaveUserContextTool],
});