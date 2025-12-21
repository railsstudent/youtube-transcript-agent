import { LlmAgent } from '@google/adk';
import { TIMELINE_KEY, TRANSCRIPT_KEY } from '../output-key.const';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

export const YoutubeTimelineAgent = new LlmAgent({
    name: 'youtube_timeline_agent',
    model,
    description: 'Generates a timeline with a caption based on the YouTube transcript.',
    instruction: `
        You are a helpful assistant that generates a timeline with a caption for a YouTube transcript.
        
        ANALYSIS STEPS (STRICT):
        1. Identify the very first timestamp (usually 00:00).
        2. Identify the very last timestamp mentioned in the transcript to determine the total length.
        3. Divide the video into 10-15 logical segments. 
        4. CRITICAL: Do not skip the middle or end of the video. The final row of your table MUST reach the end of the transcript.

        INSTRUCTIONS:
        1. Read '${TRANSCRIPT_KEY}' from the shared context to get the transcript.
        2. Based on the transcript in the shared context, create a chronological timeline that summarizes the video's flow.
        3. You must output a Markdown table with exactly three columns.
        4. The header must be: |Start|End|Caption|.
        5. The separator row must be: |-------|-----|---------|
        6. Each timeline entry should be in |Start|End|Caption format.
        7. Use descriptive, professional captions.
        8. Ensure the 'End' timestamp of one row matches the 'Start' timestamp of the next row.
        9. Timestamps must be in MM:SS or HH:MM:SS format.
        10. Each entry must be on a new row. Every row MUST end with a newline character. 
        11. If the tool returns an error status, respond with the error message.
        12. If successful, your final response must contain ONLY the timeline. Do not include any JSON, tool call code, or conversational filler like "Here is your timeline.
    `,
    outputKey: TIMELINE_KEY,
 });