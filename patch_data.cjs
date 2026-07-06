const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf8');

if (!code.includes('INITIAL_INCIDENTS')) {
  code = code.replace(
    /export const INITIAL_LOGS/,
    `import { CampIncident } from './types';\n\nexport const INITIAL_INCIDENTS: CampIncident[] = [\n  {\n    id: 'INC-001',\n    type: 'disiplin',\n    reporterId: 'S01',\n    reporterName: 'İnan BAYRAMOĞLU',\n    dateTime: '2026-06-16T15:30:00',\n    title: 'Kurallara Uymama',\n    description: 'Etkinlik saatinde kamp alanından izinsiz ayrılma girişimi.',\n    relatedParticipantId: 'P03',\n    actionTaken: 'Sözlü uyarı yapıldı.',\n    status: 'Çözüldü'\n  },\n  {\n    id: 'INC-002',\n    type: 'guvenlik',\n    reporterId: 'S11',\n    reporterName: 'Ahmet Güvenlik',\n    dateTime: '2026-06-17T22:15:00',\n    title: 'Çevre Çit Kontrolü',\n    description: 'Kuzey cephesindeki çitlerde hasar tespit edildi.',\n    actionTaken: 'Geçici önlem alındı, onarım talebi açıldı.',\n    status: 'Açık'\n  }\n];\n\nexport const INITIAL_LOGS`
  );
  fs.writeFileSync('src/data.ts', code);
}
