import { LlmAgent } from '@google/adk';
import { DESCRIPTION_KEY } from './output-key.const';
import { YoutubeTranscriptTool } from './youtube-transcript.tool';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

export const YoutubeDescriptionAgent = new LlmAgent({
    name: 'youtube_description_agent',
    model,
    description: 'Generates a description based on the public Youtube URL provided by the user.',
    instruction: `
        You are a helpful assistant that generates a description for a YouTube video.
        
        INSTRUCTIONS:
        1. Read 'youtube_url' from the shared context.
        2. Use the 'generate_youtube_description' tool to get the transcript.
        3. Based on the transcript in the shared context, generate a concise and engaging YouTube video description that accurately reflects the content of the video.
        4. Ensure the description is between 100-300 words.
        5. Ensure the description is in text format, And prefix each paragraph with a bullet point, in * symbol.
        5. The description should be presented in the perspective of the content creators summarizing their own video. Instead of "In this video, the presenter covers...", use "In this video, I cover...".
        6. Focus on making the description appealing to potential viewers, highlighting key points and value propositions of the video.
        7. If the tool returns an error status, respond with the error message.
        8. If successful, return the generated description.

        FINAL OUTPUT:
        3. Write the generated description to the shared state with the key '${DESCRIPTION_KEY}'.
    `,
    outputKey: DESCRIPTION_KEY,   
    tools: [YoutubeTranscriptTool],
 });