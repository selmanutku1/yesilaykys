import React, { useState, useRef } from 'react';
import { Shield, Search, Plus, MapPin, UserCheck, LogOut, Clock, AlertTriangle, Users, Map, Key, Package, UserX, XCircle, Printer } from 'lucide-react';
import { Participant } from '../types';
import { HelpTooltip } from './HelpTooltip';

interface GuvenlikViewProps {
  participants: Participant[];
}

export interface LostItem {
  id: string;
  itemName: string;
  locationFound: string;
  dateFound: string;
  status: 'Bulundu (Depoda)' | 'Teslim Edildi';
  claimedBy?: string;
  description: string;
  photoUrl?: string;
}

export interface VisitorLog {
  id: string;
  visitorName: string;
  visitingWho: string;
  entryTime: string;
  exitTime?: string;
  badgeNumber: string;
  purpose: string;
}

const INITIAL_LOST_ITEMS: LostItem[] = [
  { id: 'LE-001', itemName: 'Siyah iPhone 13', locationFound: 'Yemekhane (A Blok)', dateFound: '2026-07-10 14:30', status: 'Bulundu (Depoda)', description: 'Siyah kılıflı, ekranında çizik var.', photoUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop' },
  { id: 'LE-002', itemName: 'Mavi Nike Hırka', locationFound: 'Spor Salonu', dateFound: '2026-07-11 10:15', status: 'Teslim Edildi', claimedBy: 'Mehmet Yılmaz', description: 'M beden, ceplerinde anahtar vardı.' },
  { id: 'LE-003', itemName: 'Gümüş Renkli Termos', locationFound: 'Seminer Salonu 2', dateFound: '2026-07-12 09:00', status: 'Bulundu (Depoda)', description: 'Üzerinde etiket yok, yarısı dolu.' }
];

const INITIAL_VISITORS: VisitorLog[] = [
  { id: 'V-101', visitorName: 'Ahmet Çelik (Veli)', visitingWho: 'Ali Çelik', entryTime: '2026-07-12 10:00', exitTime: '2026-07-12 12:30', badgeNumber: 'Z-001', purpose: 'Veli Ziyareti' },
  { id: 'V-102', visitorName: 'Dr. Ayşe Yılmaz', visitingWho: 'Kamp Koordinatörü', entryTime: '2026-07-12 13:00', badgeNumber: 'Z-002', purpose: 'Protokol / Seminer' },
  { id: 'V-103', visitorName: 'Kargo Kuryesi', visitingWho: 'İdari Ofis', entryTime: '2026-07-12 14:15', exitTime: '2026-07-12 14:25', badgeNumber: 'Z-003', purpose: 'Kargo Teslimatı' }
];

export default function GuvenlikView({ participants }: GuvenlikViewProps) {
  const [activeTab, setActiveTab] = useState<'kayip-esya' | 'ziyaretci' | 'acil-durum'>('ziyaretci');
  
  // Emergency States
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [isRollCallMode, setIsRollCallMode] = useState(false);

  // States
  const [lostItems, setLostItems] = useState<LostItem[]>(INITIAL_LOST_ITEMS);
  const [visitors, setVisitors] = useState<VisitorLog[]>(INITIAL_VISITORS);

  const [isAddingLostItem, setIsAddingLostItem] = useState(false);
  const [isAddingVisitor, setIsAddingVisitor] = useState(false);
  const [selectedVisitorForPass, setSelectedVisitorForPass] = useState<VisitorLog | null>(null);
  const [newVisitorName, setNewVisitorName] = useState('');
  const [newVisitorVisitingWho, setNewVisitorVisitingWho] = useState('');
  const [newVisitorPurpose, setNewVisitorPurpose] = useState('');
  const [newVisitorBadgeNumber, setNewVisitorBadgeNumber] = useState('');

  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitorName || !newVisitorVisitingWho || !newVisitorBadgeNumber) return;

    const newVisitor: VisitorLog = {
      id: `V-10${visitors.length + 1}`,
      visitorName: newVisitorName,
      visitingWho: newVisitorVisitingWho,
      entryTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      badgeNumber: newVisitorBadgeNumber,
      purpose: newVisitorPurpose
    };

    setVisitors([newVisitor, ...visitors]);
    setIsAddingVisitor(false);
    setNewVisitorName('');
    setNewVisitorVisitingWho('');
    setNewVisitorPurpose('');
    setNewVisitorBadgeNumber('');
  };
  const [newItemName, setNewItemName] = useState('');
  const [newItemLocation, setNewItemLocation] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemPhotoUrl, setNewItemPhotoUrl] = useState('');

  const handleAddLostItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemLocation) return;
    
    const newItem: LostItem = {
      id: `LE-00${lostItems.length + 1}`,
      itemName: newItemName,
      locationFound: newItemLocation,
      dateFound: new Date().toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      status: 'Bulundu (Depoda)',
      description: newItemDescription,
      photoUrl: newItemPhotoUrl
    };
    
    setLostItems([newItem, ...lostItems]);
    setIsAddingLostItem(false);
    setNewItemName('');
    setNewItemLocation('');
    setNewItemDescription('');
    setNewItemPhotoUrl('');
  };

  const handleMarkAsClaimed = (id: string) => {
    const claimedBy = window.prompt("Eşyayı teslim alan kişinin adını giriniz:");
    if (!claimedBy) return;

    setLostItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: 'Teslim Edildi', claimedBy }
        : item
    ));
  };

  const handleVisitorExit = (id: string) => {
    setVisitors(prev => prev.map(v => 
      v.id === id 
        ? { ...v, exitTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }
        : v
    ));
  };

  const handleAlarmToggle = () => {
    if (isAlarmActive) {
      if (window.confirm("Acil durum alarmını iptal etmek istediğinize emin misiniz?")) {
        setIsAlarmActive(false);
        setIsRollCallMode(false);
      }
    } else {
      if (window.confirm("DİKKAT: Tüm personele acil durum SMS ve Push bildirimi gönderilecek! Onaylıyor musunuz?")) {
        setIsAlarmActive(true);
      }
    }
  };

  const [activeParticipantsForRollCall, setActiveParticipantsForRollCall] = useState<Participant[]>([]);
  
  const handleRollCallToggle = () => {
    if (!isRollCallMode) {
      setActiveParticipantsForRollCall([...activeParticipants]);
    }
    setIsRollCallMode(!isRollCallMode);
  };

  const handleRollCallCheck = (id: string, status: 'Mevcut' | 'Eksik') => {
    setActiveParticipantsForRollCall(prev => prev.map(p => {
      if (p.id === id) {
        // Just hacking status into role or a temporary field isn't great. Let's just create a local state for rollcall results
      }
      return p;
    }));
  };
  
  const [rollCallResults, setRollCallResults] = useState<Record<string, 'Mevcut' | 'Eksik'>>({});

  const toggleRollCallStatus = (id: string, status: 'Mevcut' | 'Eksik') => {
    setRollCallResults(prev => ({
      ...prev,
      [id]: status
    }));
  };

  // Computed for emergency
  const activeParticipants = participants.filter(p => p.status === 'Kampta');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Güvenlik ve Operasyon
            <HelpTooltip content="Ziyaretçi giriş-çıkışları, acil durum toplanma yoklamaları ve kamp içi kayıp eşyaların kaydedildiği modül." />
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Kamp güvenliği, ziyaretçi logları ve kayıp eşya yönetimi.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('ziyaretci')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'ziyaretci' ? 'bg-indigo-700 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Ziyaretçi &amp; Güvenlik Logları
        </button>
        <button
          onClick={() => setActiveTab('kayip-esya')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'kayip-esya' ? 'bg-indigo-700 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Package className="w-4 h-4" />
          Kayıp Eşya Sistemi
        </button>
        <button
          onClick={() => setActiveTab('acil-durum')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'acil-durum' ? 'bg-rose-700 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/20'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Acil Durum &amp; Tahliye Paneli
        </button>
      </div>

      {/* Ziyaretçi Logları */}
      {activeTab === 'ziyaretci' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                Ziyaretçi ve Güvenlik Logları
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Kampa dışarıdan gelen misafirlerin (protokol, veliler vb.) giriş-çıkış kayıtları.
              </p>
            </div>
            {!isAddingVisitor ? (
              <button onClick={() => setIsAddingVisitor(true)} className="bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs">
                <Plus className="w-4 h-4" /> Yeni Giriş Kaydı
              </button>
            ) : (
              <button onClick={() => setIsAddingVisitor(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs">
                İptal
              </button>
            )}
          </div>

          {isAddingVisitor && (
            <form onSubmit={handleAddVisitor} className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">Yeni Ziyaretçi Kaydı</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Ziyaretçi Adı Soyadı</label>
                  <input type="text" value={newVisitorName} onChange={(e) => setNewVisitorName(e.target.value)} required className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-100" placeholder="Örn: Ahmet Yılmaz" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Yaka Kartı No</label>
                  <input type="text" value={newVisitorBadgeNumber} onChange={(e) => setNewVisitorBadgeNumber(e.target.value)} required className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-100" placeholder="Örn: Z-005" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Kimi Ziyaret Ediyor?</label>
                  <input type="text" value={newVisitorVisitingWho} onChange={(e) => setNewVisitorVisitingWho(e.target.value)} required className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-100" placeholder="Örn: Kamp Müdürü" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Geliş Amacı</label>
                  <input type="text" value={newVisitorPurpose} onChange={(e) => setNewVisitorPurpose(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-100" placeholder="Örn: Veli Görüşmesi" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition cursor-pointer">
                  Kayıt Oluştur
                </button>
              </div>
            </form>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-400">
                  <th className="p-3 uppercase">Yaka Kartı</th>
                  <th className="p-3 uppercase">Ziyaretçi Adı</th>
                  <th className="p-3 uppercase">Geliş Amacı</th>
                  <th className="p-3 uppercase">Görüşülecek Kişi</th>
                  <th className="p-3 uppercase">Giriş Saati</th>
                  <th className="p-3 uppercase">Çıkış Saati</th>
                  <th className="p-3 uppercase">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-xs text-gray-800 dark:text-gray-200 font-medium">
                {visitors.map(visitor => (
                  <tr key={visitor.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                    <td className="p-3 font-mono">
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-[10px] font-bold">
                        {visitor.badgeNumber}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{visitor.visitorName}</td>
                    <td className="p-3">{visitor.purpose}</td>
                    <td className="p-3">{visitor.visitingWho}</td>
                    <td className="p-3 flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-600"/> {visitor.entryTime}</td>
                    <td className="p-3">
                      {visitor.exitTime ? (
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400"><LogOut className="w-3 h-3"/> {visitor.exitTime}</span>
                      ) : (
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold">İçeride</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {!visitor.exitTime && (
                          <button onClick={() => handleVisitorExit(visitor.id)} className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-lg font-bold text-[10px] transition cursor-pointer flex items-center gap-1">
                            <LogOut className="w-3 h-3" /> Çıkış Yap
                          </button>
                        )}
                        <button onClick={() => setSelectedVisitorForPass(visitor)} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-bold text-[10px] transition cursor-pointer flex items-center gap-1">
                          <Printer className="w-3 h-3" /> Kart Yazdır
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kayıp Eşya Sistemi */}
      {activeTab === 'kayip-esya' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <Package className="w-5 h-5 text-indigo-600" />
                Kayıp Eşya Sistemi
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Kamp alanında unutulan veya bulunan eşyaların takip deposu.
              </p>
            </div>
            {!isAddingLostItem ? (
              <button onClick={() => setIsAddingLostItem(true)} className="bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs">
                <Plus className="w-4 h-4" /> Yeni Bulunan Eşya
              </button>
            ) : (
              <button onClick={() => setIsAddingLostItem(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs">
                İptal
              </button>
            )}
          </div>

          {isAddingLostItem && (
            <form onSubmit={handleAddLostItem} className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">Yeni Eşya Kaydı</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Eşya Adı</label>
                  <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} required className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-100" placeholder="Örn: Siyah Cüzdan" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Bulunduğu Yer</label>
                  <input type="text" value={newItemLocation} onChange={(e) => setNewItemLocation(e.target.value)} required className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-100" placeholder="Örn: Yemekhane" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Fotoğraf Çek veya Yükle</label>
                  <input type="file" accept="image/*" capture="environment" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewItemPhotoUrl(URL.createObjectURL(file));
                    }
                  }} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  {newItemPhotoUrl && <img src={newItemPhotoUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg mt-2" />}
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Açıklama</label>
                  <textarea value={newItemDescription} onChange={(e) => setNewItemDescription(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-100" placeholder="Eşya hakkında detaylar..." rows={2}></textarea>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition cursor-pointer">
                  Kaydet
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lostItems.map(item => (
              <div key={item.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{item.itemName}</h4>
                    {item.photoUrl && <img src={item.photoUrl} alt={item.itemName} className="w-full h-32 object-cover rounded-lg my-2" />}
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">#{item.id}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700">{item.description}</p>
                <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-500"/> {item.locationFound}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-500"/> {item.dateFound}</div>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  {item.status === 'Bulundu (Depoda)' ? (
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold">Depoda Bekliyor</span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold">Teslim Edildi: {item.claimedBy}</span>
                  )}

                  {item.status === 'Bulundu (Depoda)' && (
                    <button onClick={() => handleMarkAsClaimed(item.id)} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded cursor-pointer">
                      Sahibine Ver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acil Durum & Tahliye Paneli */}
      {activeTab === 'acil-durum' && (
        <div className={`p-6 rounded-xl border-2 shadow-sm space-y-6 transition-colors duration-500 ${isAlarmActive ? 'bg-rose-600 border-rose-800' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-500'}`}>
          <div className={`flex justify-between items-center pb-4 border-b ${isAlarmActive ? 'border-rose-800/50' : 'border-rose-200 dark:border-rose-900/50'}`}>
            <div>
              <h3 className={`font-black text-lg flex items-center gap-2 uppercase tracking-wide ${isAlarmActive ? 'text-white' : 'text-rose-700 dark:text-rose-400'}`}>
                <AlertTriangle className={`w-6 h-6 ${isAlarmActive ? 'animate-bounce text-white' : 'animate-pulse'}`} />
                ACİL DURUM VE TAHLİYE PANELİ
              </h3>
              <p className={`text-xs mt-1 font-medium ${isAlarmActive ? 'text-rose-100' : 'text-rose-600/80 dark:text-rose-300/80'}`}>
                Bu panel sadece kriz anlarında (yangın, deprem vb.) kamp müdürü tarafından kullanılmalıdır.
              </p>
            </div>
            <button onClick={handleAlarmToggle} className={`${isAlarmActive ? 'bg-white text-rose-700 hover:bg-gray-100' : 'bg-rose-600 hover:bg-rose-700 text-white'} font-extrabold text-sm py-2 px-6 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-md uppercase tracking-wider`}>
              {isAlarmActive ? 'ALARMI İPTAL ET' : 'ACİL DURUM ALARMI VER'}
            </button>
          </div>

          {isAlarmActive && (
            <div className="bg-white/20 p-4 rounded-xl text-white font-bold animate-pulse text-center">
              DİKKAT: ALARM AKTİF DURUMDADIR. TÜM PERSONELE BİLDİRİM GÖNDERİLMİŞTİR.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sayısal Veriler */}
            <div className={`p-5 rounded-xl shadow-xs border text-center space-y-2 ${isAlarmActive ? 'bg-white/10 border-white/20' : 'bg-white dark:bg-gray-900 border-rose-100 dark:border-rose-900'}`}>
              <span className={`block text-4xl font-black ${isAlarmActive ? 'text-white' : 'text-rose-600 dark:text-rose-500'}`}>{activeParticipants.length}</span>
              <span className={`text-xs font-bold uppercase tracking-wider block ${isAlarmActive ? 'text-rose-100' : 'text-gray-500 dark:text-gray-400'}`}>Kamptaki Katılımcı Sayısı</span>
            </div>
            
            <div className={`p-5 rounded-xl shadow-xs border text-center space-y-2 ${isAlarmActive ? 'bg-white/10 border-white/20' : 'bg-white dark:bg-gray-900 border-rose-100 dark:border-rose-900'}`}>
              <span className={`block text-4xl font-black ${isAlarmActive ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>12</span>
              <span className={`text-xs font-bold uppercase tracking-wider block ${isAlarmActive ? 'text-rose-100' : 'text-gray-500 dark:text-gray-400'}`}>Aktif Personel Sayısı</span>
            </div>

            <div className={`p-5 rounded-xl shadow-xs border text-center space-y-2 ${isAlarmActive ? 'bg-white/10 border-white/20' : 'bg-white dark:bg-gray-900 border-rose-100 dark:border-rose-900'}`}>
              <span className={`block text-4xl font-black ${isAlarmActive ? 'text-white' : 'text-amber-500 dark:text-amber-400'}`}>
                {visitors.filter(v => !v.exitTime).length}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider block ${isAlarmActive ? 'text-rose-100' : 'text-gray-500 dark:text-gray-400'}`}>İçerideki Ziyaretçi Sayısı</span>
            </div>
          </div>

          <div className={`p-5 rounded-xl shadow-xs border space-y-4 ${isAlarmActive ? 'bg-white/10 border-white/20' : 'bg-white dark:bg-gray-900 border-rose-100 dark:border-rose-900'}`}>
            <h4 className={`font-bold text-sm border-b pb-2 ${isAlarmActive ? 'text-white border-white/20' : 'text-gray-900 dark:text-gray-100 border-gray-100 dark:border-gray-800'}`}>Hızlı Toplanma Alanı Yoklaması</h4>
            {!isRollCallMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={handleRollCallToggle} className={`${isAlarmActive ? 'bg-white text-rose-700 hover:bg-gray-100 border-white' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'} border p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition cursor-pointer`}>
                  <Users className="w-8 h-8" />
                  Grup Bazlı Hızlı Yoklama Başlat
                </button>
                <button className={`${isAlarmActive ? 'bg-white/20 text-white border-white/30 hover:bg-white/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'} border p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition cursor-pointer`}>
                  <Map className="w-8 h-8" />
                  Tahliye Haritası ve Planı
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold uppercase ${isAlarmActive ? 'text-rose-100' : 'text-gray-500'}`}>Katılımcı Listesi</span>
                  <button onClick={handleRollCallToggle} className={`${isAlarmActive ? 'bg-rose-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition`}>Yoklamayı Kapat</button>
                </div>
                <div className={`overflow-x-auto rounded-xl border ${isAlarmActive ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  <table className="w-full text-left border-collapse">
                    <thead className={isAlarmActive ? 'bg-white/10 text-white' : 'bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400'}>
                      <tr>
                        <th className="p-3 text-xs uppercase font-bold">Ad Soyad</th>
                        <th className="p-3 text-xs uppercase font-bold">Grup</th>
                        <th className="p-3 text-xs uppercase font-bold">Durum</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isAlarmActive ? 'divide-white/10 text-white' : 'divide-gray-100 dark:divide-gray-700 text-gray-800 dark:text-gray-200'}`}>
                      {activeParticipantsForRollCall.map(p => (
                        <tr key={p.id}>
                          <td className="p-3 font-bold text-sm">{p.firstName} {p.lastName}</td>
                          <td className="p-3 text-sm">{p.groupName || '-'}</td>
                          <td className="p-3 flex gap-2">
                            <button 
                              onClick={() => toggleRollCallStatus(p.id, 'Mevcut')}
                              className={`px-3 py-1 rounded font-bold text-xs cursor-pointer transition ${rollCallResults[p.id] === 'Mevcut' ? 'bg-emerald-500 text-white' : isAlarmActive ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >Mevcut</button>
                            <button 
                              onClick={() => toggleRollCallStatus(p.id, 'Eksik')}
                              className={`px-3 py-1 rounded font-bold text-xs cursor-pointer transition ${rollCallResults[p.id] === 'Eksik' ? 'bg-rose-600 text-white' : isAlarmActive ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >Eksik</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Printable Gate Pass Modal */}
      {selectedVisitorForPass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 print:hidden">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-600" />
                Ziyaretçi Kartı Yazdır
              </h2>
              <button onClick={() => setSelectedVisitorForPass(null)} className="text-gray-400 hover:text-gray-600 transition cursor-pointer">
                ✕
              </button>
            </div>
            
            <div className="p-6 bg-gray-50/50 flex justify-center print:bg-white print:p-0" id="printable-gate-pass">
              {/* Gate Pass Card */}
              <div className="w-[320px] h-[480px] bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col relative border-2 border-[#00AB41] print:shadow-none print:border-none print:rounded-none">
                {/* Header Section */}
                <div className="bg-[#00AB41] text-white text-center py-6 px-4 relative overflow-hidden">
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
                  
                  <div className="mx-auto mb-4 relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 100 100" className="w-14 h-14 object-contain aspect-square">
                      <path
                        d="M52,15 A35,35 0 1,0 85,68 A28,28 0 1,1 85,32 A35,35 0 0,0 52,15 Z"
                        fill="#00AB41"
                      />
                    </svg>
                  </div>
                  <h3 className="font-black text-2xl tracking-wide uppercase relative z-10 leading-tight">
                    Kamp <br/> Ziyaretçi Kartı
                  </h3>
                  <p className="text-[10px] font-bold opacity-90 uppercase tracking-widest mt-2 relative z-10">T.C. Türkiye Yeşilay Cemiyeti</p>
                </div>
                
                {/* Body Section */}
                <div className="p-6 flex-1 flex flex-col items-center text-center justify-center bg-white relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-black/5 to-transparent"></div>
                  
                  <div className="w-full">
                    <h2 className="text-2xl font-black text-gray-900 leading-tight truncate">{selectedVisitorForPass.visitorName}</h2>
                    <div className="inline-block bg-[#00AB41]/10 text-[#00AB41] px-4 py-1.5 rounded-full text-sm font-black mt-2 border border-[#00AB41]/20 tracking-wider">
                      {selectedVisitorForPass.badgeNumber}
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-gray-100 my-5" />
                  
                  <div className="w-full text-left space-y-4 px-2">
                    <div>
                      <p className="text-[10px] font-extrabold text-[#00AB41] uppercase tracking-widest mb-1">Ziyaret Edilen Kişi / Birim</p>
                      <p className="text-sm font-bold text-gray-800 leading-tight">{selectedVisitorForPass.visitingWho}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-[#00AB41] uppercase tracking-widest mb-1">Ziyaret Amacı</p>
                      <p className="text-sm font-bold text-gray-800 leading-tight">{selectedVisitorForPass.purpose}</p>
                    </div>
                  </div>
                </div>
                
                {/* Footer Section */}
                <div className="bg-[#00AB41]/5 p-4 text-center border-t border-[#00AB41]/20">
                  <p className="text-xs font-bold text-[#00AB41]">
                    Giriş: {selectedVisitorForPass.entryTime}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-2 px-4 font-medium leading-relaxed">
                    Bu kart kamp alanı içerisinde sürekli takılı olmalıdır.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setSelectedVisitorForPass(null)}
                className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Yazdır
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
