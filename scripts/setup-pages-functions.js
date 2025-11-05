const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const openNextDir = path.join(repoRoot, '.open-next');
const functionsDir = path.join(repoRoot, 'functions');
const workerFile = path.join(openNextDir, 'worker.js');
// Use catch-all route pattern for Pages Functions
const catchAllFile = path.join(functionsDir, '[[path]].js');

// Create functions directory at repository root if it doesn't exist
if (!fs.existsSync(functionsDir)) {
  fs.mkdirSync(functionsDir, { recursive: true });
  console.log('✅ Created functions directory at repository root');
}

// Create a wrapper function that imports from .open-next/worker.js
// This is needed because worker.js uses relative imports that only work
// when the file is in the .open-next directory
if (fs.existsSync(workerFile)) {
  // Read the original worker.js
  const workerContent = fs.readFileSync(workerFile, 'utf8');
  
  // Create a wrapper that imports from the correct location
  // The .open-next directory will be deployed alongside the functions
  const wrapperContent = `// Wrapper function for Cloudflare Pages Functions
// This imports the worker from .open-next where all the dependencies are located

// Calculate the path to .open-next relative to the functions directory
// In Cloudflare Pages, functions are at /functions and .open-next is at the root
const workerPath = '../.open-next/worker.js';

// Import and re-export the worker
import worker from workerPath;
export default worker;
`;

  // Actually, let's try a different approach - use dynamic import
  // But Cloudflare Functions need ES modules, so let's create a proper import
  const properWrapper = `// Cloudflare Pages Functions wrapper - catch-all route
// This file imports the worker from .open-next/worker.js
// The [[path]] pattern matches all routes

// Import the worker default export
import worker from '../.open-next/worker.js';

// Export it as the default handler for Pages Functions
export default worker;
`;

  fs.writeFileSync(catchAllFile, properWrapper);
  console.log('✅ Created functions/[[path]].js wrapper at repository root');
  
  // Verify it was created
  if (fs.existsSync(catchAllFile)) {
    console.log('✅ Verified functions/[[path]].js exists at repository root');
  } else {
    console.error('❌ Error: functions/[[path]].js was not created');
    process.exit(1);
  }
} else {
  console.error('❌ Error: .open-next/worker.js not found');
  console.error(`   Looking in: ${workerFile}`);
  process.exit(1);
}
