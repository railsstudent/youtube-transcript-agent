import { LlmAgent } from '@google/adk';
import { Schema, Type } from '@google/genai';
import { DESCRIPTION_KEY, HASHTAGS_KEY, MERGED_VIDEO_METADATA_KEY, TIMELINE_KEY, } from '../output-key.const';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

const getVideoMetadataSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        youtube_description: { type: Type.STRING},
        youtube_timeline: { type: Type.STRING },
        youtube_hashtags: { type: Type.STRING },
    },
    required: ['youtube_description', 'youtube_timeline', 'youtube_hashtags'],
}

export const YouTubeMergerAgent =  new LlmAgent({
    name: "merger_agent",
    model,
    description: 'Aggregates description, timeline, and hashtags into a single JSON object.',
    instruction: `
        You are a Data Integration Specialist. Your job is to take processed video metadata and package it into a clean JSON object.

        ### INPUT DATA
        Retrieve the following from the shared context:
        1. Description: Found at '${DESCRIPTION_KEY}'
        2. Timeline: Found at '${TIMELINE_KEY}'
        3. Hashtags: Found at '${HASHTAGS_KEY}'

        ### OUTPUT REQUIREMENTS (STRICT)
        - Your final response must be a single, valid JSON object.
        - DO NOT wrap the output in markdown code blocks (no \`\`\`json).
        - DO NOT add any conversational text before or after the JSON.
        - Ensure all special characters in the text (like newlines or quotes) are properly escaped for JSON.

        ### JSON SCHEMA
        {
          "youtube_description": "string",
          "youtube_timeline": "string",
          "youtube_hashtags": "string"
        }
    `,
    outputSchema: getVideoMetadataSchema,
    outputKey: MERGED_VIDEO_METADATA_KEY,
 });
