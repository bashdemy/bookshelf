const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const openNextDir = path.join(repoRoot, '.open-next');
const functionsDir = path.join(repoRoot, 'functions'); // Repository root, not .open-next
const workerFile = path.join(openNextDir, 'worker.js');
const indexFile = path.join(functionsDir, 'index.js');

// Create functions directory at repository root if it doesn't exist
if (!fs.existsSync(functionsDir)) {
  fs.mkdirSync(functionsDir, { recursive: true });
  console.log('✅ Created functions directory at repository root');
}

// Copy worker.js to functions/index.js at repository root
if (fs.existsSync(workerFile)) {
  fs.copyFileSync(workerFile, indexFile);
  console.log('✅ Created functions/index.js at repository root');
  
  // Verify it was created
  if (fs.existsSync(indexFile)) {
    console.log('✅ Verified functions/index.js exists at repository root');
  } else {
    console.error('❌ Error: functions/index.js was not created');
    process.exit(1);
  }
} else {
  console.error('❌ Error: .open-next/worker.js not found');
  console.error(`   Looking in: ${workerFile}`);
  process.exit(1);
}

