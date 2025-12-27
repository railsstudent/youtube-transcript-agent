import { FunctionTool } from '@google/adk';
import { YouTubeTranscriptApi } from '@playzone/youtube-transcript';
import { z } from 'zod';

const getTranscriptSchema = z.object({
    youtube_url: z.string().describe('The URL of the YouTube video.'),
});

type GetTranscriptInput = z.infer<typeof getTranscriptSchema>;

function extractVideoID(url: string) {
    console.log('youtube_url', url);
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\\&v(?:i)?=))([^#\\&\\?]*).*/;
    const match = url.match(regExp);
    return (match && match?.[1]?.length === 11) ? match[1] : null;
}

async function fetchTranscript(url: string) {
    const videoID = extractVideoID(url);
    if (!videoID) {
        return { 
            status: 'error',
            message: 'Unable to extract video ID from YouTube URL provided.'
        };
    }
    console.log('videoID', videoID);

    try {
        const api = new YouTubeTranscriptApi();
        const transcript = await api.fetch(videoID);

        const transcriptText = transcript.snippets?.reduce(
            (acc, snippet) => { 
                const start = snippet.start;
                const end = snippet.start + snippet.duration;
                return `${acc}[${start}-${end}]${snippet.text} `;
            }, '').trim();

        return transcriptText;
    } catch (e) {
        console.error(e);
        return { 
            status: 'error', 
            message: 'Error getting YouTube transcript in the custom tool.'
        };
    }
}

async function getTranscript(youtube_url: string) {
    try {
        const transcript = await fetchTranscript(youtube_url);
        if (typeof transcript === 'string') {
            return { status: 'success', transcript };
        }
        return transcript;
    } catch (err) {
        console.log(err);
        return { 
            status: 'error', 
            message: 'Error getting YouTube transcript.' 
        };
    }
};

export const YouTubeTranscriptTool = new FunctionTool({
    name: 'fetch_youtube_transcription',
    description: `Fetches the transcript of a YouTube video.`,
    parameters: getTranscriptSchema,
    execute: ({ youtube_url }: GetTranscriptInput) => getTranscript(youtube_url)
});
