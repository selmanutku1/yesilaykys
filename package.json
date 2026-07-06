const fs = require('fs');
const file = 'src/components/DashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

// DashboardView replacements
content = content.replace(/bg-white/g, 'bg-white dark:bg-gray-800');
content = content.replace(/border-gray-100/g, 'border-gray-100 dark:border-gray-700');
content = content.replace(/text-gray-900/g, 'text-gray-900 dark:text-gray-100');
content = content.replace(/text-gray-500/g, 'text-gray-500 dark:text-gray-400');
content = content.replace(/text-gray-800/g, 'text-gray-800 dark:text-gray-200');
content = content.replace(/bg-gray-50/g, 'bg-gray-50 dark:bg-gray-800/50');
content = content.replace(/bg-emerald-50/g, 'bg-emerald-50 dark:bg-emerald-900/20');
content = content.replace(/bg-blue-50/g, 'bg-blue-50 dark:bg-blue-900/20');

fs.writeFileSync(file, content);
