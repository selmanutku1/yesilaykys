const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /  ShiftAssignment/,
  `  ShiftAssignment,\n  CampIncident`
);

fs.writeFileSync('src/App.tsx', code);
