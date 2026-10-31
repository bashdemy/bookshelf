import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export interface ArticleSeed {
  id: string;
  type: 'article';
  title: string;
  author: string;
  publication: string;
  url: string;
  year: number;
  pages: number;
  genre: string;
  rating: number;
  readDate: string;
  description: string;
  tags: string[];
}

export const SUBSTACK_RECOMMENDED_ARTICLES: ArticleSeed[] = [
  {
    id: 'art-toy-software-barretto',
    type: 'article',
    title: 'Writing Toy Software Is A Joy',
    author: 'Joshua Barretto',
    publication: 'jsbarretto.com',
    url: 'https://jsbarretto.com/posts/writing-toy-software-is-a-joy/',
    year: 2025,
    pages: 8,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-08-11',
    description: 'Purely parking this here so Future Me can come back and build some of these. The list is great, equal parts useful, unhinged, and I definitely don’t have time for this.',
    tags: ['Programming', 'Hacking', 'Toy Projects', 'Creativity'],
  },
  {
    id: 'art-vibe-code-maccaw',
    type: 'article',
    title: 'How to Vibe Code as a Senior Engineer',
    author: 'Alex MacCaw',
    publication: 'blog.alexmaccaw.com',
    url: 'https://blog.alexmaccaw.com/how-to-vibe-code-as-a-senior-engineer/',
    year: 2025,
    pages: 12,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-08-11',
    description: 'I think this is a good starting point except perhaps the CLI tool diagnosis (I still quite enjoy Claude Code, thank you very much). But the broader point? Completely agree. The real draw for me is not just the speed. It is that the barrier to trying weird, possibly ridiculous ideas has never been lower. You can throw something together, see if it sticks, and move on without the week-long build and polish cycle.',
    tags: ['AI', 'Engineering', 'Vibe Coding', 'Software Architecture'],
  },
  {
    id: 'art-llm-lang-design-gopinathan',
    type: 'article',
    title: 'How LLMs Reshape Language Design',
    author: 'Kiran Gopinathan',
    publication: 'kirancodes.me',
    url: 'https://kirancodes.me/posts/log-lang-design-llms.html',
    year: 2025,
    pages: 14,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-07-18',
    description: 'The LLM wave seems to flatten the programming landscape: Python everywhere, the rest demoted to curiosities (I am still thinking of the horseless carriage analogy months later), at what point do we discard and declare something an archaism?',
    tags: ['Compilers', 'Language Design', 'LLMs', 'Programming Languages'],
  },
  {
    id: 'art-horseless-carriages-koomen',
    type: 'article',
    title: 'Horseless Carriages',
    author: 'Koomen',
    publication: 'koomen.dev',
    url: 'https://koomen.dev/essays/horseless-carriages/',
    year: 2025,
    pages: 10,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-07-18',
    description: 'On technological transitions and paradigm shifts: how early automobiles were shaped like horse-drawn carriages before cars discovered their native affordances, and what that means for AI-native software engineering.',
    tags: ['Technology & Society', 'Essays', 'AI Paradigms', 'History of Tech'],
  },
  {
    id: 'art-coding-agents-chasm-singleton',
    type: 'article',
    title: 'Coding Agents Cross a Chasm',
    author: 'Brad Singleton',
    publication: 'blog.singleton.io',
    url: 'https://blog.singleton.io/posts/2025-06-14-coding-agents-cross-a-chasm',
    year: 2025,
    pages: 16,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-07-03',
    description: 'Everyone’s asking if AI will replace programmers. We should be asking what can we build now. I relate to this; my work relationship with AI has developed the same way over the last few years.',
    tags: ['AI Agents', 'Coding', 'Software Engineering', 'Future of Work'],
  },
  {
    id: 'art-ai-charging-rent-hunter',
    type: 'article',
    title: 'AI is Charging Rent. Must Be Sydney: On the Creeping SaaS-ification of Software Engineering',
    author: 'Rian Hunter',
    publication: 'rianhunter.com',
    url: 'https://rianhunter.com',
    year: 2025,
    pages: 9,
    genre: 'Technology & Code',
    rating: 5,
    readDate: '2025-07-01',
    description: 'On the creeping SaaS-ification of software engineering, recurring developer tolls, and how developer tools are morphing into high-rent landlords.',
    tags: ['SaaS', 'Developer Tools', 'Industry Commentary', 'Sydney Tech'],
  },
];
