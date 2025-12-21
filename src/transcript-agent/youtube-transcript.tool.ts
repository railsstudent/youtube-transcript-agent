import { FunctionTool } from '@google/adk';
import { YouTubeTranscriptApi } from '@playzone/youtube-transcript';
import { z } from 'zod';

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
        throw new Error('Unable to extract video ID from YouTube URL provided.');
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

async function getTranscript(youtube_url: string) {
    try {
        const transcript = await fetchTranscript(youtube_url);
        return { status: 'success', transcript };
    } catch (err) {
        console.log(err);
        return { status: 'error', message: 'Error getting YouTube transcript.' };
    }
};

export const YoutubeTranscriptTool = new FunctionTool({
    name: 'fetch_youtube_transcription',
    description: `Fetches the transcript of a YouTube video.`,
    parameters: getTranscriptSchema,
    execute: ({ youtube_url }: GetTranscriptInput) => getTranscript(youtube_url)
});
