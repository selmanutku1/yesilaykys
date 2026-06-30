import React, { useState, useMemo } from 'react';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Info,
  Sliders,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Users,
  Percent,
  DollarSign,
  Briefcase,
  Layers,
  Utensils,
  Home,
  Truck,
  Activity,
  UserCheck,
  ChevronRight,
  Download,
  Lightbulb,
  ShieldCheck,
  Filter,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  PieChart,
  BookOpen
} from 'lucide-react';
import { Participant, CampPeriod } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface CostAnalysisViewProps {
  participants: Participant[];
  periods: CampPeriod[];
}

export interface Expense {
  id: string;
  name: string;
  category: 'Konaklama' | 'Yemek' | 'Ulaşım' | 'Aktivite' | 'Personel' | 'Genel Gider';
  amount: number;
  type: 'Sabit' | 'Değişken';
  date: string;
  description: string;
}

export default function CostAnalysisView({ participants, periods }: CostAnalysisViewProps) {
  // Initial comprehensive expense dataset
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 'EXP-001',
      name: 'Bungalov Yatak Takımları ve Çarşaf Değişimi',
      category: 'Konaklama',
      amount: 15200,
      type: 'Değişken',
      date: '2026-06-16',
      description: 'Dönem başında tüm odalar için hijyenik çarşaf tedariği.'
    },
    {
      id: 'EXP-002',
      name: 'Bungalov Tesisat ve Klima Bakımları',
      category: 'Konaklama',
      amount: 8500,
      type: 'Sabit',
      date: '2026-06-15',
      description: 'Genel elektrik/klima yıllık ve periyodik bakımı.'
    },
    {
      id: 'EXP-003',
      name: 'Odalar Temizlik Malzemeleri',
      category: 'Konaklama',
      amount: 4200,
      type: 'Değişken',
      date: '2026-06-16',
      description: 'Oda hijyeni için dezenfektan ve deterjan alımı.'
    },
    {
      id: 'EXP-004',
      name: 'Öğün Yemek İaşesi (Tedarikçi Firma)',
      category: 'Yemek',
      amount: 52000,
      type: 'Değişken',
      date: '2026-06-18',
      description: 'Ana öğünler için gıda hammadde alımı.'
    },
    {
      id: 'EXP-005',
      name: 'Günlük Ara Öğün ve Meyve Suyu Tedariği',
      category: 'Yemek',
      amount: 9800,
      type: 'Değişken',
      date: '2026-06-17',
      description: 'Katılımcı ikramları ve içecek bütçesi.'
    },
    {
      id: 'EXP-006',
      name: 'Arıtma Su Filtre Değişimleri',
      category: 'Yemek',
      amount: 3500,
      type: 'Sabit',
      date: '2026-06-15',
      description: 'Yemekhane sebil filtrelerinin yenilenmesi.'
    },
    {
      id: 'EXP-007',
      name: 'Beykoz-Sarıyer Katılımcı Transfer Servisi',
      category: 'Ulaşım',
      amount: 18000,
      type: 'Değişken',
      date: '2026-06-15',
      description: 'Katılımcıların transferini sağlayan otobüs kiralama.'
    },
    {
      id: 'EXP-008',
      name: 'Hizmet Aracı Yakıt Gideri',
      category: 'Ulaşım',
      amount: 7200,
      type: 'Değişken',
      date: '2026-06-17',
      description: 'Kamp içi operasyonel araç yakıtı.'
    },
    {
      id: 'EXP-009',
      name: 'Okçuluk ve Doğa Sporları Malzemeleri',
      category: 'Aktivite',
      amount: 9000,
      type: 'Sabit',
      date: '2026-06-16',
      description: 'Spor sahası hedef tahtası ve yay alımları.'
    },
    {
      id: 'EXP-010',
      name: 'Turnuva Madalya ve Katılım Sertifikaları',
      category: 'Aktivite',
      amount: 4500,
      type: 'Değişken',
      date: '2026-06-18',
      description: 'Final etkinlikleri için ödül setleri.'
    },
    {
      id: 'EXP-011',
      name: 'İdari ve Koordinasyon Personeli Maaşları',
      category: 'Personel',
      amount: 45000,
      type: 'Sabit',
      date: '2026-06-15',
      description: 'Dönemlik atanmış personel ve lider hakedişleri.'
    },
    {
      id: 'EXP-012',
      name: 'Gece Güvenlik Ekibi Hakedişi',
      category: 'Personel',
      amount: 18000,
      type: 'Sabit',
      date: '2026-06-15',
      description: 'Saha güvenliği gece vardiyası dış hizmet alımı.'
    },
    {
      id: 'EXP-013',
      name: 'Kamp Alanı Elektrik Faturası (Dönemlik)',
      category: 'Genel Gider',
      amount: 14000,
      type: 'Sabit',
      date: '2026-06-18',
      description: 'Sistem aydınlatmaları ve bungalov ısınma/soğutma.'
    },
    {
      id: 'EXP-014',
      name: 'Yazılım Altyapısı ve İnternet Hizmetleri',
      category: 'Genel Gider',
      amount: 6500,
      type: 'Sabit',
      date: '2026-06-15',
      description: 'Kamp yönetim sistemi bulut sunucu ve metro ethernet.'
    }
  ]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'distribution' | 'ledger' | 'simulator'>('overview');

  // New expense form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    category: 'Konaklama' as Expense['category'],
    amount: '',
    type: 'Sabit' as Expense['type'],
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Base Simulation Parameters (Default and User Interactive)
  const [simulationParticipants, setSimulationParticipants] = useState<number>(100);
  const [simulationOccupancy, setSimulationOccupancy] = useState<number>(80);
  const [simulationDays, setSimulationDays] = useState<number>(7);
  const [simulationPricePerDay, setSimulationPricePerDay] = useState<number>(2500); // Package daily pricing

  // Dynamic Metrics of the current camp state
  // We can derive current participant info from props, or use standard defaults for realism
  const campCapacity = 120; // Default nominal capacity
  const activeParticipantsCount = useMemo(() => {
    const kamptaCount = participants.filter(p => p.status === 'Kampta').length;
    return kamptaCount > 0 ? kamptaCount : 74; // Fallback to realistic active count
  }, [participants]);

  const occupancyRate = useMemo(() => {
    return Math.round((activeParticipantsCount / campCapacity) * 100);
  }, [activeParticipantsCount, campCapacity]);

  const campDurationDays = 7; // Average period duration

  // Toplam Katılımcı Gün = Toplam Katılımcı × Ortalama Kalış Süresi
  const totalParticipantDays = useMemo(() => {
    return activeParticipantsCount * campDurationDays;
  }, [activeParticipantsCount, campDurationDays]);

  // Actual Expense Calculations
  const metrics = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const fixed = expenses.filter(e => e.type === 'Sabit').reduce((sum, e) => sum + e.amount, 0);
    const variable = expenses.filter(e => e.type === 'Değişken').reduce((sum, e) => sum + e.amount, 0);

    // Kişi başı günlük hesaplamaları
    const fixedPerPersonDay = totalParticipantDays > 0 ? fixed / totalParticipantDays : 0;
    const variablePerPersonDay = totalParticipantDays > 0 ? variable / totalParticipantDays : 0;
    const totalPerPersonDay = fixedPerPersonDay + variablePerPersonDay;

    // Günlük toplam operasyonel maliyet
    const dailyOpCost = total / campDurationDays;

    return {
      total,
      fixed,
      variable,
      fixedPerPersonDay,
      variablePerPersonDay,
      totalPerPersonDay,
      dailyOpCost
    };
  }, [expenses, totalParticipantDays, campDurationDays]);

  // Category Based aggregation
  const categoryStats = useMemo(() => {
    const categories: Expense['category'][] = ['Konaklama', 'Yemek', 'Ulaşım', 'Aktivite', 'Personel', 'Genel Gider'];
    
    return categories.map(cat => {
      const catExpenses = expenses.filter(e => e.category === cat);
      const totalAmount = catExpenses.reduce((sum, e) => sum + e.amount, 0);
      const percentage = metrics.total > 0 ? Math.round((totalAmount / metrics.total) * 100) : 0;
      const perPersonDay = totalParticipantDays > 0 ? totalAmount / totalParticipantDays : 0;

      return {
        category: cat,
        totalAmount,
        percentage,
        perPersonDay
      };
    }).sort((a, b) => b.totalAmount - a.totalAmount); // Sort from highest to lowest
  }, [expenses, metrics.total, totalParticipantDays]);

  // Smart Advisory Engine Comments
  const smartInsights = useMemo(() => {
    const insights: { text: string; type: 'warning' | 'info' | 'success'; category: string }[] = [];

    // Rule 1: Eğer bir kategori toplam maliyetin %30’unu geçerse
    categoryStats.forEach(stat => {
      if (stat.percentage > 30) {
        insights.push({
          text: `"${stat.category}" harcamaları toplam bütçenin %${stat.percentage}'ine ulaştı. Bu kategori yüksek maliyetli, optimizasyon veya alternatif tedarikçiler önerilir.`,
          type: 'warning',
          category: stat.category
        });
      }
    });

    // Rule 2: Eğer yemek maliyeti kişi başı hedef bütçeyi (örn: 350 TL) aşarsa
    const yemekStat = categoryStats.find(s => s.category === 'Yemek');
    if (yemekStat && yemekStat.perPersonDay > 350) {
      insights.push({
        text: `Kişi başı günlük yemek maliyeti (${Math.round(yemekStat.perPersonDay)} TL), belirlenen 350 TL hedef bütçesinin üzerindedir. Toplu gıda alımı anlaşmaları veya menü optimizasyonu önerilir.`,
        type: 'warning',
        category: 'Yemek'
      });
    } else if (yemekStat) {
      insights.push({
        text: `Yemek maliyetleri kişi başı günlük ${Math.round(yemekStat.perPersonDay)} TL ile dengeli seyretmektedir.`,
        type: 'success',
        category: 'Yemek'
      });
    }

    // Rule 3: Eğer doluluk %70 altındaysa
    if (occupancyRate < 70) {
      insights.push({
        text: `Mevcut kamp doluluk oranı (%${occupancyRate}) %70 hedefinin altındadır. Sabit gider yükü (kişi başına düşen pay) yüksek kalmaktadır. Kapasiteyi verimli kullanmak adına kampanya veya okul işbirlikleri oluşturulması tavsiye edilir.`,
        type: 'warning',
        category: 'Doluluk'
      });
    } else {
      insights.push({
        text: `Kamp doluluk oranı (%${occupancyRate}) verimli düzeydedir. Sabit giderlerin katılımcı başına dağılımı optimize edilmiştir.`,
        type: 'success',
        category: 'Doluluk'
      });
    }

    // Rule 4: Eğer personel maliyeti %20’yi aşarsa
    const personelStat = categoryStats.find(s => s.category === 'Personel');
    if (personelStat && personelStat.percentage > 20) {
      insights.push({
        text: `Personel giderleri toplam bütçenin %${personelStat.percentage}'sini oluşturmaktadır (%20 sınırı aşılmıştır). Gönüllü entegrasyonu ve esnek vardiya planlamaları gözden geçirilmelidir.`,
        type: 'warning',
        category: 'Personel'
      });
    }

    return insights;
  }, [categoryStats, occupancyRate]);

  // Scenario Simulator calculations
  const simulatedMetrics = useMemo(() => {
    // Simulated Participant Day Count
    const simTotalParticipantDays = simulationParticipants * simulationDays;

    // Sabit giderler aynen kalır, değişken giderler katılımcı sayısına göre ölçeklenir
    // (Mevcut değişken giderleri aktif katılımcı gün sayısına bölüp yeni katılımcı gün ile çarpıyoruz)
    const originalVariablePerPersonDay = totalParticipantDays > 0 ? metrics.variable / totalParticipantDays : 100; // fallback default
    
    const simulatedFixed = metrics.fixed;
    const simulatedVariable = originalVariablePerPersonDay * simTotalParticipantDays;
    const simulatedTotal = simulatedFixed + simulatedVariable;

    // Kişi başı günlük maliyet
    const simFixedPerPersonDay = simulatedFixed / simTotalParticipantDays;
    const simVariablePerPersonDay = simulatedVariable / simTotalParticipantDays;
    const simTotalPerPersonDay = simFixedPerPersonDay + simVariablePerPersonDay;

    // Gelir & Kâr/Zarar
    const estimatedRevenue = simTotalParticipantDays * simulationPricePerDay;
    const estimatedProfitLoss = estimatedRevenue - simulatedTotal;

    // Başa baş noktası doluluk hesabı (Sadece sabit giderleri karşılamak için gereken asgari katılımcı sayısı)
    // Gelir/Gün - DeğişkenGider/Gün > 0 ise, her katılımcı sabit gideri kapatmaya katkı sağlar
    const marginPerPersonDay = simulationPricePerDay - originalVariablePerPersonDay;
    const breakEvenParticipants = marginPerPersonDay > 0 ? Math.ceil((metrics.fixed / simulationDays) / marginPerPersonDay) : 0;
    const breakEvenOccupancy = Math.min(100, Math.round((breakEvenParticipants / campCapacity) * 100));

    return {
      total: simulatedTotal,
      perPersonDay: simTotalPerPersonDay,
      revenue: estimatedRevenue,
      profitLoss: estimatedProfitLoss,
      breakEvenParticipants,
      breakEvenOccupancy
    };
  }, [simulationParticipants, simulationDays, simulationPricePerDay, metrics, totalParticipantDays, campCapacity]);

  // Handle adding new expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount) return;

    const added: Expense = {
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      name: newExpense.name,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      type: newExpense.type,
      date: newExpense.date,
      description: newExpense.description || 'Gider kaydı'
    };

    setExpenses(prev => [added, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setNewExpense({
      name: '',
      category: 'Konaklama',
      amount: '',
      type: 'Sabit',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  // Handle deleting expense
  const handleDeleteExpense = (id: string) => {
    if (confirm('Bu maliyet kalemini silmek istediğinize emin misiniz?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            e.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
      const matchesType = typeFilter === 'All' || e.type === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [expenses, searchTerm, categoryFilter, typeFilter]);

  // Color mappings helper for categories
  const getCategoryColor = (cat: Expense['category']) => {
    switch (cat) {
      case 'Konaklama': return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', hex: '#6366F1' };
      case 'Yemek': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', hex: '#F59E0B' };
      case 'Ulaşım': return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', hex: '#0EA5E9' };
      case 'Aktivite': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', hex: '#F43F5E' };
      case 'Personel': return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', hex: '#14B8A6' };
      case 'Genel Gider': return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', hex: '#9CA3AF' };
    }
  };

  return (
    <div id="cost-analysis-module" className="flex-1 overflow-y-auto bg-gray-50/50 p-6 space-y-6">
      
      {/* Module Title & Quick Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-emerald-700" />
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Katılımcı Maliyet Analiz Modülü</h1>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Mevcut kampın kişi başı ve kategori bazlı tüm operasyonel giderlerini izleyin, simülasyonlar ile kârlılık analizi yapın.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition duration-200 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Gider Girişi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sub-navigation Sidebar/Tabs */}
        <div className="lg:col-span-3 bg-white p-3.5 rounded-2xl border border-gray-150 shadow-xs flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSubTab('overview')}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 w-full shrink-0 cursor-pointer ${
              activeSubTab === 'overview'
                ? 'bg-emerald-50 text-emerald-800 border-l-0 lg:border-l-4 lg:border-emerald-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Genel Bakış</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveSubTab('distribution')}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 w-full shrink-0 cursor-pointer ${
              activeSubTab === 'distribution'
                ? 'bg-emerald-50 text-emerald-800 border-l-0 lg:border-l-4 lg:border-emerald-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <PieChart className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Bütçe Dağılımı &amp; Analiz</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('simulator')}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 w-full shrink-0 cursor-pointer ${
              activeSubTab === 'simulator'
                ? 'bg-emerald-50 text-emerald-800 border-l-0 lg:border-l-4 lg:border-emerald-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Senaryo Simülatörü</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ledger')}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 w-full shrink-0 cursor-pointer ${
              activeSubTab === 'ledger'
                ? 'bg-emerald-50 text-emerald-800 border-l-0 lg:border-l-4 lg:border-emerald-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Detaylı Gider Kaydı</span>
          </button>
        </div>

        {/* Right Active View Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* OVERVIEW TAB */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* KPI Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Toplam Gider Card */}
                <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Toplam Gider</span>
                    <span className="text-xl font-black text-gray-800 font-mono block mt-1">
                      {metrics.total.toLocaleString('tr-TR')} <span className="text-xs text-gray-500">TL</span>
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] font-semibold text-gray-500">
                    <span>Sabit: {metrics.fixed.toLocaleString('tr-TR')} TL</span>
                    <span>Değişken: {metrics.variable.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="absolute top-3 right-3 p-1.5 bg-emerald-50 rounded-xl">
                    <Coins className="w-4 h-4 text-emerald-700" />
                  </div>
                </div>

                {/* Kişi Başı Günlük Gider Card */}
                <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Kişi Başı Günlük Maliyet</span>
                    <span className="text-xl font-black text-[#00875A] font-mono block mt-1">
                      {Math.round(metrics.totalPerPersonDay).toLocaleString('tr-TR')} <span className="text-xs text-emerald-700">TL / Gün</span>
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] font-semibold text-gray-500">
                    <span>S: {Math.round(metrics.fixedPerPersonDay)} TL</span>
                    <span>D: {Math.round(metrics.variablePerPersonDay)} TL</span>
                  </div>
                  <div className="absolute top-3 right-3 p-1.5 bg-emerald-50 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-[#00875A]" />
                  </div>
                </div>

                {/* Doluluk & Gün Sayısı Card */}
                <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Doluluk &amp; Katılımcı</span>
                    <span className="text-xl font-black text-gray-800 font-mono block mt-1">
                      %{occupancyRate} <span className="text-xs text-gray-500">({activeParticipantsCount} Katılımcı)</span>
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] font-semibold text-gray-400">
                    <span>Kapasite: {campCapacity} Kişi</span>
                    <span className="text-gray-500 font-bold">Süre: {campDurationDays} Gün</span>
                  </div>
                  <div className="absolute top-3 right-3 p-1.5 bg-indigo-50 rounded-xl">
                    <Users className="w-4 h-4 text-indigo-700" />
                  </div>
                </div>

                {/* Günlük Toplam Operasyon Maliyeti Card */}
                <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Günlük Kamp Gideri</span>
                    <span className="text-xl font-black text-amber-700 font-mono block mt-1">
                      {Math.round(metrics.dailyOpCost).toLocaleString('tr-TR')} <span className="text-xs text-gray-500">TL / Gün</span>
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100 text-[10px] font-semibold text-gray-500 text-center">
                    Toplam Katılımcı Gün: <span className="font-mono text-gray-700 font-bold">{totalParticipantDays}</span>
                  </div>
                  <div className="absolute top-3 right-3 p-1.5 bg-amber-50 rounded-xl">
                    <Layers className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
              </div>

              {/* Advanced Charts: Timeline and Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs h-[300px] flex flex-col">
                  <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                    <TrendingUp className="w-4 h-4 text-emerald-700" /> Zaman İçinde Gider Dağılımı
                  </span>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={Object.entries(expenses.reduce((acc, curr) => {
                          acc[curr.date] = (acc[curr.date] || 0) + curr.amount;
                          return acc;
                        }, {} as Record<string, number>))
                        .map(([date, total]) => ({ date, total }))
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="date" tick={{fontSize: 10, fill: '#6B7280'}} tickMargin={10} axisLine={false} tickLine={false} />
                        <YAxis tick={{fontSize: 10, fill: '#6B7280'}} tickFormatter={(value) => `${value.toLocaleString('tr-TR')} ₺`} axisLine={false} tickLine={false} />
                        <RechartsTooltip 
                          formatter={(value: number) => [`${value.toLocaleString('tr-TR')} TL`, 'Toplam Maliyet']}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="total" stroke="#047857" strokeWidth={3} dot={{r: 4, fill: '#047857', strokeWidth: 0}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs h-[300px] flex flex-col">
                  <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                    <PieChart className="w-4 h-4 text-blue-700" /> Kategori Bazlı Maliyet Özeti
                  </span>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryStats.map(stat => ({ name: stat.category, value: stat.totalAmount }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" tick={{fontSize: 10, fill: '#6B7280'}} tickMargin={10} axisLine={false} tickLine={false} />
                        <YAxis tick={{fontSize: 10, fill: '#6B7280'}} tickFormatter={(value) => `${(value/1000).toLocaleString('tr-TR')}k ₺`} axisLine={false} tickLine={false} />
                        <RechartsTooltip 
                          formatter={(value: number) => [`${value.toLocaleString('tr-TR')} TL`, 'Maliyet']}
                          cursor={{fill: '#F3F4F6'}}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Overview Secondary Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overview Welcome & Info Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4">
                  <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-700" /> Kamp Finansal Karnesi
                  </span>
                  
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Bu modül, kampın kişi başı operasyonel bütçesini, gider tipolojilerini ve kârlılık durumunu analiz etmek için geliştirilmiştir. Sol menüyü kullanarak detaylı bütçe kırılımlarını görebilir, senaryo simülatörünü çalıştırabilir veya gider defterini yönetebilirsiniz.
                  </p>

                  <div className="border-t border-gray-100 pt-4 space-y-2 text-xs font-semibold text-gray-600">
                    <div className="flex justify-between items-center py-1">
                      <span>Aktif Kamp Doluluk Durumu</span>
                      <span className="font-bold text-gray-900">%{occupancyRate}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Kişi Başı Sabit Gider Yükü</span>
                      <span className="font-mono font-bold text-gray-900">{Math.round(metrics.fixedPerPersonDay).toLocaleString('tr-TR')} TL</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Kişi Başı Değişken Gider</span>
                      <span className="font-mono font-bold text-emerald-700">{Math.round(metrics.variablePerPersonDay).toLocaleString('tr-TR')} TL</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-t border-gray-100 pt-2 text-gray-800 font-extrabold">
                      <span>Toplam Kişi Başı Günlük Maliyet</span>
                      <span className="font-mono text-emerald-800">{Math.round(metrics.totalPerPersonDay).toLocaleString('tr-TR')} TL/Gün</span>
                    </div>
                  </div>
                </div>

                {/* AI Advisor Panel */}
                <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-900 shadow-md space-y-4">
                  <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
                    <span className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" /> Akıllı Analiz &amp; Karar Destek
                    </span>
                    <span className="text-[9px] bg-emerald-800 text-emerald-200 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                      Gerçek Zamanlı
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                    {smartInsights.map((insight, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border flex gap-2 text-xs font-medium leading-relaxed ${
                          insight.type === 'warning' 
                            ? 'bg-amber-950/70 border-amber-800 text-amber-150' 
                            : 'bg-emerald-900/65 border-emerald-800 text-emerald-100'
                        }`}
                      >
                        {insight.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <span className="font-extrabold text-[9px] uppercase tracking-wider block text-gray-300">
                            {insight.category} Analizi
                          </span>
                          <p className="text-3xs sm:text-2xs">{insight.text}</p>
                        </div>
                      </div>
                    ))}

                    {smartInsights.length === 0 && (
                      <div className="text-center py-6 text-emerald-200 text-xs italic">
                        Bütçe anomalisi tespit edilmemiştir. Tüm maliyetler optimum sınırlardadır.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DISTRIBUTION TAB */}
          {activeSubTab === 'distribution' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
              {/* Visual Progress Charts */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-700" /> Kategori Bazlı Maliyet Dağılımı
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Yüzde Dağılımı</span>
                </div>

                {/* Custom Horizontal Visual Bar Representation */}
                <div className="space-y-4">
                  {categoryStats.map(stat => {
                    const colors = getCategoryColor(stat.category);
                    return (
                      <div key={stat.category} className="space-y-1.5">
                        <div className="flex justify-between items-center text-2xs font-bold text-gray-700">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.hex }} />
                            <span>{stat.category}</span>
                          </div>
                          <div className="font-mono space-x-1 sm:space-x-2 text-right">
                            <span className="text-gray-400">%{stat.percentage}</span>
                            <span className="text-gray-900 font-black">{stat.totalAmount.toLocaleString('tr-TR')} TL</span>
                          </div>
                        </div>
                        {/* Visual Progress Bar */}
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${stat.percentage}%`,
                              backgroundColor: colors.hex
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Visual Donut Grid Representation (Visual Mini Charts) */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                  <div className="p-3 bg-gray-50/75 rounded-xl border border-gray-100 text-center space-y-1">
                    <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest block">Sabit Payı</span>
                    <span className="text-sm font-black font-mono text-indigo-700">
                      %{metrics.total > 0 ? Math.round((metrics.fixed / metrics.total) * 100) : 0}
                    </span>
                    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600" 
                        style={{ width: `${metrics.total > 0 ? (metrics.fixed / metrics.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50/75 rounded-xl border border-gray-100 text-center space-y-1">
                    <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest block">Değişken Payı</span>
                    <span className="text-sm font-black font-mono text-amber-700">
                      %{metrics.total > 0 ? Math.round((metrics.variable / metrics.total) * 100) : 0}
                    </span>
                    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-600" 
                        style={{ width: `${metrics.total > 0 ? (metrics.variable / metrics.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50/75 rounded-xl border border-gray-100 text-center space-y-1">
                    <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest block">Günlük Ort.</span>
                    <span className="text-sm font-black font-mono text-[#00875A]">
                      {Math.round(metrics.dailyOpCost).toLocaleString('tr-TR')} TL
                    </span>
                    <div className="text-[8px] text-gray-400 font-bold leading-none mt-1">İşletim Gideri</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Box */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-3">
                    <Lightbulb className="w-4 h-4 text-emerald-700" /> Bütçe Optimizasyon Senaryoları
                  </span>
                  <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                    Aşağıdaki simüle edilmiş aksiyon paketlerini uygulayarak bütçe üzerinde yaratacakları olumlu tasarrufları veya gelir artışlarını anlık olarak sisteme yansıtabilirsiniz.
                  </p>
                </div>

                <div className="space-y-2 pt-3">
                  <button 
                    type="button"
                    onClick={() => {
                      alert("Aksiyon tetiklendi: Toplu satın alma anlaşmaları simülasyonu başlatıldı. Yemek tedarikçi maliyeti %15 düşürüldü.");
                      setExpenses(prev => prev.map(e => e.category === 'Yemek' ? { ...e, amount: Math.round(e.amount * 0.85) } : e));
                    }}
                    className="w-full bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 py-2.5 px-3 rounded-xl border border-gray-150 hover:border-emerald-250 flex items-center justify-between transition cursor-pointer text-2xs font-extrabold"
                  >
                    <span>Gıda Toplu Satın Alma Anlaşması (%15 Tasarruf)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      alert("Aksiyon tetiklendi: Dönem doluluk kampanyası oluşturuldu. 2. ve 3. dönem için %20 indirim kuponları e-postalandı.");
                      setSimulationOccupancy(95);
                      setSimulationParticipants(115);
                    }}
                    className="w-full bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 py-2.5 px-3 rounded-xl border border-gray-150 hover:border-emerald-250 flex items-center justify-between transition cursor-pointer text-2xs font-extrabold"
                  >
                    <span>Mevsimlik Doluluk Kampanyası (%95 Doluluk)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      alert("Aksiyon tetiklendi: Lider ve Premium paket fiyatlandırmaları optimize edildi. Yeni günlük fiyat 3,000 TL olarak revize edildi.");
                      setSimulationPricePerDay(3000);
                    }}
                    className="w-full bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 py-2.5 px-3 rounded-xl border border-gray-150 hover:border-emerald-250 flex items-center justify-between transition cursor-pointer text-2xs font-extrabold"
                  >
                    <span>Paket Fiyatlandırma Revizyonu (3.000 TL/Gün)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      alert("Aksiyon tetiklendi: Gönüllü koordinatör atamaları ile operasyonel personel bütçesinde %10 tasarruf sağlandı.");
                      setExpenses(prev => prev.map(e => e.category === 'Personel' ? { ...e, amount: Math.round(e.amount * 0.90) } : e));
                    }}
                    className="w-full bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 py-2.5 px-3 rounded-xl border border-gray-150 hover:border-emerald-250 flex items-center justify-between transition cursor-pointer text-2xs font-extrabold"
                  >
                    <span>Personel Vardiya Optimizasyonu (%10 Tasarruf)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATOR TAB */}
          {activeSubTab === 'simulator' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
              {/* Senaryo Simülasyon Paneli */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-5">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-700" /> Senaryo Simülatörü (Interactive)
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Gelecek Projeksiyonu</span>
                </div>

                <p className="text-gray-500 text-2xs leading-relaxed">
                  Farklı katılımcı sayıları ve doluluk durumlarında kampın kârlılığını, tahmini gider ve gelir trendlerini anlık olarak simüle edin.
                </p>

                {/* Quick Presets Buttons */}
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest block">Hazır Senaryo Şablonları</span>
                  <div className="grid grid-cols-3 gap-1.5 text-3xs font-extrabold">
                    <button 
                      type="button"
                      onClick={() => {
                        setSimulationParticipants(50);
                        setSimulationOccupancy(42);
                      }}
                      className={`py-1.5 px-2 rounded-lg border transition text-center cursor-pointer ${
                        simulationParticipants === 50 
                          ? 'bg-emerald-700 text-white border-emerald-700' 
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                      }`}
                    >
                      50 Katılımcı (%42)
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setSimulationParticipants(100);
                        setSimulationOccupancy(83);
                      }}
                      className={`py-1.5 px-2 rounded-lg border transition text-center cursor-pointer ${
                        simulationParticipants === 100 
                          ? 'bg-emerald-700 text-white border-emerald-700' 
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                      }`}
                    >
                      100 Katılımcı (%83)
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setSimulationParticipants(250);
                        setSimulationOccupancy(100);
                        setSimulationDays(10);
                      }}
                      className={`py-1.5 px-2 rounded-lg border transition text-center cursor-pointer ${
                        simulationParticipants === 250 
                          ? 'bg-emerald-700 text-white border-emerald-700' 
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                      }`}
                    >
                      250 Katılımcı (Lider)
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-3xs font-extrabold pt-1">
                    <button 
                      type="button"
                      onClick={() => {
                        setSimulationOccupancy(50);
                        setSimulationParticipants(60);
                      }}
                      className={`py-1.5 px-2 rounded-lg border transition text-center cursor-pointer ${
                        simulationOccupancy === 50 
                          ? 'bg-indigo-700 text-white border-indigo-700' 
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                      }`}
                    >
                      %50 Doluluk
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setSimulationOccupancy(80);
                        setSimulationParticipants(96);
                      }}
                      className={`py-1.5 px-2 rounded-lg border transition text-center cursor-pointer ${
                        simulationOccupancy === 80 
                          ? 'bg-indigo-700 text-white border-indigo-700' 
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                      }`}
                    >
                      %80 Doluluk
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setSimulationOccupancy(100);
                        setSimulationParticipants(120);
                      }}
                      className={`py-1.5 px-2 rounded-lg border transition text-center cursor-pointer ${
                        simulationOccupancy === 100 
                          ? 'bg-indigo-700 text-white border-indigo-700' 
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                      }`}
                    >
                      %100 Doluluk
                    </button>
                  </div>
                </div>

                {/* Live Slider inputs */}
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-2xs font-extrabold text-gray-600">
                      <span>Simüle Edilen Katılımcı Sayısı</span>
                      <span className="text-gray-900 font-mono">{simulationParticipants} Kişi</span>
                    </div>
                    <input 
                      type="range"
                      min="20"
                      max="300"
                      value={simulationParticipants}
                      onChange={(e) => setSimulationParticipants(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-full accent-emerald-700 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-2xs font-extrabold text-gray-600">
                      <span>Kişi Başı Günlük Paket Ücreti (Gelir)</span>
                      <span className="text-emerald-700 font-mono">{simulationPricePerDay.toLocaleString('tr-TR')} TL</span>
                    </div>
                    <input 
                      type="range"
                      min="1000"
                      max="5000"
                      step="100"
                      value={simulationPricePerDay}
                      onChange={(e) => setSimulationPricePerDay(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-full accent-emerald-700 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-2xs font-extrabold text-gray-600">
                      <span>Kamp Süresi</span>
                      <span className="text-gray-900 font-mono">{simulationDays} Gün</span>
                    </div>
                    <input 
                      type="range"
                      min="3"
                      max="21"
                      value={simulationDays}
                      onChange={(e) => setSimulationDays(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-full accent-emerald-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Simulation Results Output Box */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4">
                <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-3">
                  <Coins className="w-4 h-4 text-emerald-700" /> Tahmini Simülasyon Sonuçları
                </span>
                
                <div className="p-4 rounded-xl border bg-gray-50 space-y-3.5">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-2.5 bg-white rounded-lg border border-gray-150">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Kişi Başı Maliyet</span>
                      <span className="text-xs sm:text-sm font-extrabold text-gray-800 font-mono">
                        {Math.round(simulatedMetrics.perPersonDay).toLocaleString('tr-TR')} TL/Gün
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-gray-150">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Toplam Gider</span>
                      <span className="text-xs sm:text-sm font-extrabold text-gray-800 font-mono">
                        {Math.round(simulatedMetrics.total).toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-2.5 bg-white rounded-lg border border-gray-150">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Tahmini Gelir</span>
                      <span className="text-xs sm:text-sm font-extrabold text-indigo-700 font-mono">
                        {Math.round(simulatedMetrics.revenue).toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-gray-150">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Tahmini Kâr / Zarar</span>
                      <span className={`text-xs sm:text-sm font-black font-mono ${
                        simulatedMetrics.profitLoss >= 0 ? 'text-[#00875A]' : 'text-rose-700'
                      }`}>
                        {simulatedMetrics.profitLoss >= 0 ? '+' : ''}
                        {Math.round(simulatedMetrics.profitLoss).toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                  </div>

                  {/* Break-Even (Başa Baş Noktası) Widget */}
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-extrabold text-gray-500 uppercase">
                      <span>Başa Baş Noktası (Break-Even)</span>
                      <span className="text-[#00875A]">Fiyat: {simulationPricePerDay} TL</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                      <span>Asgari Doluluk</span>
                      <span className="font-mono text-emerald-800">%{simulatedMetrics.breakEvenOccupancy} doluluk</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Sabit ve değişken maliyetleri sıfırlayabilmek için bu kampta en az <strong className="text-gray-600 font-mono">{simulatedMetrics.breakEvenParticipants} katılımcı</strong> bulunmalıdır.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 text-blue-800 text-[10px] rounded-xl border border-blue-100">
                  💡 <span className="font-extrabold">Ölçek Ekonomisi:</span> Katılımcı sayısı arttıkça, kişi başına düşen sabit gider yükü azalarak kârlılığı katlar.
                </div>
              </div>
            </div>
          )}

          {/* LEDGER TAB */}
          {activeSubTab === 'ledger' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-700" /> Detaylı Gider Kayıt Defteri ({filteredExpenses.length} Kalem)
                </span>
                
                {/* Search & Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:w-48 sm:flex-initial">
                    <input
                      type="text"
                      placeholder="Gider ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-2xs pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl focus:outline-emerald-600 bg-white font-medium"
                    />
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  </div>

                  {/* Category select filter */}
                  <div className="relative">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="text-2xs pl-7 pr-3 py-1.5 border border-gray-200 rounded-xl bg-white focus:outline-emerald-600 cursor-pointer font-bold"
                    >
                      <option value="All">Tüm Kategoriler</option>
                      <option value="Konaklama">Konaklama</option>
                      <option value="Yemek">Yemek</option>
                      <option value="Ulaşım">Ulaşım</option>
                      <option value="Aktivite">Aktivite / Spor</option>
                      <option value="Personel">Personel</option>
                      <option value="Genel Gider">Genel Gider</option>
                    </select>
                    <Filter className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Type filter */}
                  <div className="relative">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="text-2xs pl-7 pr-3 py-1.5 border border-gray-200 rounded-xl bg-white focus:outline-emerald-600 cursor-pointer font-bold"
                    >
                      <option value="All">Tüm Gider Tipleri</option>
                      <option value="Sabit">Sabit Gider</option>
                      <option value="Değişken">Değişken Gider</option>
                    </select>
                    <Filter className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Ledger Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-2xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-gray-400 font-extrabold uppercase">
                      <th className="p-3">Gider Adı</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Gider Tipi</th>
                      <th className="p-3">Tarih</th>
                      <th className="p-3">Açıklama</th>
                      <th className="p-3 text-right">Tutar (TL)</th>
                      <th className="p-3 text-center">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                    {filteredExpenses.map(expense => {
                      const colors = getCategoryColor(expense.category);
                      return (
                        <tr key={expense.id} className="hover:bg-gray-50/50 transition">
                          <td className="p-3">
                            <div className="font-bold text-gray-900">{expense.name}</div>
                            <div className="text-gray-400 text-3xs font-mono">{expense.id}</div>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-3xs font-extrabold border ${colors.bg} ${colors.text} ${colors.border}`}>
                              {expense.category}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-3xs font-extrabold ${
                              expense.type === 'Sabit' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {expense.type}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500 font-mono">{expense.date}</td>
                          <td className="p-3 max-w-xs truncate text-gray-500 font-medium" title={expense.description}>
                            {expense.description}
                          </td>
                          <td className="p-3 text-right font-black font-mono text-gray-900">
                            {expense.amount.toLocaleString('tr-TR')} TL
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="p-1 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded transition cursor-pointer"
                              title="Gideri Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredExpenses.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-400 italic">
                          Filtrelere uygun herhangi bir gider kaydı bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50/75 border-t border-gray-200">
                    <tr className="font-black text-gray-900">
                      <td className="p-3" colSpan={4}>Filtrelenmiş Toplam Gider Kalemi</td>
                      <td className="p-3 text-right text-emerald-800 font-black" colSpan={2}>
                        {filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('tr-TR')} TL
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Add New Expense Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-150 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-sm text-gray-900">Yeni Gider Giriş Kartı</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddExpense} className="p-5 space-y-4 text-3xs font-extrabold text-gray-500 uppercase">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-gray-500">Gider Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Yemekhane Sebze Alımı, Çit Onarımı vb."
                  value={newExpense.name}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white text-xs font-semibold uppercase"
                />
              </div>

              {/* Category and Type Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-gray-500">Kategori *</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value as Expense['category'] }))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white text-xs font-semibold cursor-pointer"
                  >
                    <option value="Konaklama">Konaklama</option>
                    <option value="Yemek">Yemek</option>
                    <option value="Ulaşım">Ulaşım</option>
                    <option value="Aktivite">Aktivite / Spor</option>
                    <option value="Personel">Personel</option>
                    <option value="Genel Gider">Genel Gider</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-500">Gider Tipi *</label>
                  <select
                    value={newExpense.type}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, type: e.target.value as Expense['type'] }))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white text-xs font-semibold cursor-pointer"
                  >
                    <option value="Sabit">Sabit Gider</option>
                    <option value="Değişken">Değişken Gider</option>
                  </select>
                </div>
              </div>

              {/* Amount and Date Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-gray-500">Gider Tutarı (TL) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Tutar girin"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white text-xs font-semibold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-500">Kayıt Tarihi *</label>
                  <input
                    type="date"
                    required
                    value={newExpense.date}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white text-xs font-semibold font-mono cursor-pointer"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-gray-500">Açıklama</label>
                <textarea
                  placeholder="Gider detayları ve fatura/ödeme bilgileri..."
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white text-xs font-semibold"
                  rows={3}
                ></textarea>
              </div>

              {/* Form Actions */}
              <div className="pt-4 flex justify-end gap-2 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl cursor-pointer text-xs font-bold transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl cursor-pointer text-xs font-bold shadow-xs transition"
                >
                  Kaydet &amp; Hesapla
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
