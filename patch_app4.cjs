const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /import DijitalArsivView from '\.\/components\/DijitalArsivView';/,
  `import DijitalArsivView from './components/DijitalArsivView';\nimport IncidentLogsView from './components/IncidentLogsView';`
);

code = code.replace(
  /  BookText,\n  Video,/g,
  `  BookText,\n  Video,\n  AlertOctagon,`
);

fs.writeFileSync('src/App.tsx', code);
