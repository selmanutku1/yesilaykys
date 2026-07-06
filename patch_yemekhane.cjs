const fs = require('fs');
let code = fs.readFileSync('src/components/YemekhaneView.tsx', 'utf8');

// 1. Update activeTab type
code = code.replace(
  /const \[activeTab, setActiveTab\] = useState\<'gunluk' \| 'haftalik' \| 'depo' \| 'vardiya'\>\('gunluk'\);/,
  "const [activeTab, setActiveTab] = useState<'gunluk' | 'haftalik' | 'depo'>('gunluk');"
);

// 2. Remove Vardiya button
const buttonRegex = /\s*<button\n\s*onClick=\{\(\) => setActiveTab\('vardiya'\)\}[\s\S]*?Vardiya ve Görevlerim\n\s*<\/button>/;
code = code.replace(buttonRegex, '');

// 3. Remove Vardiya JSX block
const jsxRegex = /\n\s*\{activeTab === 'vardiya' && \([\s\S]*?\n\s*\)\}/;
code = code.replace(jsxRegex, '');

fs.writeFileSync('src/components/YemekhaneView.tsx', code);
