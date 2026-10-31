import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Clean set of 9 standard bookstore categories
export const GENRE_MAPPING: Record<string, string> = {
  // Classics
  'War and Peace': 'Classics',
  'The Idiot (Идиот)': 'Classics',
  'Воскресение (Resurrection)': 'Classics',
  'Resurrection': 'Classics',
  'Fathers and Sons': 'Classics',
  'Crime and Punishment': 'Classics',
  'The Well of Loneliness': 'Classics',
  'The Man in the Iron Mask': 'Classics',
  'Dead Souls': 'Classics',
  'The Red and the Black': 'Classics',
  'Emma': 'Classics',
  'The Odyssey': 'Classics',
  'Faust: Parts I & II': 'Classics',
  'For the Term of His Natural Life': 'Classics',
  'Little Women': 'Classics',
  'Moby-Dick': 'Classics',
  'The Complete Stories of Sherlock Holmes': 'Mystery & Thriller',
  'Russian Tales (Сказки)': 'Classics',
  'The Scarlet Letter': 'Classics',
  'The Narrative of Arthur Gordon Pym of Nantucket and Related Tales': 'Classics',
  'The Narrative of Arthur Gordon Pym': 'Classics',

  // Fiction & Literature
  'To Kill a Mockingbird': 'Fiction & Literature',
  'The Master and Margarita': 'Fiction & Literature',
  'Mother Night': 'Fiction & Literature',
  'Slaughterhouse-Five': 'Fiction & Literature',
  'All Quiet on the Western Front': 'Fiction & Literature',
  'A Farewell to Arms': 'Fiction & Literature',
  'The Old Man and the Sea': 'Fiction & Literature',
  'The Catcher in the Rye': 'Fiction & Literature',
  'One Hundred Years of Solitude': 'Fiction & Literature',
  'The Little Prince': 'Fiction & Literature',
  'Cat’s Cradle': 'Fiction & Literature',
  'Lolita': 'Fiction & Literature',
  'Fear and Loathing in Las Vegas': 'Fiction & Literature',
  'The Metamorphosis and Other Stories': 'Fiction & Literature',
  'The Book Thief': 'Fiction & Literature',
  'The Alchemist': 'Fiction & Literature',
  'Women': 'Fiction & Literature',
  'The Cat Who Saved Books': 'Fiction & Literature',
  'Too Much Lip': 'Fiction & Literature',
  'Look at the Birdie: Unpublished Short Fiction': 'Fiction & Literature',
  'Look at the Birdie': 'Fiction & Literature',

  // Sci-Fi, Fantasy & Dystopia
  'Nineteen Eighty-Four': 'Sci-Fi & Dystopia',
  'The Handmaid’s Tale': 'Sci-Fi & Dystopia',
  'Island': 'Sci-Fi & Dystopia',
  'Time Must Have a Stop': 'Sci-Fi & Dystopia',
  'The Call of Cthulhu and Other Weird Stories': 'Sci-Fi & Dystopia',
  'The Hitchhiker’s Guide to the Galaxy (The Complete Trilogy of Five)': 'Sci-Fi & Dystopia',
  'The Hitchhiker’s Guide to the Galaxy (Trilogy in Five Parts)': 'Sci-Fi & Dystopia',
  'The Hitchhiker’s Guide to the Galaxy': 'Sci-Fi & Dystopia',
  'The Bees': 'Sci-Fi & Dystopia',

  // Mystery, Horror & Thriller
  'Dracula': 'Mystery & Thriller',
  '4.50 from Paddington': 'Mystery & Thriller',
  'Gone Girl': 'Mystery & Thriller',
  'In Cold Blood': 'Mystery & Thriller',
  'The Teacher’s Pet': 'Mystery & Thriller',

  // Psychology & Self-Development
  'The Ten Types of Human: A New Understanding of Who We Are, and Who We Can Be': 'Psychology & Mind',
  'The Ten Types of Human': 'Psychology & Mind',
  'Unmasking Autism: Discovering the New Faces of Neurodiversity': 'Psychology & Mind',
  'Unmasking Autism': 'Psychology & Mind',
  'This Naked Mind: Control Alcohol, Find Freedom, Discover Happiness & Change Your Life': 'Psychology & Mind',
  'This Naked Mind: Control Alcohol': 'Psychology & Mind',
  'This Naked Mind': 'Psychology & Mind',
  'The Gifts of Imperfection': 'Psychology & Mind',
  'ADHD 2.0: New Science and Essential Strategies for Thriving with Distraction': 'Psychology & Mind',
  'ADHD 2.0': 'Psychology & Mind',
  'The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness': 'Psychology & Mind',
  'The Psychology of Money': 'Psychology & Mind',
  'The Interpretation of Dreams': 'Psychology & Mind',
  'The Psychology of Love': 'Psychology & Mind',
  'Set Boundaries, Find Peace: A Guide to Reclaiming Yourself': 'Psychology & Mind',
  'Set Boundaries, Find Peace': 'Psychology & Mind',

  // Philosophy & Strategy
  '12 Rules for Life: An Antidote to Chaos': 'Philosophy & Strategy',
  '12 Rules for Life': 'Philosophy & Strategy',
  'Maps of Meaning: The Architecture of Belief': 'Philosophy & Strategy',
  'Maps of Meaning': 'Philosophy & Strategy',
  'The 48 Laws of Power': 'Philosophy & Strategy',
  'The Art of War': 'Philosophy & Strategy',
  'Political Correctness Gone Mad?': 'Philosophy & Strategy',

  // History & Society
  'Sapiens: A Brief History of Humankind': 'History & Society',
  'Sapiens': 'History & Society',
  'Genghis Khan and the Making of the Modern World': 'History & Society',
  'The Rise and Fall of the Third Reich': 'History & Society',
  'The Gulag Archipelago': 'History & Society',
  '21 Lessons for the 21st Century': 'History & Society',
  'Homo Deus: A Brief History of Tomorrow': 'History & Society',
  'Permanent Record': 'History & Society',
  'The History of Magic, Witchcraft & the Occult': 'History & Society',

  // Science & Mathematics
  'Everything Is Predictable: How Bayes’ Remarkable Theorem Explains the World': 'Science & Mathematics',
  'Everything Is Predictable': 'Science & Mathematics',
  'The Art of Uncertainty: How to Navigate Chance, Ignorance, Risk and Luck': 'Science & Mathematics',
  'The Art of Uncertainty': 'Science & Mathematics',
  'Brief Answers to the Big Questions': 'Science & Mathematics',
  'Космос (Cosmos)': 'Science & Mathematics',

  // Technology & Code
  'Algorithms': 'Technology & Code',
  'Clean Code': 'Technology & Code',
  'The Pragmatic Programmer': 'Technology & Code',
  'Designing Data-Intensive Applications': 'Technology & Code',
  'Understanding React Server Components': 'Technology & Code',
  'The Future of Web Development': 'Technology & Code',

  // Memoir & Lifestyle
  'Quit Like a Woman: The Radical Choice to Not Drink in a Culture Obsessed with Alcohol': 'Memoir & Lifestyle',
  'Quit Like a Woman': 'Memoir & Lifestyle',
  '488 Rules for Life: The Thankless Art of Being Correct': 'Memoir & Lifestyle',
  '488 Rules for Life': 'Memoir & Lifestyle',
  'Intoxicating: Ten Drinks That Shaped Australia': 'Memoir & Lifestyle',
  'Intoxicating': 'Memoir & Lifestyle',
  'The Playbook: 52 Rules to Aim, Shoot, and Score in This Game Called Life': 'Memoir & Lifestyle',
  'The Playbook': 'Memoir & Lifestyle',
  'The Six Foot Track: Katoomba to Jenolan Caves': 'Memoir & Lifestyle',
  'The Six Foot Track': 'Memoir & Lifestyle',
};

async function consolidate(dbUrl: string, name: string) {
  const sql = neon(dbUrl);
  console.log(`Consolidating genres for ${name}...`);

  const items = await sql`
    SELECT id, title, genre FROM reading_items
  ` as Array<{ id: string; title: string; genre: string | null }>;

  let updated = 0;
  for (const item of items) {
    let cleanGenre = GENRE_MAPPING[item.title];

    // Fallback fuzzy search if exact match doesn't hit
    if (!cleanGenre) {
      for (const [key, val] of Object.entries(GENRE_MAPPING)) {
        if (item.title.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(item.title.toLowerCase())) {
          cleanGenre = val;
          break;
        }
      }
    }

    // Default heuristics based on old messy genre
    if (!cleanGenre && item.genre) {
      const g = item.genre.toLowerCase();
      if (g.includes('classic') || g.includes('russian')) cleanGenre = 'Classics';
      else if (g.includes('fiction') || g.includes('novella')) cleanGenre = 'Fiction & Literature';
      else if (g.includes('sci-fi') || g.includes('dystopian') || g.includes('speculative')) cleanGenre = 'Sci-Fi & Dystopia';
      else if (g.includes('psycholog') || g.includes('self-help')) cleanGenre = 'Psychology & Mind';
      else if (g.includes('philosoph') || g.includes('strategy')) cleanGenre = 'Philosophy & Strategy';
      else if (g.includes('histor') || g.includes('society')) cleanGenre = 'History & Society';
      else if (g.includes('crime') || g.includes('mystery') || g.includes('thriller') || g.includes('gothic')) cleanGenre = 'Mystery & Thriller';
      else if (g.includes('science') || g.includes('math') || g.includes('astronomy')) cleanGenre = 'Science & Mathematics';
      else if (g.includes('program') || g.includes('computer') || g.includes('tech')) cleanGenre = 'Technology & Code';
      else cleanGenre = 'Memoir & Lifestyle';
    }

    if (cleanGenre && cleanGenre !== item.genre) {
      await sql`
        UPDATE reading_items
        SET genre = ${cleanGenre}
        WHERE id = ${item.id}
      `;
      updated++;
    }
  }

  console.log(`Updated ${updated} items in ${name}.`);
}

async function main() {
  const devUrl = process.env.DATABASE_URL;
  if (devUrl) {
    await consolidate(devUrl, 'development branch');
  }

  // Also update production branch
  const prodUrl = 'postgresql://neondb_owner:npg_FJjR3v0bhmCq@ep-fragrant-morning-a7iwwn5l-pooler.ap-southeast-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
  await consolidate(prodUrl, 'production branch');
}

if (process.argv[1] && process.argv[1].endsWith('consolidate-genres.ts')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
