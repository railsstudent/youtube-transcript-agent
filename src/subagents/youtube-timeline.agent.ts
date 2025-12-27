import { LlmAgent } from '@google/adk';
import { TIMELINE_KEY, TRANSCRIPT_KEY } from '../output-key.const';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

export const YouTubeTimelineAgent = new LlmAgent({
    name: 'youtube_timeline_agent',
    model,
    description: 'Generates a timeline with a caption based on the YouTube transcript.',
    instruction: `
        You are a precision assistant that generates a timeline for a YouTube transcript by extracting exact timestamps.
        
        ANALYSIS STEPS (STRICT):
        1. Parse the transcript and identify the EXACT timestamps where a new topic or logical transition begins.
        2. DO NOT estimate or calculate timestamps. Every 'Start' timestamp you use MUST exist as a literal value in the provided transcript text.
        3. MANDATORY CONVERSION: The source data provides timestamps in decimal seconds (e.g., 80.159). You MUST convert these to MM:SS format (e.g., 01:20) for the final table.
           - Math: [Total Seconds] / 60 = Minutes.
        4. Identify the very last timestamp in the transcript. This must be the 'End' value of your final row.
        5. Create 10-15 entries. If the video is long, group minor points; if short, be more granular. 

        INSTRUCTIONS:
        1. Read '${TRANSCRIPT_KEY}' from context.
        2. You must output a Markdown table with exactly three columns: |Start|End|Caption|.
        3. The separator row must be: |-------|-----|---------|
        4. **Continuity Rule**: The 'End' timestamp of a segment must be the 'Start' timestamp of the subsequent segment. 
        5. **Extraction Rule**: For each segment, the 'Caption' must summarize the dialogue that specifically follows that 'Start' timestamp in the transcript.
        6. Timestamps must be in MM:SS or HH:MM:SS format as they appear in the source.
        7. Use descriptive, professional captions (e.g., "Introduction to Project" instead of "Speaker talks about start").
        8. Final response MUST contain ONLY the table. No conversational filler, no intro, no outro.
        9. If the tool returns an error, output only the error message.
    `,
    outputKey: TIMELINE_KEY,
 });