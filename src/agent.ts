import {FunctionTool, LlmAgent} from '@google/adk';
import {z} from 'zod';

const getCurrentTimeSchema = z.object({
    timeZone: z.string().describe("The IANA timezone string, e.g., 'Europe/Paris'."),
    city: z.string().describe("The name of the city for which to retrieve the current time.")
});

type GetCurrentTimeInput = z.infer<typeof getCurrentTimeSchema>;

const getCityTime = ({timeZone, city}: GetCurrentTimeInput) => {
    const now = new Date();
    // Use built-in JS Intl formatter
    const timeString = new Intl.DateTimeFormat('en-US', {
        timeStyle: 'medium',
        dateStyle: 'full',
        timeZone,
    }).format(now);

    return `The current time in ${city} is ${timeString}`;
}

/* Mock tool implementation */
const getCurrentTime = new FunctionTool({
    name: 'get_current_time',
    description: 'Returns the current time in a specified city.',
    parameters: getCurrentTimeSchema,
    execute: getCityTime,
});

export const rootAgent = new LlmAgent({
  name: 'hello_time_agent',
  model: 'gemini-3-flash-preview',
  description: 'Tells the current time in a specified city.',
  instruction: `You are a helpful assistant that tells the current time in a city.
                Identify the correct IANA timezone for that city (e.g., "Paris" -> "Europe/Paris").
                Use the 'getCurrentTime' tool with that timezone and city name for this purpose.
                Display the result to the user in a friendly manner.
                
                If the user says "hello" or anything else, greet them and ask which city they want to know the time for.
                ALWAYS provide a text response. Never leave a response blank.`,
  tools: [getCurrentTime],
});