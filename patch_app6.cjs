const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /'dijital-arsiv'\)\[\]/,
  `'dijital-arsiv' | 'olay-kayit')[]`
);

code = code.replace(
  /'sistem-loglari', 'dijital-arsiv'\]/,
  `'sistem-loglari', 'dijital-arsiv', 'olay-kayit']`
);
code = code.replace(
  /'dijital-arsiv'\]\n  },/g,
  `'dijital-arsiv', 'olay-kayit']\n  },`
);
code = code.replace(
  /'guvenlik', 'katilimci'\]/,
  `'guvenlik', 'katilimci', 'olay-kayit']`
);
code = code.replace(
  /'revir', 'katilimci'\]/,
  `'revir', 'katilimci', 'olay-kayit']`
);

fs.writeFileSync('src/App.tsx', code);
