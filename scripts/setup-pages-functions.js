const fs = require('fs');
const path = require('path');

const openNextDir = path.join(__dirname, '..', '.open-next');
const functionsDir = path.join(openNextDir, 'functions');
const workerFile = path.join(openNextDir, 'worker.js');

// Create functions directory if it doesn't exist
if (!fs.existsSync(functionsDir)) {
  fs.mkdirSync(functionsDir, { recursive: true });
}

// Copy worker.js to functions/index.js
if (fs.existsSync(workerFile)) {
  const indexFile = path.join(functionsDir, 'index.js');
  fs.copyFileSync(workerFile, indexFile);
  console.log('✅ Created .open-next/functions/index.js');
  
  // Verify it was created
  if (fs.existsSync(indexFile)) {
    console.log('✅ Verified functions/index.js exists');
  } else {
    console.error('❌ Error: functions/index.js was not created');
    process.exit(1);
  }
} else {
  console.error('❌ Error: .open-next/worker.js not found');
  console.error(`   Looking in: ${workerFile}`);
  process.exit(1);
}

