/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CampCenter, CampPeriod, SystemLog } from '../types';
import { 
  Sliders, 
  Building2, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  CalendarDays, 
  CheckCircle, 
  ShieldCheck, 
  Info,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface SettingsViewProps {
  campCenters: CampCenter[];
  onUpdateCampCenters: (updated: CampCenter[]) => void;
  periods: CampPeriod[];
  onUpdatePeriods: (updated: CampPeriod[]) => void;
  onAddLog: (action: string, details: string) => void;
}

export default function SettingsView({
  campCenters,
  onUpdateCampCenters,
  periods,
  onUpdatePeriods,
  onAddLog
}: SettingsViewProps) {
  // Local states for System Parameters
  const [segregateGender, setSegregateGender] = useState<boolean>(() => {
    const saved = localStorage.getItem('kys_setting_segregate_gender');
    return saved !== 'false'; // default true
  });
  
  const [maxAgeDiff, setMaxAgeDiff] = useState<number>(() => {
    const saved = localStorage.getItem('kys_setting_max_age_diff');
    return saved ? parseInt(saved) : 2; // default 2
  });

  const [asthmaGrouping, setAsthmaGrouping] = useState<boolean>(() => {
    const saved = localStorage.getItem('kys_setting_asthma_grouping');
    return saved !== 'false'; // default true
  });

  const [dataRetentionYears, setDataRetentionYears] = useState<number>(() => {
    const saved = localStorage.getItem('kys_setting_data_retention_years');
    return saved ? parseInt(saved) : 2; // default 2
  });

  // Local state for camp center editing & adding
  const [editingCenterId, setEditingCenterId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editCapacity, setEditCapacity] = useState(78);

  const [newCenterName, setNewCenterName] = useState('');
  const [newCenterCity, setNewCenterCity] = useState('');
  const [newCenterCapacity, setNewCenterCapacity] = useState(60);
  const [showAddCenterForm, setShowAddCenterForm] = useState(false);

  // Success message toaster state
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  // Save System parameters to localStorage
  const handleSaveSystemSettings = () => {
    localStorage.setItem('kys_setting_segregate_gender', String(segregateGender));
    localStorage.setItem('kys_setting_max_age_diff', String(maxAgeDiff));
    localStorage.setItem('kys_setting_asthma_grouping', String(asthmaGrouping));
    localStorage.setItem('kys_setting_data_retention_years', String(dataRetentionYears));
    
    onAddLog(
      'Sistem Ayarları Değişti',
      `Genel parametreler güncellendi: Cinsiyet Koruma=${segregateGender}, Max Yaş Farkı=${maxAgeDiff}, Sağlık Gruplama=${asthmaGrouping}, Retensiyon=${dataRetentionYears} yıl.`
    );
    triggerSuccess('Sistem parametreleri başarıyla kaydedildi.');
  };

  // Camp Center Management actions
  const handleStartEditCenter = (center: CampCenter) => {
    setEditingCenterId(center.id);
    setEditName(center.name);
    setEditCity(center.city);
    setEditCapacity(center.capacity);
  };

  const handleSaveCenterEdit = (centerId: string) => {
    if (!editName.trim() || !editCity.trim()) {
      alert('Lütfen merkez adı ve şehir alanlarını doldurun.');
      return;
    }
    const updated = campCenters.map(c => {
      if (c.id === centerId) {
        return { ...c, name: editName, city: editCity, capacity: editCapacity };
      }
      return c;
    });
    onUpdateCampCenters(updated);
    setEditingCenterId(null);
    onAddLog('Kamp Merkezi Düzenlendi', `'${editName}' isimli kamp merkezinin kapasite ve şehir bilgileri güncellendi.`);
    triggerSuccess('Kamp merkezi başarıyla güncellendi.');
  };

  const handleAddCampCenter = () => {
    if (!newCenterName.trim() || !newCenterCity.trim()) {
      alert('Lütfen kamp merkezi adı ve şehir alanını doldurun.');
      return;
    }

    const nextId = `C${String(campCenters.length + 1).padStart(2, '0')}`;
    const newCenter: CampCenter = {
      id: nextId,
      name: newCenterName,
      city: newCenterCity,
      capacity: newCenterCapacity
    };

    onUpdateCampCenters([...campCenters, newCenter]);
    onAddLog('Kamp Merkezi Eklendi', `Yeni kamp merkezi tanımlandı: '${newCenterName}' (${newCenterCity}), Kapasite: ${newCenterCapacity}.`);
    
    // Reset form states
    setNewCenterName('');
    setNewCenterCity('');
    setNewCenterCapacity(60);
    setShowAddCenterForm(false);
    triggerSuccess('Yeni kamp merkezi başarıyla eklendi.');
  };

  const handleDeleteCampCenter = (centerId: string) => {
    if (campCenters.length <= 1) {
      alert('Sistemde en az bir aktif Kamp Merkezi bulunmak zorundadır.');
      return;
    }
    
    const center = campCenters.find(c => c.id === centerId);
    if (!center) return;

    if (confirm(`'${center.name}' merkezini ve buna ait tanımları silmek istediğinize emin misiniz?`)) {
      const updated = campCenters.filter(c => c.id !== centerId);
      onUpdateCampCenters(updated);
      onAddLog('Kamp Merkezi Silindi', `'${center.name}' kamp merkezi sistemden kaldırıldı.`);
      triggerSuccess('Kamp merkezi sistemden kaldırıldı.');
    }
  };

  // Database Wipe Utility
  const handleResetSystemData = () => {
    if (confirm('DİKKAT! Tüm localStorage verilerini sıfırlayıp fabrika ayarlarına geri dönmek istiyor musunuz? Katılımcı, ön kayıt ve log verileriniz silinecektir.')) {
      localStorage.clear();
      onAddLog('Sistem Sıfırlandı', 'Yönetici oturumuyla tüm yerel veritabanı logları ve konaklama kayıtları fabrika ayarlarına sıfırlandı.');
      alert('Sistem başarıyla fabrika ayarlarına sıfırlandı. Sayfa otomatik olarak yenilenecek.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="settings-management-root">
      {/* Toast Alert Header */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 bg-emerald-800 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Screen Introductory Banner */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-sans">
          <Sliders className="w-5 h-5 text-emerald-600" />
          Genel Ayarlar ve Sistem Yapılandırması
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          KYS akıllı algoritmik yerleşim limitlerini yönetin, yeni kamp şubeleri ekleyin ve veri tabanı durumunu denetleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left Column: Algorithmic parameters & Local configs */}
        <div className="space-y-6">
          
          {/* System Rules Panel */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 pb-2 border-b flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              KYS Algoritmik Sınırları &amp; Güvenlik Kuralları
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              {/* Segregate Gender Policy */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <h4 className="text-gray-800 font-bold mb-0.5">Cinsiyet Ayrımı Güvenlik Filtresi</h4>
                  <p className="text-4xs text-gray-450">Konaklama odalarında kız/erkek karma yerleşimleri mutlak olarak engeller.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={segregateGender} 
                    onChange={(e) => setSegregateGender(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Max Age Difference Threshold */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-800 font-bold mb-0.5">Oda Dağıtımı Maksimal Yaş Farkı</h4>
                    <p className="text-4xs text-gray-450">Sebebi olmadan aynı odadaki gönüllülerin yaş farkının maks kaç olacağını belirler.</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={maxAgeDiff}
                    onChange={(e) => setMaxAgeDiff(parseInt(e.target.value) || 2)}
                    className="w-16 p-1.5 text-center bg-white border border-gray-200 rounded text-xs font-extrabold text-emerald-900 focus:outline-emerald-600"
                  />
                </div>
              </div>

              {/* Asthma / Allergen Grouping Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <h4 className="text-gray-800 font-bold mb-0.5">Kronik Alerjen/Astım Kümeleme Algoritması</h4>
                  <p className="text-4xs text-gray-450">Alerji ve astım hassasiyetleri olan çocukları birbirine yakın ve havadar bungalovlarda birleştirir.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={asthmaGrouping} 
                    onChange={(e) => setAsthmaGrouping(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Data retention years */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-800 font-bold mb-0.5">KVKK Veri İmha Politikası Sınırı (Yıl)</h4>
                    <p className="text-4xs text-gray-450">Kampçının mezuniyetinden sonra kişisel verilerin anonimleştirme bekleme süresi.</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={dataRetentionYears}
                    onChange={(e) => setDataRetentionYears(parseInt(e.target.value) || 2)}
                    className="w-16 p-1.5 text-center bg-white border border-gray-200 rounded text-xs font-extrabold text-emerald-900 focus:outline-emerald-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveSystemSettings}
                className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                Sistem Parametrelerini Kaydet
              </button>
            </div>
          </div>

          {/* Quick Info & Guidelines */}
          <div className="bg-emerald-50/30 p-5 rounded-xl border border-emerald-100 text-xs text-gray-650 space-y-3">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-700" />
              Yeşilay Dönemsel Operasyon Bilgisi
            </h4>
            <p>
              Tüm parametreler anlık olarak tarayıcınızın <code>localStorage</code> API'si ile saklanmakta olup, yeni yapılacak olan akıllı bungalov yerleşimleri bu limitlere göre işleyecektir.
            </p>
            <div className="p-3 bg-white rounded border border-emerald-100 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-3xs block">
                <strong>Entegrasyon Notu:</strong> KVKK kapsamında tüm imha koşulları, otomatik zaman damgasıyla eşleştirilmiş olup mühür süreçleri arkaplanda simüle edilmektedir.
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/10 border-l-4 border-l-red-600 p-5 rounded-xl border border-red-100 space-y-3">
            <h4 className="text-xs font-bold text-red-900">Sistem Tehlikeli Alanı (Danger Zone)</h4>
            <p className="text-3xs text-gray-500 leading-normal">
              Aşağıdaki sıfırlama işlemi veri kurtarılması mümkün olmaksızın tüm ön kayıtları, tıp loglarını, anketleri ve bungalov durumlarını silecektir.
            </p>
            <button
              onClick={handleResetSystemData}
              className="bg-red-600 text-white hover:bg-red-700 px-3.5 py-1.5 rounded-lg text-3xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3 h-3 animate-spin" />
              SİSTEM VERİLERİNİ FABRİKA AYARLARINA SIFIRLA
            </button>
          </div>

        </div>

        {/* Right Column: Camp Centers Definition List & Periods Summary */}
        <div className="space-y-6">
          
          {/* Camp Centers List */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Yeşilay Kamp Merkezleri ({campCenters.length})
              </h3>
              
              <button
                onClick={() => setShowAddCenterForm(!showAddCenterForm)}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg text-3xs font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Merkez Tanımla
              </button>
            </div>

            {/* Form to add a Camp Center */}
            {showAddCenterForm && (
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-lg text-xs space-y-3">
                <h4 className="font-bold text-emerald-900 text-xs">Yeni Yeşilay Kamp Merkezi Ekle</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-4xs text-gray-500 uppercase font-black">Merkez Adı</label>
                    <input
                      type="text"
                      placeholder="e.g. Yeşilay Edirne Kampı"
                      value={newCenterName}
                      onChange={(e) => setNewCenterName(e.target.value)}
                      className="w-full p-2 bg-white border rounded text-xs focus:outline-emerald-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-4xs text-gray-500 uppercase font-black">Şehir / İl</label>
                    <input
                      type="text"
                      placeholder="e.g. Edirne"
                      value={newCenterCity}
                      onChange={(e) => setNewCenterCity(e.target.value)}
                      className="w-full p-2 bg-white border rounded text-xs focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-4xs text-gray-500 uppercase font-black block">Toplam Kapasite Kontenjanı</label>
                  <input
                    type="number"
                    min={20}
                    max={300}
                    value={newCenterCapacity}
                    onChange={(e) => setNewCenterCapacity(parseInt(e.target.value) || 60)}
                    className="w-32 p-2 bg-white border rounded text-xs focus:outline-emerald-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1 text-2xs">
                  <button
                    onClick={() => setShowAddCenterForm(false)}
                    className="text-gray-500 px-3 py-1.5 focus:outline-none"
                  >
                    Vazgeç
                  </button>
                  <button
                    onClick={handleAddCampCenter}
                    className="bg-emerald-600 text-white px-3.5 py-1.5 rounded font-extrabold hover:bg-emerald-700"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            )}

            {/* Camp Centers Grid */}
            <div className="space-y-2.5">
              {campCenters.map((cc) => {
                const isEditing = editingCenterId === cc.id;
                
                return (
                  <div 
                    key={cc.id} 
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold ${
                      isEditing ? 'border-amber-400 bg-amber-50/10' : 'border-gray-150 bg-gray-50/50'
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex-grow space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="p-1.5 bg-white border rounded text-2xs"
                          />
                          <input
                            type="text"
                            value={editCity}
                            onChange={(e) => setEditCity(e.target.value)}
                            className="p-1.5 bg-white border rounded text-2xs"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xs text-gray-500">Kapasite:</span>
                          <input
                            type="number"
                            value={editCapacity}
                            onChange={(e) => setEditCapacity(parseInt(e.target.value) || 78)}
                            className="w-16 p-1 bg-white border rounded text-2xs text-center"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-3xs font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase">
                            {cc.id}
                          </span>
                          <h4 className="font-bold text-gray-900">{cc.name}</h4>
                        </div>
                        <p className="text-3xs text-gray-400 mt-0.5 font-semibold">
                          Konum: {cc.city} | Nominal Yatak İhtiyacı: {cc.capacity}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2.5 shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => setEditingCenterId(null)}
                            className="text-gray-450 hover:text-gray-600 text-3xs"
                          >
                            İptal
                          </button>
                          <button
                            onClick={() => handleSaveCenterEdit(cc.id)}
                            className="text-amber-800 bg-amber-100 hover:bg-amber-200 p-1.5 rounded"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEditCenter(cc)}
                            className="text-gray-600 hover:text-emerald-700 hover:bg-gray-100 p-1.5 rounded transition"
                            title="Düzenle"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDeleteCampCenter(cc.id)}
                            className="text-red-650 hover:bg-red-50 p-1.5 rounded transition"
                            title="Merkezi Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Camp Periods Panel */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 pb-2 border-b flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              Aktif Sezon Dönem Rapor Değerleri
            </h3>

            <div className="space-y-3.5 text-xs font-semibold">
              {periods.map((per) => (
                <div key={per.id} className="p-3 bg-gray-50/50 border rounded-lg text-2xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{per.name}</span>
                    <span className={`text-4xs font-bold px-1.5 py-0.5 rounded ${
                      per.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {per.status}
                    </span>
                  </div>
                  <p className="text-3xs text-gray-400 font-semibold uppercase font-mono">
                    Süreç: {per.startDate} / {per.endDate} • Kota: {per.maxQuota} Katılımcı
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
