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

// Extract the panel code
let panelCode = code.substring(startIndex, endIndex);

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

// Format the panel to match the indentation of the new parent (main container)
// It was indented with 12 spaces, new parent is 8 spaces
let formattedPanel = panelCode.split('\n').map(line => line.startsWith('    ') ? line.substring(4) : line).join('\n');

// Insert it
code = code.substring(0, insertIndex) + '\n\n' + formattedPanel + code.substring(insertIndex);

fs.writeFileSync('src/App.tsx', code);
console.log("Panel moved successfully!");
