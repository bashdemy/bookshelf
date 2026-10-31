import fs from 'fs';
import { GENRE_MAPPING } from './consolidate-genres';

for (const filePath of ['lib/shelf-data.ts', 'scripts/seed-shelf-books.ts']) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');

  for (const [title, cleanGenre] of Object.entries(GENRE_MAPPING)) {
    // Look for book block with this title and replace its genre
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(title:\\s*['"]${escapedTitle}['"][\\s\\S]*?genre:\\s*['"])([^'"]+)(['"])`, 'g');
    content = content.replace(pattern, `$1${cleanGenre}$3`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}
