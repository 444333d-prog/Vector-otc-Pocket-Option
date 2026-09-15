const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startMarker = `            {/* Asset Configuration Panel */}`;
const endMarker = `            </div>\n\n            {/* Trading Canvas Real-time Chart Display */}`;

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(`            {/* Trading Canvas Real-time Chart Display */}`);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found");
  process.exit(1);
}

// Find the exact end of the panel (the closing div before Trading Canvas)
const panelCode = code.substring(startIndex, endIndex);

// Remove the panel from its original position
code = code.substring(0, startIndex) + code.substring(endIndex);

// Find insertion point (after SignalsFeed)
const insertMarker = `        <SignalsFeed
          signals={signals}
          completedHistory={completedHistory}
          onClearHistory={() => setCompletedHistory([])}
        />`;

const insertIndex = code.indexOf(insertMarker) + insertMarker.length;

if (insertIndex === -1 + insertMarker.length) {
  console.error("Insert marker not found");
  process.exit(1);
}

// Format the panel a bit to align with its new parent (shift left by 4 spaces)
let formattedPanel = panelCode.split('\n').map(line => line.startsWith('    ') ? line.substring(4) : line).join('\n');

// Insert it
code = code.substring(0, insertIndex) + '\n\n        ' + formattedPanel.trim() + '\n' + code.substring(insertIndex);

fs.writeFileSync('src/App.tsx', code);
console.log("Panel moved successfully!");
