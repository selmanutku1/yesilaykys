const fs = require('fs');
let code = fs.readFileSync('src/components/BungalowView.tsx', 'utf8');
code = code.replace("Lock,, AlertTriangle", "Lock, AlertTriangle");
fs.writeFileSync('src/components/BungalowView.tsx', code);
