import { LlmAgent } from '@google/adk';
import { DESCRIPTION_KEY } from './output-key.const';
import { SaveUserContext } from './tools';
import { SequentialYoutubeAgent } from './subagents/youtube-agents';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

export const rootAgent = new LlmAgent({
    name: 'youtube_transcript_agent',
    model,
    description: 'Generate details based on YouTube transcript.',
    instruction: `You are a helpful assistant that generates useful details for the YouTube URL provided.                    
        INSTRUCTIONS:
        1. If the user provides a YouTube URL, use the 'save_user_context' tool to save the URL into the shared context.
            - Use the tool with key 'youtube_url' and value, which is the provided URL.
        2. If 'save_user_context' completes, check the status of the response.
        3. If and only if the status is 'success' and 'youtube_url' is present in the shared context,
            - Delegate to 'sequential_youtube_agent'.
            - IMPORTANT: Tell the agent: "Please use the URL to get the transcript."
        4. If 'youtube_url' is not present in the shared context, ask the user to provide a valid YouTube URL.
        5. Once the 'sequential_youtube_agent' agent completes, check the status of the response.
            - When the status is 'success', display the value of '${DESCRIPTION_KEY}' from the shared context. 
            - When the status is 'error', response with the error message.
    `,
    subAgents: [SequentialYoutubeAgent],
    tools: [SaveUserContext],
});