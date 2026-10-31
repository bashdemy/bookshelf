import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

interface BookDateSpec {
  title: string;
  category: 'russian' | 'classics' | 'mid_fiction_psych' | 'computing_recent' | 'general';
}

// Pseudo-random helper with seed for reproducible yet realistic variations
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate random date between start and end (YYYY-MM-DD)
function randomDate(startYear: number, startMonth: number, endYear: number, endMonth: number, seed: number): string {
  const startDate = new Date(startYear, startMonth - 1, 1).getTime();
  const endDate = new Date(endYear, endMonth - 1, 28).getTime();
  const r = seededRandom(seed);
  const time = startDate + r * (endDate - startDate);
  const d = new Date(time);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(Math.min(28, d.getDate())).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Generate randomized realistic rating (mostly 5 and 4, occasional 3)
function randomRating(seed: number, isMasterpiece = false): number {
  if (isMasterpiece) {
    return seededRandom(seed) > 0.3 ? 5 : 4;
  }
  const r = seededRandom(seed);
  if (r > 0.45) return 5;
  if (r > 0.15) return 4;
  return 3;
}

export function computeBookUpdates(items: Array<{ id: string; title: string; genre?: string | null }>) {
  const updates: Array<{ id: string; title: string; readDate: string; rating: number }> = [];

  // Group books by chronological logic
  items.forEach((item, index) => {
    const t = item.title.toLowerCase();
    const g = (item.genre || '').toLowerCase();
    const seed = index * 37 + item.title.length * 13;

    let dateStr = '';
    let rating = 5;

    // 1. Russian books (Earliest: 2017 - 2019)
    if (
      t.includes('воскресение') ||
      t.includes('идиот') ||
      t.includes('космос') ||
      t.includes('russian tales') ||
      t.includes('сказки')
    ) {
      dateStr = randomDate(2017, 2, 2018, 12, seed);
      rating = randomRating(seed, true);
    }
    // 2. Harder Computing & Math (Closest to present: 2024 - 2026)
    else if (
      t.includes('data-intensive') ||
      t.includes('algorithms') ||
      t.includes('pragmatic programmer') ||
      t.includes('clean code') ||
      t.includes('everything is predictable') ||
      t.includes('art of uncertainty') ||
      t.includes('react server') ||
      t.includes('future of web') ||
      g.includes('technology')
    ) {
      dateStr = randomDate(2024, 6, 2026, 3, seed);
      rating = randomRating(seed, true);
    }
    // 3. Early Classics (Right after Russian: 2018 - 2021)
    else if (
      t.includes('war and peace') ||
      t.includes('crime and punishment') ||
      t.includes('fathers and sons') ||
      t.includes('dead souls') ||
      t.includes('faust') ||
      t.includes('the odyssey') ||
      t.includes('emma') ||
      t.includes('moby-dick') ||
      t.includes('the red and the black') ||
      t.includes('the man in the iron mask') ||
      t.includes('the well of loneliness') ||
      t.includes('for the term of his natural life') ||
      t.includes('arthur gordon pym') ||
      t.includes('the scarlet letter') ||
      t.includes('sherlock holmes') ||
      t.includes('dracula') ||
      t.includes('interpretation of dreams') ||
      g.includes('classics')
    ) {
      dateStr = randomDate(2018, 6, 2021, 10, seed);
      rating = randomRating(seed, false);
    }
    // 4. Modern classics, Sci-Fi, Society & Philosophy (2021 - 2024)
    else if (
      t.includes('sapiens') ||
      t.includes('genghis khan') ||
      t.includes('third reich') ||
      t.includes('gulag') ||
      t.includes('1984') ||
      t.includes('nineteen eighty-four') ||
      t.includes('handmaid') ||
      t.includes('hitchhiker') ||
      t.includes('cthulhu') ||
      t.includes('12 rules') ||
      t.includes('maps of meaning') ||
      t.includes('48 laws') ||
      t.includes('art of war') ||
      t.includes('to kill a mockingbird') ||
      t.includes('master and margarita') ||
      t.includes('slaughterhouse') ||
      t.includes('all quiet') ||
      t.includes('farewell to arms') ||
      t.includes('old man and the sea') ||
      t.includes('catcher in the rye') ||
      t.includes('one hundred years of solitude') ||
      t.includes('little prince') ||
      t.includes('lolita')
    ) {
      dateStr = randomDate(2021, 6, 2023, 12, seed);
      rating = randomRating(seed, true);
    }
    // 5. Contemporary Psychology, Memoirs, Science & Recent Books (2023 - 2025)
    else {
      dateStr = randomDate(2023, 1, 2025, 8, seed);
      rating = randomRating(seed, false);
    }

    updates.push({
      id: item.id,
      title: item.title,
      readDate: dateStr,
      rating,
    });
  });

  return updates;
}

async function updateDb(dbUrl: string, name: string) {
  const sql = neon(dbUrl);
  console.log(`Rebalancing dates and ratings for ${name}...`);

  const items = await sql`
    SELECT id, title, genre FROM reading_items
  ` as Array<{ id: string; title: string; genre: string | null }>;

  const updates = computeBookUpdates(items);

  for (const u of updates) {
    await sql`
      UPDATE reading_items
      SET read_date = ${u.readDate}, rating = ${u.rating}
      WHERE id = ${u.id}
    `;
  }

  console.log(`Successfully updated ${updates.length} items in ${name}.`);
  return updates;
}

async function main() {
  const devUrl = process.env.DATABASE_URL;
  if (!devUrl) {
    console.error('DATABASE_URL is missing in .env.local');
    process.exit(1);
  }

  const updates = await updateDb(devUrl, 'development branch');

  // Also update production branch
  const prodUrl = 'postgresql://neondb_owner:npg_FJjR3v0bhmCq@ep-fragrant-morning-a7iwwn5l-pooler.ap-southeast-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
  await updateDb(prodUrl, 'production branch');

  // Now update lib/shelf-data.ts with these dates and ratings
  const updateMap = new Map(updates.map(u => [u.title.toLowerCase(), u]));

  const shelfDataPath = 'lib/shelf-data.ts';
  if (fs.existsSync(shelfDataPath)) {
    let content = fs.readFileSync(shelfDataPath, 'utf8');

    for (const u of updates) {
      const escapedTitle = u.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // replace rating inside book object
      const patternRating = new RegExp(`(title:\\s*['"]${escapedTitle}['"][\\s\\S]*?rating:\\s*)([1-5])`, 'g');
      content = content.replace(patternRating, `$1${u.rating}`);
    }

    fs.writeFileSync(shelfDataPath, content, 'utf8');
    console.log('Updated ratings in lib/shelf-data.ts');
  }
}

if (process.argv[1] && process.argv[1].endsWith('rebalance-dates-ratings.ts')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
