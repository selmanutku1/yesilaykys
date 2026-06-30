/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Participant, CampPeriod, SystemLog, CampCenter } from '../types';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  AlertCircle, 
  Bell, 
  Activity, 
  Plus, 
  Percent, 
  Sparkles,
  ArrowRightCircle,
  ExternalLink,
  QrCode,
  Copy,
  Check,
  Share2,
  Printer,
  HeartPulse,
  Wrench,
  Utensils
} from 'lucide-react';
import { HelpTooltip } from './HelpTooltip';

interface DashboardViewProps {
  participants: Participant[];
  periods: CampPeriod[];
  logs: SystemLog[];
  selectedCampCenterId: string;
  campCenters: CampCenter[];
  currentUser: any;
  onAddPeriod: (p: CampPeriod) => void;
  onUpdatePeriods: (updated: CampPeriod[]) => void;
  onAddLog: (action: string, details: string) => void;
  setActiveMainTab: (tab: any) => void;
}

export default function DashboardView({
  participants,
  periods,
  logs,
  selectedCampCenterId,
  campCenters,
  currentUser,
  onAddPeriod,
  onUpdatePeriods,
  onAddLog,
  setActiveMainTab,
}: DashboardViewProps) {
  // New Period Form states
  const [newPeriodName, setNewPeriodName] = useState('');
  const [newPeriodStart, setNewPeriodStart] = useState('2026-08-01');
  const [newPeriodEnd, setNewPeriodEnd] = useState('2026-08-08');
  const [newPeriodQuota, setNewPeriodQuota] = useState(78);
  const [copiedCenterId, setCopiedCenterId] = useState<string | null>(null);
  const [copiedPeriodId, setCopiedPeriodId] = useState<string | null>(null);
  const [showPrintWarning, setShowPrintWarning] = useState(false);
  const [isSurveySent, setIsSurveySent] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [surveyType, setSurveyType] = useState('genel');
  const [surveyAudience, setSurveyAudience] = useState('all');
  const [surveyChannel, setSurveyChannel] = useState('sms');
  const [isSurveyEditMode, setIsSurveyEditMode] = useState(false);
  const [surveyTemplates, setSurveyTemplates] = useState({
    genel: 'Kamp deneyiminizi değerlendirmek için kısa anketimize katılın:',
    tesis: 'Tesis ve konaklama hizmetlerimizi değerlendirmek için kısa anketimize katılın:',
    egitim: 'Eğitim ve etkinlik programlarımızı değerlendirmek için anketimize katılın:'
  });

  const handleSendSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSurveyModalOpen(false);
    setIsSurveySent(true);
    
    let typeName = surveyType === 'genel' ? 'Genel Memnuniyet' : surveyType === 'tesis' ? 'Tesis ve Konaklama' : 'Eğitim ve Etkinlik';
    let audName = surveyAudience === 'all' ? 'tüm katılımcılara' : surveyAudience === 'checked-out' ? 'çıkış yapan katılımcılara' : 'velilere';
    let chName = surveyChannel === 'sms' ? 'SMS' : surveyChannel === 'email' ? 'E-posta' : 'SMS ve E-posta';
    
    onAddLog('Anket Gönderimi', `${typeName} anketi ${audName} ${chName} aracılığıyla gönderildi.`);
    setTimeout(() => setIsSurveySent(false), 4000);
  };

  const handleCopyPeriodLink = (periodId: string) => {
    const regLink = `${window.location.origin}${window.location.pathname}?portal=basvuru&periodId=${periodId}`;
    navigator.clipboard.writeText(regLink).then(() => {
      setCopiedPeriodId(periodId);
      setTimeout(() => setCopiedPeriodId(null), 2000);
    }).catch(() => {
      // Fallback if clipboard API fails
      const tempInput = document.createElement('input');
      tempInput.value = regLink;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setCopiedPeriodId(periodId);
      setTimeout(() => setCopiedPeriodId(null), 2000);
    });
    onAddLog('Başvuru Bağlantısı Kopyalandı', `Dönem ID ${periodId} için online başvuru bağlantısı kopyalandı.`);
  };

  const handleCopyLink = (centerId: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedCenterId(centerId);
      setTimeout(() => setCopiedCenterId(null), 2000);
    }).catch(() => {
      // Fallback if clipboard API fails in some browsers/iframes
      const tempInput = document.createElement('input');
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setCopiedCenterId(centerId);
      setTimeout(() => setCopiedCenterId(null), 2000);
    });
  };

  const activeCenter = campCenters.find((c) => c.id === selectedCampCenterId) || campCenters[0];
  const totalCapacity = activeCenter?.capacity || 78;
  const activePeriod = periods.find((p) => p.isActive) || periods[0];

  // Calculators
  const inCampCount = participants.filter((p) => p.status === 'Kampta').length;
  const occupancyPercent = totalCapacity > 0 ? Math.round((inCampCount / totalCapacity) * 100) : 0;
  const pendingCount = participants.filter((p) => p.status === 'Başvuru Yapıldı').length;
  const checkedInToday = participants.filter((p) => p.checkedIn).length;

  // Age calculation groupings for visual stats bar
  const ageDist = participants.reduce(
    (acc, next) => {
      const age = new Date().getFullYear() - new Date(next.birthDate).getFullYear();
      if (age <= 12) acc['11-12']++;
      else acc['13-14']++;
      return acc;
    },
    { '11-12': 0, '13-14': 0 }
  );

  // Gender calculation groupings
  const girlCount = participants.filter((p) => p.gender === 'Kız').length;
  const boyCount = participants.filter((p) => p.gender === 'Erkek').length;
  const totalCount = participants.length || 1;

  const girlPercent = Math.round((girlCount / totalCount) * 100);
  const boyPercent = Math.round((boyCount / totalCount) * 100);

  // Chart Data Setup
  const ageData = [
    { name: '11-12 Yaş Grubu', value: ageDist['11-12'] },
    { name: '13-14 Yaş Grubu', value: ageDist['13-14'] },
  ];
  const ageColors = ['#059669', '#3b82f6'];

  const occupancyData = [
    { name: 'Dolu Kapasite', value: inCampCount },
    { name: 'Boş Kapasite', value: Math.max(totalCapacity - inCampCount, 0) },
  ];
  const occupancyColors = ['#2563eb', '#e5e7eb'];
  
  const surveyData = [
    { name: 'Tesis', 'Memnuniyet (%)': 88 },
    { name: 'Yemek', 'Memnuniyet (%)': 82 },
    { name: 'Eğitim', 'Memnuniyet (%)': 95 },
    { name: 'Etkinlik', 'Memnuniyet (%)': 92 },
    { name: 'Güvenlik', 'Memnuniyet (%)': 98 },
  ];

  const handleCreatePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriodName) return;

    const newPeriod: CampPeriod = {
      id: `P0${periods.length + 1}`,
      campCenterId: selectedCampCenterId,
      name: newPeriodName,
      startDate: newPeriodStart,
      endDate: newPeriodEnd,
      maxQuota: newPeriodQuota,
      isActive: false,
      status: 'Planlandı',
    };

    onAddPeriod(newPeriod);
    onAddLog('Yeni Dönem Oluşturuldu', `${newPeriodName} isimli kamp dönemi planlandı.`);
    setNewPeriodName('');
    alert('Yeni kamp dönemi başarıyla planlama takvimine eklendi!');
  };

  const handleActivatePeriod = (pId: string) => {
    const updated = periods.map((p) => {
      // Deactivate all others, activate target
      return { ...p, isActive: p.id === pId, status: p.id === pId ? ('Aktif' as const) : ('Planlandı' as const) };
    });
    onUpdatePeriods(updated);
    const targetName = periods.find((p) => p.id === pId)?.name || '';
    onAddLog('Dönem Aktivasyonu', `${targetName} dönemi kampa geçirildi ve aktif kılındı.`);
    alert(`${targetName} başarıyla aktif kamp dönemi yapıldı!`);
  };

  return (
    <div className="space-y-6" id="dashboard-tab-content">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm print:hidden">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Yönetim Özeti
            <HelpTooltip content="Sistemdeki tüm modüllerin anlık özetini, kamp doluluğunu ve operasyonel metrikleri bu ekrandan takip edebilirsiniz." />
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Kamp merkezinizin genel operasyonel durumunu izleyin.</p>
        </div>
        <button
          onClick={() => {
            if (window.self !== window.top) {
              setShowPrintWarning(true);
            } else {
              window.print();
            }
          }}
          className="flex items-center justify-center w-full sm:w-auto gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 px-4 py-2 rounded-lg text-sm font-bold transition border border-blue-200 shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Hızlı Rapor Oluştur (PDF)
        </button>
      </div>

      {/* Visual Statistics Dashboard Grid Cards - Role Based Customization */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Default Cards for Admin / Mudur / Kayit / Guvenlik */}
        {(!['saglik', 'teknik', 'yemekhane'].includes(currentUser?.role)) && (
          <>
            {/* Card 1: Capacity */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-emerald-100 text-emerald-800 p-2 sm:p-2.5 rounded-lg shrink-0">
                <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-grow min-w-0 w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-emerald-700 tracking-wider uppercase block truncate" title={activeCenter?.name}>
                  {activeCenter?.name ? activeCenter.name.replace('Yeşilay ', '') : 'Toplam Kapasite'}
                </span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">{totalCapacity} Kişi</h3>
                
                <a 
                  href="https://kamplar.yesilay.org.tr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-1 inline-flex items-center justify-center gap-1 text-emerald-700 hover:text-emerald-800 transition text-[8px] sm:text-[9px] font-bold bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-100/60"
                  title="Yeşilay Online Kamp Başvuru Portalı'nı Yeni Sekmede Aç"
                >
                  <span>Başvuru Portalı</span>
                  <ExternalLink className="w-2.5 h-2.5 text-emerald-600" />
                </a>
              </div>
            </div>

            {/* Card 2: Occupancy Rate */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-blue-100 text-blue-800 p-2 sm:p-2.5 rounded-lg shrink-0">
                <Percent className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-gray-400 tracking-wider uppercase block">Doluluk Oranı</span>
                <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-0.5">
                  <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">% {occupancyPercent}</h3>
                  <span className="text-[8px] sm:text-3xs text-gray-400">({inCampCount} Aktif)</span>
                </div>
                <div className="w-16 sm:w-20 bg-gray-100 h-1 rounded-full overflow-hidden mt-1 bg-gradient-to-r from-blue-300 to-blue-500 mx-auto sm:mx-0">
                  <div className="h-full bg-blue-600" style={{ width: `${occupancyPercent}%` }}></div>
                </div>
              </div>
            </div>

            {/* Card 3: Pending approvals */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-purple-100 text-purple-800 p-2 sm:p-2.5 rounded-lg shrink-0">
                <AlertCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-gray-400 tracking-wider uppercase block">Onay Bekleyenler</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">{pendingCount} Başvuru</h3>
                <span className="text-[8px] sm:text-[9px] text-purple-700 font-bold hover:underline cursor-pointer block mt-1" onClick={() => setActiveMainTab('kayit')}>
                  İncele &rarr;
                </span>
              </div>
            </div>

            {/* Card 4: Daily check-ins/outs */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-amber-100 text-amber-800 p-2 sm:p-2.5 rounded-lg shrink-0">
                <Activity className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-gray-400 tracking-wider uppercase block">Günlük Yoklama</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">{checkedInToday} Giriş</h3>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold block mt-1">QR Geçişleri</span>
              </div>
            </div>
          </>
        )}

        {/* HEALTH ROLE CARDS */}
        {currentUser?.role === 'saglik' && (
          <>
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-rose-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-rose-100 text-rose-700 p-2 sm:p-2.5 rounded-lg shrink-0">
                <HeartPulse className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-rose-500 tracking-wider uppercase block">Revirdeki Aktif Vaka</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">3 Öğrenci</h3>
                <span className="text-[8px] sm:text-[9px] text-rose-600 font-bold hover:underline cursor-pointer block mt-1" onClick={() => setActiveMainTab('revir')}>
                  Revire Git &rarr;
                </span>
              </div>
            </div>
            
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-amber-100 text-amber-700 p-2 sm:p-2.5 rounded-lg shrink-0">
                <AlertCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-amber-600 tracking-wider uppercase block">Riskli Durumlar</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">{participants.filter(p => p.healthNote && p.healthNote.trim().length > 0).length || 5} Kişi</h3>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold block mt-1">Alerji / Kronik Hastalık</span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-emerald-100 text-emerald-800 p-2 sm:p-2.5 rounded-lg shrink-0">
                <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-emerald-700 tracking-wider uppercase block">Mevcut Kamp Nüfusu</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">{inCampCount} Kişi</h3>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold block mt-1">Toplam Sorumluluk</span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-blue-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-blue-100 text-blue-700 p-2 sm:p-2.5 rounded-lg shrink-0">
                <Activity className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-blue-600 tracking-wider uppercase block">Günlük Müdahale</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">8 İşlem</h3>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold block mt-1">Bugün yapılan viziteler</span>
              </div>
            </div>
          </>
        )}

        {/* TECHNICAL ROLE CARDS */}
        {currentUser?.role === 'teknik' && (
          <>
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-rose-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-rose-100 text-rose-700 p-2 sm:p-2.5 rounded-lg shrink-0">
                <AlertCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-rose-500 tracking-wider uppercase block">Açık Arıza Kayıtları</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">4 Bildirim</h3>
                <span className="text-[8px] sm:text-[9px] text-rose-600 font-bold hover:underline cursor-pointer block mt-1" onClick={() => setActiveMainTab('teknik')}>
                  Detayları Gör &rarr;
                </span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-emerald-100 text-emerald-700 p-2 sm:p-2.5 rounded-lg shrink-0">
                <Check className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-emerald-600 tracking-wider uppercase block">Çözülen İşler (Bugün)</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">2 İşlem</h3>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold block mt-1">Tamamlanan onarımlar</span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-blue-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-blue-100 text-blue-700 p-2 sm:p-2.5 rounded-lg shrink-0">
                <Wrench className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-blue-600 tracking-wider uppercase block">Periyodik Bakımlar</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">%85</h3>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold block mt-1">Bu haftaki tamamlanma</span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-amber-100 text-amber-700 p-2 sm:p-2.5 rounded-lg shrink-0">
                <Activity className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-amber-600 tracking-wider uppercase block">Tesis Durumu</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">Aktif</h3>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold block mt-1">Tüm sistemler çalışıyor</span>
              </div>
            </div>
          </>
        )}

        {/* FOOD/KITCHEN ROLE CARDS */}
        {currentUser?.role === 'yemekhane' && (
          <>
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-emerald-100 text-emerald-800 p-2 sm:p-2.5 rounded-lg shrink-0">
                <Utensils className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-emerald-700 tracking-wider uppercase block">Toplam Yemek Mevcudu</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">{inCampCount + 15} Kişi</h3>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold block mt-1">(Öğrenci + Personel)</span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-amber-100 text-amber-700 p-2 sm:p-2.5 rounded-lg shrink-0">
                <AlertCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-amber-600 tracking-wider uppercase block">Özel Beslenme Listesi</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">4 Öğrenci</h3>
                <span className="text-[8px] sm:text-[9px] text-amber-700 font-bold hover:underline cursor-pointer block mt-1" onClick={() => setActiveMainTab('yemekhane')}>
                  Diyet Listelerini Gör &rarr;
                </span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-blue-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-blue-100 text-blue-700 p-2 sm:p-2.5 rounded-lg shrink-0">
                <Activity className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-blue-600 tracking-wider uppercase block">Dağıtılan Öğün (Bugün)</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">Kahvaltı</h3>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold block mt-1">Aktif Yemek Servisi</span>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-xl border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
              <div className="bg-purple-100 text-purple-700 p-2 sm:p-2.5 rounded-lg shrink-0">
                <TrendingUp className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <span className="text-[8px] sm:text-3xs font-extrabold text-purple-600 tracking-wider uppercase block">Erzak Depo Durumu</span>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">Yeterli</h3>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold block mt-1">Kritik stok uyarısı yok</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Age Groups Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-72">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-emerald-700" />
            Yaş Grupları Dağılımı
          </h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ageColors[index % ageColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => [`${value} Kişi`, 'Kayıt']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-72">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-700" />
            Kamp Doluluk Oranı
          </h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={occupancyColors[index % occupancyColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => [`${value} Kişi`, 'Kapasite']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Survey Analysis Module Section */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-700" />
                Kamp Sonu Değerlendirme Analizi
              </h3>
              <p className="text-xs text-gray-500 mt-1">Katılımcıların dönem sonu anket sonuçları ve genel memnuniyet dağılımı.</p>
            </div>
            <button
              onClick={() => setIsSurveyModalOpen(true)}
              disabled={isSurveySent}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isSurveySent
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100'
              }`}
            >
              {isSurveySent ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Anket Gönderildi
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" /> Otomatik Anket Gönder
                </>
              )}
            </button>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={surveyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} domain={[0, 100]} />
                <RechartsTooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="Memnuniyet (%)" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dynamic Camp Registration QR Codes Section */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 font-sans">
            <QrCode className="w-4 h-4 text-emerald-700" />
            Yeşilay Gönüllü Kayıt Kamp QR İstasyonları
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Gönüllü adaylarının doğrudan kampa ön başvuru yapabilmesi için dinamik karekodlar. İndirebilir, yazdırabilir veya paylaşabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campCenters.map((cc) => {
            const regLink = `${window.location.origin}${window.location.pathname}?portal=basvuru&centerId=${cc.id}`;
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(regLink)}&color=047857&margin=10`;

            return (
              <div key={cc.id} className="p-4 rounded-xl border border-gray-150 bg-gray-50 dark:bg-gray-900/50/70 hover:border-emerald-200 transition-all duration-200 flex flex-col justify-between text-center space-y-3.5 shadow-3xs">
                <div>
                  <h4 className="font-extrabold text-neutral-800 text-xs truncate" title={cc.name}>{cc.name}</h4>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-0.5">{cc.city} Kamp Merkezi</p>
                </div>

                {/* QR Code Frame */}
                <div className="bg-white p-2 flex items-center justify-center rounded-lg border border-gray-200/60 shadow-xs mx-auto">
                  <img
                    src={qrApiUrl}
                    alt={`${cc.name} Kayıt QR`}
                    className="w-24 h-24 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info and action tools */}
                <div className="w-full space-y-2">
                  <div className="bg-white px-2 py-1 rounded text-[10px] text-gray-400 font-mono truncate border border-gray-150 select-all" title={regLink}>
                    {regLink}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-3xs font-extrabold">
                    <button
                      onClick={() => handleCopyLink(cc.id, regLink)}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-150 hover:border-emerald-350 rounded-lg transition-all cursor-pointer"
                    >
                      {copiedCenterId === cc.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 animate-pulse" />
                          <span>Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-emerald-700" />
                          <span>Kopyala</span>
                        </>
                      )}
                    </button>

                    <a
                      href={regLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Git</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Camp Period Hub */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="border-b pb-3 mb-4 flex justify-between items-center flex-wrap gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Aktif Kamp Dönemi Bilgisi
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">{activePeriod?.name}</h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-100">
            KOT: {inCampCount}/{activePeriod?.maxQuota || 78} Dolu
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-2xs font-extrabold text-gray-400 tracking-wider uppercase">Yeşilay Tematik Kamp Dönem Yönetimi</h4>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {periods.map((per) => (
                <div
                  key={per.id}
                  className={`p-3 rounded-lg border text-xs flex justify-between items-center transition ${
                    per.isActive 
                      ? 'border-emerald-600 bg-emerald-50/20' 
                      : 'border-gray-150 bg-gray-50/50'
                  }`}
                >
                  <div>
                    <p className="font-extrabold text-gray-800 dark:text-gray-200">{per.name}</p>
                    <p className="text-3xs text-gray-500 font-semibold mt-1">
                      Zamanlama: {new Date(per.startDate).toLocaleDateString()} - {new Date(per.endDate).toLocaleDateString()} | Kota: {per.maxQuota} Kişilik
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyPeriodLink(per.id)}
                      title="Bu kamp için başvuru formu bağlantısını kopyala"
                      className={`py-1 px-2 text-3xs font-bold rounded border transition-all cursor-pointer flex items-center gap-1 ${
                        copiedPeriodId === per.id
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse'
                          : 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-150'
                      }`}
                    >
                      {copiedPeriodId === per.id ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Bağlantı Kopyalandı!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Başvuru Linkini Al</span>
                        </>
                      )}
                    </button>

                    {per.isActive ? (
                      <span className="text-3xs font-extrabold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded border border-emerald-250">
                        Aktif Dönem
                      </span>
                    ) : (
                      <button
                        onClick={() => handleActivatePeriod(per.id)}
                        className="bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border text-3xs font-bold px-2 py-1.5 rounded transition cursor-pointer"
                      >
                        Dönemi Aktif Yap
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Add period panel */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-3.5 text-xs">
            <h5 className="font-bold text-gray-800 flex items-center gap-1">
              <Plus className="w-4 h-4 text-emerald-700" />
              Dönem Ekle / Kotası
            </h5>
            <form onSubmit={handleCreatePeriod} className="space-y-2.5 text-3xs">
              <div>
                <input
                  type="text"
                  placeholder="Başlık (Örn: 4. Dönem Sağlıklı Yaşam Kampı)"
                  value={newPeriodName}
                  onChange={(e) => setNewPeriodName(e.target.value)}
                  className="w-full p-2 border bg-white rounded focus:outline-emerald-600"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-0.5 font-bold uppercase">Başlangıç</label>
                  <input
                    type="date"
                    value={newPeriodStart}
                    onChange={(e) => setNewPeriodStart(e.target.value)}
                    className="w-full p-2 border bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-0.5 font-bold uppercase">Bitiş</label>
                  <input
                    type="date"
                    value={newPeriodEnd}
                    onChange={(e) => setNewPeriodEnd(e.target.value)}
                    className="w-full p-2 border bg-white rounded"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 rounded shadow-sm text-2xs cursor-pointer"
              >
                Yeni Dönemi Planla
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Charts & System Logs twin boards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Custom drawn HTML5 Visual Statistics (Age & Gender distributions) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-gray-900 pb-2 border-b flex items-center gap-1.5 font-sans">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Demografik &amp; Hizmet Analitik Raporları
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender bar comparative indicator */}
            <div className="p-4 rounded-xl border border-gray-105 bg-gray-50/40 space-y-3">
              <span className="text-3xs font-extrabold text-gray-400 tracking-wider uppercase">Cinsiyet Dağılımı</span>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-pink-600">Kız ({girlCount})</span>
                <span className="text-blue-600">Erkek ({boyCount})</span>
              </div>
              <div className="w-full bg-gray-250 h-3 rounded-full overflow-hidden flex">
                <div className="bg-pink-500 h-full" style={{ width: `${girlPercent}%` }} title={`Kız %${girlPercent}`}></div>
                <div className="bg-blue-600 h-full" style={{ width: `${boyPercent}%` }} title={`Erkek %${boyPercent}`}></div>
              </div>
              <p className="text-4xs text-gray-450 leading-relaxed text-center font-semibold">
                Turnike ve konaklama eşleşmeleri bu dengelere göre akıllıca filtrelenir.
              </p>
            </div>

            {/* Age categorization columns indicator */}
            <div className="p-4 rounded-xl border border-gray-105 bg-gray-50/40 space-y-3">
              <span className="text-3xs font-extrabold text-gray-400 tracking-wider uppercase">Yaş Dağılımı (KYS)</span>
              
              <div className="space-y-2">
                {/* Age 11-12 */}
                <div>
                  <div className="flex justify-between text-3xs font-bold text-gray-650 mb-0.5">
                    <span>11-12 Yaş Grubu</span>
                    <span>{ageDist['11-12']} Katılımcı</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: `${(ageDist['11-12'] / totalCount) * 100}%` }}></div>
                  </div>
                </div>

                {/* Age 13-14 */}
                <div>
                  <div className="flex justify-between text-3xs font-bold text-gray-650 mb-0.5">
                    <span>13-14 Yaş Grubu</span>
                    <span>{ageDist['13-14']} Katılımcı</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: `${(ageDist['13-14'] / totalCount) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center text-xs font-semibold">
            <div onClick={() => setActiveMainTab('bungalov')} className="p-2 sm:p-3 bg-white hover:bg-emerald-50/30 transition-colors border rounded-xl shadow-3xs cursor-pointer flex flex-col items-center gap-1 font-sans min-w-0">
              <span className="text-[8px] sm:text-[10px] text-gray-400 block uppercase font-bold tracking-wider truncate w-full">Lider Dolu</span>
              <span className="text-xs sm:text-base font-extrabold text-amber-700">6 / 12</span>
              <span className="text-[7px] sm:text-[9px] text-emerald-800 flex items-center gap-0.5 font-bold">Harita &rarr;</span>
            </div>
            <div onClick={() => setActiveMainTab('revir')} className="p-2 sm:p-3 bg-white hover:bg-emerald-50/30 transition-colors border rounded-xl shadow-3xs cursor-pointer flex flex-col items-center gap-1 font-sans min-w-0">
              <span className="text-[8px] sm:text-[10px] text-gray-400 block uppercase font-bold tracking-wider truncate w-full">Sağlık / Revir</span>
              <span className="text-xs sm:text-base font-extrabold text-red-650">3 Aktif</span>
              <span className="text-[7px] sm:text-[9px] text-emerald-800 flex items-center gap-0.5 font-bold">Revir &rarr;</span>
            </div>
            <div onClick={() => setActiveMainTab('kayit')} className="p-2 sm:p-3 bg-white hover:bg-emerald-50/30 transition-colors border rounded-xl shadow-3xs cursor-pointer flex flex-col items-center gap-1 font-sans min-w-0">
              <span className="text-[8px] sm:text-[10px] text-gray-400 block uppercase font-bold tracking-wider truncate w-full">Ön Kayıt</span>
              <span className="text-xs sm:text-base font-extrabold text-purple-800">{pendingCount}</span>
              <span className="text-[7px] sm:text-[9px] text-emerald-800 flex items-center gap-0.5 font-bold">Kuyruk &rarr;</span>
            </div>
          </div>
        </div>

        {/* Real-time audit logs of actions */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 pb-2 border-b flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-emerald-600 animate-pulse" />
            Sistem İşlem Günlük Defteri (Security Logs)
          </h3>

          <div className="space-y-2.5 max-h-[295px] overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 border border-gray-100 rounded-lg text-[10px] bg-slate-50 relative overflow-hidden"
              >
                <div className="flex justify-between items-start font-mono mb-1 text-gray-400 font-bold shrink-0">
                  <span>{new Date(log.timestamp).toLocaleTimeString()} ({log.userRole})</span>
                  <span className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-extrabold text-[9px]">
                    {log.action}
                  </span>
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">{log.details}</p>
                <p className="text-4xs text-gray-400 mt-1">Gerektiren Aktör: {log.userName} (ID: {log.userId})</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Print Warning Modal for iframe */}
      {showPrintWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-gray-900">PDF Rapor Oluşturma</h3>
            <p className="text-sm text-gray-600">
              Uygulama şu anda önizleme modunda (iframe) çalışmaktadır. Raporu yazdırabilmek veya PDF olarak kaydedebilmek için lütfen uygulamayı <strong>yeni bir sekmede</strong> açınız.
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

      {/* Survey Configuration Modal */}
      {isSurveyModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-600" /> Anket Gönderim Konfigürasyonu
              </h2>
              <button onClick={() => setIsSurveyModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition cursor-pointer">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSendSurveySubmit} className="p-5 space-y-5">
              <div className="space-y-4">
                {/* Survey Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Anket Türü</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'genel', label: 'Genel Memnuniyet' },
                      { id: 'tesis', label: 'Tesis & Konaklama' },
                      { id: 'egitim', label: 'Eğitim & Etkinlik' }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSurveyType(type.id)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                          surveyType === type.id 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Hedef Kitle</label>
                  <select 
                    value={surveyAudience}
                    onChange={(e) => setSurveyAudience(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 text-sm"
                  >
                    <option value="all">Tüm Kayıtlı Katılımcılar (Bu Dönem)</option>
                    <option value="checked-out">Sadece Çıkış (Check-out) Yapanlar</option>
                    <option value="parents">Katılımcı Velileri</option>
                  </select>
                </div>

                {/* Channel */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">İletişim Kanalı</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="channel" 
                        value="sms" 
                        checked={surveyChannel === 'sms'}
                        onChange={(e) => setSurveyChannel(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500" 
                      />
                      <span className="text-sm font-medium text-gray-700">SMS ile Gönder</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="channel" 
                        value="email" 
                        checked={surveyChannel === 'email'}
                        onChange={(e) => setSurveyChannel(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500" 
                      />
                      <span className="text-sm font-medium text-gray-700">E-posta</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="channel" 
                        value="both" 
                        checked={surveyChannel === 'both'}
                        onChange={(e) => setSurveyChannel(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500" 
                      />
                      <span className="text-sm font-medium text-gray-700">Her İkisi (SMS + E-posta)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Survey Preview Area */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Önizleme ({surveyChannel === 'sms' ? 'SMS' : surveyChannel === 'email' ? 'E-posta' : 'SMS & E-posta'})</h4>
                  {currentUser?.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setIsSurveyEditMode(!isSurveyEditMode)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
                    >
                      {isSurveyEditMode ? 'Kaydet' : 'Düzenle'}
                    </button>
                  )}
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    Merhaba, Yeşilay {activeCenter?.name || 'Kampı'} katılımınız için teşekkür ederiz!
                  </p>
                  {isSurveyEditMode ? (
                    <textarea
                      value={surveyTemplates[surveyType as keyof typeof surveyTemplates]}
                      onChange={(e) => setSurveyTemplates({...surveyTemplates, [surveyType]: e.target.value})}
                      className="mt-2 w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 text-sm"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-2">
                      {surveyTemplates[surveyType as keyof typeof surveyTemplates]}
                    </p>
                  )}
                  <p className="mt-2 text-indigo-600 dark:text-indigo-400 cursor-pointer underline">
                    https://kamplar.yesilay.org.tr/anket/x7y8z9
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setIsSurveyModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Gönderimi Başlat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
