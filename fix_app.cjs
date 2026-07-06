const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /allowedTabs: \('dashboard' \| 'bungalov' \| 'katilimci' \| 'kayit' \| 'revir' \| 'yemekhane' \| 'teknik' \| 'guvenlik' \| 'dokümanlar' \| 'ayarlar' \| 'maliyet' \| 'anket-analizi' \| 'sistem-loglari' \| 'dijital-arsiv' \| 'olay-kayit'\) => \{\| 'dijital-arsiv' \| 'olay-kayit'\>\('dashboard'\);\| 'dijital-arsiv' \| 'olay-kayit'\)\[\];/,
  "allowedTabs: ('dashboard' | 'bungalov' | 'katilimci' | 'kayit' | 'revir' | 'yemekhane' | 'teknik' | 'guvenlik' | 'dokümanlar' | 'ayarlar' | 'maliyet' | 'anket-analizi' | 'sistem-loglari' | 'dijital-arsiv' | 'olay-kayit')[];"
);

code = code.replace(
  /useState<'dashboard' \| 'bungalov' \| 'katilimci' \| 'kayit' \| 'revir' \| 'yemekhane' \| 'teknik' \| 'guvenlik' \| 'dokümanlar' \| 'ayarlar' \| 'maliyet' \| 'anket-analizi' \| 'sistem-loglari' \| 'dijital-arsiv' \| 'olay-kayit'\) => \{\| 'dijital-arsiv' \| 'olay-kayit'\>\('dashboard'\);\|'sistem-loglari' \| 'dijital-arsiv' \| 'olay-kayit'\) => \{\| 'dijital-arsiv' \| 'olay-kayit'\>\('dashboard'\);/,
  "useState<'dashboard' | 'bungalov' | 'katilimci' | 'kayit' | 'revir' | 'yemekhane' | 'teknik' | 'guvenlik' | 'dokümanlar' | 'ayarlar' | 'maliyet' | 'anket-analizi' | 'sistem-loglari' | 'dijital-arsiv' | 'olay-kayit'>('dashboard');"
);

fs.writeFileSync('src/App.tsx', code);
