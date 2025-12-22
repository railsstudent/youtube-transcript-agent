import { LlmAgent } from '@google/adk';
import { YouTubeTranscriptTool } from './youtube-transcript.tool';
import { TRANSCRIPT_KEY, YOUTUBE_URL_KEY } from '../output-key.const';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

export const YouTubeTranscriptAgent = new LlmAgent({
    name: 'youtube_transcript_agent',
    model,
    description: 'Fetches the transcript of a public YouTube URL provided by the user.',
    instruction: `
        You are a helpful assistant that fetches the transcript for a public YouTube URL provided by the user.
        
        INSTRUCTIONS:
        1. Read '${YOUTUBE_URL_KEY}' from the shared context.
        2. Use the 'fetch_youtube_transcription' tool to get the transcript.
        3. If the tool returns an error status, respond with the error message.
        4. If the tool is successful, your FINAL response must be the RAW text of the transcript. Do not add conversational filler like "Here is the transcript:".
    `,
    outputKey: TRANSCRIPT_KEY,   
    tools: [YouTubeTranscriptTool],
 });