import { LlmAgent } from '@google/adk';
import { DESCRIPTION_KEY, TRANSCRIPT_KEY } from '../output-key.const';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

export const YouTubeDescriptionAgent = new LlmAgent({
    name: 'youtube_description_agent',
    model,
    description: 'Generates a description based on the YouTube transcript.',
    instruction: `
        You are a helpful assistant that generates a description for a YouTube transcript.
        
        INSTRUCTIONS:
        1. Read '${TRANSCRIPT_KEY}' from the shared context to get the transcript.
        3. Based on the transcript in the shared context, generate a concise and engaging YouTube video description that accurately reflects the content of the video.
        4. Ensure the description is between 100-300 words.
        5. Ensure the description is in text format, and prefix each paragraph with a * symbol.
        5. The description should be presented in the perspective of the content creators summarizing their own video. Instead of "In this video, the presenter covers...", use "In this video, I cover...".
        6. Focus on making the description appealing to potential viewers, highlighting key points and value propositions of the video.
        7. If the tool returns an error status, respond with the error message.
        8. If successful, your final response must contain ONLY the description text. Do not include any JSON, tool call code, or conversational filler like "Here is your description.
    `,
    outputKey: DESCRIPTION_KEY,
 });