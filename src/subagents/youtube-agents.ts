import { ParallelAgent, SequentialAgent } from '@google/adk';
import { SendEmailAgent } from './send-email.agent';
import { YoutubeDescriptionAgent } from './youtube-description.agent';
import { YoutubeHashtagsAgent } from './youtube-hashtags.agent';
import { YoutubeTimelineAgent } from './youtube-timeline.agent';
import { YoutubeTranscriptAgent } from './youtube-transcript.agent';

const ParallelYouTubeAgent = new ParallelAgent({
    name: "parallel_youtube_agent",
    subAgents: [YoutubeDescriptionAgent, YoutubeHashtagsAgent, YoutubeTimelineAgent],
    description: "Runs multiple Youtube agents in parallel to gather description, hashtags, and timeline."
});

export const SequentialYouTubeAgent = new SequentialAgent({
    name: 'sequential_youtube_agent',
    subAgents: [YoutubeTranscriptAgent, ParallelYouTubeAgent, SendEmailAgent],
    description: 'Runs Youtube agents sequentially to generate description based on transcript.',
});
