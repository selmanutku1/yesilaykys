/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Participant, Group } from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  FileCheck, 
  Award, 
  Heart, 
  UserSquare2, 
  X,
  FileSpreadsheet,
  TrendingUp,
  Printer,
  FileDown,
  Mail,
  MessageSquare,
  Send,
  Smartphone,
  UserPlus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { exportToWord, exportToPdf } from '../utils/formExporter';

interface ParticipantViewProps {
  participants: Participant[];
  groups: Group[];
  onUpdateParticipants: (updated: Participant[]) => void;
  onAddLog: (action: string, details: string) => void;
}

export default function ParticipantView({
  participants,
  groups,
  onUpdateParticipants,
  onAddLog,
}: ParticipantViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [evaluationScore, setEvaluationScore] = useState<number>(85);
  const [evaluationNotes, setEvaluationNotes] = useState<string>('');

  // SMS & E-posta Bilgilendirme States
  const [notifyMethod, setNotifyMethod] = useState<'both' | 'sms' | 'email'>('both');
  const [notifyTemplate, setNotifyTemplate] = useState<string>('welcome');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isListOpen, setIsListOpen] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(true);

  const getTemplateText = (templateKey: string, name: string) => {
    switch (templateKey) {
      case 'welcome':
        return `Sayın Velimiz, ${name} isimli gönüllümüzün Yeşilay Kamp Katılım başvurusu onaylanmıştır. Kampa katılım için gerekli evrakları ve eşyaları getirmeyi unutmayınız. İyi günler dileriz.`;
      case 'incident':
        return `Değerli Velimiz, ${name} isimli gönüllümüz kamp süresince hafif bir sağlık durumundan dolayı kamp revirimizde kontrole alınmıştır. Genel durumu iyidir, müdahale yapılmıştır.`;
      case 'general':
        return `Kıymetli Yeşilay Gönüllüsü, ${name} isimli katılımcımızın bulunduğu kamp dönemi başarıyla devam etmektedir. Günlük fotoğraflar ve duyurular için mobil uygulamamızı takip edebilirsiniz.`;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (selectedParticipant) {
      setCustomMessage(getTemplateText(notifyTemplate, selectedParticipant.name));
    }
  }, [selectedParticipantId, notifyTemplate]);

  const handleSendNotification = () => {
    if (!selectedParticipant) return;
    if (!customMessage.trim()) {
      alert("Lütfen göndermek üzere bir bilgilendirme mesajı yazın.");
      return;
    }

    const destinations: string[] = [];
    if (notifyMethod === 'both' || notifyMethod === 'sms') {
      destinations.push(`SMS (${selectedParticipant.phone || 'Gsm Yok'})`);
    }
    if (notifyMethod === 'both' || notifyMethod === 'email') {
      destinations.push(`E-Posta (${selectedParticipant.email || 'Mail Yok'})`);
    }

    onAddLog(
      'Bilgilendirme Gönderildi',
      `'${selectedParticipant.name}' velisine ${destinations.join(' ve ')} kanalı üzerinden mesaj iletildi: "${customMessage}"`
    );

    alert(`Başarılı: Bilgilendirme mesajı ${destinations.join(' ve ')} üzerinden başarıyla gönderildi ve arşive loglandı.`);
  };

  const handleAdd100Participants = () => {
    const boyNames = ['Ahmet', 'Mehmet', 'Can', 'Ali', 'Mustafa', 'Ömer', 'Yusuf', 'Selim', 'Kerem', 'Arda', 'Ege', 'Barış', 'Sarp', 'Yiğit', 'Emre', 'Burak', 'Hakan', 'Gökhan', 'Fatih', 'Alper', 'Kaan', 'Batuhan', 'Umut', 'Tuna', 'Mert', 'Görkem', 'Serkan', 'Bora', 'Oğuz', 'Deniz'];
    const girlNames = ['Zeynep', 'Elif', 'Defne', 'Eylül', 'Ayşe', 'Fatma', 'Merve', 'Selin', 'Duru', 'Yağmur', 'Ada', 'Beren', 'Melis', 'İpek', 'Aslı', 'Hazal', 'Ceren', 'Büşra', 'Sude', 'Sena', 'Gamze', 'Derya', 'Buse', 'Ebru', 'İrem', 'Ceyda', 'Pelin', 'Seda', 'Damla', 'Ece'];
    const lastNames = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şen', 'Bulut', 'Yalçın', 'Güler', 'Köse', 'Polat', 'Yiğit', 'Avcı', 'Aksoy', 'Özcan', 'Sarı'];

    const newGenerated: Participant[] = [];
    const baseId = Date.now();

    for (let i = 0; i < 100; i++) {
      const isBoy = Math.random() > 0.5;
      const gender: 'Erkek' | 'Kız' = isBoy ? 'Erkek' : 'Kız';
      const firstName = isBoy 
        ? boyNames[Math.floor(Math.random() * boyNames.length)] 
        : girlNames[Math.floor(Math.random() * girlNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;

      // Simulate 11-digit Turkish National Identity Number
      const idPrefix = Math.floor(100000000 + Math.random() * 900000000).toString();
      const tcNumber = `${idPrefix}${Math.floor(10 + Math.random() * 90)}`;

      // Simulate birth year between 2009 and 2016 (age 10-17 as of 2026)
      const bYear = Math.floor(2009 + Math.random() * 8);
      const bMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
      const bDay = String(Math.floor(1 + Math.random() * 28)).padStart(2, '0');
      const birthDate = `${bYear}-${bMonth}-${bDay}`;

      // Simulate mobile phone number
      const phoneOperators = ['0532', '0544', '0555', '0505', '0535', '0542'];
      const op = phoneOperators[Math.floor(Math.random() * phoneOperators.length)];
      const phoneDigits = Math.floor(1000000 + Math.random() * 9000000).toString();
      const phone = `${op} ${phoneDigits.substring(0, 3)} ${phoneDigits.substring(3, 5)} ${phoneDigits.substring(5)}`;

      // Simulate email address
      const turkishCharsMap: { [key: string]: string } = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
      const makeEmailFriendly = (str: string) => {
        return str.toLowerCase().split('').map(char => turkishCharsMap[char] || char).join('').replace(/\s+/g, '');
      };
      const email = `${makeEmailFriendly(firstName)}.${makeEmailFriendly(lastName)}@gmail.com`;

      // Some health variety
      const healthRnd = Math.random();
      let allergies = 'Yok';
      let chronicDiseases = 'Yok';
      let medications = 'Yok';
      let healthNote = '';

      if (healthRnd < 0.08) {
        allergies = 'Gluten Alerjisi';
        healthNote = 'Glütensiz yemek porsiyonu hazırlanmalıdır.';
      } else if (healthRnd < 0.15) {
        allergies = 'Laktoz Hassasiyeti';
        healthNote = 'Laktozsuz süt ürünleri veya muafiyet menüsü verilmeli.';
      } else if (healthRnd < 0.18) {
        allergies = 'Polen ve Çilek Alerjisi';
      }

      const diseaseRnd = Math.random();
      if (diseaseRnd < 0.05) {
        chronicDiseases = 'Astım';
        healthNote += (healthNote ? ' | ' : '') + 'Nefes darlığı durumunda fısfısları kontrol edilmeli.';
      } else if (diseaseRnd < 0.08) {
        chronicDiseases = 'Tip 1 Diyabet';
        healthNote += (healthNote ? ' | ' : '') + 'Şeker ölçüm takibi yapılmalıdır.';
      }

      const age = 2026 - bYear;
      let genCategory: 'İlkokul' | 'Ortaokul' | 'Lise' | 'Üniversite' | 'Yetişkin' | 'Kafile Sorumlusu' | 'Şoför' = 'Lise';
      if (age <= 10) genCategory = 'İlkokul';
      else if (age <= 13) genCategory = 'Ortaokul';
      else if (age <= 17) genCategory = 'Lise';
      else genCategory = 'Üniversite';

      // Assign adult / supervisor role to some
      const roleRnd = Math.random();
      if (roleRnd < 0.02) genCategory = 'Kafile Sorumlusu';
      else if (roleRnd < 0.04) genCategory = 'Şoför';
      else if (roleRnd < 0.06) genCategory = 'Yetişkin';

      newGenerated.push({
        id: `PT-${baseId}-${i}`,
        name: fullName,
        identityNumber: tcNumber,
        birthDate: birthDate,
        gender: gender,
        category: genCategory,
        phone: phone,
        email: email,
        status: 'Başvuru Yapıldı', // "deftere ekle ama yerleşim yapma" -> unassigned in groups/beds/bungalows!
        bungalowId: null,
        bedNumber: null,
        groupId: null,
        allergies: allergies,
        chronicDiseases: chronicDiseases,
        medications: medications,
        healthNote: healthNote,
        consentReceived: true,
        kvkkSigned: true,
        checkedIn: false
      });
    }

    const updated = [...participants, ...newGenerated];
    onUpdateParticipants(updated);
    onAddLog(
      'Toplu Katılımcı Oluşturma',
      `Sistem simülasyon testi için karışık cinsiyetlerde temsili 100 yerleşimsiz yeni aday katılımcı başarıyla deftere eklendi.`
    );
    alert('Temsili 100 katılımcı (karışık cinsiyette ve tamamen yerleşimsiz) başarıyla oluşturuldu ve deftere eklendi!');
  };

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.identityNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesGender = genderFilter === 'All' || p.gender === genderFilter;
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesGender && matchesCategory;
  });

  const selectedParticipant = participants.find((p) => p.id === selectedParticipantId);

  const participantGroup = useMemo(() => {
    if (!selectedParticipant || !selectedParticipant.groupId) return null;
    return groups.find(g => g.id === selectedParticipant.groupId);
  }, [selectedParticipant, groups]);

  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [showPrintWarning, setShowPrintWarning] = useState(false);

  const handlePrintBadge = (p: Participant, groupName: string, groupColor: string) => {
    if (window.self !== window.top) {
      setShowPrintWarning(true);
      return;
    }

    const printWindow = window.open('', '_blank', 'width=450,height=650');
    if (!printWindow) {
      return;
    }
    
    const badgeHtml = `
      <html>
        <head>
          <title>Yeşilay Kamp Katılım Kartı - ${p.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .badge-card {
              width: 320px;
              height: 500px;
              border: 3px solid #00AB41;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              display: flex;
              flex-direction: column;
              position: relative;
              box-sizing: border-box;
              background-color: #ffffff;
            }
            .badge-header {
              background-color: #0B3B24;
              color: #ffffff;
              padding: 15px;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              border-bottom: 4px solid #00AB41;
            }
            .badge-header svg {
              width: 28px;
              height: 28px;
            }
            .badge-header-text {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            }
            .badge-header-title {
              font-size: 13px;
              font-weight: 900;
              letter-spacing: 0.1em;
            }
            .badge-header-subtitle {
              font-size: 8px;
              font-weight: 700;
              color: #00AB41;
              letter-spacing: 0.2em;
              margin-top: 2px;
            }
            .badge-body {
              flex: 1;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              text-align: center;
            }
            .avatar-container {
              width: 90px;
              height: 90px;
              border-radius: 50%;
              background-color: #f0fdf4;
              border: 3px solid #00AB41;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
              font-weight: 800;
              color: #0B3B24;
              margin-top: 5px;
            }
            .participant-name {
              font-size: 18px;
              font-weight: 900;
              color: #0B3B24;
              margin: 10px 0 2px 0;
              text-transform: uppercase;
            }
            .participant-role {
              font-size: 10px;
              font-weight: 800;
              color: #00AB41;
              background-color: #e6f9ed;
              padding: 4px 12px;
              border-radius: 12px;
              letter-spacing: 0.05em;
              margin-bottom: 12px;
            }
            .info-grid {
              width: 100%;
              display: grid;
              grid-template-columns: 1fr;
              gap: 8px;
              margin-bottom: 12px;
            }
            .info-row {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              padding: 8px 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
              font-weight: 700;
            }
            .info-label {
              color: #64748b;
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .info-value {
              color: #0f172a;
            }
            .group-indicator {
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .group-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
            }
            .allergy-alert {
              width: 100%;
              background-color: #fef2f2;
              border: 1px solid #fee2e2;
              border-radius: 10px;
              padding: 8px;
              color: #991b1b;
              font-size: 10px;
              font-weight: 700;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
            }
            .badge-footer {
              padding: 10px 20px;
              background-color: #f8fafc;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 50px;
              box-sizing: border-box;
            }
            .badge-seals {
              display: flex;
              gap: 5px;
            }
            .seal-pill {
              font-size: 8px;
              font-weight: 800;
              color: #15803d;
              background-color: #dcfce7;
              padding: 2px 6px;
              border-radius: 4px;
              text-transform: uppercase;
            }
            .barcode-svg {
              height: 30px;
              width: 100px;
            }
          </style>
        </head>
        <body>
          <div class="badge-card">
            <div class="badge-header">
              <svg viewBox="0 0 100 100">
                <path d="M52,15 A35,35 0 1,0 85,68 A28,28 0 1,1 85,32 A35,35 0 0,0 52,15 Z" fill="#00AB41" />
              </svg>
              <div class="badge-header-text">
                <span class="badge-header-title">YEŞİLAY GENÇLİK KAMPI</span>
                <span class="badge-header-subtitle">KAMP KATILIM KARTI</span>
              </div>
            </div>
            
            <div class="badge-body">
              <div class="avatar-container">
                ${p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              
              <div>
                <div class="participant-name">${p.name}</div>
                <span class="participant-role">${p.category ? `${p.category} ${['İlkokul', 'Ortaokul', 'Lise', 'Üniversite'].includes(p.category) ? 'ÖĞRENCİSİ' : ''}`.toUpperCase() : 'KATILIMCI GÖNÜLLÜ'}</span>
              </div>
              
              <div class="info-grid">
                <div class="info-row">
                  <span class="info-label">Grup Adı</span>
                  <span class="info-value group-indicator">
                    <span class="group-dot" style="background-color: ${groupColor}"></span>
                    ${groupName}
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Konaklama / Bungalov</span>
                  <span class="info-value">${p.bungalowId ? `${p.bungalowId} - Yatak ${p.bedNumber}` : 'Oda Atanmadı'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Kimlik / TC</span>
                  <span class="info-value" style="font-family: monospace;">${p.identityNumber.slice(0, 3)}******${p.identityNumber.slice(-2)}</span>
                </div>
              </div>
            </div>
            
            <div class="badge-footer">
              <div class="badge-seals">
                <span class="seal-pill">KVKK ONAM</span>
                <span class="seal-pill">MUVAFFAKAT</span>
              </div>
              <!-- Mini Barcode SVG -->
              <svg class="barcode-svg" viewBox="0 0 100 30">
                <rect x="0" y="2" width="2" height="26" fill="#000" />
                <rect x="4" y="2" width="1" height="26" fill="#000" />
                <rect x="7" y="2" width="3" height="26" fill="#000" />
                <rect x="12" y="2" width="1" height="26" fill="#000" />
                <rect x="15" y="2" width="2" height="26" fill="#000" />
                <rect x="19" y="2" width="4" height="26" fill="#000" />
                <rect x="25" y="2" width="1" height="26" fill="#000" />
                <rect x="28" y="2" width="2" height="26" fill="#000" />
                <rect x="32" y="2" width="1" height="26" fill="#000" />
                <rect x="35" y="2" width="3" height="26" fill="#000" />
                <rect x="40" y="2" width="2" height="26" fill="#000" />
                <rect x="44" y="2" width="1" height="26" fill="#000" />
                <rect x="47" y="2" width="4" height="26" fill="#000" />
                <rect x="53" y="2" width="1" height="26" fill="#000" />
                <rect x="56" y="2" width="2" height="26" fill="#000" />
                <rect x="60" y="2" width="3" height="26" fill="#000" />
                <rect x="65" y="2" width="1" height="26" fill="#000" />
                <rect x="68" y="2" width="4" height="26" fill="#000" />
                <rect x="74" y="2" width="2" height="26" fill="#000" />
                <rect x="78" y="2" width="1" height="26" fill="#000" />
                <rect x="81" y="2" width="3" height="26" fill="#000" />
                <rect x="86" y="2" width="2" height="26" fill="#000" />
                <rect x="90" y="2" width="4" height="26" fill="#000" />
                <rect x="96" y="2" width="2" height="26" fill="#000" />
              </svg>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(badgeHtml);
    printWindow.document.close();
  };

  const handleGenerateCertificate = (pId: string) => {
    const updated = participants.map((p) => {
      if (p.id === pId) {
        return { ...p, certificateId: `YEK-CERT-2026-${p.id}` };
      }
      return p;
    });

    onUpdateParticipants(updated);
    onAddLog('Sertifika Basımı', `${selectedParticipant?.name} için dijital Katılım Sertifikası üretildi.`);
    alert('Katılım belgesi başarıyla oluşturuldu! Katılımcı mobil uygulamasından görüntüleyebilir.');
  };

  return (
    <div className="space-y-6" id="participants-panel-root">
      {/* Upper bar filter */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-sans">
              <Users className="w-5 h-5 text-emerald-600" />
              Katılımcı Yönetimi &amp; Defteri
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Kampta kayıtlı gönüllülerin evrakları, sağlık durumu ve eğitmen değerlendirmeleri.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd100Participants}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 font-black text-2xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer shadow-2xs shrink-0 self-stretch sm:self-auto justify-center"
            title="Sisteme test amaçlı karışık cinsiyetlerde 100 yerleşimsiz temsili katılımcı ekler."
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
            Temsili 100 Katılımcı Ekle
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="İsim veya T.C. Kimlik No ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-250 rounded-lg text-xs w-full focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 border border-gray-250 rounded-lg text-2xs w-full focus:outline-none focus:border-emerald-600"
            >
              <option value="All">Tüm Durumlar</option>
              <option value="Kampta">Kampta Aktif</option>
              <option value="Onaylandı">Onaylandı (Giriş Bekliyor)</option>
              <option value="Başvuru Yapıldı">Başvuru Yapıldı</option>
              <option value="Yedek Listede">Yedek Listede</option>
              <option value="Ayrıldı">Ayrıldı</option>
            </select>
          </div>

          <div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="py-2 border border-gray-250 rounded-lg text-2xs w-full focus:outline-none focus:border-emerald-600"
            >
              <option value="All">Tüm Cinsiyetler</option>
              <option value="Erkek">Erkek</option>
              <option value="Kız">Kız</option>
            </select>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 border border-gray-250 rounded-lg text-2xs w-full focus:outline-none focus:border-emerald-600 font-medium"
            >
              <option value="All">Tüm Kategoriler</option>
              <option value="İlkokul">Öğrenci: İlkokul</option>
              <option value="Ortaokul">Öğrenci: Ortaokul</option>
              <option value="Lise">Öğrenci: Lise</option>
              <option value="Üniversite">Öğrenci: Üniversite</option>
              <option value="Yetişkin">Yetişkin</option>
              <option value="Kafile Sorumlusu">Kafile Sorumlusu</option>
              <option value="Şoför">Şoför</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------
          Collapsible Accordion Panels for Participant View
         --------------------------------------------------------- */}
      <div className="space-y-5">
        
        {/* Accordion 1: Participant Ledger & Search Directory */}
        <div id="participant-acc-list" className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden">
          <div 
            onClick={() => setIsListOpen(!isListOpen)}
            className="flex justify-between items-center p-4 bg-gray-50/75 hover:bg-gray-50 cursor-pointer select-none transition duration-150"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
                <Users className="w-4 h-4 text-emerald-600" />
              </span>
              <div>
                <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block">Katılımcı Kayıt Defteri ({filteredParticipants.length} Kişi)</span>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5 normal-case font-sans">Kampta kayıtlı tüm gönüllülerin, şoförlerin ve liderlerin listesi.</p>
              </div>
            </div>
            <button type="button" className="text-gray-400 hover:text-emerald-700 p-1">
              {isListOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {isListOpen && (
            <div className="p-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="overflow-x-auto border border-gray-150 rounded-xl bg-white shadow-3xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-150">
                  <th className="p-3">Katılımcı / T.C. No</th>
                  <th className="p-3">Yaş &amp; Cinsiyet</th>
                  <th className="p-3">Muvafakat / KVKK</th>
                  <th className="p-3">Bungalov / Yatak</th>
                  <th className="p-3 text-center">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredParticipants.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => {
                      setSelectedParticipantId(p.id);
                      setEvaluationScore(p.performanceScore || 85);
                      setEvaluationNotes('');
                    }}
                    className={`hover:bg-gray-50/70 cursor-pointer transition-colors ${
                      selectedParticipantId === p.id ? 'bg-emerald-50/30' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div>
                        <p className="font-extrabold text-gray-900">{p.name}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-3xs text-gray-400 font-mono">ID: {p.id} | TC: {p.identityNumber.slice(0, 3)}****</span>
                          {p.category && (
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[9px] font-black leading-none">
                              {p.category} {['İlkokul', 'Ortaokul', 'Lise', 'Üniversite'].includes(p.category) ? 'Öğrencisi' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-semibold text-gray-700 capitalize">{p.gender}</p>
                        <p className="text-3xs text-gray-400 font-mono">
                          {new Date().getFullYear() - new Date(p.birthDate).getFullYear()} Yaş ({new Date(p.birthDate).toLocaleDateString()})
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-0.5 ${
                            p.consentReceived ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                          title="Katılım Taahhütnamesi İmzalı"
                        >
                          <FileCheck className="w-3 h-3" /> TAAH
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-0.5 ${
                            p.kvkkSigned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                          title="KVKK Onam Metni İmzalı"
                        >
                          <CheckCircle className="w-3 h-3" /> KVKK
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-mono">
                      {p.bungalowId ? (
                        <div className="text-xs text-gray-800">
                          <span className="font-extrabold text-emerald-800">{p.bungalowId}</span>
                          <span className="text-3xs font-semibold text-gray-400 ml-1">B.{p.bedNumber}</span>
                        </div>
                      ) : (
                        <span className="text-3xs text-gray-400 italic">Oda Atanmamış</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-[10px] font-extrabold ${
                          p.status === 'Kampta'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'Onaylandı'
                            ? 'bg-blue-100 text-blue-800'
                            : p.status === 'Yedek Listede'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-150 text-gray-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </div>

        {/* Accordion 2: Selected Participant Detail & Evaluation */}
        <div id="participant-acc-detail" className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden">
          <div 
            onClick={() => setIsDetailOpen(!isDetailOpen)}
            className="flex justify-between items-center p-4 bg-gray-50/75 hover:bg-gray-50 cursor-pointer select-none transition duration-150"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
                <Award className="w-4 h-4 text-emerald-600" />
              </span>
              <div>
                <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block">
                  {selectedParticipant ? `${selectedParticipant.name} - Detaylı Profil Kartı` : 'Detaylı Katılımcı Kartı & Değerlendirme'}
                </span>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5 normal-case font-sans">
                  {selectedParticipant ? `${selectedParticipant.category} kategorisindeki katılımcının evrak, sağlık, bilgilendirme ve lider puan kartı.` : 'Evrak durumu, sağlık bildirimleri, veli bilgilendirme ve lider gelişim puanlaması.'}
                </p>
              </div>
            </div>
            <button type="button" className="text-gray-400 hover:text-emerald-700 p-1">
              {isDetailOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {isDetailOpen && (
            <div className="p-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-150">
              {selectedParticipant ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="participant-detail-grid">
                  
                  {/* Column 1: Core Information */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b pb-3 border-gray-150">
                      <div className="flex items-center gap-2">
                        <UserSquare2 className="w-10 h-10 text-emerald-700" />
                        <div>
                          <h3 className="text-base font-bold text-gray-900">{selectedParticipant.name}</h3>
                          <p className="text-3xs text-gray-500 font-semibold font-mono">T.C.: {selectedParticipant.identityNumber}</p>
                          {selectedParticipant.category && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase">
                              {selectedParticipant.category} {['İlkokul', 'Ortaokul', 'Lise', 'Üniversite'].includes(selectedParticipant.category) ? 'Öğrencisi' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedParticipantId(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* İletişim Bilgileri */}
                    <div className="space-y-1 bg-gray-50 p-3 rounded-lg text-2xs">
                      <span className="font-bold text-gray-400 block uppercase tracking-wider text-[9px] mb-1">Katılımcı İletişim Bilgileri</span>
                      <p><strong>İrtibat Tel:</strong> {selectedParticipant.phone || 'Belirtilmedi'}</p>
                      <p><strong>E-posta:</strong> {selectedParticipant.email || 'Belirtilmedi'}</p>
                    </div>

                    {/* Sağlık Kartı */}
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px] flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        Revir &amp; Sağlık Kartı Bilgileri
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-2xs">
                        <div className="p-2 border rounded border-gray-100 bg-red-50/5">
                          <span className="font-bold text-gray-600 block">Şiddetli Alerjiler:</span>
                          <span className="text-gray-700 leading-tight block">{selectedParticipant.allergies}</span>
                        </div>
                        <div className="p-2 border rounded border-gray-100">
                          <span className="font-bold text-gray-600 block">Kronik Hastalıklar / İlaçlar:</span>
                          <span className="text-gray-700 leading-tight block">
                            {selectedParticipant.chronicDiseases} {selectedParticipant.medications ? `| İlaçlar: ${selectedParticipant.medications}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Notification & Velileri Bilgilendirme */}
                  <div className="space-y-4 md:border-l md:border-gray-100 md:pl-6">
                    <span className="font-bold text-gray-400 block uppercase tracking-wider text-[9px]">Katılımcı / Velileri Bilgilendirme</span>
                    
                    <div className="space-y-2.5 p-3.5 bg-blue-50/20 border border-blue-100 rounded-lg text-3xs font-semibold">
                      
                      {/* Channel selection */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase font-black block">Bilgilendirme Kanalı</label>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() => setNotifyMethod('both')}
                            className={`py-1 rounded border font-black transition cursor-pointer text-center ${
                              notifyMethod === 'both' ? 'border-blue-600 bg-blue-100/45 text-blue-900' : 'border-gray-150 hover:border-gray-200 text-gray-500'
                            }`}
                          >
                            Her İkisi
                          </button>
                          <button
                            type="button"
                            onClick={() => setNotifyMethod('sms')}
                            className={`py-1 rounded border font-black transition cursor-pointer text-center ${
                              notifyMethod === 'sms' ? 'border-blue-600 bg-blue-100/45 text-blue-900' : 'border-gray-150 hover:border-gray-200 text-gray-500'
                            }`}
                          >
                            Sadece SMS
                          </button>
                          <button
                            type="button"
                            onClick={() => setNotifyMethod('email')}
                            className={`py-1 rounded border font-black transition cursor-pointer text-center ${
                              notifyMethod === 'email' ? 'border-blue-600 bg-blue-100/45 text-blue-900' : 'border-gray-150 hover:border-gray-200 text-gray-500'
                            }`}
                          >
                            Sadece Mail
                          </button>
                        </div>
                      </div>

                      {/* Template selection */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase font-black block">Şablon Seçimi</label>
                        <select
                          value={notifyTemplate}
                          onChange={(e) => setNotifyTemplate(e.target.value)}
                          className="w-full border border-gray-200 rounded p-1.5 focus:outline-blue-600 bg-white text-2xs font-bold text-gray-700"
                        >
                          <option value="welcome">Açılış / Kamp Kabulü Bildirimi</option>
                          <option value="incident">Tıbbi Bilgilendirme (Revir Durumu)</option>
                          <option value="general">Genç Yeşilay Gelişim / Günlük Özet</option>
                        </select>
                      </div>

                      {/* Message body */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] text-gray-400 uppercase font-black">Gönderilecek İleti İçeriği</label>
                          <span className="text-[9px] text-gray-400 font-bold">Karakter: {customMessage.length}</span>
                        </div>
                        <textarea
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          className="w-full border border-gray-200 rounded p-2 focus:outline-blue-600 text-2xs leading-relaxed select-text font-medium text-gray-800 bg-white"
                          rows={3}
                          placeholder="İleti yazın..."
                        ></textarea>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="button"
                        onClick={handleSendNotification}
                        className="w-full bg-blue-700 text-white font-extrabold text-3xs py-1.5 px-3 rounded hover:bg-blue-800 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        Bilgilendirmeyi Gönder
                      </button>
                    </div>
                  </div>

                  {/* Column 3: Documents */}
                  <div className="space-y-4 md:border-l md:border-gray-100 md:pl-6">
                    {/* Documents Download Module */}
                    <div className="space-y-2">
                      <span className="font-bold text-gray-400 block uppercase tracking-wider text-[9px]">Resmi Form &amp; Belgeler</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            exportToPdf(selectedParticipant);
                            onAddLog('Form İndirme', `'${selectedParticipant.name}' için müracaat ve sağlık beyan kabul formu PDF olarak yazdırıldı.`);
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-2.5 rounded text-3xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-red-100"
                          title="Kamp Kayıt Formunu PDF olarak yazdır/kaydet"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          PDF İndir
                        </button>
                        <button
                          onClick={() => {
                            exportToWord(selectedParticipant);
                            onAddLog('Form İndirme', `'${selectedParticipant.name}' için müracaat ve sağlık beyan kabul formu Word (.doc) olarak indirildi.`);
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold py-2 px-2.5 rounded text-3xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-blue-100"
                          title="Kamp Kayıt Formunu Word (.doc) dosyası olarak indir"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          Word İndir
                        </button>
                      </div>
                    </div>

                    {/* Yaka Kartı / Giriş Kimliği Modülü */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsBadgeModalOpen(true);
                          onAddLog('Katılımcı Kartı', `'${selectedParticipant.name}' için Kamp Katılım Kartı / Yaka Kartı oluşturuldu.`);
                        }}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-2xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-emerald-100" />
                        Kamp Katılımcı Kartı Oluştur
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                  <FileSpreadsheet className="w-12 h-12 text-gray-200 stroke-1 mb-2" />
                  <p className="text-xs font-semibold">Detaylı Katılımcı Kartını İncele</p>
                  <p className="text-3xs mt-1">Yukarıdaki katılımcı defterinden bir gönüllüyü tıklayarak iletişim, revir ve sağlık beyan formlarına ve eğitmen değerlendirme paneline erişebilirsiniz.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div> {/* Closes space-y-5 accordion list */}

      {/* Kamp Katılımcı Kartı (Yaka Kartı) Modal */}
      {isBadgeModalOpen && selectedParticipant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative border border-gray-100 flex flex-col items-center">
            {/* Close button */}
            <button
              onClick={() => setIsBadgeModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-gray-800 self-start mb-4 uppercase tracking-wider">Kart Önizleme</h3>

            {/* Virtual physical badge card */}
            <div className="w-[300px] h-[460px] border-[3px] border-[#00AB41] rounded-2xl overflow-hidden flex flex-col bg-white shadow-lg relative select-none">
              {/* Green Header */}
              <div className="bg-[#0B3B24] p-3.5 flex items-center justify-center gap-2 border-b-2 border-[#00AB41]">
                <div className="w-7 h-7 flex items-center justify-center bg-white rounded-full">
                  <svg viewBox="0 0 100 100" className="w-5 h-5">
                    <path
                      d="M52,15 A35,35 0 1,0 85,68 A28,28 0 1,1 85,32 A35,35 0 0,0 52,15 Z"
                      fill="#00AB41"
                    />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-white leading-none tracking-wider">YEŞİLAY GENÇLİK KAMPI</span>
                  <span className="text-[7px] text-[#00AB41] font-bold leading-none uppercase tracking-widest mt-1">KAMP KATILIM KARTI</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex-1 p-4 flex flex-col items-center justify-between text-center bg-radial-at-t from-emerald-50/10 to-white">
                {/* Initials Avatar */}
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-[#00AB41] flex items-center justify-center text-2xl font-black text-[#0B3B24] shadow-2xs">
                  {selectedParticipant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>

                {/* Name */}
                <div className="mt-2">
                  <p className="text-sm font-black text-[#0B3B24] tracking-tight uppercase leading-none">{selectedParticipant.name}</p>
                  <span className="inline-block bg-emerald-100/70 text-[#00875A] text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-1 border border-emerald-200/50">
                    {selectedParticipant.category ? `${selectedParticipant.category} ${['İlkokul', 'Ortaokul', 'Lise', 'Üniversite'].includes(selectedParticipant.category) ? 'Öğrencisi' : ''}` : 'GÖNÜLLÜ KATILIMCI'}
                  </span>
                </div>

                {/* Grid Details */}
                <div className="w-full space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                    <span className="text-gray-400 font-extrabold uppercase text-[8px]">Grup</span>
                    <span className="font-extrabold text-gray-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: participantGroup?.color || '#cbd5e1' }} />
                      {participantGroup?.name || 'Grup Atanmamış'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                    <span className="text-gray-400 font-extrabold uppercase text-[8px]">Konaklama</span>
                    <span className="font-extrabold text-gray-800">
                      {selectedParticipant.bungalowId ? `${selectedParticipant.bungalowId} - Yatak ${selectedParticipant.bedNumber}` : 'Oda Atanmamış'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                    <span className="text-gray-400 font-extrabold uppercase text-[8px]">T.C. Kimlik</span>
                    <span className="font-mono text-gray-700">{selectedParticipant.identityNumber.slice(0, 3)}******{selectedParticipant.identityNumber.slice(-2)}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer with Seals & Fake Barcode */}
              <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex justify-between items-center h-12">
                <div className="flex gap-1">
                  <span className="text-[7px] font-extrabold text-green-800 bg-green-100 px-1 py-0.5 rounded-xs">KVKK</span>
                  <span className="text-[7px] font-extrabold text-green-800 bg-green-100 px-1 py-0.5 rounded-xs">TAAH</span>
                </div>
                {/* SVG Barcode */}
                <svg className="h-6 w-20" viewBox="0 0 100 30">
                  <rect x="0" y="2" width="2" height="26" fill="#000" />
                  <rect x="4" y="2" width="1" height="26" fill="#000" />
                  <rect x="7" y="2" width="3" height="26" fill="#000" />
                  <rect x="12" y="2" width="1" height="26" fill="#000" />
                  <rect x="15" y="2" width="2" height="26" fill="#000" />
                  <rect x="19" y="2" width="4" height="26" fill="#000" />
                  <rect x="25" y="2" width="1" height="26" fill="#000" />
                  <rect x="28" y="2" width="2" height="26" fill="#000" />
                  <rect x="32" y="2" width="1" height="26" fill="#000" />
                  <rect x="35" y="2" width="3" height="26" fill="#000" />
                  <rect x="40" y="2" width="2" height="26" fill="#000" />
                  <rect x="44" y="2" width="1" height="26" fill="#000" />
                  <rect x="47" y="2" width="4" height="26" fill="#000" />
                  <rect x="53" y="2" width="1" height="26" fill="#000" />
                  <rect x="56" y="2" width="2" height="26" fill="#000" />
                  <rect x="60" y="2" width="3" height="26" fill="#000" />
                  <rect x="65" y="2" width="1" height="26" fill="#000" />
                  <rect x="68" y="2" width="4" height="26" fill="#000" />
                  <rect x="74" y="2" width="2" height="26" fill="#000" />
                  <rect x="78" y="2" width="1" height="26" fill="#000" />
                  <rect x="81" y="2" width="3" height="26" fill="#000" />
                  <rect x="86" y="2" width="2" height="26" fill="#000" />
                  <rect x="90" y="2" width="4" height="26" fill="#000" />
                  <rect x="96" y="2" width="2" height="26" fill="#000" />
                </svg>
              </div>
            </div>

            {/* Print trigger button */}
            <button
              onClick={() => handlePrintBadge(selectedParticipant, participantGroup?.name || 'Grup Atanmamış', participantGroup?.color || '#cbd5e1')}
              className="mt-6 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              Yazdır / PDF Olarak Kaydet
            </button>
          </div>
        </div>
      )}
      {/* Print Warning Modal for iframe */}
      {showPrintWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-gray-900">PDF Rapor / Kart Oluşturma</h3>
            <p className="text-sm text-gray-600">
              Uygulama şu anda önizleme modunda (iframe) çalışmaktadır. Belgeyi yazdırabilmek veya PDF olarak kaydedebilmek için lütfen uygulamayı <strong>yeni bir sekmede</strong> açınız.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => setShowPrintWarning(false)}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
              >
                Anladım, Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
