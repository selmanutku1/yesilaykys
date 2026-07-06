const fs = require('fs');
let code = fs.readFileSync('src/components/BungalowView.tsx', 'utf8');

const strToFind = `  const [printPageBreak, setPrintPageBreak] = useState(false);`;
const replacement = `  const [printPageBreak, setPrintPageBreak] = useState(false);

  // Smart Allocation Wizard
  const [showSmartAllocationModal, setShowSmartAllocationModal] = useState(false);
  const [smartRules, setSmartRules] = useState({
    groupTogether: true, // Aynı kamp grubundakiler beraber kalsın
    schoolTogether: false, // Aynı okuldan/şehirden gelenler birlikte kalsın
    noiseSensitivity: false, // Gürültü hassasiyeti olanlar ayrı yerleştirilsin
    separatePrevious: false, // Daha önce birlikte kalanları dağıt
    mixExperience: false, // İlk kez gelenler deneyimlilerle eşleşsin
  });
  const [isAllocating, setIsAllocating] = useState(false);`;

code = code.replace(strToFind, replacement);
fs.writeFileSync('src/components/BungalowView.tsx', code);
