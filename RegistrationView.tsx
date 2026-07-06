/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Participant, CampPeriod, SystemLog, CampCenter, Expense, SurveyResponse } from '../types';
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
  Check, Zap, UserPlus, ClipboardCheck, Home, MessageSquare,
  Share2,
  Printer,
  HeartPulse,
  Wrench,
  Utensils,
  FileText,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { HelpTooltip } from './HelpTooltip';

interface DashboardViewProps {
  participants: Participant[];
  periods: CampPeriod[];
  logs: SystemLog[];
  selectedCampCenterId: string;
  campCenters: CampCenter[];
  expenses: Expense[];
  surveys: SurveyResponse[];
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
  expenses,
  surveys,
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
  const [newPeriodGender, setNewPeriodGender] = useState<'Kadın' | 'Erkek' | 'Karışık/Aile'>('Karışık/Aile');
  const [newPeriodMinAge, setNewPeriodMinAge] = useState(11);
  const [newPeriodMaxAge, setNewPeriodMaxAge] = useState(14);
  const [newPeriodCriteria, setNewPeriodCriteria] = useState('');
  
  const [selectedPeriodDetail, setSelectedPeriodDetail] = useState<CampPeriod | null>(null);
  const [showPeriodParticipants, setShowPeriodParticipants] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<CampPeriod | null>(null);

  const [copiedCenterId, setCopiedCenterId] = useState<string | null>(null);
  const [copiedPeriodId, setCopiedPeriodId] = useState<string | null>(null);
  const [showPrintWarning, setShowPrintWarning] = useState(false);
  const [isSurveySent, setIsSurveySent] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [surveyType, setSurveyType] = useState('genel');
  const [surveyAudience, setSurveyAudience] = useState('all');
  const [surveyChannel, setSurveyChannel] = useState('sms');
  const [isSurveyEditMode, setIsSurveyEditMode] = useState(false);
  const [selectedParticipantDetail, setSelectedParticipantDetail] = useState<Participant | null>(null);

  const [surveyTemplates, setSurveyTemplates] = useState({
    kapsamli: 'Kamp deneyiminizi (Genel, Tesis ve Eğitim) değerlendirmek için anketimize katılın ve görüşlerinizi paylaşın:'
  });

  const generateProductivityReport = () => {
    const doc = new jsPDF();
    const activeCenter = campCenters.find(c => c.id === selectedCampCenterId);
    const activePeriod = periods.find(p => p.isActive) || periods[0];
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text('Dönem Sonu Verimlilik Raporu', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Kamp Merkezi: ${activeCenter?.name || 'Tüm Merkezler'}`, 105, 30, { align: 'center' });
    doc.text(`Dönem: ${activePeriod?.name || 'Genel'}`, 105, 35, { align: 'center' });
    doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 105, 40, { align: 'center' });

    // 1. Participant Statistics
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('1. Katılımcı İstatistikleri', 14, 55);
    
    const statsData = [
      ['Toplam Kapasite', `${totalCapacity} Kişi`],
      ['Aktif Katılımcı Sayısı', `${inCampCount} Kişi`],
      ['Doluluk Oranı', `%${occupancyPercent}`],
      ['Kadın/Erkek Dağılımı', `%${girlPercent} / %${boyPercent}`],
      ['Yaş Ortalaması', '12.8 Yaş']
    ];

    autoTable(doc, {
      startY: 60,
      head: [['Metrik', 'Değer']],
      body: statsData,
      theme: 'striped',
      headStyles: { fillColor: [5, 150, 105] }
    });

    // 2. Expense Summary
    const expenseTotal = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    doc.setFontSize(14);
    doc.text('2. Harcama Özeti', 14, (doc as any).lastAutoTable.finalY + 15);
    
    const expenseData = expenses.map(e => [
      e.date,
      e.category,
      e.description,
      `${e.amount.toLocaleString('tr-TR')} TL`
    ]);
    expenseData.push(['', '', 'TOPLAM', `${expenseTotal.toLocaleString('tr-TR')} TL`]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Tarih', 'Kategori', 'Açıklama', 'Tutar']],
      body: expenseData,
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105] }
    });

    // 3. Satisfaction Surveys
    doc.setFontSize(14);
    doc.text('3. Memnuniyet Anketleri (Ortalama %)', 14, (doc as any).lastAutoTable.finalY + 15);
    
    const surveyTableData = surveyData.map(s => [s.name, `%${s['Memnuniyet (%)']}`]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Kategori', 'Memnuniyet Oranı']],
      body: surveyTableData,
      theme: 'striped',
      headStyles: { fillColor: [5, 150, 105] }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Yeşilay Kamp Yönetim Sistemi - Otomatik Verimlilik Raporu', 105, 285, { align: 'center' });
    }

    doc.save(`Verimlilik_Raporu_${activePeriod?.name || 'Genel'}.pdf`);
    onAddLog('Verimlilik Raporu Üretildi', `${activePeriod?.name} dönemi için PDF raporu oluşturuldu.`);
  };

  const handleSendSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSurveyModalOpen(false);
    setIsSurveySent(true);
    
    let audName = surveyAudience === 'all' ? 'tüm katılımcılara' : surveyAudience === 'checked-out' ? 'çıkış yapan katılımcılara' : 'velilere';
    let chName = surveyChannel === 'sms' ? 'SMS' : surveyChannel === 'email' ? 'E-posta' : 'SMS ve E-posta';
    
    onAddLog('Anket Gönderimi', `Kapsamlı Değerlendirme Anketi ${audName} ${chName} aracılığıyla gönderildi.`);
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
  const girlCount = participants.filter((p) => p.gender === 'Kadın').length;
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
  
  const avgSurvey = (key: keyof SurveyResponse) => {
    if (surveys.length === 0) return 0;
    const sum = surveys.reduce((acc, s) => acc + (s[key] as number || 0), 0);
    return Math.round((sum / (surveys.length * 5)) * 100);
  };

  const surveyData = surveys.length > 0 ? [
    { name: 'Konaklama', 'Memnuniyet (%)': avgSurvey('ratingBungalows') },
    { name: 'Yemekhane', 'Memnuniyet (%)': avgSurvey('ratingMeals') },
    { name: 'Eğitimciler', 'Memnuniyet (%)': avgSurvey('ratingTrainers') },
    { name: 'Etkinlik', 'Memnuniyet (%)': avgSurvey('ratingActivities') },
  ] : [
    { name: 'Veri Yok', 'Memnuniyet (%)': 0 }
  ];

  const checkQuotaWarning = (targetPeriod: CampPeriod): boolean => {
    const start = new Date(targetPeriod.startDate);
    const end = new Date(targetPeriod.endDate);

    const overlappingPeriods = periods.filter(p => {
      if (p.id === targetPeriod.id) return false;
      if (p.campCenterId !== targetPeriod.campCenterId) return false;
      
      const pStart = new Date(p.startDate);
      const pEnd = new Date(p.endDate);
      
      return start <= pEnd && pStart <= end;
    });

    if (overlappingPeriods.length > 0) {
      const activeCenter = campCenters.find(c => c.id === targetPeriod.campCenterId);
      const totalCapacity = activeCenter?.capacity || 0;
      const totalOverlappingQuota = overlappingPeriods.reduce((acc, p) => acc + p.maxQuota, 0);
      const proposedTotal = totalOverlappingQuota + targetPeriod.maxQuota;

      if (proposedTotal > totalCapacity) {
        return window.confirm(`ÖNEMLİ UYARI: Bu dönemin tarihleri başka dönemlerle (${overlappingPeriods.map(p => p.name).join(', ')}) çakışmaktadır.\n\nToplam planlanan kontenjan (${proposedTotal}), kamp merkezinin kapasitesini (${totalCapacity}) aşmaktadır!\n\nBuna rağmen kaydetmek/planlamak istiyor musunuz?`);
      }
    }
    return true;
  };

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
      gender: newPeriodGender,
      minAge: newPeriodMinAge,
      maxAge: newPeriodMaxAge,
      criteria: newPeriodCriteria,
      isActive: false,
      status: 'Planlandı',
    };

    if (!checkQuotaWarning(newPeriod)) {
      return;
    }

    onAddPeriod(newPeriod);
    onAddLog('Yeni Dönem Oluşturuldu', `${newPeriodName} isimli kamp dönemi planlandı.`);
    setNewPeriodName('');
    setNewPeriodCriteria('');
    alert('Yeni kamp dönemi başarıyla planlama takvimine eklendi!');
  };

  const handleUpdatePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPeriod) return;

    if (!checkQuotaWarning(editingPeriod)) {
      return;
    }

    const updated = periods.map(p => p.id === editingPeriod.id ? editingPeriod : p);
    onUpdatePeriods(updated);
    onAddLog('Dönem Güncellendi', `${editingPeriod.name} isimli kamp dönemi güncellendi.`);
    setEditingPeriod(null);
    alert('Kamp dönemi bilgileri başarıyla güncellendi!');
  };

  const handleActivatePeriod = (pId: string) => {
    const updated = periods.map((p) => {
      if (p.id === pId) {
        return { ...p, isActive: true, status: 'Aktif' as const };
      }
      return p;
    });
    onUpdatePeriods(updated);
    const targetName = periods.find((p) => p.id === pId)?.name || '';
    onAddLog('Dönem Aktivasyonu', `${targetName} dönemi kampa geçirildi ve aktif kılındı.`);
    alert(`${targetName} başarıyla aktif kamp dönemi yapıldı!`);
  };

  const handleDeactivatePeriod = (pId: string) => {
    const updated = periods.map((p) => {
      if (p.id === pId) {
        return { ...p, isActive: false, status: 'Tamamlandı' as const };
      }
      return p;
    });
    onUpdatePeriods(updated);
    const targetName = periods.find((p) => p.id === pId)?.name || '';
    onAddLog('Dönem Bitişi', `${targetName} dönemi tamamlandı olarak işaretlendi.`);
    alert(`${targetName} dönemi tamamlandı!`);
  };

  const activePeriods = periods.filter(p => p.isActive);

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
        <div className="flex gap-2">
          <button 
            onClick={generateProductivityReport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-sm shadow-emerald-600/20"
          >
            <FileText className="w-4 h-4" />
            Dönem Sonu Verimlilik Raporu (PDF)
          </button>
        </div>
      </div>

      {/* Active Camp Period Hub */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm print:hidden">
        <div className="border-b pb-3 mb-4 flex justify-between items-center flex-wrap gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Aktif Kamp Dönemleri
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">
              {activePeriods.length > 0 ? activePeriods.map(p => p.name).join(', ') : 'Aktif kamp dönemi bulunmamaktadır.'}
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-100">
            Tesis Doluluğu: {inCampCount}/{totalCapacity} Dolu
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <h4 className="text-2xs font-extrabold text-gray-400 tracking-wider uppercase">Yeşilay Tematik Kamp Dönem Yönetimi</h4>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {periods.map((per) => (
                <div
                  key={per.id}
                  onClick={() => setSelectedPeriodDetail(per)}
                  className={`p-3 rounded-lg border text-xs flex justify-between items-center transition cursor-pointer hover:shadow-sm ${
                    per.isActive 
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-3xs' 
                      : 'border-gray-200 bg-gray-50/80 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    <p className="font-extrabold text-gray-800 dark:text-gray-200">{per.name}</p>
                    <p className="text-3xs text-gray-500 font-semibold mt-1">
                      {new Date(per.startDate).toLocaleDateString()} - {new Date(per.endDate).toLocaleDateString()} | Kota: {per.maxQuota}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {per.gender && <span className="text-[9px] px-1.5 py-0.5 bg-gray-200 rounded font-bold text-gray-600">{per.gender}</span>}
                      {per.minAge && per.maxAge && <span className="text-[9px] px-1.5 py-0.5 bg-gray-200 rounded font-bold text-gray-600">{per.minAge}-{per.maxAge} Yaş</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                          <span className="hidden sm:inline">Kopyalandı!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span className="hidden sm:inline">Link Al</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPeriod(per);
                      }}
                      className="bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-300 text-3xs font-bold px-2 py-1 rounded transition cursor-pointer"
                    >
                      Düzenle
                    </button>
                    {per.isActive ? (
                      <div className="flex items-center gap-1">
                        <span className="text-3xs font-extrabold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded border border-emerald-250">
                          Aktif Dönem
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeactivatePeriod(per.id);
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-3xs font-bold px-2 py-1 rounded transition cursor-pointer"
                        >
                          Bitir
                        </button>
                      </div>
                    ) : per.status !== 'Tamamlandı' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivatePeriod(per.id);
                        }}
                        className="bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-300 text-3xs font-bold px-2 py-1 rounded transition cursor-pointer"
                      >
                        Aktif Yap
                      </button>
                    ) : (
                      <span className="text-3xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                        Tamamlandı
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Add period panel */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-3.5 text-xs h-fit">
            <h5 className="font-bold text-gray-800 flex items-center gap-1">
              <Plus className="w-4 h-4 text-emerald-700" />
              Yeni Dönem Planla
            </h5>
            <form onSubmit={handleCreatePeriod} className="space-y-3 text-3xs">
              <div>
                <input
                  type="text"
                  placeholder="Başlık (Örn: 4. Dönem Kampı)"
                  value={newPeriodName}
                  onChange={(e) => setNewPeriodName(e.target.value)}
                  className="w-full p-2 border border-gray-200 bg-white rounded-lg focus:outline-emerald-600 font-semibold"
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
                    className="w-full p-1.5 border border-gray-200 bg-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-0.5 font-bold uppercase">Bitiş</label>
                  <input
                    type="date"
                    value={newPeriodEnd}
                    onChange={(e) => setNewPeriodEnd(e.target.value)}
                    className="w-full p-1.5 border border-gray-200 bg-white rounded-lg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-0.5 font-bold uppercase">Kota</label>
                  <input
                    type="number"
                    value={newPeriodQuota}
                    onChange={(e) => setNewPeriodQuota(Number(e.target.value))}
                    className="w-full p-1.5 border border-gray-200 bg-white rounded-lg"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-0.5 font-bold uppercase">Cinsiyet</label>
                  <select
                    value={newPeriodGender}
                    onChange={(e) => setNewPeriodGender(e.target.value as 'Kadın' | 'Erkek' | 'Karışık/Aile')}
                    className="w-full p-1.5 border border-gray-200 bg-white rounded-lg"
                  >
                    <option value="Karışık/Aile">Karışık/Aile</option>
                    <option value="Kadın">Kadın</option>
                    <option value="Erkek">Erkek</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-0.5 font-bold uppercase">Min Yaş</label>
                  <input
                    type="number"
                    value={newPeriodMinAge}
                    onChange={(e) => setNewPeriodMinAge(Number(e.target.value))}
                    className="w-full p-1.5 border border-gray-200 bg-white rounded-lg"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-0.5 font-bold uppercase">Max Yaş</label>
                  <input
                    type="number"
                    value={newPeriodMaxAge}
                    onChange={(e) => setNewPeriodMaxAge(Number(e.target.value))}
                    className="w-full p-1.5 border border-gray-200 bg-white rounded-lg"
                    min="1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-0.5 font-bold uppercase">Kriterler / Uyarı</label>
                <textarea
                  placeholder="Başvuru sayfasında gösterilecek uyarılar..."
                  value={newPeriodCriteria}
                  onChange={(e) => setNewPeriodCriteria(e.target.value)}
                  className="w-full p-2 border border-gray-200 bg-white rounded-lg focus:outline-emerald-600 font-semibold"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-lg shadow-xs text-xs cursor-pointer transition"
              >
                Planla
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
            >
              <span>Başvuru Portalı</span>
              <ExternalLink className="w-2.5 h-2.5 text-emerald-600" />
            </a>
          </div>
        </div>

        {/* Card 2: Occupancy Rate */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
          <div className="bg-emerald-100 text-emerald-800 p-2 sm:p-2.5 rounded-lg shrink-0">
            <Percent className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="w-full">
            <span className="text-[8px] sm:text-3xs font-extrabold text-gray-400 tracking-wider uppercase block">Doluluk Oranı</span>
            <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-0.5">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">% {occupancyPercent}</h3>
              <span className="text-[8px] sm:text-3xs text-gray-400">({inCampCount} Aktif)</span>
            </div>
            <div className="w-16 sm:w-20 bg-gray-100 h-1 rounded-full overflow-hidden mt-1 bg-gradient-to-r from-blue-300 to-blue-500 mx-auto sm:mx-0">
              <div className="h-full bg-emerald-600" style={{ width: `${occupancyPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Card 3: Pending approvals */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
          <div className="bg-amber-100 text-amber-800 p-2 sm:p-2.5 rounded-lg shrink-0">
            <AlertCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="w-full">
            <span className="text-[8px] sm:text-3xs font-extrabold text-amber-600 tracking-wider uppercase block">Onay Bekleyenler</span>
            <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">{pendingCount} Başvuru</h3>
            <span className="text-[8px] sm:text-[9px] text-amber-700 font-bold hover:underline cursor-pointer block mt-1" onClick={() => setActiveMainTab('kayit')}>
              İncele &rarr;
            </span>
          </div>
        </div>

        {/* Card 4: Daily check-ins/outs */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-blue-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5">
          <div className="bg-blue-100 text-blue-800 p-2 sm:p-2.5 rounded-lg shrink-0">
            <Activity className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="w-full">
            <span className="text-[8px] sm:text-3xs font-extrabold text-blue-600 tracking-wider uppercase block">Kampa Katılanlar</span>
            <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">{checkedInToday} Kişi</h3>
            <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold block mt-1">Saha Yoklaması Aktif</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Actions & Overview */}
        <div className="lg:col-span-2 space-y-6">
           {/* Hızlı İşlemler */}
           <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
             <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-500" />
                Hızlı İşlemler
             </h3>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
               <button onClick={() => setActiveMainTab('kayit')} className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition text-left flex flex-col gap-2 cursor-pointer">
                 <UserPlus className="w-5 h-5" />
                 <span className="text-xs font-bold">Yeni Kayıt</span>
               </button>
               <button onClick={() => setActiveMainTab('yoklama')} className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition text-left flex flex-col gap-2 cursor-pointer">
                 <ClipboardCheck className="w-5 h-5" />
                 <span className="text-xs font-bold">Yoklama Al</span>
               </button>
               <button onClick={() => setActiveMainTab('bungalov')} className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition text-left flex flex-col gap-2 cursor-pointer">
                 <Home className="w-5 h-5" />
                 <span className="text-xs font-bold">Oda Yerleşimi</span>
               </button>
               <button onClick={() => setIsSurveyModalOpen(true)} className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition text-left flex flex-col gap-2 cursor-pointer">
                 <MessageSquare className="w-5 h-5" />
                 <span className="text-xs font-bold">Anket Gönder</span>
               </button>
             </div>
           </div>

           {/* Survey Results Miniature */}
           <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
             <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
               <Check className="w-4 h-4 text-emerald-600" />
               Genel Memnuniyet Durumu
             </h3>
             <p className="text-xs text-gray-500 mb-5">Dönem sonu anketlerinden alınan ortalama değerlendirmeler.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {surveyData.map((item, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
                      <span>{item.name}</span>
                      <span className="text-emerald-700">% {item['Memnuniyet (%)']}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${item['Memnuniyet (%)']}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
           </div>
           
           {/* Custom drawn HTML5 Visual Statistics (Age & Gender distributions) */}
           <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
             <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5 font-sans">
               <TrendingUp className="w-4 h-4 text-emerald-600" />
               Demografik Analiz
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Gender bar comparative indicator */}
               <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-3">
                 <span className="text-3xs font-extrabold text-gray-400 tracking-wider uppercase">Cinsiyet Dağılımı</span>
                 <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-pink-600">Kadın ({girlCount})</span>
                   <span className="text-blue-600">Erkek ({boyCount})</span>
                 </div>
                 <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden flex">
                   <div className="bg-pink-500 h-full" style={{ width: `${girlPercent}%` }} title={`Kadın %${girlPercent}`}></div>
                   <div className="bg-emerald-600 h-full" style={{ width: `${boyPercent}%` }} title={`Erkek %${boyPercent}`}></div>
                 </div>
               </div>
               
               {/* Age categorization */}
               <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-3">
                 <span className="text-3xs font-extrabold text-gray-400 tracking-wider uppercase">Yaş Dağılımı</span>
                 <div className="space-y-2">
                   <div>
                     <div className="flex justify-between text-3xs font-bold text-gray-600 mb-1">
                       <span>11-12 Yaş</span>
                       <span>{ageDist['11-12']} Katılımcı</span>
                     </div>
                     <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-emerald-600 h-full" style={{ width: `${(ageDist['11-12'] / (totalCount || 1)) * 100}%` }}></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-3xs font-bold text-gray-600 mb-1">
                       <span>13-14 Yaş</span>
                       <span>{ageDist['13-14']} Katılımcı</span>
                     </div>
                     <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-emerald-600 h-full" style={{ width: `${(ageDist['13-14'] / (totalCount || 1)) * 100}%` }}></div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Right Column: System Logs & Mini Info */}
        <div className="space-y-6">
           <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
             <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-blue-600" />
                Son Sistem İşlemleri
             </h3>
             <div className="space-y-4 flex-1">
               {logs.slice(0, 7).map(log => (
                 <div key={log.id} className="relative pl-4 border-l-2 border-gray-200">
                   <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-gray-300 border-2 border-white"></div>
                   <p className="text-xs font-bold text-gray-800">{log.action}</p>
                   <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{log.details}</p>
                   <span className="text-[9px] text-gray-400 font-mono mt-1 block">
                     {new Date(log.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} • {log.userName || (log as any).user}
                   </span>
                 </div>
               ))}
             </div>
             <button onClick={() => setActiveMainTab('sistem')} className="w-full mt-4 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-center cursor-pointer border border-gray-200">
               Tüm Kayıtları Gör
             </button>
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
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <h3 className="font-bold text-emerald-900 text-sm mb-1">Kapsamlı Değerlendirme Anketi</h3>
                  <p className="text-xs text-emerald-700">Genel Memnuniyet, Tesis & Konaklama ve Eğitim & Etkinlik değerlendirmelerini ve katılımcı görüşlerini tek başlıkta toplar.</p>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Hedef Kitle</label>
                  <select 
                    value={surveyAudience}
                    onChange={(e) => setSurveyAudience(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 text-sm"
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
                      value={surveyTemplates.kapsamli}
                      onChange={(e) => setSurveyTemplates({ kapsamli: e.target.value })}
                      className="mt-2 w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 text-sm"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-2 text-indigo-700 bg-indigo-50 p-2 rounded-lg font-medium border border-indigo-100">
                      {surveyTemplates.kapsamli}
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
                  className="px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Gönderimi Başlat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Period Detail Modal */}
      {selectedPeriodDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{selectedPeriodDetail.name}</h3>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedPeriodDetail.isActive ? 'bg-emerald-100 text-emerald-800' : 
                  selectedPeriodDetail.status === 'Tamamlandı' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedPeriodDetail.isActive ? 'Aktif' : selectedPeriodDetail.status}
                </span>
              </div>
              <button 
                onClick={() => setSelectedPeriodDetail(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">Tarih</span>
                  <span className="font-semibold">{new Date(selectedPeriodDetail.startDate).toLocaleDateString()} - {new Date(selectedPeriodDetail.endDate).toLocaleDateString()}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">Kota</span>
                  <span className="font-semibold">{selectedPeriodDetail.maxQuota} Kişi</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">Cinsiyet Grubu</span>
                  <span className="font-semibold">{selectedPeriodDetail.gender || 'Karışık/Aile'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">Yaş Aralığı</span>
                  <span className="font-semibold">{selectedPeriodDetail.minAge && selectedPeriodDetail.maxAge ? `${selectedPeriodDetail.minAge} - ${selectedPeriodDetail.maxAge} Yaş` : 'Kısıtlama Yok'}</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <span className="block text-[10px] font-bold text-amber-600 uppercase mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Kriterler / Başvuru Uyarıları
                </span>
                <p className="font-medium text-amber-900 text-xs">
                  {selectedPeriodDetail.criteria || 'Özel bir kriter veya uyarı eklenmemiş.'}
                </p>
              </div>

              <div 
                className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 cursor-pointer hover:bg-emerald-100/50 transition-colors"
                onClick={() => setShowPeriodParticipants(!showPeriodParticipants)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="block text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Başvuru Özeti
                  </span>
                  {showPeriodParticipants ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="font-medium text-emerald-900 text-xs">
                  {selectedPeriodDetail.status === 'Tamamlandı' ? (
                     `Kamp ${new Date(selectedPeriodDetail.endDate).toLocaleDateString()} tarihinde tamamlandı. Toplam ${participants.filter(p => p.campPeriodId === selectedPeriodDetail.id).length} katılımcı katıldı.`
                  ) : selectedPeriodDetail.isActive ? (
                     `Şu anda aktif. Toplam ${participants.filter(p => p.campPeriodId === selectedPeriodDetail.id && p.status === 'Kampta').length} kişi kampta bulunuyor. Kota doluluk oranı: ${Math.round((participants.filter(p => p.campPeriodId === selectedPeriodDetail.id && p.status === 'Kampta').length / selectedPeriodDetail.maxQuota) * 100)}%`
                  ) : (
                     `Toplam ${participants.filter(p => p.campPeriodId === selectedPeriodDetail.id && p.status === 'Başvuru Yapıldı').length} başvuru alındı. Henüz başlamadı.`
                  )}
                </p>
                
                {showPeriodParticipants && (
                  <div className="mt-4 pt-3 border-t border-emerald-200/50" onClick={e => e.stopPropagation()}>
                    <h4 className="text-xs font-bold text-emerald-800 mb-2 flex justify-between items-center">
                      <span>Başvurular ({participants.filter(p => p.campPeriodId === selectedPeriodDetail.id).length})</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPeriodDetail(null);
                          setActiveMainTab('katilimci');
                        }}
                        className="text-[9px] bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700 transition"
                      >
                        Tümünü Gör
                      </button>
                    </h4>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                      {participants.filter(p => p.campPeriodId === selectedPeriodDetail.id).length > 0 ? (
                        participants.filter(p => p.campPeriodId === selectedPeriodDetail.id).map(p => (
                          <div 
                            key={p.id} 
                            className="bg-white p-2 rounded border border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedParticipantDetail(p);
                            }}
                          >
                            <div>
                              <p className="text-xs font-bold text-gray-800 hover:text-emerald-700 transition-colors">{p.name}</p>
                              <p className="text-[10px] text-gray-500">{p.identityNumber} - {p.gender}</p>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${
                              p.status === 'Kampta' ? 'bg-emerald-100 text-emerald-700' :
                              p.status === 'Ayrıldı' ? 'bg-blue-100 text-blue-700' :
                              p.status === 'Reddedildi' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {p.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-emerald-700 text-center py-2">Henüz başvuru bulunmuyor.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
               <button onClick={() => setSelectedPeriodDetail(null)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm cursor-pointer">
                 Kapat
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Editing Period Modal */}
      {editingPeriod && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl my-8">
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Kamp Dönemi Düzenle</h3>
                <p className="text-xs text-gray-500 mt-1">Dönem bilgilerini buradan güncelleyebilirsiniz.</p>
              </div>
              <button 
                onClick={() => setEditingPeriod(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePeriod} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dönem Adı *</label>
                <input
                  type="text"
                  value={editingPeriod.name}
                  onChange={(e) => setEditingPeriod({...editingPeriod, name: e.target.value})}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Başlangıç *</label>
                  <input
                    type="date"
                    value={editingPeriod.startDate}
                    onChange={(e) => setEditingPeriod({...editingPeriod, startDate: e.target.value})}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bitiş *</label>
                  <input
                    type="date"
                    value={editingPeriod.endDate}
                    onChange={(e) => setEditingPeriod({...editingPeriod, endDate: e.target.value})}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kota *</label>
                  <input
                    type="number"
                    value={editingPeriod.maxQuota}
                    onChange={(e) => setEditingPeriod({...editingPeriod, maxQuota: parseInt(e.target.value)})}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cinsiyet Grubu *</label>
                  <select
                    value={editingPeriod.gender || 'Karışık/Aile'}
                    onChange={(e) => setEditingPeriod({...editingPeriod, gender: e.target.value as any})}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                    <option value="Karışık/Aile">Karışık/Aile</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Min. Yaş</label>
                  <input
                    type="number"
                    value={editingPeriod.minAge || ''}
                    onChange={(e) => setEditingPeriod({...editingPeriod, minAge: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Max. Yaş</label>
                  <input
                    type="number"
                    value={editingPeriod.maxAge || ''}
                    onChange={(e) => setEditingPeriod({...editingPeriod, maxAge: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kriterler / Başvuru Uyarıları</label>
                <textarea
                  value={editingPeriod.criteria || ''}
                  onChange={(e) => setEditingPeriod({...editingPeriod, criteria: e.target.value})}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                  rows={3}
                ></textarea>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingPeriod(null)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm cursor-pointer">
                  İptal
                </button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 cursor-pointer transition">
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Participant Detail Modal */}
      {selectedParticipantDetail && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-600 p-4 flex justify-between items-start text-white">
              <div>
                <h3 className="font-bold text-lg">{selectedParticipantDetail.name}</h3>
                <p className="text-xs opacity-90">{selectedParticipantDetail.identityNumber}</p>
              </div>
              <button 
                onClick={() => setSelectedParticipantDetail(null)}
                className="p-1 text-white hover:bg-emerald-500 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase">Cinsiyet</span>
                  <span className="font-bold text-gray-800 text-sm">{selectedParticipantDetail.gender}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase">Doğum Tarihi</span>
                  <span className="font-bold text-gray-800 text-sm">{new Date(selectedParticipantDetail.birthDate).toLocaleDateString()}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase">İletişim No</span>
                  <span className="font-bold text-gray-800 text-sm">{selectedParticipantDetail.phone || '-'}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase">Kategori</span>
                  <span className="font-bold text-gray-800 text-sm">{selectedParticipantDetail.category}</span>
                </div>
              </div>

              {(selectedParticipantDetail.allergies !== 'Yok' || selectedParticipantDetail.chronicDiseases !== 'Yok' || selectedParticipantDetail.medications !== 'Yok') && (
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                  <span className="block text-[10px] font-bold text-amber-800 uppercase mb-2 flex items-center gap-1">
                    <HeartPulse className="w-3 h-3" />
                    Sağlık Bilgileri
                  </span>
                  <div className="space-y-1 text-xs text-amber-900">
                    {selectedParticipantDetail.allergies !== 'Yok' && <p><strong>Alerji:</strong> {selectedParticipantDetail.allergies}</p>}
                    {selectedParticipantDetail.chronicDiseases !== 'Yok' && <p><strong>Kronik:</strong> {selectedParticipantDetail.chronicDiseases}</p>}
                    {selectedParticipantDetail.medications !== 'Yok' && <p><strong>İlaçlar:</strong> {selectedParticipantDetail.medications}</p>}
                  </div>
                </div>
              )}
              
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedParticipantDetail.status === 'Kampta' ? 'bg-emerald-100 text-emerald-800' :
                  selectedParticipantDetail.status === 'Reddedildi' ? 'bg-red-100 text-red-800' :
                  selectedParticipantDetail.status === 'Ayrıldı' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {selectedParticipantDetail.status}
                </span>
                
                <button 
                  onClick={() => {
                    setSelectedParticipantDetail(null);
                    setSelectedPeriodDetail(null);
                    setActiveMainTab('katilimci');
                  }}
                  className="text-emerald-700 text-xs font-bold hover:underline"
                >
                  Detaylı Profili Gör
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY: Dönem Sonu Verimlilik Raporu */}
      <div className="hidden print:block text-black bg-white">
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-black mb-2">YEŞİLAY KAMP YÖNETİM SİSTEMİ</h1>
          <h2 className="text-2xl font-bold">Dönem Sonu Verimlilik Raporu</h2>
          <p className="text-sm mt-2 font-medium">Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">Katılımcı İstatistikleri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-300 rounded">
                <p className="text-sm text-gray-500">Toplam Başvuru</p>
                <p className="text-3xl font-black">{participants.length}</p>
              </div>
              <div className="p-4 border border-gray-300 rounded">
                <p className="text-sm text-gray-500">Kampa Katılan</p>
                <p className="text-3xl font-black">{participants.filter(p => p.status === 'Kampta' || p.status === 'Ayrıldı').length}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">Finansal Özet (Giderler)</h3>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="py-2">Kategori</th>
                  <th className="py-2">Tutar (TL)</th>
                </tr>
              </thead>
              <tbody>
                {['Konaklama', 'Yemek', 'Ulaşım', 'Aktivite', 'Personel', 'Genel Gider'].map(cat => {
                  const total = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
                  if (total === 0) return null;
                  return (
                    <tr key={cat} className="border-b border-gray-200">
                      <td className="py-2">{cat}</td>
                      <td className="py-2 font-bold">{total.toLocaleString('tr-TR')} ₺</td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-gray-800 font-bold bg-gray-100">
                  <td className="py-2 px-2">Genel Toplam</td>
                  <td className="py-2 px-2">{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('tr-TR')} ₺</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">Memnuniyet Anketleri Ortalaması</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border border-gray-300 rounded text-center">
                <p className="text-sm text-gray-500 mb-1">Yemek</p>
                <p className="text-2xl font-black">{surveys.length ? (surveys.reduce((sum, s) => sum + s.ratingMeals, 0) / surveys.length).toFixed(1) : '-'} / 5</p>
              </div>
              <div className="p-4 border border-gray-300 rounded text-center">
                <p className="text-sm text-gray-500 mb-1">Aktivite</p>
                <p className="text-2xl font-black">{surveys.length ? (surveys.reduce((sum, s) => sum + s.ratingActivities, 0) / surveys.length).toFixed(1) : '-'} / 5</p>
              </div>
              <div className="p-4 border border-gray-300 rounded text-center">
                <p className="text-sm text-gray-500 mb-1">Tesis</p>
                <p className="text-2xl font-black">{surveys.length ? (surveys.reduce((sum, s) => sum + s.ratingBungalows, 0) / surveys.length).toFixed(1) : '-'} / 5</p>
              </div>
              <div className="p-4 border border-gray-300 rounded text-center">
                <p className="text-sm text-gray-500 mb-1">Eğitmenler</p>
                <p className="text-2xl font-black">{surveys.length ? (surveys.reduce((sum, s) => sum + s.ratingTrainers, 0) / surveys.length).toFixed(1) : '-'} / 5</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
