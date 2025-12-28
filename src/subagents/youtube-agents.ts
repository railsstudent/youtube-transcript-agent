import { ParallelAgent, SequentialAgent } from '@google/adk';
import { SendEmailAgent } from './send-email.agent';
import { YouTubeDescriptionAgent } from './youtube-description.agent';
import { YouTubeHashtagsAgent } from './youtube-hashtags.agent';
import { YouTubeTimelineAgent } from './youtube-timeline.agent';
import { YouTubeTranscriptAgent } from './youtube-transcript.agent';
import { BlogPostAgent } from './blog-post.agent';

const ParallelYouTubeAgent = new ParallelAgent({
    name: "parallel_youtube_agent",
    subAgents: [YouTubeDescriptionAgent, YouTubeHashtagsAgent, YouTubeTimelineAgent],
    description: "Runs multiple Youtube agents in parallel to gather description, hashtags, and timeline."
});

const ParallelWritersAgent = new ParallelAgent({
    name: "parallel_writers_agent",
    subAgents: [ParallelYouTubeAgent, BlogPostAgent],
    description: "Runs multiple agents in parallel to generate metadata and a draftblog post."
});

export const SequentialYouTubeAgent = new SequentialAgent({
    name: 'sequential_youtube_agent',
    subAgents: [YouTubeTranscriptAgent, ParallelWritersAgent, SendEmailAgent],
    description: 'Runs Youtube agents sequentially to generate description based on transcript.',
});
