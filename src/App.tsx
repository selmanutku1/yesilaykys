/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  INITIAL_CAMP_CENTERS, 
  INITIAL_BUNGALOWS, 
  INITIAL_STAFF, 
  INITIAL_GROUPS, 
  INITIAL_CAMP_PERIODS, 
  INITIAL_PARTICIPANTS, 
  INITIAL_HEALTH_INCIDENTS, 
  INITIAL_MEAL_PLANS, 
  INITIAL_ACTIVITIES, 
  INITIAL_LOGS, 
  INITIAL_SURVEYS,
  INITIAL_NOTIFICATIONS
} from './data';

import { 
  CampCenter, 
  Bungalow, 
  Staff, 
  Group, 
  CampPeriod, 
  Participant, 
  HealthIncident, 
  MealPlan, 
  CampActivity, 
  SystemLog, 
  SurveyResponse,
  AppNotification
} from './types';

// Importing our modular sub-views
import DashboardView from './components/DashboardView';
import BungalowView from './components/BungalowView';
import ParticipantView from './components/ParticipantView';
import RegistrationView from './components/RegistrationView';
import HealthView from './components/HealthView';
import DocumentationTab from './components/DocumentationTab';
import SettingsView from './components/SettingsView';
import YemekhaneView from './components/YemekhaneView';
import TechnicalOperationsView from './components/TechnicalOperationsView';
import CostAnalysisView from './components/CostAnalysisView';
import GuvenlikView from './components/GuvenlikView';
import SystemLogsView from './components/SystemLogsView';
import DijitalArsivView from './components/DijitalArsivView';
import LoginView from './components/LoginView';
import { OnboardingGuide } from './components/OnboardingGuide';

// Lucide icons
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  FileText, 
  HeartHandshake, 
  UtensilsCrossed, 
  BookOpen, 
  Activity, 
  Building2, 
  Compass, 
  ArrowRight,
  TrendingDown,
  CalendarDays,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Menu,
  X,
  Coins,
  LogIn,
  LogOut,
  Lock,
  User,
  Shield,
  Bell,
  Moon,
  Sun,
  Terminal,
  Archive
} from 'lucide-react';

export interface LoginUser {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'mudur' | 'kayit' | 'saglik' | 'yemekhane' | 'teknik' | 'guvenlik';
  roleName: string;
  allowedTabs: ('dashboard' | 'bungalov' | 'katilimci' | 'kayit' | 'revir' | 'yemekhane' | 'teknik' | 'guvenlik' | 'dokümanlar' | 'ayarlar' | 'maliyet' | 'sistem-loglari' | 'dijital-arsiv')[];
}

export const USERS_LIST: LoginUser[] = [
  {
    id: 'ADMIN',
    name: 'Selman UTKU',
    username: 'admin',
    role: 'admin',
    roleName: 'Sistem Yöneticisi',
    allowedTabs: ['dashboard', 'bungalov', 'katilimci', 'kayit', 'revir', 'yemekhane', 'teknik', 'guvenlik', 'maliyet', 'dokümanlar', 'ayarlar', 'sistem-loglari', 'dijital-arsiv']
  },
  {
    id: 'S01',
    name: 'İnan BAYRAMOĞLU',
    username: 'mudur',
    role: 'mudur',
    roleName: 'Kamp Müdürü',
    allowedTabs: ['dashboard', 'bungalov', 'katilimci', 'kayit', 'revir', 'yemekhane', 'teknik', 'guvenlik', 'maliyet', 'dokümanlar', 'ayarlar', 'dijital-arsiv']
  },
  {
    id: 'S02',
    name: 'Canan Özdemir',
    username: 'kayit',
    role: 'kayit',
    roleName: 'Kayıt ve Yerleşim Sorumlusu',
    allowedTabs: ['bungalov', 'katilimci', 'kayit']
  },
  {
    id: 'S06',
    name: 'Hemşire Elif Aslan',
    username: 'saglik',
    role: 'saglik',
    roleName: 'Sağlık Görevlisi',
    allowedTabs: ['revir', 'katilimci']
  },
  {
    id: 'S09',
    name: 'Adem Usta',
    username: 'yemekhane',
    role: 'yemekhane',
    roleName: 'Yemekhane Sorumlusu',
    allowedTabs: ['yemekhane']
  },
  {
    id: 'S10',
    name: 'Mehmet Teknik',
    username: 'teknik',
    role: 'teknik',
    roleName: 'Teknik Sorumlu',
    allowedTabs: ['teknik']
  },
  {
    id: 'S11',
    name: 'Ahmet Güvenlik',
    username: 'guvenlik',
    role: 'guvenlik',
    roleName: 'Güvenlik Sorumlusu',
    allowedTabs: ['guvenlik', 'katilimci']
  }
];

export default function App() {
  // Master states representing KYS persistent database
  const [campCenters, setCampCenters] = useState<CampCenter[]>(INITIAL_CAMP_CENTERS);
  const [selectedCenterId, setSelectedCenterId] = useState<string>('C01');
  
  const [bungalows, setBungalows] = useState<Bungalow[]>(INITIAL_BUNGALOWS);
  const [staff] = useState<Staff[]>(INITIAL_STAFF);
  const [groups] = useState<Group[]>(INITIAL_GROUPS);
  
  const [periods, setPeriods] = useState<CampPeriod[]>(INITIAL_CAMP_PERIODS);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [healthIncidents, setHealthIncidents] = useState<HealthIncident[]>(INITIAL_HEALTH_INCIDENTS);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(INITIAL_MEAL_PLANS);
  const [activities, setActivities] = useState<CampActivity[]>(INITIAL_ACTIVITIES);
  const [surveys, setSurveys] = useState<SurveyResponse[]>(INITIAL_SURVEYS);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // User session state
  const [currentUser, setCurrentUser] = useState<LoginUser | null>(() => {
    const saved = localStorage.getItem('kys_current_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      const latestUser = USERS_LIST.find(u => u.id === parsed.id);
      return latestUser ? latestUser : parsed;
    }
    return null;
  });

  // UI state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Initialize onboarding when user logs in or page reloads
  useEffect(() => {
    if (currentUser) {
      const onboarded = localStorage.getItem(`kys_onboarded_${currentUser.role}`);
      if (!onboarded) {
        setShowOnboarding(true);
      }
    }
  }, [currentUser]);

  const handleCompleteOnboarding = () => {
    if (currentUser) {
      localStorage.setItem(`kys_onboarded_${currentUser.role}`, 'true');
    }
    setShowOnboarding(false);
  };

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bungalov' | 'katilimci' | 'kayit' | 'revir' | 'yemekhane' | 'teknik' | 'guvenlik' | 'dokümanlar' | 'ayarlar' | 'maliyet' | 'sistem-loglari' | 'dijital-arsiv'>('dashboard');
  const [registrationSubTab, setRegistrationSubTab] = useState<'form' | 'queue'>('form');
  const [technicalSubTab, setTechnicalSubTab] = useState<'dashboard' | 'issues' | 'requests' | 'ai-copilot' | 'reports' | 'areas'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Check role-based tab access
  const hasAccess = (tab: 'dashboard' | 'bungalov' | 'katilimci' | 'kayit' | 'revir' | 'yemekhane' | 'teknik' | 'guvenlik' | 'dokümanlar' | 'ayarlar' | 'maliyet' | 'sistem-loglari' | 'dijital-arsiv') => {
    if (!currentUser) return false;
    return currentUser.allowedTabs.includes(tab);
  };

  const handleActiveTabChange = (tab: 'dashboard' | 'bungalov' | 'katilimci' | 'kayit' | 'revir' | 'yemekhane' | 'teknik' | 'guvenlik' | 'dokümanlar' | 'ayarlar' | 'maliyet' | 'sistem-loglari' | 'dijital-arsiv') => {
    if (hasAccess(tab)) {
      setActiveTab(tab);
    }
    setIsMobileMenuOpen(false);
  };

  // URL parameters detection
  const params = new URLSearchParams(window.location.search);
  const isRemotePortal = params.get('portal') === 'basvuru';

  // State synchronization helper
  const syncStateWithServer = (dataToSync: {
    participants?: Participant[];
    periods?: CampPeriod[];
    healthIncidents?: HealthIncident[];
    surveys?: SurveyResponse[];
    logs?: SystemLog[];
    bungalows?: Bungalow[];
    campCenters?: CampCenter[];
    mealPlans?: MealPlan[];
  }) => {
    fetch('/api/state/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSync)
    }).catch(err => console.error("Error syncing state with server:", err));
  };

  // Load from backend API with localStorage fallback
  useEffect(() => {
    fetch('/api/state')
      .then(res => res.json())
      .then(data => {
        if (data && data.participants) {
          setParticipants(data.participants);
          setPeriods(data.periods);
          setHealthIncidents(data.healthIncidents);
          setSurveys(data.surveys);
          setLogs(data.logs);
          setBungalows(data.bungalows);
          setCampCenters(data.campCenters);
          setMealPlans(data.mealPlans);
          
          // Sync locally
          localStorage.setItem('kys_participants', JSON.stringify(data.participants));
          localStorage.setItem('kys_periods', JSON.stringify(data.periods));
          localStorage.setItem('kys_health', JSON.stringify(data.healthIncidents));
          localStorage.setItem('kys_surveys', JSON.stringify(data.surveys));
          localStorage.setItem('kys_logs', JSON.stringify(data.logs));
          localStorage.setItem('kys_bungalows', JSON.stringify(data.bungalows));
          localStorage.setItem('kys_camp_centers', JSON.stringify(data.campCenters));
          localStorage.setItem('kys_meal_plans', JSON.stringify(data.mealPlans));
        } else {
          loadLocalStorage();
        }
      })
      .catch(() => {
        loadLocalStorage();
      });

    function loadLocalStorage() {
      const savedParticipants = localStorage.getItem('kys_participants');
      const savedPeriods = localStorage.getItem('kys_periods');
      const savedHealth = localStorage.getItem('kys_health');
      const savedSurveys = localStorage.getItem('kys_surveys');
      const savedLogs = localStorage.getItem('kys_logs');
      const savedBungalows = localStorage.getItem('kys_bungalows');
      const savedCenters = localStorage.getItem('kys_camp_centers');
      const savedMealPlans = localStorage.getItem('kys_meal_plans');

      if (savedParticipants) setParticipants(JSON.parse(savedParticipants));
      if (savedPeriods) setPeriods(JSON.parse(savedPeriods));
      if (savedHealth) setHealthIncidents(JSON.parse(savedHealth));
      if (savedSurveys) setSurveys(JSON.parse(savedSurveys));
      if (savedLogs) setLogs(JSON.parse(savedLogs));
      if (savedBungalows) setBungalows(JSON.parse(savedBungalows));
      if (savedCenters) setCampCenters(JSON.parse(savedCenters));
      if (savedMealPlans) setMealPlans(JSON.parse(savedMealPlans));
    }
    
    // Auto-select tab and camp center based on URL query or hash for convenient QR scanning!
    const tabParam = params.get('tab');
    const centerIdParam = params.get('centerId');
    const hash = window.location.hash;
    
    if (centerIdParam) {
      setSelectedCenterId(centerIdParam);
    }
    
    if (tabParam === 'kayit' || hash === '#kayit') {
      setActiveTab('kayit');
    }
  }, []);

  // Persistent storage synchronized hooks
  const updateParticipants = (updated: Participant[]) => {
    setParticipants(updated);
    localStorage.setItem('kys_participants', JSON.stringify(updated));
    syncStateWithServer({ participants: updated });
  };

  const updateMealPlans = (updated: MealPlan[]) => {
    setMealPlans(updated);
    localStorage.setItem('kys_meal_plans', JSON.stringify(updated));
    syncStateWithServer({ mealPlans: updated });
  };

  const updateBungalows = (updated: Bungalow[]) => {
    setBungalows(updated);
    localStorage.setItem('kys_bungalows', JSON.stringify(updated));
    syncStateWithServer({ bungalows: updated });
  };

  const updateCampCenters = (updated: CampCenter[]) => {
    setCampCenters(updated);
    localStorage.setItem('kys_camp_centers', JSON.stringify(updated));
    
    // If our currently selected center ID got deleted, reset to the first available one!
    if (updated.length > 0 && !updated.some(c => c.id === selectedCenterId)) {
      setSelectedCenterId(updated[0].id);
    }
    syncStateWithServer({ campCenters: updated });
  };

  const updatePeriods = (updated: CampPeriod[]) => {
    setPeriods(updated);
    localStorage.setItem('kys_periods', JSON.stringify(updated));
    syncStateWithServer({ periods: updated });
  };

  const handleAddPeriod = (newPer: CampPeriod) => {
    const updated = [newPer, ...periods];
    setPeriods(updated);
    localStorage.setItem('kys_periods', JSON.stringify(updated));
    syncStateWithServer({ periods: updated });
  };

  const handleAddHealthIncident = (inc: HealthIncident) => {
    const updated = [inc, ...healthIncidents];
    setHealthIncidents(updated);
    localStorage.setItem('kys_health', JSON.stringify(updated));
    syncStateWithServer({ healthIncidents: updated });
  };

  const handleAddSurvey = (surv: SurveyResponse) => {
    const updated = [surv, ...surveys];
    setSurveys(updated);
    localStorage.setItem('kys_surveys', JSON.stringify(updated));
    syncStateWithServer({ surveys: updated });
  };

  const addSystemLog = (action: string, details: string, overrideUser?: { id: string; name: string; roleName: string }) => {
    const actorId = overrideUser ? overrideUser.id : (currentUser?.id || 'S01');
    const actorName = overrideUser ? overrideUser.name : (currentUser?.name || 'İnan BAYRAMOĞLU');
    const actorRole = overrideUser ? overrideUser.roleName : (currentUser?.roleName || 'Kamp Müdürü');

    const newLog: SystemLog = {
      id: `L0${logs.length + 1}`,
      userId: actorId,
      userName: actorName,
      userRole: actorRole,
      action,
      timestamp: new Date().toISOString().slice(0, 19),
      details,
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem('kys_logs', JSON.stringify(updated));
    syncStateWithServer({ logs: updated });
  };

  const selectedCenter = campCenters.find((c) => c.id === selectedCenterId) || campCenters[0];

  // Specific Bungalows for ONLY the selected Center
  const centerBungalows = bungalows.filter((b) => b.campCenterId === selectedCenterId);

  // Dynamic values for special nutritional alerts in food/kitchen tab
  const activeInSelectedCenter = participants.filter(
    (p) => p.status === 'Kampta'
  );

  const glutenFreeCount = activeInSelectedCenter.filter(
    (p) => p.allergies.toLowerCase().includes('gluten') || p.healthNote.toLowerCase().includes('gluten')
  ).length;

  const lactoseFreeCount = activeInSelectedCenter.filter(
    (p) => p.allergies.toLowerCase().includes('laktoz') || p.allergies.toLowerCase().includes('süt') || p.healthNote.toLowerCase().includes('laktoz')
  ).length;

  const allergyDetails = activeInSelectedCenter.filter(
    (p) => p.allergies && p.allergies.toLowerCase() !== 'yok' && p.allergies.toLowerCase() !== 'belirtilmedi'
  );

  if (isRemotePortal) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col font-sans" id="yesilay-kys-remote-portal">
        {/* Beautiful standalone Header */}
        <header className="bg-white border-b border-gray-150 px-6 py-4 flex justify-between items-center z-30 shadow-xs">
          <div className="flex items-center gap-3 mx-auto">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-2xs select-none h-14">
              <div className="w-11 h-11 flex items-center justify-center bg-white rounded-lg">
                <svg viewBox="0 0 100 100" className="w-9 h-9">
                  <path
                    d="M52,15 A35,35 0 1,0 85,68 A28,28 0 1,1 85,32 A35,35 0 0,0 52,15 Z"
                    fill="#00AB41"
                  />
                </svg>
              </div>
              
              {/* Divider */}
              <div className="h-9 w-[1.5px] bg-gray-300 mx-2.5" />
              
              {/* Yesilay Bold Brand Text */}
              <div className="pr-3 flex flex-col justify-center">
                <span className="font-black text-[#0B3B24] tracking-tight text-lg font-sans leading-none">YEŞİLAY</span>
                <span className="text-[7.5px] text-[#00AB41] font-black uppercase tracking-[0.2em] mt-1 leading-none">KAMP BAŞVURU PORTALI</span>
              </div>
            </div>
          </div>
        </header>

        {/* Standalone content wrapper */}
        <main className="flex-1 p-4 md:p-8 max-w-[1200px] mx-auto w-full">
          <RegistrationView
            participants={participants}
            periods={periods}
            bungalows={bungalows}
            onUpdateParticipants={updateParticipants}
            onAddLog={addSystemLog}
            isRemote={true}
          />
        </main>

        <footer className="py-6 border-t border-gray-200 bg-white text-center text-xs text-gray-500 font-semibold space-y-1">
          <p>© 2026 Türkiye Yeşilay Cemiyeti • Kamp Yönetim Sistemi</p>
          <p className="text-[10px] text-gray-400">Tüm hakları saklıdır.</p>
        </footer>
      </div>
    );
  }

  const handleLogin = (user: LoginUser) => {
    setCurrentUser(user);
    localStorage.setItem('kys_current_user', JSON.stringify(user));
    if (user.allowedTabs.length > 0) {
      setActiveTab(user.allowedTabs[0]);
    }
    addSystemLog('Giriş Yapıldı', `${user.name} (${user.roleName}) sisteme giriş yaptı.`, user);
  };

  const handleLogout = () => {
    if (currentUser) {
      addSystemLog('Çıkış Yapıldı', `${currentUser.name} (${currentUser.roleName}) sistemden çıkış yaptı.`);
    }
    setCurrentUser(null);
    localStorage.removeItem('kys_current_user');
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const unreadCount = notifications.filter(n => !n.read && n.roles.includes(currentUser?.role || '')).length;

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col font-sans" id="yesilay-kys-master-parent">
      
      {/* SaaS Executive Header Banner */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-150 dark:border-gray-700 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-30 shadow-xs transition-colors duration-200">
        {/* Brand & Turkey Crest */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            {/* Authentic Yeşilay Logo Component */}
            <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-1 shadow-2xs select-none h-14">
              {/* Green Crescent on White Box */}
              <div className="w-11 h-11 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg">
                <svg viewBox="0 0 100 100" className="w-9 h-9">
                  <path
                    d="M52,15 A35,35 0 1,0 85,68 A28,28 0 1,1 85,32 A35,35 0 0,0 52,15 Z"
                    fill="#00AB41"
                  />
                </svg>
              </div>
              
              {/* Divider */}
              <div className="h-9 w-[1.5px] bg-gray-300 dark:bg-gray-500 mx-2.5" />
              
              {/* Yesilay Bold Brand Text */}
              <div className="pr-3 flex flex-col justify-center">
                <span className="font-black text-[#0B3B24] dark:text-gray-100 tracking-tight text-lg font-sans leading-none">YEŞİLAY</span>
                <span className="text-[7.5px] text-[#00AB41] font-black uppercase tracking-[0.2em] mt-1 leading-none">TÜRKİYE</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-[#00875A] dark:text-emerald-100 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">Kamp Yönetim Sistemi (KYS)</span>
              </div>
              <p className="hidden md:block text-gray-400 dark:text-gray-400 text-2xs font-semibold leading-none mt-1">Kamp Yönetim Sistemi (KYS)</p>
            </div>
          </div>

          {/* Hamburger Menu Button for Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-[#00875A] hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-xl transition cursor-pointer flex items-center justify-center border border-gray-150 dark:border-gray-600"
            title="Menüyü Aç/Kapat"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-emerald-800 dark:text-emerald-400" /> : <Menu className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />}
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto min-w-0">
          {/* Multi-Tenant SaaS Camp Center Switcher */}
          <div className="flex items-center gap-2 bg-emerald-50/50 dark:bg-gray-700 p-1.5 border border-emerald-100 dark:border-gray-600 rounded-lg flex-1 md:flex-none">
            <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 ml-1" />
            <span className="text-3xs font-extrabold text-emerald-900 dark:text-emerald-100 uppercase shrink-0">Kamp Merkezi:</span>
            <select
              value={selectedCenterId}
              onChange={(e) => {
                setSelectedCenterId(e.target.value);
                addSystemLog('Camp Center Switch', `SaaS seçici ile '${campCenters.find(c=>c.id===e.target.value)?.name}' merkezine geçildi.`);
              }}
              className="bg-transparent text-xs font-bold text-emerald-950 dark:text-white focus:outline-none cursor-pointer pr-2 flex-grow min-w-0 truncate max-w-[170px] xs:max-w-[230px] sm:max-w-sm md:max-w-none"
            >
              {campCenters.map((cc) => (
                <option key={cc.id} value={cc.id}>
                  {cc.name} ({cc.city})
                </option>
              ))}
            </select>
          </div>

          {/* Action Icons (Theme & Notifications) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition"
              title="Karanlık / Aydınlık Mod"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition relative"
                title="Bildirimler"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-gray-800"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Bildirim Merkezi</h4>
                    <button 
                      className="text-4xs text-emerald-600 font-bold hover:underline"
                      onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                    >
                      Tümünü Okundu İşaretle
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.filter(n => n.roles.includes(currentUser.role)).length > 0 ? (
                      notifications.filter(n => n.roles.includes(currentUser.role)).map(notif => (
                        <div key={notif.id} className={`p-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-default ${!notif.read ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}>
                          <div className="flex items-start gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${notif.type === 'alert' ? 'bg-rose-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-800 dark:text-gray-200 leading-snug">{notif.message}</p>
                              <span className="text-4xs text-gray-400 mt-1 block">{new Date(notif.timestamp).toLocaleString('tr-TR')}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">Yeni bildirim yok.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Section */}
      <div className="flex-grow flex flex-col lg:flex-row transition-colors duration-200">
        
        {/* Left Side Navigation Bar */}
        <nav className={`bg-white dark:bg-gray-800 border-r border-gray-150 dark:border-gray-700 w-full lg:flex flex-col gap-1.5 shrink-0 select-none transition-all duration-300 ${
          isMobileMenuOpen ? 'flex p-5' : 'hidden lg:flex'
        } ${
          isSidebarCollapsed ? 'lg:w-[72px] lg:p-3' : 'lg:w-64 lg:p-5'
        }`}>
          <div className="flex items-center justify-end px-3 mb-2">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition cursor-pointer"
              title={isSidebarCollapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {hasAccess('dashboard') && (
            <button
              onClick={() => handleActiveTabChange('dashboard')}
              title="Kontrol Paneli (Dashboard)"
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'dashboard' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                Kontrol Paneli (Dashboard)
              </span>
            </button>
          )}

          {hasAccess('bungalov') && (
            <button
              onClick={() => handleActiveTabChange('bungalov')}
              title={`Bungalov & Yerleşim (${centerBungalows.length} Oda)`}
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'bungalov' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                Bungalov &amp; Yerleşim ({centerBungalows.length} Oda)
              </span>
            </button>
          )}

          {hasAccess('katilimci') && (
            <button
              onClick={() => handleActiveTabChange('katilimci')}
              title="Katılımcı Defteri"
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'katilimci' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                Katılımcı Defteri
              </span>
            </button>
          )}

          {hasAccess('kayit') && (
            <button
              onClick={() => {
                handleActiveTabChange('kayit');
                setRegistrationSubTab('form');
              }}
              title="Ön Kayıtlar & Muvafakat"
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'kayit' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                Ön Kayıtlar &amp; Muvafakat
              </span>
            </button>
          )}

          {/* Sub-menu categories under Kayıt when active */}
          {activeTab === 'kayit' && hasAccess('kayit') && !isSidebarCollapsed && (
            <div className="pl-6 pr-2 py-1 flex flex-col gap-1 border-l-2 border-emerald-100/50 ml-5 animate-in slide-in-from-top-1 duration-150">
              <button
                onClick={() => setRegistrationSubTab('form')}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg text-left transition text-[11px] font-semibold ${
                  registrationSubTab === 'form'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold shadow-3xs'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${registrationSubTab === 'form' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                Başvuru Formu
              </button>
              <button
                onClick={() => setRegistrationSubTab('queue')}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg text-left transition text-[11px] font-semibold ${
                  registrationSubTab === 'queue'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold shadow-3xs'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${registrationSubTab === 'queue' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                Müracaat Değerlendirme
              </button>
            </div>
          )}

          {hasAccess('revir') && (
            <button
              onClick={() => handleActiveTabChange('revir')}
              title="Revir & Sağlık Modülü"
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'revir' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <HeartHandshake className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                Revir &amp; Sağlık Modülü
              </span>
            </button>
          )}

          {hasAccess('yemekhane') && (
            <button
              onClick={() => handleActiveTabChange('yemekhane')}
              title="Yemekhane & Öğün Planlama"
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'yemekhane' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                Yemekhane &amp; Öğün Planlama
              </span>
            </button>
          )}

          {hasAccess('teknik') && (
            <button
              onClick={() => {
                handleActiveTabChange('teknik');
                setTechnicalSubTab('dashboard');
              }}
              title="Teknik İşler & Talepler"
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'teknik' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                Teknik İşler &amp; Talepler
              </span>
            </button>
          )}

          {/* Sub-menu categories under Teknik when active */}
          {activeTab === 'teknik' && hasAccess('teknik') && !isSidebarCollapsed && (
            <div className="pl-6 pr-2 py-1 flex flex-col gap-1 border-l-2 border-emerald-100/50 ml-5 animate-in slide-in-from-top-1 duration-150">
              <button
                onClick={() => setTechnicalSubTab('dashboard')}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg text-left transition text-[11px] font-semibold ${
                  technicalSubTab === 'dashboard'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold shadow-3xs'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${technicalSubTab === 'dashboard' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                Genel Durum Panel
              </button>
              <button
                onClick={() => setTechnicalSubTab('issues')}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg text-left transition text-[11px] font-semibold ${
                  technicalSubTab === 'issues'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold shadow-3xs'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${technicalSubTab === 'issues' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                Arıza &amp; Onarım İşleri
              </button>
              <button
                onClick={() => setTechnicalSubTab('requests')}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg text-left transition text-[11px] font-semibold ${
                  technicalSubTab === 'requests'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold shadow-3xs'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${technicalSubTab === 'requests' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                Malzeme &amp; Sipariş
              </button>
              <button
                onClick={() => setTechnicalSubTab('ai-copilot')}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg text-left transition text-[11px] font-semibold ${
                  technicalSubTab === 'ai-copilot'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold shadow-3xs'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${technicalSubTab === 'ai-copilot' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                Yapay Zeka Copilot
              </button>
              <button
                onClick={() => setTechnicalSubTab('reports')}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg text-left transition text-[11px] font-semibold ${
                  technicalSubTab === 'reports'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold shadow-3xs'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${technicalSubTab === 'reports' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                Sarf Malzeme Raporu
              </button>
              <button
                onClick={() => setTechnicalSubTab('areas')}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg text-left transition text-[11px] font-semibold ${
                  technicalSubTab === 'areas'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold shadow-3xs'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${technicalSubTab === 'areas' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                Alanlar &amp; Sorumlular
              </button>
            </div>
          )}

          {hasAccess('guvenlik') && (
            <button
              onClick={() => handleActiveTabChange('guvenlik')}
              title="Güvenlik & Operasyon"
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'guvenlik' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                Güvenlik &amp; Operasyon
              </span>
            </button>
          )}

          {hasAccess('maliyet') && (
            <>
              <span className={`text-4xs font-extrabold text-gray-400 tracking-widest uppercase mt-6 mb-2 px-3 block ${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>FİNANSAL ANALİZ</span>

              <button
                onClick={() => handleActiveTabChange('maliyet')}
                title="Katılımcı Maliyet Analiz Modülü"
                className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                  isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
                } ${
                  activeTab === 'maliyet' 
                    ? 'bg-emerald-700 text-white shadow-xs' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Coins className="w-4 h-4 shrink-0" />
                <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                  Maliyet Analiz Modülü
                </span>
              </button>
            </>
          )}

          {(hasAccess('dokümanlar') || hasAccess('ayarlar') || hasAccess('dijital-arsiv')) && (
            <span className={`text-4xs font-extrabold text-gray-400 tracking-widest uppercase mt-6 mb-2 px-3 block ${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>SİSTEM STANDARTLARI</span>
          )}

          {hasAccess('dijital-arsiv') && (
            <button
              onClick={() => handleActiveTabChange('dijital-arsiv')}
              title="Dijital Arşiv"
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'dijital-arsiv' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Archive className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                Dijital Arşiv
              </span>
            </button>
          )}

          {hasAccess('dokümanlar') && (
            <button
              onClick={() => handleActiveTabChange('dokümanlar')}
              title="KYS Sistem Tasarım Analizi"
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'dokümanlar' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                KYS Sistem Tasarım Analizi
              </span>
            </button>
          )}

          {hasAccess('ayarlar') && (
            <button
              onClick={() => handleActiveTabChange('ayarlar')}
              title="Genel Ayarlar"
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'ayarlar' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                Genel Ayarlar
              </span>
            </button>
          )}

          {hasAccess('sistem-loglari') && (
            <button
              onClick={() => handleActiveTabChange('sistem-loglari')}
              title="Sistem Logları"
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } ${
                activeTab === 'sistem-loglari' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <span className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
                Sistem Logları
              </span>
            </button>
          )}

          {/* Active Logged-in User Profile Card */}
          <div className={`mt-auto pt-4 border-t border-gray-150 flex flex-col gap-2 ${isSidebarCollapsed ? 'items-center' : ''}`}>
            <div className={`bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5 flex items-center gap-2.5 ${isSidebarCollapsed ? 'justify-center p-1.5' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-emerald-750 text-white flex items-center justify-center font-black text-xs shadow-3xs shrink-0 uppercase">
                {currentUser?.name.slice(0, 2)}
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-2xs font-extrabold text-gray-800 truncate leading-none mb-1">{currentUser?.name}</p>
                  <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wide bg-emerald-100/60 px-1.5 py-0.5 rounded border border-emerald-200">
                    {currentUser?.roleName}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200/60 hover:border-rose-600 rounded-xl text-3xs font-extrabold transition-all duration-150 cursor-pointer ${
                isSidebarCollapsed ? 'p-2 justify-center' : 'px-3 py-2 gap-2 justify-center'
              }`}
              title="Sistemden Güvenli Çıkış"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              {!isSidebarCollapsed && <span>Oturumu Kapat</span>}
            </button>
          </div>

          <div className={`pt-6 border-t border-gray-100 text-center text-4xs text-gray-400 font-semibold space-y-1 ${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
            <p>© 2026 Türkiye Yeşilay Cemiyeti</p>
            <p>Kamp Yönetim Sistemi v3.4.2</p>
          </div>

          {isSidebarCollapsed && (
            <div className="mt-auto flex justify-center py-4 animate-pulse" title="Türkiye Yeşilay Cemiyeti">
              <svg viewBox="0 0 100 100" className="w-5 h-5">
                <path
                  d="M52,15 A35,35 0 1,0 85,68 A28,28 0 1,1 85,32 A35,35 0 0,0 52,15 Z"
                  fill="#00AB41"
                />
              </svg>
            </div>
          )}
        </nav>

        {/* Dynamic workspace panel */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {/* Active Tab View routers */}
          
          {activeTab === 'dashboard' && (
            <DashboardView
              participants={participants}
              periods={periods}
              logs={logs}
              selectedCampCenterId={selectedCenterId}
              campCenters={campCenters}
              currentUser={currentUser}
              onAddPeriod={handleAddPeriod}
              onUpdatePeriods={setPeriods}
              onAddLog={addSystemLog}
              setActiveMainTab={handleActiveTabChange}
            />
          )}

          {activeTab === 'bungalov' && (
            <BungalowView
              bungalows={bungalows}
              selectedCenterId={selectedCenterId}
              onUpdateBungalows={updateBungalows}
              participants={participants}
              onUpdateParticipants={updateParticipants}
              onAddLog={addSystemLog}
            />
          )}

          {activeTab === 'katilimci' && (
            <ParticipantView
              participants={participants}
              groups={groups}
              onUpdateParticipants={updateParticipants}
              onAddLog={addSystemLog}
            />
          )}

          {activeTab === 'kayit' && (
            <RegistrationView
              participants={participants}
              periods={periods}
              bungalows={bungalows}
              onUpdateParticipants={updateParticipants}
              onAddLog={addSystemLog}
              activeSubView={registrationSubTab}
              onChangeSubView={setRegistrationSubTab}
            />
          )}

          {activeTab === 'revir' && (
            <HealthView
              participants={participants}
              healthIncidents={healthIncidents}
              onAddHealthIncident={handleAddHealthIncident}
              onAddLog={addSystemLog}
            />
          )}

          {activeTab === 'dokümanlar' && (
            <DocumentationTab />
          )}

          {activeTab === 'yemekhane' && (
            <YemekhaneView
              participants={participants}
              mealPlans={mealPlans}
              onUpdateMealPlans={updateMealPlans}
              onAddLog={addSystemLog}
            />
          )}

          {activeTab === 'teknik' && (
            <TechnicalOperationsView
              selectedCenterId={selectedCenterId}
              onAddLog={addSystemLog}
              activeSubView={technicalSubTab}
              onChangeSubView={setTechnicalSubTab}
            />
          )}

          {activeTab === 'sistem-loglari' && (
            <SystemLogsView logs={logs} />
          )}

          {activeTab === 'dijital-arsiv' && (
            <DijitalArsivView />
          )}

          {activeTab === 'ayarlar' && (
            <SettingsView
              campCenters={campCenters}
              onUpdateCampCenters={updateCampCenters}
              periods={periods}
              onUpdatePeriods={updatePeriods}
              onAddLog={addSystemLog}
            />
          )}

          {activeTab === 'maliyet' && (
            <CostAnalysisView
              participants={participants}
              periods={periods}
            />
          )}

          {activeTab === 'guvenlik' && (
            <GuvenlikView
              participants={participants}
            />
          )}
        </main>
      </div>
      
      {showOnboarding && currentUser && (
        <OnboardingGuide role={currentUser.role} onComplete={handleCompleteOnboarding} />
      )}
    </div>
  );
}
