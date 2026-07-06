const fs = require('fs');
let code = fs.readFileSync('src/components/BungalowView.tsx', 'utf8');
code = code.replace(/Lock,\s*,/g, "Lock,");
fs.writeFileSync('src/components/BungalowView.tsx', code);
