const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /INITIAL_LOGS,/,
  `INITIAL_LOGS,\n  INITIAL_INCIDENTS,`
);

code = code.replace(
  /const \[logs, setLogs\] = useState<SystemLog\[\]>\(INITIAL_LOGS\);/,
  `const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);\n  const [incidents, setIncidents] = useState<CampIncident[]>(INITIAL_INCIDENTS);`
);

fs.writeFileSync('src/App.tsx', code);
