import { FunctionTool, LlmAgent, ToolContext } from '@google/adk';
import { z } from 'zod';
import { YoutubeDescriptionAgent } from './description-agents/youtube-description.agent';

process.loadEnvFile();
const model = process.env.GEMINI_MODEL_NAME || 'gemini-3-flash-preview';

const saveUserContextSchema = z.object({
    youtube_url: z.string().describe("The YouTube URL to save in context"),
});

type SaveUserContextInput = z.infer<typeof saveUserContextSchema>;

const SaveUserContext = new FunctionTool({
  name: 'save_user_context',
  description: 'Saves user-specific information into the shared context for other agents to use.',
  parameters: saveUserContextSchema,
  execute: async ({ youtube_url }: SaveUserContextInput, toolContext?: ToolContext) => {
    // Returning this data makes it part of the "Trace" and "State" 
    // which all sub-agents in the session can see.
    if (toolContext) {
        toolContext.state.set('youtube_url', youtube_url);
    }

    return {
      status: 'success',
      message: `Saved '${youtube_url}' to the shared context.`,
    };
  }
});

// const ParallelYoutubeAgent = new ParallelAgent({
//     name: "parallel_youtube_agent",
//     subAgents: [YoutubeDescriptionAgent],
//     description: "Runs multiple Youtube agents in parallel to gather description, hashtags, and timeline."
// });

export const rootAgent = new LlmAgent({
    name: 'youtube_transcript_agent',
    model,
    description: 'Generate details based on YouTube transcript.',
    instruction: `You are a helpful assistant that generates useful details for the YouTube URL provided.                    
        INSTRUCTIONS:
        1. If the user provides a YouTube URL, use the 'save_user_context' tool to save the URL into the shared context.
        2. If 'save_user_context' completes, check the status of the response.
        3. If and only if the status is 'success' and 'youtube_url' is present in the shared context,
            - Delegate to 'youtube_description_agent'.
            - IMPORTANT: Tell the agent: "Please use the URL to generate the description."
        4. If 'youtube_url' is not present in the shared context, ask the user to provide a valid YouTube URL.
        5. Once the 'youtube_description_agent' agent completes, check the status of the response.
            - When the status is 'success', extract the value of 'youtube_description' from the response and display it. 
            - When the status is 'error', extract the error message from the response and display it.
    `,
    // subAgents: [ParallelYoutubeAgent],
    subAgents: [YoutubeDescriptionAgent],
    tools: [SaveUserContext],
});