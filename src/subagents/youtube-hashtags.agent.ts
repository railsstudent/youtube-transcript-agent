import { LlmAgent } from '@google/adk';
import { HASHTAGS_KEY, TRANSCRIPT_KEY } from '../output-key.const';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

export const YouTubeHashtagsAgent = new LlmAgent({
    name: 'youtube_hashtags_agent',
    model,
    description: 'Generates hashtags based on the YouTube transcript.',
    instruction: `
        You are a helpful assistant that generates hashtags for a YouTube transcript.
        
        INSTRUCTIONS:
        1. Read '${TRANSCRIPT_KEY}' from the shared context to get the transcript.
        3. Based on the transcript in the shared context, generate a list of hashtags that accurately reflect the content of the video.
        4. Focus on making the hashtags appealing to potential viewers, highlighting key points and themes of the video.
        5. The hashtags should each start with the '#' symbol and contain no spaces.
        6. The hashtags should be in English, all lowercase, and order in alphabetical ascending order.
        7. The hashtags should be presented in string format, separated by spaces.
        8. If the tool returns an error status, respond with the error message.
        9. If successful, your final response must contain ONLY the hashtags. Do not include any JSON, tool call code, or conversational filler like "Here are your hashtags.
    `,
    outputKey: HASHTAGS_KEY,
 });