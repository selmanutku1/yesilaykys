const fs = require('fs');
let code = fs.readFileSync('src/components/BungalowView.tsx', 'utf8');

const helperCode = `const analyzeBungalowRisks = (occupants: Participant[]): string[] => {
  if (occupants.length < 2) return [];

  const risks: string[] = [];
  
  // 1. Cinsiyet Uyumsuzluğu
  const genders = new Set(occupants.map(o => o.gender));
  if (genders.size > 1) {
    risks.push("Kritik Risk: Karşı cinsiyetten katılımcılar aynı odada bulunuyor!");
  }

  // 2. Yaş / Kategori Uyumsuzluğu (Minors vs Adults/Older)
  const categories = occupants.map(o => o.category).filter(Boolean) as string[];
  if (categories.length > 0) {
    const hasMinors = categories.some(c => c === 'İlkokul' || c === 'Ortaokul');
    const hasAdults = categories.some(c => c === 'Yetişkin' || c === 'Üniversite' || c === 'Şoför' || c === 'Kafile Sorumlusu');
    if (hasMinors && hasAdults) {
      // Check if the adult is their convoy leader
      const hasConvoyLeader = occupants.some(o => o.category === 'Kafile Sorumlusu' || o.isConvoyLeader);
      if (!hasConvoyLeader) {
         risks.push("Yaş/Kategori Riski: Küçük yaş grubu (İlkokul/Ortaokul) ile yetişkin/büyük yaş grubu aynı odada.");
      }
    }
  }

  // 3. Kafile (Grup) Uyumsuzluğu
  const convoys = new Set(occupants.map(o => o.convoyName).filter(Boolean));
  if (convoys.size > 1) {
    risks.push("Uyum Riski: Farklı kamp gruplarından/kafilelerden katılımcılar bir arada.");
  }

  return risks;
};

export default function BungalowView({`;

code = code.replace(/export default function BungalowView\(\{/, helperCode);
fs.writeFileSync('src/components/BungalowView.tsx', code);
