import { FunctionTool, ToolContext } from '@google/adk';
import z from 'zod';
import { SAVE_USER_CONTEXT_TOOL_NAME } from './tool-names.constant';

const saveUserContextSchema = z.object({
    key: z.string().describe("The key to store the data in the shared context"),
    value: z.any().describe("The data to store in the shared context"),
});

type SaveUserContextInput = z.infer<typeof saveUserContextSchema>;

export const SaveUserContextTool = new FunctionTool({
  name: SAVE_USER_CONTEXT_TOOL_NAME,
  description: 'Saves user-specific information into the shared context for other agents to use.',
  parameters: saveUserContextSchema,
  execute: async ({ key, value }: SaveUserContextInput, toolContext?: ToolContext) => {
    // Returning this data makes it part of the "Trace" and "State" 
    // which all sub-agents in the session can see.
    if (toolContext) {
        toolContext.state.set(key, value);
    }

    return {
      status: 'success',
      message: `Saved '${value}' to ${key} in the shared context.`,
    };
  }
});
