const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /  Building2,/,
  `  Building2,\n  AlertOctagon,`
);

fs.writeFileSync('src/App.tsx', code);
