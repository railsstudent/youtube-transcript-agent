import { ParallelAgent, SequentialAgent } from '@google/adk';
import { SendEmailAgent } from './send-email.agent';
import { YouTubeDescriptionAgent } from './youtube-description.agent';
import { YouTubeHashtagsAgent } from './youtube-hashtags.agent';
import { YouTubeTimelineAgent } from './youtube-timeline.agent';
import { YouTubeTranscriptAgent } from './youtube-transcript.agent';

const ParallelYouTubeAgent = new ParallelAgent({
    name: "parallel_youtube_agent",
    subAgents: [YouTubeDescriptionAgent, YouTubeHashtagsAgent, YouTubeTimelineAgent],
    description: "Runs multiple Youtube agents in parallel to gather description, hashtags, and timeline."
});

export const SequentialYouTubeAgent = new SequentialAgent({
    name: 'sequential_youtube_agent',
    subAgents: [YouTubeTranscriptAgent, ParallelYouTubeAgent, SendEmailAgent],
    description: 'Runs Youtube agents sequentially to generate description based on transcript.',
});
