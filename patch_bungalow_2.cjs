const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /'sistem-loglari' | 'dijital-arsiv'>\('dashboard'\);/g,
  `'sistem-loglari' | 'dijital-arsiv' | 'olay-kayit'>('dashboard');`
);

code = code.replace(
  /'sistem-loglari' | 'dijital-arsiv'\) => \{/g,
  `'sistem-loglari' | 'dijital-arsiv' | 'olay-kayit') => {`
);

code = code.replace(
  /\| hasAccess\('ayarlar'\) \|\| hasAccess\('dijital-arsiv'\)\) && \(/,
  `| hasAccess('ayarlar') || hasAccess('dijital-arsiv') || hasAccess('olay-kayit')) && (`
);

fs.writeFileSync('src/App.tsx', code);
