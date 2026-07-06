const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('export interface CampIncident')) {
  code = code.replace(
    /export interface SystemLog/,
    `export interface CampIncident {
  id: string;
  type: 'disiplin' | 'saglik' | 'guvenlik';
  reporterId: string;
  reporterName: string;
  dateTime: string;
  title: string;
  description: string;
  relatedParticipantId?: string;
  actionTaken: string;
  status: 'Açık' | 'Çözüldü' | 'Sevk Edildi';
}

export interface SystemLog`
  );
  fs.writeFileSync('src/types.ts', code);
}
