import { Event, Community, UserRole, EmailSequence, LeadMagnet } from './types';

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'AI Product Design Workshop',
    description: 'Learn how to design AI-native interfaces that users love. We will cover UX patterns for LLMs, agentic workflows, and more.',
    date: '2026-03-15',
    time: '18:00',
    location: 'San Francisco, CA',
    organizerId: 'org1',
    organizerName: 'Design Collective',
    price: 49,
    category: 'Design',
    attendees: ['user1', 'user2', 'user3'],
    image: 'https://picsum.photos/seed/ai-design/800/400',
    tags: ['AI', 'UX', 'Design'],
    aiSummary: 'A hands-on workshop focused on the intersection of AI and User Experience.'
  },
  {
    id: '2',
    title: 'Future of LLMs Meetup',
    description: 'A deep dive into the latest advancements in Large Language Models. Networking and lightning talks from industry leaders.',
    date: '2026-03-20',
    time: '19:00',
    location: 'London, UK',
    organizerId: 'org2',
    organizerName: 'AI London',
    price: 0,
    category: 'Technology',
    attendees: ['user4', 'user5'],
    image: 'https://picsum.photos/seed/llm-meetup/800/400',
    tags: ['LLM', 'AI', 'Networking'],
    aiSummary: 'Networking event for AI enthusiasts and researchers.'
  },
  {
    id: '3',
    title: 'Startup Growth Hacking with AI',
    description: 'How to use AI tools to scale your startup marketing and sales without increasing headcount.',
    date: '2026-04-05',
    time: '10:00',
    location: 'Online',
    organizerId: 'org3',
    organizerName: 'Growth Lab',
    price: 25,
    category: 'Business',
    attendees: ['user1', 'user6'],
    image: 'https://picsum.photos/seed/growth/800/400',
    tags: ['Startup', 'Marketing', 'AI'],
    aiSummary: 'Practical strategies for AI-driven business growth.'
  }
];

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'c1',
    name: 'AI Builders Guild',
    description: 'A community for developers building AI-first applications.',
    memberCount: 1250,
    organizerId: 'org1',
    image: 'https://picsum.photos/seed/guild/400/400',
    tags: ['Dev', 'AI', 'Open Source']
  },
  {
    id: 'c2',
    name: 'Product Leaders AI',
    description: 'Strategic discussions for product managers navigating the AI era.',
    memberCount: 850,
    organizerId: 'org4',
    image: 'https://picsum.photos/seed/pm/400/400',
    tags: ['Product', 'Strategy', 'AI']
  }
];

export const EMAIL_SEQUENCES: EmailSequence[] = [
  {
    id: 'seq1',
    name: 'Organizer Onboarding',
    targetICP: 'Event Organizers',
    steps: [
      {
        subject: 'Welcome to Nexus AI: Your first event is waiting',
        body: 'Hi there! Ready to build an intelligent community? Our AI assistant is here to help you draft your first event description...',
        delay: 'Day 0'
      },
      {
        subject: 'Boost your attendance with AI insights',
        body: 'Did you know Nexus can predict your attendance based on timing? Check your dashboard for suggestions...',
        delay: 'Day 2'
      }
    ]
  },
  {
    id: 'seq2',
    name: 'Member Engagement',
    targetICP: 'Community Members',
    steps: [
      {
        subject: 'Discover events tailored for you',
        body: 'Based on your interest in AI Design, we found 3 events you might love...',
        delay: 'Day 1'
      }
    ]
  }
];

export const LEAD_MAGNETS: LeadMagnet[] = [
  {
    id: 'lm1',
    title: 'The AI Event Growth Playbook',
    description: '10 strategies to double your event attendance using AI-powered marketing.',
    type: 'PDF',
    content: 'Full playbook content here...'
  },
  {
    id: 'lm2',
    title: 'AI Community Checklist',
    description: 'Everything you need to launch an AI-native community in 7 days.',
    type: 'CHECKLIST',
    content: 'Step 1: Define your niche...'
  }
];
