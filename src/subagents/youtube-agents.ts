import { ParallelAgent, SequentialAgent } from '@google/adk';
import { YoutubeDescriptionAgent } from './youtube-description.agent';
import { YoutubeHashtagsAgent } from './youtube-hashtags.agent';
import { YoutubeTimelineAgent } from './youtube-timeline.agent';
import { YoutubeTranscriptAgent } from './youtube-transcript.agent';

const ParallelYoutubeAgent = new ParallelAgent({
    name: "parallel_youtube_agent",
    subAgents: [YoutubeDescriptionAgent, YoutubeHashtagsAgent, YoutubeTimelineAgent],
    description: "Runs multiple Youtube agents in parallel to gather description, hashtags, and timeline."
});

export const SequentialYoutubeAgent = new SequentialAgent({
    name: 'sequential_youtube_agent',
    subAgents: [YoutubeTranscriptAgent, ParallelYoutubeAgent],
    description: 'Runs Youtube agents sequentially to generate description based on transcript.',
});
