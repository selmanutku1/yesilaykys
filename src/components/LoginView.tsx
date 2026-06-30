import React, { useState } from 'react';
import { 
  Shield, 
  Building2, 
  Home, 
  HeartHandshake, 
  UtensilsCrossed, 
  Wrench, 
  Lock, 
  User, 
  LogIn,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import { LoginUser, USERS_LIST } from '../App';

interface LoginViewProps {
  onLogin: (user: LoginUser) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-5 h-5 text-indigo-600" />;
      case 'mudur': return <Building2 className="w-5 h-5 text-emerald-600" />;
      case 'kayit': return <Home className="w-5 h-5 text-amber-600" />;
      case 'saglik': return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'yemekhane': return <UtensilsCrossed className="w-5 h-5 text-teal-600" />;
      case 'teknik': return <Wrench className="w-5 h-5 text-orange-600" />;
      case 'guvenlik': return <Shield className="w-5 h-5 text-slate-600" />;
      default: return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'mudur': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'kayit': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'saglik': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'yemekhane': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'teknik': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'guvenlik': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRoleTabsDescription = (user: LoginUser) => {
    switch (user.role) {
      case 'admin': return 'Tüm kampüs modüllerine sınırsız tam yetkili erişim.';
      case 'mudur': return 'Müdür Onayları, Dashboard, Raporlar ve tüm modüller.';
      case 'kayit': return 'Yerleşim Planları, Katılımcı Listeleri, Ön Kayıt Formu ve Müracaat Havuzu.';
      case 'saglik': return 'Revir Kayıtları, Kronik Hastalıklar, İlaç Takibi ve Alerji Bilgileri.';
      case 'yemekhane': return 'Öğün Planlama, Günlük Menü ve Alerjen Katılımcı Filtreleme.';
      case 'teknik': return 'Arıza Talepleri, Sarf Malzemeleri ve Tesis Alanı Teknik Takibi.';
      case 'guvenlik': return 'Ziyaretçi Takibi, Nöbet Çizelgeleri, Olay Raporlama ve Güvenlik Kameraları.';
      default: return 'Kendi yetki alanındaki modüller.';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Lütfen tüm alanları doldurunuz.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const foundUser = USERS_LIST.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (foundUser && password === '123') {
        onLogin(foundUser);
      } else {
        setError('Hatalı kullanıcı adı veya şifre! (Hızlı giriş seçeneklerini kullanabilir veya şifre olarak 123 yazabilirsiniz.)');
      }
      setIsLoading(false);
    }, 450);
  };

  const handlePresetClick = (user: LoginUser) => {
    setUsername(user.username);
    setPassword('123');
    setError('');
    
    // Quick directly login
    setIsLoading(true);
    setTimeout(() => {
      onLogin(user);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-between font-sans select-none" id="kys-login-container">
      {/* Top spacing / Brand banner */}
      <div className="w-full bg-emerald-800 text-white py-3 px-6 text-center text-4xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span>TÜRKİYE YEŞİLAY CEMİYETİ • KAMP YÖNETİM SİSTEMİ (KYS) GİRİŞ PORTALI</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 py-8 lg:p-12 w-full max-w-7xl mx-auto">
        
        {/* Interactive Credential login & Presets */}
        <div className="w-full max-w-[550px] bg-white rounded-3xl border border-gray-200/80 shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center bg-white border border-gray-200 rounded-2xl p-2.5 shadow-xs w-fit mx-auto">
              <div className="w-14 h-14 flex items-center justify-center bg-emerald-50 rounded-xl">
                <svg viewBox="0 0 100 100" className="w-10 h-10">
                  <path
                    d="M52,15 A35,35 0 1,0 85,68 A28,28 0 1,1 85,32 A35,35 0 0,0 52,15 Z"
                    fill="#00AB41"
                  />
                </svg>
              </div>
              <div className="h-12 w-[1px] bg-gray-200 mx-3.5" />
              <div className="pr-2 flex flex-col justify-center text-left">
                <span className="font-black text-[#0B3B24] tracking-tight text-xl leading-none">YEŞİLAY</span>
                <span className="text-[9px] text-[#00AB41] font-black uppercase tracking-[0.2em] mt-1.5 leading-none">KAMP YÖNETİM SİSTEMİ</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide">KYS Kullanıcı Girişi</h2>
              <p className="text-xs text-gray-500 font-semibold px-4">Sistem sorumlusu kullanıcı bilgileriyle veya aşağıdaki hızlı seçimlerden biriyle giriş yapın.</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-3xs text-rose-800 font-bold leading-relaxed animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-4xs text-gray-400 font-black uppercase tracking-wider block mb-1">Kullanıcı Adı</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="örn. admin, mudur, kayit, saglik..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-xs font-bold text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-none transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="text-4xs text-gray-400 font-black uppercase tracking-wider block mb-1">Şifre</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 text-xs font-bold text-gray-850 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-none transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-450 hover:text-gray-700 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold block mt-1">Giriş şifresi tüm roller için <strong className="text-emerald-700 font-extrabold">123</strong> olarak tanımlanmıştır.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#00875A] hover:bg-[#00704a] text-white rounded-xl text-xs font-extrabold transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {isLoading ? (
                <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sistemde Oturum Aç</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Selector Grid */}
          <div className="pt-4 border-t border-gray-150 space-y-4">
            <span className="text-4xs text-gray-400 font-black uppercase tracking-widest block text-center">BİRİM GÖREVLİSİ HIZLI GİRİŞ SEÇENEKLERİ</span>
            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-4">
              
              {/* Yönetim Kategorisi */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Yönetim ve İdare</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {USERS_LIST.filter(u => ['admin', 'mudur'].includes(u.role)).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handlePresetClick(user)}
                      disabled={isLoading}
                      className="p-3 bg-gray-50/50 hover:bg-emerald-50/40 border border-gray-150 hover:border-emerald-300 rounded-xl text-left transition flex items-start gap-3 group cursor-pointer hover:shadow-xs focus:outline-none"
                    >
                      <div className="p-1.5 bg-white border border-gray-100 rounded-lg shrink-0 group-hover:scale-110 transition duration-150 shadow-3xs">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-black text-gray-800 group-hover:text-emerald-950 truncate leading-tight">{user.name}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 border rounded-md text-[8px] font-extrabold uppercase inline-block leading-none ${getRoleBadgeColor(user.role)}`}>
                          {user.roleName}
                        </span>
                        <p className="text-[9px] text-gray-400 font-medium leading-normal line-clamp-2">
                          {getRoleTabsDescription(user)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Operasyon Kategorisi */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Operasyon ve Kampüs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {USERS_LIST.filter(u => ['kayit', 'yemekhane', 'teknik'].includes(u.role)).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handlePresetClick(user)}
                      disabled={isLoading}
                      className="p-3 bg-gray-50/50 hover:bg-emerald-50/40 border border-gray-150 hover:border-emerald-300 rounded-xl text-left transition flex items-start gap-3 group cursor-pointer hover:shadow-xs focus:outline-none"
                    >
                      <div className="p-1.5 bg-white border border-gray-100 rounded-lg shrink-0 group-hover:scale-110 transition duration-150 shadow-3xs">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-black text-gray-800 group-hover:text-emerald-950 truncate leading-tight">{user.name}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 border rounded-md text-[8px] font-extrabold uppercase inline-block leading-none ${getRoleBadgeColor(user.role)}`}>
                          {user.roleName}
                        </span>
                        <p className="text-[9px] text-gray-400 font-medium leading-normal line-clamp-2">
                          {getRoleTabsDescription(user)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sağlık ve Güvenlik Kategorisi */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Sağlık ve Güvenlik</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {USERS_LIST.filter(u => ['saglik', 'guvenlik'].includes(u.role)).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handlePresetClick(user)}
                      disabled={isLoading}
                      className="p-3 bg-gray-50/50 hover:bg-emerald-50/40 border border-gray-150 hover:border-emerald-300 rounded-xl text-left transition flex items-start gap-3 group cursor-pointer hover:shadow-xs focus:outline-none"
                    >
                      <div className="p-1.5 bg-white border border-gray-100 rounded-lg shrink-0 group-hover:scale-110 transition duration-150 shadow-3xs">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-black text-gray-800 group-hover:text-emerald-950 truncate leading-tight">{user.name}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 border rounded-md text-[8px] font-extrabold uppercase inline-block leading-none ${getRoleBadgeColor(user.role)}`}>
                          {user.roleName}
                        </span>
                        <p className="text-[9px] text-gray-400 font-medium leading-normal line-clamp-2">
                          {getRoleTabsDescription(user)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Footer copyright */}
      <footer className="py-5 border-t border-gray-200 bg-white text-center text-xs text-gray-400 font-semibold space-y-1">
        <p>© 2026 Türkiye Yeşilay Cemiyeti • Kampüs Operasyonları ve Güvenli Erişim Altyapısı</p>
        <p className="text-[10px] text-gray-300">Bu sistem sadece yetkilendirilmiş personel kullanımına özeldir.</p>
      </footer>
    </div>
  );
}
