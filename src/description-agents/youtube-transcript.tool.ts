import { FunctionTool, ToolContext } from '@google/adk';
import { YouTubeTranscriptApi } from '@playzone/youtube-transcript';
import { z } from 'zod';
import { TRANSCRIPT_KEY } from './output-key.const';

const getTranscriptSchema = z.object({
    youtube_url: z.string().describe('The URL of the YouTube video.'),
});

type GetTranscriptInput = z.infer<typeof getTranscriptSchema>;

function extractVideoID(url: string) {
    console.log('youtube_url', url);
    const regExp = /^.*(?:(?:youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match?.[1]?.length === 11) ? match[1] : null;
}

async function fetchTranscript(url: string) {
    const videoID = extractVideoID(url);
    if (!videoID) {
        return { status: 'error', message: 'Unable to extract video ID from YouTube URL provided.' };
    }
    console.log('videoID', videoID);

    const api = new YouTubeTranscriptApi();
    const transcript = await api.fetch(videoID);
    const transcriptText = transcript.snippets?.reduce(
        (acc, snippet) => acc + snippet.text + ' ', ''
    ).trim();

    console.log('transcriptText', transcriptText);
    return transcriptText;
}

export const YoutubeTranscriptTool = new FunctionTool({
    name: 'generate_youtube_description',
    description: `Fetches the transcript of a YouTube video and write to ${TRANSCRIPT_KEY} in the shared context.`,
    parameters: getTranscriptSchema,
    execute: async ({ youtube_url }: GetTranscriptInput, toolContext?: ToolContext) => {
        try {
            const transcriptText = await fetchTranscript(youtube_url);
            toolContext?.state.set(TRANSCRIPT_KEY, transcriptText);
            return { status: 'success', [TRANSCRIPT_KEY]: transcriptText };
        } catch (err) {
            console.log(err);
            return { status: 'error', message: 'Error getting YouTube transcript.' };
        }
    }
});