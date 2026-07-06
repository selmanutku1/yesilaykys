const fs = require('fs');
let code = fs.readFileSync('src/components/BungalowView.tsx', 'utf8');

code = code.replace(
  /onClick=\{handleAutoAllocate\}/g,
  `onClick={() => setShowSmartAllocationModal(true)}`
);

fs.writeFileSync('src/components/BungalowView.tsx', code);
