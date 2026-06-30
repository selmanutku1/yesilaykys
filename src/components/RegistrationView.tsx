/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Participant, CampPeriod, Bungalow } from '../types';
import { 
  FileEdit, 
  Smile, 
  Check, 
  X, 
  AlertTriangle, 
  UserCheck,
  Printer,
  FileText,
  FileDown,
  Users,
  MapPin,
  Plus,
  Trash2,
  CalendarDays,
  Building,
  CheckSquare,
  Square,
  HelpCircle,
  Link,
  Copy,
  Pencil,
  Save,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { exportToWord, exportToPdf } from '../utils/formExporter';
import { HelpTooltip } from './HelpTooltip';

const CITY_DISTRICT_MAP: Record<string, string[]> = {
  'Adana': ['Seyhan', 'Yüreğir', 'Çukurova', 'Sarıçam', 'Ceyhan', 'Kozan', 'İmamoğlu', 'Karataş', 'Pozantı', 'Feke'],
  'Adıyaman': ['Merkez', 'Kahta', 'Besni', 'Gölbaşı', 'Gerger', 'Samsat', 'Çelikhan', 'Tut', 'Sincik'],
  'Afyonkarahisar': ['Merkez', 'Sandıklı', 'Dinar', 'Bolvadin', 'Emirdağ', 'Sinanpaşa', 'Şuhut', 'Çay', 'İhsaniye'],
  'Ağrı': ['Merkez', 'Patnos', 'Doğubayazıt', 'Diyadin', 'Eleşkirt', 'Tutak', 'Taşlıçay', 'Hamur'],
  'Amasya': ['Merkez', 'Merzifon', 'Suluova', 'Taşova', 'Gümüşhacıköy', 'Göynücek', 'Hamamözü'],
  'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Gölbaşı', 'Polatlı', 'Beypazarı', 'Kahramankazan', 'Nallıhan', 'Haymana', 'Kızılcahamam', 'Şereflikoçhisar'],
  'Antalya': ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Alanya', 'Manavgat', 'Kemer', 'Serik', 'Kumluca', 'Kaş', 'Finike', 'Gazipaşa', 'Demre', 'Elmalı', 'Akseki', 'İbradı', 'Gündoğmuş'],
  'Artvin': ['Merkez', 'Hopa', 'Borçka', 'Arhavi', 'Şavşat', 'Yusufeli', 'Ardanuç', 'Murgul', 'Kemalpaşa'],
  'Aydın': ['Efeler', 'Nazilli', 'Söke', 'Kuşadası', 'Didim', 'Germencik', 'İncirliova', 'Çine', 'Bozdoğan', 'Karacasu', 'Sultanhisar', 'Köşk'],
  'Balıkesir': ['Altıeylül', 'Karesi', 'Edremit', 'Bandırma', 'Ayvalık', 'Burhaniye', 'Gönen', 'Erdek', 'Bigadiç', 'Sındırgı', 'Havran', 'Dursunbey', 'Susurluk', 'Manyas', 'Savaştepe', 'İvrindi'],
  'Bilecik': ['Merkez', 'Bozüyük', 'Osmaneli', 'Söğüt', 'Gölpazarı', 'Pazaryeri', 'Yenipazar', 'İnhisar'],
  'Bingöl': ['Merkez', 'Genç', 'Solhan', 'Karlıova', 'Adaklı', 'Kiğı', 'Yedisu', 'Yayladere'],
  'Bitlis': ['Merkez', 'Tatvan', 'Ahlat', 'Adilcevaz', 'Güroymak', 'Hizan', 'Mutki'],
  'Bolu': ['Merkez', 'Gerede', 'Mudurnu', 'Göynük', 'Mengen', 'Yeniçağa', 'Dörtdivan', 'Seben', 'Kıbrıscık'],
  'Burdur': ['Merkez', 'Bucak', 'Gölhisar', 'Yeşilova', 'Tefenni', 'Karamanlı', 'Kemer', 'Altınyayla', 'Çavdır', 'Ağlasun', 'Çeltikçi'],
  'Bursa': ['Osmangazi', 'Nilüfer', 'Yıldırım', 'İnegöl', 'Gemlik', 'Mustafakemalpaşa', 'Mudanya', 'Gürsu', 'Kestel', 'Karacabey', 'Orhangazi', 'Yenişehir', 'İznik', 'Orhaneli', 'Keles', 'Büyükorhan', 'Harmancık'],
  'Çanakkale': ['Merkez', 'Biga', 'Gelibolu', 'Çan', 'Ayvacık', 'Ezine', 'Yenice', 'Lapseki', 'Bayramiç', 'Eceabat', 'Gökçeada', 'Bozcaada'],
  'Çankırı': ['Merkez', 'Orta', 'Çerkeş', 'Ilgaz', 'Kurşunlu', 'Yapraklı', 'Eldivan', 'Şabanözü'],
  'Çorum': ['Merkez', 'Sungurlu', 'Osmancık', 'Alaca', 'İskilip', 'Mecitözü', 'Bayat', 'Kargı', 'Uğurludağ', 'Ortaköy', 'Oğuzlar', 'Dodurga', 'Laçin', 'Boğazkale'],
  'Denizli': ['Pamukkale', 'Merkezefendi', 'Acıpayam', 'Tavas', 'Çivril', 'Sarayköy', 'Buldan', 'Honaz', 'Kale', 'Çal', 'Bozkurt', 'Serinhisar', 'Güney', 'Çardak', 'Bekilli', 'Babadağ'],
  'Diyarbakır': ['Kayapınar', 'Bağlar', 'Yenişehir', 'Sur', 'Ergani', 'Bismil', 'Silvan', 'Çınar', 'Lice', 'Kulp', 'Dicle', 'Hani', 'Eğil', 'Hazro', 'Kocaköy'],
  'Edirne': ['Merkez', 'Keşan', 'Uzunköprü', 'İpsala', 'Havsa', 'Meriç', 'Enez', 'Süloğlu', 'Lalapaşa'],
  'Elazığ': ['Merkez', 'Kovancılar', 'Karakoçan', 'Palu', 'Baskil', 'Arıcak', 'Maden', 'Sivrice', 'Alacakaya', 'Keban', 'Ağın'],
  'Erzincan': ['Merkez', 'Tercan', 'Üzümlü', 'Refahiye', 'Çayırlı', 'İliç', 'Kemah', 'Kemaliye', 'Otlukbeli'],
  'Erzurum': ['Yakutiye', 'Palandöken', 'Aziziye', 'Oltu', 'Horasan', 'Hınıs', 'İspir', 'Pasinler', 'Karayazı', 'Aşkale', 'Tekman', 'Tortum', 'Karaçoban', 'Şenkaya', 'Köprüköy', 'Olur'],
  'Eskişehir': ['Odunpazarı', 'Tepebaşı', 'Sivrihisar', 'Çifteler', 'Seyitgazi', 'Alpu', 'Mihalıççık', 'Mahmudiye', 'Beylikova', 'İnönü', 'Sarıcakaya', 'Günyüzü', 'Mihalgazi', 'Han'],
  'Gaziantep': ['Şahinbey', 'Şehitkamil', 'Nizip', 'Islahiye', 'Nurdağı', 'Araban', 'Oğuzeli', 'Yavuzeli', 'Karkamış'],
  'Giresun': ['Merkez', 'Bulancak', 'Espiye', 'Görele', 'Tirebolu', 'Şebinkarahisar', 'Dereli', 'Keşap', 'Yağlıdere', 'Alucra', 'Piraziz', 'Eynesil', 'Çamoluk', 'Güce'],
  'Gümüşhane': ['Merkez', 'Kelkit', 'Şiran', 'Köse', 'Kürtün', 'Torul'],
  'Hakkari': ['Merkez', 'Yüksekova', 'Şemdinli', 'Çukurca', 'Derecik'],
  'Hatay': ['Antakya', 'İskenderun', 'Defne', 'Dörtyol', 'Samandağ', 'Kırıkhan', 'Reyhanlı', 'Arsuz', 'Altınözü', 'Hassa', 'Erzin', 'Payas', 'Belen', 'Yayladağı', 'Kumlu'],
  'Isparta': ['Merkez', 'Yalvaç', 'Eğirdir', 'Şarkikaraağaç', 'Gelendost', 'Keçiborlu', 'Senirkent', 'Sütçüler', 'Gönen', 'Uluborlu', 'Atabey', 'Aksu', 'Yenişarbademli'],
  'Mersin': ['Tarsus', 'Toroslar', 'Yenişehir', 'Akdeniz', 'Mezitli', 'Silifke', 'Anamur', 'Erdemli', 'Mut', 'Bozyazı', 'Gülnar', 'Aydıncık', 'Çamlıyayla'],
  'İstanbul': ['Beşiktaş', 'Kadıköy', 'Fatih', 'Üsküdar', 'Pendik', 'Esenyurt', 'Sarıyer', 'Beykoz', 'Şile', 'Arnavutköy', 'Bakırköy', 'Şişli', 'Beylikdüzü', 'Maltepe', 'Kartal', 'Ataşehir', 'Kağıthane', 'Zeytinburnu', 'Bağcılar', 'Bahçelievler', 'Eyüpsultan', 'Gaziosmanpaşa', 'Ümraniye', 'Sultangazi', 'Başakşehir', 'Sancaktepe', 'Tuzla', 'Büyükçekmece', 'Silivri', 'Çatalca'],
  'İzmir': ['Konak', 'Bornova', 'Karşıyaka', 'Buca', 'Çeşme', 'Aliağa', 'Karabağlar', 'Bayraklı', 'Çiğli', 'Gaziemir', 'Menemen', 'Torbalı', 'Ödemiş', 'Bergama', 'Kemalpaşa', 'Tire', 'Balçova', 'Narlıdere', 'Urla', 'Foça', 'Seferihisar', 'Selçuk', 'Dikili', 'Kiraz', 'Menderes'],
  'Kars': ['Merkez', 'Sarıkamış', 'Kağızman', 'Digor', 'Selim', 'Arpaçay', 'Akyaka', 'Susuz'],
  'Kastamonu': ['Merkez', 'Tosya', 'Taşköprü', 'Cide', 'İnebolu', 'Araç', 'Devrekani', 'Daday', 'Küre', 'Abana', 'Bozkurt', 'Seydiler'],
  'Kayseri': ['Melikgazi', 'Kocasinan', 'Talas', 'Develi', 'Yahyalı', 'Hacılar', 'Bünyan', 'Pınarbaşı', 'Tomarza', 'Yeşilhisar', 'Sarıoğlan', 'Felahiye', 'Özvatan'],
  'Kırklareli': ['Merkez', 'Lüleburgaz', 'Babaeski', 'Vize', 'Pınarhisar', 'Demirköy', 'Pehlivanköy', 'Kofçaz'],
  'Kırşehir': ['Merkez', 'Kaman', 'Mucur', 'Çiçekdağı', 'Akpınar', 'Boztepe', 'Akçakent'],
  'Kocaeli': ['İzmit', 'Gebze', 'Darıca', 'Körfez', 'Gölcük', 'Derince', 'Kartepe', 'Çayırova', 'Başiskele', 'Karamürsel', 'Kandıra', 'Dilovası'],
  'Konya': ['Selçuklu', 'Meram', 'Karatay', 'Ereğli', 'Akşehir', 'Beyşehir', 'Kulu', 'Cihanbeyli', 'Seydişehir', 'Karapınar', 'Çumra', 'Ilgın', 'Bozkır', 'Sarayönü', 'Yunak', 'Kadınhanı'],
  'Kütahya': ['Merkez', 'Tavşanlı', 'Simav', 'Gediz', 'Emet', 'Altıntaş', 'Domaniç', 'Hisarcık', 'Aslanapa', 'Şaphane'],
  'Malatya': ['Yeşilyurt', 'Battalgazi', 'Doğanşehir', 'Akçadağ', 'Darende', 'Hekimhan', 'Pütürge', 'Yazıhan', 'Arapgir', 'Arguvan', 'Kuluncak', 'Kale', 'Doğanyol'],
  'Manisa': ['Yunusemre', 'Şehzadeler', 'Akhisar', 'Turgutlu', 'Salihli', 'Soma', 'Alaşehir', 'Saruhanlı', 'Kula', 'Kırkağaç', 'Demirci', 'Gördes', 'Selendi', 'Ahmetli', 'Köprübaşı'],
  'Kahramanmaraş': ['Onikişubat', 'Dulkadiroğlu', 'Elbistan', 'Afşin', 'Türkoğlu', 'Pazarcık', 'Göksun', 'Andırın', 'Çağlayancerit', 'Ekinözü', 'Nurhak'],
  'Mardin': ['Artuklu', 'Kızıltepe', 'Midyat', 'Nusaybin', 'Derik', 'Mazıdağı', 'Dargeçit', 'Savur', 'Yeşilli', 'Ömerli'],
  'Muğla': ['Menteşe', 'Bodrum', 'Fethiye', 'Milas', 'Marmaris', 'Ortaca', 'Yatağan', 'Dalaman', 'Datça', 'Köyceğiz', 'Ula', 'Kavaklıdere'],
  'Muş': ['Merkez', 'Bulanık', 'Malazgirt', 'Hasköy', 'Varto', 'Korkut'],
  'Nevşehir': ['Merkez', 'Ürgüp', 'Avanos', 'Gülşehir', 'Derinkuyu', 'Acıgöl', 'Kozaklı', 'Hacıbektaş'],
  'Niğde': ['Merkez', 'Bor', 'Çamardı', 'Ulukışla', 'Altunhisar', 'Çiftlik'],
  'Ordu': ['Altınordu', 'Ünye', 'Fatsa', 'Gölköy', 'Korgan', 'Kumru', 'Perşembe', 'Aybastı', 'Ulubey', 'Mesudiye', 'İkizce', 'Gürgentepe'],
  'Rize': ['Merkez', 'Çayeli', 'Ardeşen', 'Pazar', 'Fındıklı', 'Güneysu', 'Kalkandere', 'İyidere', 'Derepazarı', 'Çamlıhemşin', 'İkizdere', 'Hemşin'],
  'Sakarya': ['Adapazarı', 'Serdivan', 'Akyazı', 'Erenler', 'Hendek', 'Karasu', 'Geyve', 'Arifiye', 'Sapanca', 'Pamukova', 'Kocaali', 'Ferizli', 'Söğütlü', 'Karapürçek', 'Taraklı'],
  'Samsun': ['İlkadım', 'Atakum', 'Bafra', 'Çarşamba', 'Canik', 'Vezirköprü', 'Tekkeköy', 'Havza', 'Alaçam', 'Terme', '19 Mayıs', 'Kavak', 'Salıpazarı', 'Ayvacık', 'Ladik'],
  'Siirt': ['Merkez', 'Kurtalan', 'Eruh', 'Baykan', 'Şirvan', 'Tillo'],
  'Sinop': ['Merkez', 'Boyabat', 'Gerze', 'Ayancık', 'Durağan', 'Türkeli', 'Erfelek', 'Saraydüzü', 'Dikmen'],
  'Sivas': ['Merkez', 'Şarkışla', 'Yıldızeli', 'Suşehri', 'Gemerek', 'Zara', 'Kangal', 'Gürün', 'Divriği', 'Koyulhisar', 'Altınyayla'],
  'Tekirdağ': ['Süleymanpaşa', 'Çorlu', 'Çerkezköy', 'Kapaklı', 'Ergene', 'Malkara', 'Saray', 'Hayrabolu', 'Şarköy', 'Muratlı', 'Marmaraereğlisi'],
  'Tokat': ['Merkez', 'Erbaa', 'Turhal', 'Niksar', 'Zile', 'Reşadiye', 'Almus', 'Pazar', 'Yeşilyurt', 'Sulusaray'],
  'Trabzon': ['Ortahisar', 'Akçaabat', 'Araklı', 'Sürmene', 'Of', 'Yomra', 'Arsin', 'Vakfıkebir', 'Beşikdüzü', 'Tonya', 'Maçka', 'Çaykara', 'Şalpazarı', 'Düzköy'],
  'Tunceli': ['Merkez', 'Ovacık', 'Mazgirt', 'Pertek', 'Hozat', 'Çemişgezek', 'Pülümür', 'Nazımiye'],
  'Şanlıurfa': ['Haliliye', 'Eyyübiye', 'Karaköprü', 'Siverek', 'Viranşehir', 'Birecik', 'Suruç', 'Ceylanpınar', 'Harran', 'Akçakale', 'Bozova', 'Hilvan', 'Halfeti'],
  'Uşak': ['Merkez', 'Banaz', 'Eşme', 'Sivaslı', 'Ulubey', 'Karahallı'],
  'Van': ['İpekyolu', 'Tuşba', 'Edremit', 'Erciş', 'Özalp', 'Muradiye', 'Çaldıran', 'Başkale', 'Gevaş', 'Saray', 'Gürpınar', 'Çatak', 'Bahçesaray'],
  'Yozgat': ['Merkez', 'Sorgun', 'Akdağmadeni', 'Yerköy', 'Boğazlıyan', 'Sarıkaya', 'Çekerek', 'Şefaatli', 'Saraykent', 'Aydıncık'],
  'Zonguldak': ['Merkez', 'Ereğli', 'Alaplı', 'Çaycuma', 'Devrek', 'Kozlu', 'Kilimli', 'Gökçebey'],
  'Aksaray': ['Merkez', 'Ortaköy', 'Eskil', 'Gülağaç', 'Güzelyurt', 'Sarıyahşi', 'Ağaçören'],
  'Bayburt': ['Merkez', 'Demirözü', 'Aydıntepe'],
  'Karaman': ['Merkez', 'Ermenek', 'Sarıveliler', 'Ayrancı', 'Kazımkarabekir', 'Başyayla'],
  'Kırıkkale': ['Merkez', 'Yahşihan', 'Bahşılı', 'Keskin', 'Delice', 'Sulakyurt', 'Karakeçili', 'Balışeyh', 'Çelebi'],
  'Batman': ['Merkez', 'Kozluk', 'Beşiri', 'Sason', 'Gercüş', 'Hasankeyf'],
  'Şırnak': ['Merkez', 'Cizre', 'Silopi', 'İdil', 'Uludere', 'Beytüşşebap', 'Güçlükonak'],
  'Bartın': ['Merkez', 'Amasra', 'Ulus', 'Kurucaşile'],
  'Ardahan': ['Merkez', 'Göle', 'Çıldır', 'Posof', 'Hanak', 'Damal'],
  'Iğdır': ['Merkez', 'Aralık', 'Tuzluca', 'Karakoyunlu'],
  'Yalova': ['Merkez', 'Çiftlikköy', 'Çınarcık', 'Altınova', 'Armutlu', 'Termal'],
  'Karabük': ['Merkez', 'Safranbolu', 'Yenice', 'Eskipazar', 'Ovacık', 'Eflani'],
  'Kilis': ['Merkez', 'Musabeyli', 'Elbeyli', 'Polateli'],
  'Osmaniye': ['Merkez', 'Kadirli', 'Düziçi', 'Bahçe', 'Toprakkale', 'Sumbas', 'Hasanbeyli'],
  'Düzce': ['Merkez', 'Akçakoca', 'Kaynaşlı', 'Gölyaka', 'Çilimli', 'Yığılca', 'Gümüşova', 'Cumayeri']
};

interface RegistrationViewProps {
  participants: Participant[];
  periods: CampPeriod[];
  bungalows: Bungalow[];
  onUpdateParticipants: (updated: Participant[]) => void;
  onAddLog: (action: string, details: string) => void;
  isRemote?: boolean;
  activeSubView?: 'form' | 'queue';
  onChangeSubView?: (view: 'form' | 'queue') => void;
}

export default function RegistrationView({
  participants,
  periods,
  bungalows,
  onUpdateParticipants,
  onAddLog,
  isRemote = false,
  activeSubView = 'form',
  onChangeSubView,
}: RegistrationViewProps) {
  // Application Mode: Individual (Bireysel) or Convoy (Kafile)
  const [formMode, setFormMode] = useState<'individual' | 'convoy'>('individual');
  const [copiedLink, setCopiedLink] = useState(false);

  // URL Parameter Detection
  const params = new URLSearchParams(window.location.search);
  const urlPeriodId = params.get('periodId');
  const urlCenterId = params.get('centerId');

  // Filter periods by center if provided
  const filteredPeriods = urlCenterId 
    ? (periods.filter(p => p.campCenterId === urlCenterId).length > 0 
        ? periods.filter(p => p.campCenterId === urlCenterId) 
        : periods)
    : periods;

  const initialPeriodId = urlPeriodId || (filteredPeriods.find(p => p.isActive)?.id || filteredPeriods[0]?.id || '');

  // 1. Individual Form State
  const [selectedPeriodId, setSelectedPeriodId] = useState(initialPeriodId);
  const [name, setName] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [birthDate, setBirthDate] = useState('2013-05-15');
  const [gender, setGender] = useState<'Erkek' | 'Kız'>('Erkek');
  const [category, setCategory] = useState<'İlkokul' | 'Ortaokul' | 'Lise' | 'Üniversite' | 'Yetişkin' | 'Kafile Sorumlusu' | 'Şoför'>('Lise');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('Beşiktaş');
  const [address, setAddress] = useState('');
  
  const [allergies, setAllergies] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [medications, setMedications] = useState('');
  const [healthNote, setHealthNote] = useState('');
  
  // Placement State
  const [autoAllocate, setAutoAllocate] = useState(true);
  const [preferredBungalowId, setPreferredBungalowId] = useState<string>('');
  const [preferredBedNumber, setPreferredBedNumber] = useState<number>(0);

  const [kvkkChecked, setKvkkChecked] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  // 2. Convoy Form State
  const [convoyName, setConvoyName] = useState('');
  const [convoyPeriodId, setConvoyPeriodId] = useState(initialPeriodId);
  
  // Leader info
  const [leaderName, setLeaderName] = useState('');
  const [leaderTc, setLeaderTc] = useState('');
  const [leaderBirth, setLeaderBirth] = useState('1985-06-15');
  const [leaderGender, setLeaderGender] = useState<'Erkek' | 'Kız'>('Erkek');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderCity, setLeaderCity] = useState('İstanbul');
  const [leaderDistrict, setLeaderDistrict] = useState('Beşiktaş');
  const [leaderAddress, setLeaderAddress] = useState('');
  const [leaderAllergies, setLeaderAllergies] = useState('');
  const [leaderChronicDiseases, setLeaderChronicDiseases] = useState('');
  const [leaderMedications, setLeaderMedications] = useState('');
  const [leaderHealthNote, setLeaderHealthNote] = useState('');
  const [leaderAutoAllocate, setLeaderAutoAllocate] = useState(true);
  const [leaderPrefBungalowId, setLeaderPrefBungalowId] = useState('');
  const [leaderPrefBed, setLeaderPrefBed] = useState(0);

  // Convoy Members info
  interface ConvoyMemberForm {
    name: string;
    tcNo: string;
    birthDate: string;
    gender: 'Erkek' | 'Kız';
    category: 'İlkokul' | 'Ortaokul' | 'Lise' | 'Üniversite' | 'Yetişkin' | 'Şoför';
    allergies: string;
    chronicDiseases: string;
    medications: string;
    healthNote: string;
    autoAllocate: boolean;
    preferredBungalowId: string;
    preferredBedNumber: number;
  }

  const [convoyMembers, setConvoyMembers] = useState<ConvoyMemberForm[]>([
    {
      name: '',
      tcNo: '',
      birthDate: '2012-05-15',
      gender: 'Erkek',
      category: 'Lise',
      allergies: '',
      chronicDiseases: '',
      medications: '',
      healthNote: '',
      autoAllocate: true,
      preferredBungalowId: '',
      preferredBedNumber: 0
    }
  ]);

  // Bulk Selection State for evaluations
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);

  // 3. Edit Participant Modal State
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [viewingConvoyLeader, setViewingConvoyLeader] = useState<Participant | null>(null);
  const [expandedAppIds, setExpandedAppIds] = useState<string[]>([]);

  const handleSaveEditedParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant) return;

    const updated = participants.map(p => p.id === editingParticipant.id ? editingParticipant : p);
    onUpdateParticipants(updated);
    onAddLog(
      'Başvuru Bilgileri Güncellendi',
      `'${editingParticipant.name}' adlı katılımcının başvuru bilgileri yönetici tarafından güncellendi.`
    );
    setEditingParticipant(null);
  };

  // Reset district when city changes
  useEffect(() => {
    if (CITY_DISTRICT_MAP[city]) {
      setDistrict(CITY_DISTRICT_MAP[city][0]);
    }
  }, [city]);

  useEffect(() => {
    if (CITY_DISTRICT_MAP[leaderCity]) {
      setLeaderDistrict(CITY_DISTRICT_MAP[leaderCity][0]);
    }
  }, [leaderCity]);

  // Handle selected campaign from URL query on component mount
  useEffect(() => {
    if (urlPeriodId) {
      setSelectedPeriodId(urlPeriodId);
      setConvoyPeriodId(urlPeriodId);
    }
  }, [urlPeriodId]);

  // List only applicants with status "Başvuru Yapıldı" or "Yedek Listede"
  const applications = participants.filter(
    (p) => p.status === 'Başvuru Yapıldı' || p.status === 'Yedek Listede'
  );

  // Helper to get available bungalows for a specific gender & type
  const getBungalowList = (genderFilter: 'Erkek' | 'Kız', typeFilter?: 'Lider' | 'Standart') => {
    return bungalows.map(b => {
      const occupants = participants.filter(p => p.bungalowId === b.id);
      const isAvailable = occupants.length < b.capacity;
      const isGenderMatch = occupants.length === 0 || occupants[0].gender === genderFilter;
      const isTypeMatch = !typeFilter || b.type === typeFilter;
      
      return {
        ...b,
        occupantCount: occupants.length,
        isAvailable: isAvailable && isGenderMatch && isTypeMatch,
        currentGender: occupants.length > 0 ? occupants[0].gender : 'Boş'
      };
    });
  };

  const addConvoyMember = () => {
    setConvoyMembers([
      ...convoyMembers,
      {
        name: '',
        tcNo: '',
        birthDate: '2012-05-15',
        gender: leaderGender, // inherit gender by default
        category: 'Lise',
        allergies: '',
        chronicDiseases: '',
        medications: '',
        healthNote: '',
        autoAllocate: true,
        preferredBungalowId: '',
        preferredBedNumber: 0
      }
    ]);
  };

  const removeConvoyMember = (index: number) => {
    if (convoyMembers.length === 1) {
      alert("En az bir katılımcı bilgisi girmelisiniz.");
      return;
    }
    setConvoyMembers(convoyMembers.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, field: keyof ConvoyMemberForm, value: any) => {
    const updated = [...convoyMembers];
    updated[index] = { ...updated[index], [field]: value };
    setConvoyMembers(updated);
  };

  // Helper to compile current simulator inputs into a temporary draft participant
  const getDraftParticipant = (): Participant => {
    return {
      id: "BASVURU-TASLAK",
      name: name.trim() || "İsimsiz Kampçı Adayı",
      identityNumber: tcNo || "11111111111",
      birthDate: birthDate || "2013-05-15",
      gender: gender,
      category: category,
      phone: phone || "Girilmedi",
      email: email || "Girilmedi",
      address,
      city,
      district,
      campPeriodId: selectedPeriodId,
      allergies: allergies.trim() || "Saptanamayan Alerji Yok",
      chronicDiseases: chronicDiseases.trim() || "Yok",
      medications: medications.trim() || "Yok",
      healthNote: healthNote.trim() || "Müracaat Formu Taslağı",
      consentReceived: consentChecked,
      kvkkSigned: kvkkChecked,
      status: 'Başvuru Yapıldı',
      bungalowId: null,
      bedNumber: null,
      groupId: null,
      checkedIn: false
    };
  };

  const handleDownloadDraft = (format: 'pdf' | 'word') => {
    const draft = getDraftParticipant();
    if (format === 'pdf') {
      exportToPdf(draft);
    } else {
      exportToWord(draft);
    }
    onAddLog(
      'Form İndirme',
      `Sistem simülatöründe yazılı bilgiler ile geçici '${draft.name}' kayıt formu (${format.toUpperCase()}) olarak indirildi.`
    );
  };

  // SUBMIT INDIVIDUAL APPLICATION
  const handleSubmitIndividual = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !tcNo || !phone) {
      alert('Lütfen tüm zorunlu (yıldızlı) alanları doldurunuz.');
      return;
    }

    if (tcNo.length !== 11) {
      alert('T.C. Kimlik Numarası tam olarak 11 haneden oluşmalıdır.');
      return;
    }

    if (!kvkkChecked || !consentChecked) {
      alert('Lütfen KVKK Onay Belgesini ve Kamp Katılım Taahhütnamesini onaylayınız.');
      return;
    }

    const payload = {
      name,
      identityNumber: tcNo,
      birthDate,
      gender,
      category,
      phone,
      email,
      address,
      city,
      district,
      campPeriodId: selectedPeriodId,
      autoAllocate,
      preferredBungalowId: !autoAllocate && preferredBungalowId ? preferredBungalowId : null,
      preferredBedNumber: !autoAllocate && preferredBedNumber ? preferredBedNumber : null,
      allergies: allergies || 'Saptanamayan Alerji Yok',
      chronicDiseases: chronicDiseases || 'Yok',
      medications: medications || 'Yok',
      healthNote,
      consentReceived: true,
      kvkkSigned: true,
    };

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'individual', payload })
      });
      if (res.ok) {
        if (!isRemote) {
          const data = await res.json();
          const newParticipant: Participant = {
            ...payload,
            id: data.participantId,
            status: 'Başvuru Yapıldı',
            bungalowId: null,
            bedNumber: null,
            groupId: null,
            checkedIn: false
          } as any;
          onUpdateParticipants([...participants, newParticipant]);
          onAddLog(
            'Online Başvuru',
            `${name} (${gender} - ${category}) adlı gönüllü için yeni online kamp başvurusu yapıldı. İl: ${city}, İlçe: ${district}.`
          );
        }
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      const newParticipant: Participant = {
        id: `P0${participants.length + 100}`,
        ...payload,
        status: 'Başvuru Yapıldı',
        bungalowId: null,
        bedNumber: null,
        groupId: null,
        checkedIn: false,
      } as any;
      onUpdateParticipants([...participants, newParticipant]);
      onAddLog(
        'Online Başvuru',
        `${name} (${gender} - ${category}) adlı gönüllü için yeni online kamp başvurusu yapıldı. İl: ${city}, İlçe: ${district}.`
      );
    }

    // Clear form
    setName('');
    setTcNo('');
    setPhone('');
    setEmail('');
    setCategory('Lise');
    setAddress('');
    setAllergies('');
    setChronicDiseases('');
    setMedications('');
    setHealthNote('');
    setKvkkChecked(false);
    setConsentChecked(false);
    setAutoAllocate(true);
    setPreferredBungalowId('');
    setPreferredBedNumber(0);

    alert('Yeşilay Kamp Başvurunuz sisteme başarıyla kaydedildi! Yönetici onayı bekleniyor.');
  };

  // SUBMIT CONVOY/BATCH APPLICATION
  const handleSubmitConvoy = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!convoyName || !leaderName || !leaderTc || !leaderPhone) {
      alert('Lütfen Kafile Adı, Sorumlu Adı, T.C. Kimlik No ve Telefonunu eksiksiz doldurunuz.');
      return;
    }

    if (leaderTc.length !== 11) {
      alert('Kafile sorumlusunun T.C. Kimlik No 11 haneli olmalıdır.');
      return;
    }

    // Validate members
    for (let i = 0; i < convoyMembers.length; i++) {
      const m = convoyMembers[i];
      if (!m.name || !m.tcNo) {
        alert(`${i + 1}. katılımcının Ad-Soyad ve T.C. Kimlik No alanlarını doldurunuz.`);
        return;
      }
      if (m.tcNo.length !== 11) {
        alert(`${i + 1}. katılımcının T.C. Kimlik Numarası 11 haneli olmalıdır.`);
        return;
      }
    }

    if (!kvkkChecked || !consentChecked) {
      alert('Lütfen sözleşme ve katılım onay kutularını işaretleyiniz.');
      return;
    }

    const convoyPayload = {
      convoyName,
      leader: {
        name: leaderName,
        identityNumber: leaderTc,
        birthDate: leaderBirth,
        gender: leaderGender,
        category: 'Kafile Sorumlusu',
        phone: leaderPhone,
        email: leaderEmail,
        address: leaderAddress || convoyName,
        city: leaderCity,
        district: leaderDistrict,
        autoAllocate: leaderAutoAllocate,
        preferredBungalowId: !leaderAutoAllocate && leaderPrefBungalowId ? leaderPrefBungalowId : null,
        preferredBedNumber: !leaderAutoAllocate && leaderPrefBed ? leaderPrefBed : null,
        allergies: leaderAllergies || 'Yok',
        chronicDiseases: leaderChronicDiseases || 'Yok',
        medications: leaderMedications || 'Yok',
        healthNote: leaderHealthNote || 'Kafile Sorumlusu Girişi',
        consentReceived: true,
        kvkkSigned: true,
      },
      members: convoyMembers.map(m => ({
        name: m.name,
        identityNumber: m.tcNo,
        birthDate: m.birthDate,
        gender: m.gender,
        category: m.category,
        autoAllocate: m.autoAllocate,
        preferredBungalowId: !m.autoAllocate && m.preferredBungalowId ? m.preferredBungalowId : null,
        preferredBedNumber: !m.autoAllocate && m.preferredBedNumber ? m.preferredBedNumber : null,
        allergies: m.allergies || 'Saptanamayan Alerji Yok',
        chronicDiseases: m.chronicDiseases || 'Yok',
        medications: m.medications || 'Yok',
        healthNote: m.healthNote || `Üyesi: ${convoyName}`,
        consentReceived: true,
        kvkkSigned: true,
      })),
      campPeriodId: convoyPeriodId
    };

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'convoy', payload: convoyPayload })
      });
      if (res.ok) {
        if (!isRemote) {
          const data = await res.json();
          const leaderId = data.leaderId;
          const newLeader = {
            ...convoyPayload.leader,
            id: leaderId,
            status: 'Başvuru Yapıldı',
            bungalowId: null,
            bedNumber: null,
            campPeriodId: convoyPeriodId,
            convoyName,
            isConvoyLeader: true,
            groupId: null,
            checkedIn: false
          };
          const newMembers = convoyPayload.members.map((member, idx) => ({
            ...member,
            id: `PT-MEM-REM-${Date.now()}-${idx}`,
            status: 'Başvuru Yapıldı',
            bungalowId: null,
            bedNumber: null,
            phone: leaderPhone,
            email: leaderEmail,
            address: leaderAddress || convoyName,
            city: leaderCity,
            district: leaderDistrict,
            campPeriodId: convoyPeriodId,
            convoyName,
            isConvoyLeader: false,
            convoyLeaderId: leaderId,
            groupId: null,
            checkedIn: false
          }));
          onUpdateParticipants([...participants, newLeader as any, ...newMembers as any]);
          onAddLog(
            'Kafile Başvurusu',
            `'${convoyName}' isimli kafile için 1 Sorumlu ve ${convoyMembers.length} Katılımcı müracaatı toplu şekilde yapıldı.`
          );
        }
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      // Fallback
      let updatedList = [...participants];
      const baseIdNum = participants.length + 200;
      const leaderId = `PT-LDR-${baseIdNum}`;
      const newLeader: Participant = {
        id: leaderId,
        ...convoyPayload.leader,
        status: 'Başvuru Yapıldı',
        bungalowId: null,
        bedNumber: null,
        campPeriodId: convoyPeriodId,
        convoyName: convoyName,
        isConvoyLeader: true,
        groupId: null,
        checkedIn: false
      } as any;
      updatedList.push(newLeader);
      
      convoyMembers.forEach((member, idx) => {
        const memberId = `PT-MEM-${baseIdNum}-${idx}`;
        const newMember: Participant = {
          id: memberId,
          ...member,
          identityNumber: member.tcNo,
          status: 'Başvuru Yapıldı',
          bungalowId: null,
          bedNumber: null,
          phone: leaderPhone,
          email: leaderEmail,
          address: leaderAddress || convoyName,
          city: leaderCity,
          district: leaderDistrict,
          campPeriodId: convoyPeriodId,
          convoyName: convoyName,
          isConvoyLeader: false,
          convoyLeaderId: leaderId,
          groupId: null,
          checkedIn: false
        } as any;
        updatedList.push(newMember);
      });
      onUpdateParticipants(updatedList);
      onAddLog(
        'Kafile Başvurusu',
        `'${convoyName}' isimli kafile için 1 Sorumlu ve ${convoyMembers.length} Katılımcı müracaatı toplu şekilde yapıldı.`
      );
    }

    // Reset convoy states
    setConvoyName('');
    setLeaderName('');
    setLeaderTc('');
    setLeaderPhone('');
    setLeaderEmail('');
    setLeaderAddress('');
    setLeaderAllergies('');
    setLeaderChronicDiseases('');
    setLeaderMedications('');
    setLeaderHealthNote('');
    setConvoyMembers([
      {
        name: '',
        tcNo: '',
        birthDate: '2012-05-15',
        gender: 'Erkek',
        category: 'Lise',
        allergies: '',
        chronicDiseases: '',
        medications: '',
        healthNote: '',
        autoAllocate: true,
        preferredBungalowId: '',
        preferredBedNumber: 0
      }
    ]);
    setKvkkChecked(false);
    setConsentChecked(false);

    alert(`'${convoyName}' kafilesinin tüm başvuru belgeleri ve katılımcı listesi başarıyla kaydedildi!`);
  };

  // REAL AUTOMATIC BUNGALOW ALLOCATOR
  const autoAllocateParticipant = (p: Participant, list: Participant[]): { bungalowId: string | null, bedNumber: number | null } => {
    // Determine target bungalow type preference
    const isLeaderOrAdult = p.category === 'Kafile Sorumlusu' || p.category === 'Şoför' || p.category === 'Yetişkin';
    const preferredType = isLeaderOrAdult ? 'Lider' : 'Standart';

    // Find available bungalows
    const matchBungalows = bungalows.filter(b => {
      // Prefer specified type, fallback to any if no spot
      const occupants = list.filter(op => op.bungalowId === b.id);
      if (occupants.length >= b.capacity) return false;

      // Gender validation
      const existingGender = occupants.length > 0 ? occupants[0].gender : null;
      if (existingGender !== null && existingGender !== p.gender) return false;

      return true;
    });

    // Try to get one matching preferred type first
    let selectedBg = matchBungalows.find(b => b.type === preferredType);
    if (!selectedBg) {
      selectedBg = matchBungalows[0]; // fallback
    }

    if (selectedBg) {
      const occupants = list.filter(op => op.bungalowId === selectedBg.id);
      const filledBeds = occupants.map(o => o.bedNumber);
      let freeBed = 1;
      for (let bNum = 1; bNum <= selectedBg.capacity; bNum++) {
        if (!filledBeds.includes(bNum)) {
          freeBed = bNum;
          break;
        }
      }
      return { bungalowId: selectedBg.id, bedNumber: freeBed };
    }

    return { bungalowId: null, bedNumber: null };
  };

  // HANDLERS FOR STATUS CHANGING (SINGLE AND BULK APPROVALS)
  const handleStatusChange = (pId: string, newStatus: 'Onaylandı' | 'Reddedildi' | 'Yedek Listede') => {
    const target = participants.find((p) => p.id === pId);
    if (!target) return;

    let updatedList = [...participants];
    
    const updated = updatedList.map((p) => {
      if (p.id === pId) {
        let updateData: Partial<Participant> = { status: newStatus };

        // If approved and autoAllocate is checked, perform automatic placement
        if (newStatus === 'Onaylandı') {
          if (p.autoAllocate) {
            const placement = autoAllocateParticipant(p, updatedList);
            if (placement.bungalowId) {
              updateData.bungalowId = placement.bungalowId;
              updateData.bedNumber = placement.bedNumber;
              updateData.status = 'Kampta'; // Put them in camp directly if bed found!
              updateData.checkedIn = true;
              updateData.checkInTime = new Date().toISOString().slice(0, 19);
            }
          } else if (p.preferredBungalowId && p.preferredBedNumber) {
            // Respect manual preference if spot is still available
            const isFilled = updatedList.some(op => op.bungalowId === p.preferredBungalowId && op.bedNumber === p.preferredBedNumber);
            if (!isFilled) {
              updateData.bungalowId = p.preferredBungalowId;
              updateData.bedNumber = p.preferredBedNumber;
              updateData.status = 'Kampta';
              updateData.checkedIn = true;
              updateData.checkInTime = new Date().toISOString().slice(0, 19);
            } else {
              // Fallback to unassigned approved state
              updateData.bungalowId = null;
              updateData.bedNumber = null;
            }
          }
        } else {
          // If rejected or waitlisted, clear any bungalow preference
          updateData.bungalowId = null;
          updateData.bedNumber = null;
          updateData.checkedIn = false;
        }

        return { ...p, ...updateData };
      }
      return p;
    });

    onUpdateParticipants(updated);
    
    let allocationDetail = "";
    const updatedTarget = updated.find(p => p.id === pId);
    if (updatedTarget?.bungalowId) {
      allocationDetail = ` ve otomatik olarak ${updatedTarget.bungalowId} - Yatak ${updatedTarget.bedNumber} numaralı odaya yerleştirildi.`;
    }

    onAddLog(
      `Başvuru Kararı`,
      `${target.name} kişisinin müracaatı değerlendirildi ve durumu '${newStatus}' olarak güncellendi${allocationDetail}.`
    );

    // Remove from bulk selection
    setSelectedAppIds(selectedAppIds.filter(id => id !== pId));
  };

  // BULK ACTIONS (TOPLU ONAY, TOPLU RED)
  const handleBulkAction = (action: 'Onaylandı' | 'Reddedildi' | 'Yedek Listede') => {
    if (selectedAppIds.length === 0) {
      alert("Lütfen işlem yapmak istediğiniz müracaatları yandaki kutucuklardan seçiniz.");
      return;
    }

    if (!window.confirm(`Seçilen ${selectedAppIds.length} müracaat için toplu '${action}' kararı verilecektir. Emin misiniz?`)) {
      return;
    }

    let currentParticipants = [...participants];
    let approvedCount = 0;
    let placedCount = 0;

    const updated = currentParticipants.map((p) => {
      if (selectedAppIds.includes(p.id)) {
        let updateData: Partial<Participant> = { status: action };

        if (action === 'Onaylandı') {
          approvedCount++;
          if (p.autoAllocate) {
            const placement = autoAllocateParticipant(p, currentParticipants);
            if (placement.bungalowId) {
              updateData.bungalowId = placement.bungalowId;
              updateData.bedNumber = placement.bedNumber;
              updateData.status = 'Kampta';
              updateData.checkedIn = true;
              updateData.checkInTime = new Date().toISOString().slice(0, 19);
              placedCount++;
              
              // update local list snapshot for sequential allocator inside the map loop!
              currentParticipants = currentParticipants.map(cp => 
                cp.id === p.id ? { ...cp, bungalowId: placement.bungalowId, bedNumber: placement.bedNumber } : cp
              );
            }
          } else if (p.preferredBungalowId && p.preferredBedNumber) {
            const isFilled = currentParticipants.some(op => op.bungalowId === p.preferredBungalowId && op.bedNumber === p.preferredBedNumber);
            if (!isFilled) {
              updateData.bungalowId = p.preferredBungalowId;
              updateData.bedNumber = p.preferredBedNumber;
              updateData.status = 'Kampta';
              updateData.checkedIn = true;
              updateData.checkInTime = new Date().toISOString().slice(0, 19);
              placedCount++;
              
              currentParticipants = currentParticipants.map(cp => 
                cp.id === p.id ? { ...cp, bungalowId: p.preferredBungalowId, bedNumber: p.preferredBedNumber } : cp
              );
            }
          }
        } else {
          updateData.bungalowId = null;
          updateData.bedNumber = null;
          updateData.checkedIn = false;
        }

        return { ...p, ...updateData };
      }
      return p;
    });

    onUpdateParticipants(updated);
    onAddLog(
      `Toplu Değerlendirme`,
      `Sistem üzerinden seçilen ${selectedAppIds.length} müracaatçı için toplu '${action}' kararı verildi. ${placedCount} kişi otomatik yerleştirildi.`
    );

    setSelectedAppIds([]);
    alert(`Toplu işlem başarıyla tamamlandı! ${action === 'Onaylandı' ? `${approvedCount} başvuru onaylandı, bunlardan ${placedCount} kişi uygun odalara otomatik yerleştirildi.` : `${selectedAppIds.length} başvuru güncellendi.`}`);
  };

  const toggleSelectAll = () => {
    if (selectedAppIds.length === applications.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(applications.map(app => app.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedAppIds.includes(id)) {
      setSelectedAppIds(selectedAppIds.filter(item => item !== id));
    } else {
      setSelectedAppIds([...selectedAppIds, id]);
    }
  };

  const handleCopyLink = () => {
    const origin = window.location.origin;
    const shareUrl = `${origin}/?portal=basvuru`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  return (
    <div className="space-y-6" id="registrations-management-panel">
      {/* Title block */}
      {!isRemote && (
        <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-sans">
              <FileEdit className="w-5 h-5 text-emerald-600" />
              {activeSubView === 'form' ? 'Başvuru ve Ön Kayıt Formu' : 'Müracaat Değerlendirme & İşlem Kuyruğu'}
              <HelpTooltip content={activeSubView === 'form' ? 'Bu ekrandan kampa yeni katılacak kişilerin ön kayıt bilgilerini girebilir veya dışarıya açık başvuru linkini kopyalayabilirsiniz.' : 'Ön kayıt işlemi tamamlanmış katılımcıların evraklarını onaylayarak onları kampa kesin kayıtlı hale getirdiğiniz kuyruk ekranı.'} />
            </h2>
            <p className="text-xs text-gray-505 mt-1 max-w-2xl">
              {activeSubView === 'form' 
                ? 'Yeşilay kamp dönemi müracaatlarının bizzat sisteme girildiği veya uzaktan müracaat kanallarının yönetildiği kayıt kabul form alanı.'
                : 'Online portallardan gelen ön başvuruların, evrak uygunluk durumlarının ve kontenjan/yatak eşleştirme müracaat onaylarının yönetildiği işlem merkezi.'}
            </p>
          </div>

          {/* Quick inline tab switcher for responsive/collapsed state convenience */}
          {onChangeSubView && (
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold w-full md:w-auto shadow-3xs border border-gray-200">
              <button
                type="button"
                onClick={() => onChangeSubView('form')}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSubView === 'form'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                📝 Başvuru Formu
              </button>
              <button
                type="button"
                onClick={() => onChangeSubView('queue')}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSubView === 'queue'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                📋 Değerlendirme &amp; Kuyruk
              </button>
            </div>
          )}
        </div>
      )}

      <div className="w-full">
        {/* Left Side: Simulation form of Participant Portal Online Application */}
        {(isRemote || activeSubView === 'form') && (
          <div className={`${isRemote ? "max-w-3xl" : "max-w-4xl"} mx-auto bg-white p-6 rounded-xl border border-gray-150 shadow-sm space-y-5`}>
          
          {/* Shareable Link Box for Admins */}
          {!isRemote && (
            <div className="p-4 bg-emerald-50/75 border border-emerald-100 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-xs text-emerald-900">
                  Uzaktan Online Başvuru Bağlantısı
                </span>
              </div>
              <p className="text-[10px] text-emerald-800 leading-relaxed">
                Bu bağlantıyı bireysel olarak başvurmak isteyen gönüllülere ya da toplu katılım sağlayacak kafile liderlerine gönderebilirsiniz. Buradan yapılan tüm başvurular anında müracaat değerlendirme kuyruğuna düşecektir.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/?portal=basvuru`}
                  className="bg-white border border-emerald-200 rounded p-1.5 px-3 font-mono text-[10px] text-gray-600 flex-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded text-[10px] transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3 h-3" /> Kopyalandı
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Bağlantıyı Kopyala
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Mode Switcher Buttons */}
          <div className="flex border-b border-gray-100 pb-3 justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5 font-sans">
                <Smile className="w-4 h-4 text-emerald-600" />
                {isRemote ? 'Yeşilay Kamp Online Başvuru Portalı' : 'Yeşilay Kamp Kayıt Portalı'}
              </h3>
              <p className="text-[9px] text-gray-400 mt-0.5">
                {isRemote ? 'Lütfen bilgilerinizi eksiksiz doldurarak başvurunuzu tamamlayınız.' : 'Şehir, adres, kafile sorumlusu ve yerleşim planlama müracaat kanalı.'}
              </p>
            </div>
            
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-3xs font-extrabold">
              <button
                type="button"
                onClick={() => setFormMode('individual')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${formMode === 'individual' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Bireysel Başvuru
              </button>
              <button
                type="button"
                onClick={() => setFormMode('convoy')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${formMode === 'convoy' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Users className="w-3 h-3" />
                Kafile / Toplu Başvuru
              </button>
            </div>
          </div>

          {/* Share Period URL Highlight */}
          {(urlPeriodId || selectedPeriodId) && (
            <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-lg flex items-center justify-between text-2xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600 animate-pulse" />
                <div>
                  <span className="font-bold block">Seçili Kamp Dönemi İçin Başvuru</span>
                  <p className="text-gray-500 font-medium text-[10px]">
                    {periods.find(p => p.id === (formMode === 'individual' ? selectedPeriodId : convoyPeriodId))?.name || 'Seçilen Dönem'}
                  </p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase">
                Aktif Bağlantı
              </span>
            </div>
          )}

          {/* MODE A: INDIVIDUAL FORM */}
          {formMode === 'individual' && (
            <form onSubmit={handleSubmitIndividual} className="space-y-4 text-xs">
              <div className="space-y-3">
                <span className="font-bold text-emerald-900 uppercase text-[9px] block">1. Dönem ve Kimlik Bilgileri</span>
                
                <div>
                  <label className="block text-3xs font-extrabold text-gray-500 mb-1">Başvurulan Kamp Dönemi *</label>
                  <select
                    value={selectedPeriodId}
                    onChange={(e) => setSelectedPeriodId(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white font-medium"
                  >
                    {filteredPeriods.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-3xs font-extrabold text-gray-500 mb-1">
                      Gönüllü Adı Soyadı *
                    </label>
                    <input
                      type="text"
                      placeholder="Can Öztürk"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-extrabold text-gray-500 mb-1">
                      Gönüllü T.C. Kimlik No *
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="11 haneli T.C. No"
                      value={tcNo}
                      onChange={(e) => setTcNo(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-3xs font-extrabold text-gray-500 mb-1">
                      Doğum Tarihi *
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-extrabold text-gray-500 mb-1">
                      Gönüllü Cinsiyet *
                    </label>
                    <div className="flex gap-4 mt-1.5">
                      <label className="flex items-center gap-1.5 font-bold text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === 'Erkek'}
                          onChange={() => setGender('Erkek')}
                          className="accent-emerald-700"
                        />
                        Erkek
                      </label>
                      <label className="flex items-center gap-1.5 font-bold text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === 'Kız'}
                          onChange={() => setGender('Kız')}
                          className="accent-emerald-700"
                        />
                        Kız
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-3xs font-extrabold text-gray-500 mb-1">
                      Katılımcı Kategorisi *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white font-medium"
                      required
                    >
                      <optgroup label="Öğrenci">
                        <option value="İlkokul">İlkokul Öğrencisi</option>
                        <option value="Ortaokul">Ortaokul Öğrencisi</option>
                        <option value="Lise">Lise Öğrencisi</option>
                        <option value="Üniversite">Üniversite Öğrencisi</option>
                      </optgroup>
                      <optgroup label="Diğer">
                        <option value="Yetişkin">Yetişkin</option>
                        <option value="Kafile Sorumlusu">Kafile Sorumlusu</option>
                        <option value="Şoför">Şoför</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-3xs font-extrabold text-gray-500 mb-1">
                      Cep Telefonu *
                    </label>
                    <input
                      type="tel"
                      placeholder="+90 5XX XXX XX XX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ADDRESS FIELD SECTION */}
              <div className="p-3 bg-neutral-50 border border-gray-200 rounded-lg space-y-3">
                <span className="font-bold text-emerald-900 uppercase text-[9px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-700" />
                  2. Adres, İl &amp; İlçe Bilgileri (Zorunlu)
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-3xs font-extrabold text-gray-500 mb-1">İl (Şehir) *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white font-medium"
                    >
                      {Object.keys(CITY_DISTRICT_MAP).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-3xs font-extrabold text-gray-500 mb-1">İlçe *</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white font-medium"
                    >
                      {(CITY_DISTRICT_MAP[city] || []).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-3xs font-extrabold text-gray-500 mb-1">Açık Adres (Mahalle, Cadde, No) *</label>
                  <textarea
                    placeholder="Yeşilay Kamp Eğitim Merkezi sokak no:15..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={1.5}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white"
                    required
                  />
                </div>
              </div>

              {/* BUNGALOW ALLOCATION PREFERENCE */}
              <div className="p-3 bg-amber-50/20 border border-amber-100 rounded-lg space-y-3">
                <span className="font-bold text-amber-800 uppercase text-[9px] flex items-center gap-1">
                  <Building className="w-3 h-3 text-amber-750" />
                  3. Bungalov &amp; Yerleşim Planı Tercihi
                </span>

                <div className="flex items-center gap-2 py-0.5">
                  <input
                    type="checkbox"
                    id="autoAllocateCheckbox"
                    checked={autoAllocate}
                    onChange={(e) => setAutoAllocate(e.target.checked)}
                    className="accent-emerald-700 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="autoAllocateCheckbox" className="text-2xs font-extrabold text-gray-700 cursor-pointer select-none">
                    Otomatik Akıllı Bungalov Yerleşimi İstiyorum (Tavsiye Edilen)
                  </label>
                </div>

                {!autoAllocate && (
                  <div className="p-2.5 bg-white border border-amber-150 rounded-md space-y-2.5 animate-fadeIn">
                    <p className="text-[10px] text-amber-900 font-bold">
                      ⚠️ Manuel Plan: Başvurunuz onaylandığı anda el ile seçtiğiniz odaya kaydedilecektir. Boş yatak yoksa normal onaylanır fakat yerleştirilmez.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-3xs font-extrabold text-gray-500 mb-1">Bungalov Seçin ({gender} Odaları)</label>
                        <select
                          value={preferredBungalowId}
                          onChange={(e) => {
                            setPreferredBungalowId(e.target.value);
                            setPreferredBedNumber(1);
                          }}
                          className="w-full p-2 border border-gray-200 rounded bg-white text-[10px] font-bold text-neutral-800"
                        >
                          <option value="">-- El ile Seçim Yok --</option>
                          {getBungalowList(gender).filter(b => b.isAvailable).map(b => (
                            <option key={b.id} value={b.id}>
                              {b.id} - {b.name} ({b.type === 'Lider' ? 'Lider Odası' : 'Standart'}) ({b.occupantCount}/{b.capacity} Dolu - {b.currentGender})
                            </option>
                          ))}
                        </select>
                      </div>

                      {preferredBungalowId && (
                        <div>
                          <label className="block text-3xs font-extrabold text-gray-500 mb-1">Yatak No</label>
                          <select
                            value={preferredBedNumber}
                            onChange={(e) => setPreferredBedNumber(parseInt(e.target.value))}
                            className="w-full p-2 border border-gray-200 rounded bg-white text-[10px] font-bold text-neutral-800"
                          >
                            {[1, 2, 3, 4, 5, 6].slice(0, bungalows.find(b => b.id === preferredBungalowId)?.capacity || 6).map(n => {
                              const isBedFilled = participants.some(p => p.bungalowId === preferredBungalowId && p.bedNumber === n);
                              return (
                                <option key={n} value={n} disabled={isBedFilled}>
                                  {n}. Yatak {isBedFilled ? '(Dolu)' : '(Boş)'}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* HEALTH DECLARATION */}
              <div className="space-y-3">
                <span className="font-bold text-gray-400 uppercase text-[9px] block">4. Sağlık Beyan Bilgileri</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Hassas Alerjiler (arı, fıstık vb.)"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Kronik Hastalıklar (Astım, Diyabet vb.)"
                      value={chronicDiseases}
                      onChange={(e) => setChronicDiseases(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Düzenli Kullanılan İlaçlar"
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Sağlık Ekibi İçin Özel Tıbbi Notlar"
                      value={healthNote}
                      onChange={(e) => setHealthNote(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* CONSENTS */}
              <div className="space-y-2 border-t pt-3 font-semibold text-gray-650">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kvkkChecked}
                    onChange={(e) => setKvkkChecked(e.target.checked)}
                    className="accent-emerald-700 mt-0.5"
                  />
                  <span className="text-[10px]">
                    <strong>KVKK Onam Belgesi:</strong> Sağlık beyan ve kimlik verilerimin Yeşilay KYS güvenlik kuralları uyarınca saklanmasını onaylıyorum.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="accent-emerald-700 mt-0.5"
                  />
                  <span className="text-[10px]">
                    <strong>Kamp Katılım Taahhütnamesi:</strong> Yeşilay Kamp Kurallarına ve acil tıbbi müdahale dahil her türlü kamp düzenlemesine onay veriyorum.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg shadow-sm transition cursor-pointer"
              >
                Gönüllü Kampçı Başvurusunu Kaydet
              </button>

              {/* Form exporter */}
              <div className="border-t border-gray-100 pt-3 mt-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2 text-center">Taslağı Belge Olarak İndir</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadDraft('pdf')}
                    className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-1.5 px-3 rounded-lg text-3xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-red-150"
                  >
                    <Printer className="w-3.5 h-3.5" /> PDF Yazdır
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadDraft('word')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-855 font-bold py-1.5 px-3 rounded-lg text-3xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-blue-150"
                  >
                    <FileText className="w-3.5 h-3.5" /> Word İndir
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MODE B: CONVOY / BATCH FORM */}
          {formMode === 'convoy' && (
            <form onSubmit={handleSubmitConvoy} className="space-y-4 text-xs">
              
              {/* Campaign & Convoy Header */}
              <div className="space-y-3">
                <span className="font-bold text-emerald-950 uppercase text-[9px] block">1. Kafile &amp; Dönem Tanımlaması</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-3xs font-extrabold text-gray-500 mb-1">Kafile / Grup İsmi *</label>
                    <input
                      type="text"
                      placeholder="Örn: Kayseri Genç Yeşilay Şubesi Lise Grubu"
                      value={convoyName}
                      onChange={(e) => setConvoyName(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-extrabold text-gray-500 mb-1">Başvurulan Kamp Dönemi *</label>
                    <select
                      value={convoyPeriodId}
                      onChange={(e) => setConvoyPeriodId(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white font-medium"
                    >
                      {filteredPeriods.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* CONVOY LEADER DETAILS FIRST */}
              <div className="p-4 bg-emerald-50/10 border border-emerald-100 rounded-xl space-y-3">
                <span className="font-extrabold text-emerald-900 uppercase text-[9.5px] flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  2. Kafile Sorumlusu (Grup Lideri) Bilgileri
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600">Sorumlu Adı Soyadı *</label>
                    <input
                      type="text"
                      placeholder="Ahmet Yılmaz"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600">T.C. Kimlik Numarası *</label>
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="11 haneli TC"
                      value={leaderTc}
                      onChange={(e) => setLeaderTc(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-2 border border-gray-200 rounded bg-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600">Doğum Tarihi *</label>
                    <input
                      type="date"
                      value={leaderBirth}
                      onChange={(e) => setLeaderBirth(e.target.value)}
                      className="w-full p-1.5 border border-gray-200 rounded bg-white text-[10px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600">Cinsiyet *</label>
                    <select
                      value={leaderGender}
                      onChange={(e) => setLeaderGender(e.target.value as any)}
                      className="w-full p-2 border border-gray-200 rounded bg-white text-[10px]"
                    >
                      <option value="Erkek">Erkek</option>
                      <option value="Kız">Kız</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600">İrtibat No *</label>
                    <input
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded bg-white font-mono text-[10px]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 border-t pt-2 mt-1">
                  <div>
                    <label className="block text-3xs font-bold text-gray-500">İl (Şehir)</label>
                    <select
                      value={leaderCity}
                      onChange={(e) => setLeaderCity(e.target.value)}
                      className="w-full p-1.5 border border-gray-200 bg-white rounded text-[10px]"
                    >
                      {Object.keys(CITY_DISTRICT_MAP).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-3xs font-bold text-gray-500">İlçe</label>
                    <select
                      value={leaderDistrict}
                      onChange={(e) => setLeaderDistrict(e.target.value)}
                      className="w-full p-1.5 border border-gray-200 bg-white rounded text-[10px]"
                    >
                      {(CITY_DISTRICT_MAP[leaderCity] || []).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-3xs font-bold text-gray-500">Kafile Adresi</label>
                  <textarea
                    placeholder="Kafilenin çıkış yapacağı şube veya merkez adresi..."
                    value={leaderAddress}
                    onChange={(e) => setLeaderAddress(e.target.value)}
                    rows={1}
                    className="w-full p-1.5 border border-gray-200 bg-white rounded text-[10px]"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-3xs font-extrabold text-neutral-700 bg-white p-2 rounded border border-emerald-100">
                  <input
                    type="checkbox"
                    id="leaderAuto"
                    checked={leaderAutoAllocate}
                    onChange={(e) => setLeaderAutoAllocate(e.target.checked)}
                    className="accent-emerald-700"
                  />
                  <label htmlFor="leaderAuto" className="cursor-pointer">
                    Sorumluyu Odalara Akıllı Otomatik Yerleştir (Lider Odaları Tercih Edilir)
                  </label>
                </div>
              </div>

              {/* DYNAMIC LIST OF PARTICIPANTS (CONVOY MEMBERS) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-gray-900 uppercase text-[9.5px]">
                    3. Kafiledeki Katılımcıların Listesi
                  </span>
                  
                  <button
                    type="button"
                    onClick={addConvoyMember}
                    className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-3xs font-black flex items-center gap-1 shadow-3xs cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Katılımcı Ekle
                  </button>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {convoyMembers.map((member, index) => (
                    <div key={index} className="p-3 border border-gray-150 rounded-lg bg-gray-50/70 relative space-y-2.5">
                      <button
                        type="button"
                        onClick={() => removeConvoyMember(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                        title="Bu katılımcıyı kafileden çıkar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="text-[10px] font-black text-emerald-800 uppercase">
                        #{index + 1}. Kafile Üyesi
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="text"
                            placeholder="Katılımcı Adı Soyadı *"
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                            className="w-full p-2 border border-gray-200 bg-white rounded text-[10px]"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            maxLength={11}
                            placeholder="T.C. Kimlik Numarası *"
                            value={member.tcNo}
                            onChange={(e) => handleMemberChange(index, 'tcNo', e.target.value.replace(/\D/g, ''))}
                            className="w-full p-2 border border-gray-200 bg-white rounded font-mono text-[10px]"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <div>
                          <label className="block text-[8px] font-bold text-gray-500 mb-0.5">Doğum Tarihi</label>
                          <input
                            type="date"
                            value={member.birthDate}
                            onChange={(e) => handleMemberChange(index, 'birthDate', e.target.value)}
                            className="w-full p-1 border border-gray-200 bg-white rounded text-[9px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-gray-500 mb-0.5">Cinsiyet</label>
                          <select
                            value={member.gender}
                            onChange={(e) => handleMemberChange(index, 'gender', e.target.value as any)}
                            className="w-full p-1 border border-gray-200 bg-white rounded text-[9px]"
                          >
                            <option value="Erkek">Erkek</option>
                            <option value="Kız">Kız</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-gray-500 mb-0.5">Kategori</label>
                          <select
                            value={member.category}
                            onChange={(e) => handleMemberChange(index, 'category', e.target.value as any)}
                            className="w-full p-1 border border-gray-200 bg-white rounded text-[9px]"
                          >
                            <option value="İlkokul">İlkokul</option>
                            <option value="Ortaokul">Ortaokul</option>
                            <option value="Lise">Lise</option>
                            <option value="Üniversite">Üniversite</option>
                            <option value="Yetişkin">Yetişkin</option>
                            <option value="Şoför">Şoför</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[9px]">
                        <input
                          type="text"
                          placeholder="Alerji Hassasiyeti (varsa)"
                          value={member.allergies}
                          onChange={(e) => handleMemberChange(index, 'allergies', e.target.value)}
                          className="w-full p-1 border border-gray-200 bg-white rounded"
                        />
                        <input
                          type="text"
                          placeholder="Kronik Hastalık (varsa)"
                          value={member.chronicDiseases}
                          onChange={(e) => handleMemberChange(index, 'chronicDiseases', e.target.value)}
                          className="w-full p-1 border border-gray-200 bg-white rounded"
                        />
                      </div>

                      {/* Manual/Auto placement selector for each member */}
                      <div className="bg-white p-2 rounded border border-gray-150 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-700">
                          <input
                            type="checkbox"
                            id={`memberAuto-${index}`}
                            checked={member.autoAllocate}
                            onChange={(e) => handleMemberChange(index, 'autoAllocate', e.target.checked)}
                            className="accent-emerald-700"
                          />
                          <label htmlFor={`memberAuto-${index}`} className="cursor-pointer">
                            Otomatik Yerleştir (Öğrenci Bungalovları)
                          </label>
                        </div>

                        {!member.autoAllocate && (
                          <div className="grid grid-cols-2 gap-1 animate-fadeIn">
                            <select
                              value={member.preferredBungalowId}
                              onChange={(e) => {
                                handleMemberChange(index, 'preferredBungalowId', e.target.value);
                                handleMemberChange(index, 'preferredBedNumber', 1);
                              }}
                              className="p-1 border border-gray-200 text-[9px] bg-white rounded font-bold"
                            >
                              <option value="">-- El ile Seç --</option>
                              {getBungalowList(member.gender, 'Standart').filter(b => b.isAvailable).map(b => (
                                <option key={b.id} value={b.id}>
                                  {b.id} ({b.occupantCount}/{b.capacity} Dolu - {b.currentGender})
                                </option>
                              ))}
                            </select>

                            {member.preferredBungalowId && (
                              <select
                                value={member.preferredBedNumber}
                                onChange={(e) => handleMemberChange(index, 'preferredBedNumber', parseInt(e.target.value))}
                                className="p-1 border border-gray-200 text-[9px] bg-white rounded font-bold"
                              >
                                {[1, 2, 3, 4, 5, 6].slice(0, bungalows.find(b => b.id === member.preferredBungalowId)?.capacity || 6).map(n => {
                                  const isBedFilled = participants.some(p => p.bungalowId === member.preferredBungalowId && p.bedNumber === n);
                                  return (
                                    <option key={n} value={n} disabled={isBedFilled}>
                                      {n}. Yatak {isBedFilled ? '(Dolu)' : ''}
                                    </option>
                                  );
                                })}
                              </select>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONSENTS & CONTRACTS FOR GROUP */}
              <div className="space-y-2 border-t pt-3 font-semibold text-gray-650">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kvkkChecked}
                    onChange={(e) => setKvkkChecked(e.target.checked)}
                    className="accent-emerald-700 mt-0.5"
                    required
                  />
                  <span className="text-[10px]">
                    <strong>Kafile Sorumluluk Beyanı &amp; KVKK Onayı:</strong> Sorumlusu olduğum kafiledeki tüm katılımcı velilerinin muvafakat belgelerini elden teslim aldığımı ve sağlık/kimlik verilerinin sistemde güvenli işlenmesini onayladığımı taahhüt ederim.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="accent-emerald-700 mt-0.5"
                    required
                  />
                  <span className="text-[10px]">
                    <strong>Kamp Katılım Taahhütnamesi:</strong> Kafilemizin tüm üyelerinin Yeşilay Kamp Kurallarına ve acil tıbbi müdahale düzenlemelerine uyacağını taahhüt ederim.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg shadow-sm transition cursor-pointer"
              >
                Kafileyi ve Tüm Katılımcı Listesini Toplu Kaydet
              </button>
            </form>
          )}
        </div>
        )}

        {/* Right Side: Admins Evaluation Panel for waiting Registrations */}
        {!isRemote && activeSubView === 'queue' && (
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm space-y-4 w-full">
          
          {/* Header block with processing count */}
          <div className="flex justify-between items-start border-b pb-2 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5 font-sans">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Müracaat Değerlendirme &amp; İşlem Kuyruğu
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Online portaldan gönderilen ve yöneticinin onay/ret kararını bekleyen evrak ve başvurular.
              </p>
            </div>
            
            <div className="bg-gray-50 px-2.5 py-1 rounded-md text-right">
              <span className="text-3xs text-gray-400 font-extrabold uppercase block">Bekleyen Toplam</span>
              <span className="text-xs font-black text-emerald-800">{applications.length} Başvuru</span>
            </div>
          </div>

          {/* BULK ACTIONS HEADER (TOPLU İŞLEM ALANI) */}
          {applications.length > 0 && (
            <div className="p-3 bg-neutral-50 rounded-xl border border-gray-150 space-y-2.5 text-xs">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-1 text-3xs font-extrabold text-neutral-700 hover:text-neutral-900 bg-white border border-gray-200 px-2 py-1 rounded"
                  >
                    {selectedAppIds.length === applications.length ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                        Seçimleri Temizle ({selectedAppIds.length})
                      </>
                    ) : (
                      <>
                        <Square className="w-3.5 h-3.5 text-gray-400" />
                        Tümünü Seç ({applications.length})
                      </>
                    )}
                  </button>
                </div>
                
                <span className="text-3xs font-black text-emerald-850 uppercase">
                  {selectedAppIds.length} Müracaat Seçildi
                </span>
              </div>

              {/* Bulk operations row */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleBulkAction('Reddedildi')}
                  disabled={selectedAppIds.length === 0}
                  className="py-1.5 px-2 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:hover:bg-red-50 text-red-700 text-3xs font-black rounded-lg transition border border-red-200 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Toplu Reddet
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAction('Yedek Listede')}
                  disabled={selectedAppIds.length === 0}
                  className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 disabled:opacity-50 disabled:hover:bg-purple-50 text-purple-700 text-3xs font-black rounded-lg transition border border-purple-200 flex items-center justify-center gap-1 cursor-pointer"
                >
                  Toplu Yedeğe Al
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAction('Onaylandı')}
                  disabled={selectedAppIds.length === 0}
                  className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-3xs font-black rounded-lg transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Toplu Onayla
                </button>
              </div>
            </div>
          )}

          {/* APPLICATION CARDS LIST */}
          {applications.length > 0 ? (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {applications.map((app) => {
                const isSelected = selectedAppIds.includes(app.id);
                const isExpanded = expandedAppIds.includes(app.id);
                const toggleExpand = () => {
                  if (isExpanded) {
                    setExpandedAppIds(expandedAppIds.filter(id => id !== app.id));
                  } else {
                    setExpandedAppIds([...expandedAppIds, app.id]);
                  }
                };

                return (
                  <div
                    key={app.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      isSelected 
                        ? 'border-emerald-400 bg-emerald-50/20 shadow-xs' 
                        : 'border-gray-150 bg-gray-50/50 hover:border-gray-300'
                    } space-y-3.5 text-xs`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-start gap-2">
                        {/* Checkbox for bulk actions */}
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(app.id)}
                          className="mt-0.5 shrink-0 transition"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-300 hover:text-emerald-600" />
                          )}
                        </button>
                        
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-gray-950 text-sm">{app.name}</span>
                            {app.convoyName && (
                              <span className="bg-blue-100/80 text-blue-800 border border-blue-200 rounded text-[9px] font-black px-1.5 py-0.5">
                                🛡️ {app.convoyName}
                              </span>
                            )}
                          </div>
                          <p className="text-3xs text-gray-400 font-mono mt-0.5">
                            T.C.: {app.identityNumber} | ID: {app.id} | Kategori: <span className="font-extrabold text-emerald-800">{app.category || 'Belirtilmedi'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                            app.status === 'Yedek Listede'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-yellow-100 text-yellow-850 border border-yellow-200 animate-pulse'
                          }`}
                        >
                          {app.status}
                        </span>
                        
                        <button
                          type="button"
                          onClick={toggleExpand}
                          className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-150 cursor-pointer shadow-3xs"
                        >
                          {isExpanded ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-emerald-800" /> Detayları Gizle
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-700" /> Detayları Gör
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Meta info grid - Show only if expanded */}
                    {isExpanded && (
                      <div className="grid grid-cols-2 gap-2 text-2xs text-gray-650 bg-white p-2.5 rounded-lg border border-gray-100 font-medium shadow-3xs animate-in fade-in slide-in-from-top-1 duration-200">
                        <p><strong>Cinsiyet:</strong> {app.gender}</p>
                        <p><strong>Doğum T.:</strong> {app.birthDate}</p>
                        
                        <p className="col-span-2 text-emerald-800 bg-emerald-50/70 border border-emerald-100 px-1.5 py-1 rounded">
                          <strong>Kategori:</strong> {app.category ? `${app.category} ${['İlkokul', 'Ortaokul', 'Lise', 'Üniversite'].includes(app.category) ? 'Öğrencisi' : ''}` : 'Belirtilmedi'}
                        </p>

                        {/* Dynamic city, district, address listing */}
                        {(app.city || app.district) && (
                          <p className="col-span-2 text-neutral-850 bg-neutral-50 px-1.5 py-1 rounded border border-gray-150">
                            <strong>Adres:</strong> {app.district}, {app.city} {app.address ? `(${app.address})` : ''}
                          </p>
                        )}

                        {/* Display allocation mode preference */}
                        <p className="col-span-2 text-[10px] text-amber-900 bg-amber-50/30 border border-amber-100/60 px-1.5 py-0.5 rounded">
                          <strong>Yerleşim:</strong> {app.autoAllocate ? '⚡ Otomatik Akıllı Yerleştirme' : `📌 Manuel Plan: ${app.preferredBungalowId ? `${app.preferredBungalowId} (Yatak ${app.preferredBedNumber})` : 'Odası Belirlenmedi (Yönetici Atasın)'}`}
                        </p>

                        <p className="col-span-2"><strong>Alerji Durumu:</strong> <span className="text-red-700">{app.allergies}</span></p>
                        <p className="col-span-2"><strong>Hastalık/Not:</strong> {app.chronicDiseases} {app.healthNote ? `(${app.healthNote})` : ''}</p>
                        {(app.phone || app.email) && (
                          <p className="col-span-2 border-t pt-1.5 mt-1"><strong>İletişim:</strong> {app.phone} {app.email ? `(${app.email})` : ''}</p>
                        )}
                      </div>
                    )}

                    {/* Convoy Information & Separate Access Button */}
                    {(app.isConvoyLeader || app.convoyLeaderId || app.convoyName) && (
                      <div className="p-2.5 rounded-xl bg-blue-50/40 border border-blue-100 flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black text-blue-900 flex items-center gap-1">
                            🛡️ {app.isConvoyLeader ? 'Kafile Sorumlusu' : 'Kafile Katılımcısı'}
                          </p>
                          <p className="text-[9px] text-[#0f3460] font-extrabold leading-tight">
                            Grup: {app.convoyName}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            let leader: Participant | undefined = undefined;
                            if (app.isConvoyLeader) {
                              leader = app;
                            } else {
                              leader = participants.find(p => p.id === app.convoyLeaderId || (p.isConvoyLeader && p.convoyName === app.convoyName));
                            }
                            if (leader) {
                              setViewingConvoyLeader(leader);
                            }
                          }}
                          className="shrink-0 py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] rounded-lg transition shadow-3xs flex items-center gap-1 cursor-pointer"
                        >
                          <Users className="w-3 h-3" /> Kafileyi Gör ({participants.filter(p => p.convoyName === app.convoyName).length} Katılımcı)
                        </button>
                      </div>
                    )}

                    {/* Actions buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-700 font-extrabold text-3xs flex items-center gap-0.5">
                          <Check className="w-3.5 h-3.5" /> Evraklar Onaylı
                        </span>
                        {/* Archive download buttons for this exact applicant */}
                        <button
                          onClick={() => {
                            exportToPdf(app);
                            onAddLog('Form İndirme', `'${app.name}' için kayıt ve sağlık beyan formu PDF olarak yazdırıldı.`);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded border border-red-100 cursor-pointer"
                          title="Resmi Kayıt Formunu PDF İndir"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            exportToWord(app);
                            onAddLog('Form İndirme', `'${app.name}' için kayıt ve sağlık beyan formu Word (.doc) olarak indirildi.`);
                          }}
                          className="p-1 text-blue-700 hover:bg-blue-50 rounded border border-blue-100 cursor-pointer"
                          title="Resmi Kayıt Formunu Word İndir"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap sm:flex-nowrap gap-1.5 self-stretch sm:self-end w-full sm:w-auto mt-2 sm:mt-0">
                        <button
                          onClick={() => setEditingParticipant(app)}
                          className="flex-1 sm:flex-none justify-center p-1 px-2 border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-emerald-500 hover:text-emerald-700 font-bold rounded text-3xs flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" /> Düzenle
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, 'Reddedildi')}
                          className="flex-1 sm:flex-none justify-center p-1 px-2 border border-red-200 text-red-650 hover:bg-red-50 font-bold rounded text-3xs flex items-center gap-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Reddet
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, 'Yedek Listede')}
                          className="flex-1 sm:flex-none justify-center p-1 px-2 border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold rounded text-3xs flex items-center gap-0.5 cursor-pointer"
                        >
                          Yedeğe Al
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, 'Onaylandı')}
                          className="flex-1 sm:flex-none justify-center p-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded text-3xs flex items-center gap-0.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Onayla
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 border border-dashed rounded-xl">
              <Smile className="w-12 h-12 text-gray-200 stroke-1 mb-2" />
              <p className="text-xs font-semibold">Tüm İşlem Kuyruğu Tamamlandı</p>
              <p className="text-3xs mt-1">
                Değerlendirilmeyi bekleyen herhangi bir ön başvuru bulunmamaktadır. Yeni başvurular geldikçe bu akışa düşecektir.
              </p>
            </div>
          )}

          {/* Guidelines info */}
          <div className="p-3 bg-yellow-50/50 border border-yellow-100 rounded-lg flex items-start gap-1.5 text-2xs text-yellow-800">
            <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[10px]">Onay &amp; Otomatik Yerleşim Detayları</span>
              <p className="text-gray-650">
                Müracaatçılar <strong>Onaylandığında</strong>, eğer "Otomatik Akıllı Yerleşim" seçilmişse, sistem boştaki cinsiyet ve kategori uyumlu yatağa bizzat yerleşim yapar. Manuel planda ise seçilen odaya atanırlar.
              </p>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Participant Edit Modal */}
      {editingParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="font-extrabold text-base leading-tight">Başvuru Bilgilerini Düzenle</h3>
                  <p className="text-3xs text-emerald-200 font-mono mt-0.5">ID: {editingParticipant.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingParticipant(null)}
                className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveEditedParticipant} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Bölüm 1: Kişisel Bilgiler */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#0B3B24] uppercase tracking-wider border-b pb-1">Kişisel Bilgiler</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Adı Soyadı</label>
                    <input
                      type="text"
                      required
                      value={editingParticipant.name || ''}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, name: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">T.C. Kimlik No</label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={editingParticipant.identityNumber || ''}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, identityNumber: e.target.value.replace(/\D/g, '') })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Doğum Tarihi</label>
                    <input
                      type="date"
                      required
                      value={editingParticipant.birthDate || ''}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, birthDate: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-gray-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Cinsiyet</label>
                      <select
                        value={editingParticipant.gender || 'Erkek'}
                        onChange={(e) => setEditingParticipant({ ...editingParticipant, gender: e.target.value as 'Erkek' | 'Kız' })}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-white"
                      >
                        <option value="Erkek">Erkek</option>
                        <option value="Kız">Kız</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Kategori</label>
                      <select
                        value={editingParticipant.category || 'Lise'}
                        onChange={(e) => setEditingParticipant({ ...editingParticipant, category: e.target.value as any })}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-white"
                      >
                        <option value="İlkokul">İlkokul</option>
                        <option value="Ortaokul">Ortaokul</option>
                        <option value="Lise">Lise</option>
                        <option value="Üniversite">Üniversite</option>
                        <option value="Yetişkin">Yetişkin</option>
                        <option value="Kafile Sorumlusu">Kafile Sorumlusu</option>
                        <option value="Şoför">Şoför</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bölüm 2: İletişim & Adres */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#0B3B24] uppercase tracking-wider border-b pb-1">İletişim &amp; Adres Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Telefon</label>
                    <input
                      type="text"
                      placeholder="05xx xxx xx xx"
                      value={editingParticipant.phone || ''}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, phone: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">E-Posta</label>
                    <input
                      type="email"
                      placeholder="ornek@mail.com"
                      value={editingParticipant.email || ''}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, email: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-gray-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 col-span-1 md:col-span-2">
                    <div>
                      <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">İl</label>
                      <select
                        value={editingParticipant.city || 'İstanbul'}
                        onChange={(e) => {
                          const newCity = e.target.value;
                          const districts = CITY_DISTRICT_MAP[newCity] || [];
                          setEditingParticipant({
                            ...editingParticipant,
                            city: newCity,
                            district: districts[0] || ''
                          });
                        }}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-white"
                      >
                        {Object.keys(CITY_DISTRICT_MAP).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">İlçe</label>
                      <select
                        value={editingParticipant.district || ''}
                        onChange={(e) => setEditingParticipant({ ...editingParticipant, district: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-white"
                      >
                        {(CITY_DISTRICT_MAP[editingParticipant.city || 'İstanbul'] || []).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Adres Detayı</label>
                    <textarea
                      rows={2}
                      value={editingParticipant.address || ''}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, address: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-gray-50/50 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bölüm 3: Sağlık Bilgileri */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#0B3B24] uppercase tracking-wider border-b pb-1">Sağlık Beyan Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Alerjiler</label>
                    <input
                      type="text"
                      placeholder="Gıda veya ilaç alerjisi..."
                      value={editingParticipant.allergies || ''}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, allergies: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Kronik Hastalıklar</label>
                    <input
                      type="text"
                      placeholder="Astım, diyabet vb..."
                      value={editingParticipant.chronicDiseases || ''}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, chronicDiseases: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Kullanılan İlaçlar</label>
                    <input
                      type="text"
                      placeholder="Düzenli alınan ilaçlar..."
                      value={editingParticipant.medications || ''}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, medications: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Diğer Sağlık Notları</label>
                    <input
                      type="text"
                      placeholder="Yöneticiye iletilecek özel notlar..."
                      value={editingParticipant.healthNote || ''}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, healthNote: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Bölüm 4: Kamp Yerleşim Seçenekleri */}
              <div className="space-y-3 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/80">
                <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  🛖 Kamp Yerleşim Tercihi
                </h4>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingParticipant.autoAllocate ?? true}
                      onChange={(e) => setEditingParticipant({
                        ...editingParticipant,
                        autoAllocate: e.target.checked,
                        preferredBungalowId: e.target.checked ? null : (editingParticipant.preferredBungalowId || ''),
                        preferredBedNumber: e.target.checked ? null : (editingParticipant.preferredBedNumber || 1)
                      })}
                      className="mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-950 block">Otomatik Akıllı Odalandırma</span>
                      <p className="text-gray-550 text-2xs">Başvuru onaylandığında sistem boş olan ve cinsiyete uygun en ideal bungalova otomatik yerleştirsin.</p>
                    </div>
                  </label>

                  {!(editingParticipant.autoAllocate ?? true) && (
                    <div className="grid grid-cols-2 gap-3 pt-2 pl-6 animate-in slide-in-from-top-1 duration-150">
                      <div>
                        <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Tercih Edilen Oda/Bungalov</label>
                        <select
                          value={editingParticipant.preferredBungalowId || ''}
                          onChange={(e) => setEditingParticipant({ ...editingParticipant, preferredBungalowId: e.target.value })}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-white"
                        >
                          <option value="">Oda Belirlenmedi (Manuel)</option>
                          {bungalows
                            .filter(b => b.type === (['Kafile Sorumlusu', 'Yetişkin', 'Şoför'].includes(editingParticipant.category || '') ? 'Lider' : 'Standart'))
                            .map(b => (
                              <option key={b.id} value={b.id}>
                                {b.name} ({b.id} - Kapasite: {b.capacity})
                              </option>
                            ))
                          }
                        </select>
                      </div>

                      <div>
                        <label className="block text-3xs font-bold text-gray-500 uppercase mb-1">Yatak Numarası</label>
                        <select
                          value={editingParticipant.preferredBedNumber || 1}
                          onChange={(e) => setEditingParticipant({ ...editingParticipant, preferredBedNumber: parseInt(e.target.value) })}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-xs bg-white"
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num}. Yatak</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-150 p-4 px-6 flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setEditingParticipant(null)}
                className="py-2 px-4 border border-gray-350 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-100 transition cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSaveEditedParticipant}
                className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" /> Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convoy Evaluation Modal */}
      {viewingConvoyLeader && (() => {
        const convoyName = viewingConvoyLeader.convoyName || '';
        const convoyMembers = participants.filter(p => p.convoyName === convoyName);
        const leader = convoyMembers.find(p => p.isConvoyLeader) || viewingConvoyLeader;
        
        const pendingCount = convoyMembers.filter(p => p.status === 'Başvuru Yapıldı').length;
        const approvedCount = convoyMembers.filter(p => p.status === 'Onaylandı' || p.status === 'Kampta').length;
        const rejectedCount = convoyMembers.filter(p => p.status === 'Reddedildi').length;
        const waitingCount = convoyMembers.filter(p => p.status === 'Yedek Listede').length;

        const handleConvoyBulkAction = (action: 'Onaylandı' | 'Reddedildi' | 'Yedek Listede') => {
          let updatedList = [...participants];
          const convoyIds = convoyMembers.map(p => p.id);
          
          const updated = updatedList.map((p) => {
            if (convoyIds.includes(p.id)) {
              let updateData: Partial<Participant> = { status: action };
              if (action === 'Onaylandı') {
                if (p.autoAllocate) {
                  const placement = autoAllocateParticipant(p, updatedList);
                  if (placement.bungalowId) {
                    updateData.bungalowId = placement.bungalowId;
                    updateData.bedNumber = placement.bedNumber;
                    updateData.status = 'Kampta';
                    updateData.checkedIn = true;
                    updateData.checkInTime = new Date().toISOString().slice(0, 19);
                  }
                } else if (p.preferredBungalowId && p.preferredBedNumber) {
                  const isFilled = updatedList.some(op => op.bungalowId === p.preferredBungalowId && op.bedNumber === p.preferredBedNumber);
                  if (!isFilled) {
                    updateData.bungalowId = p.preferredBungalowId;
                    updateData.bedNumber = p.preferredBedNumber;
                    updateData.status = 'Kampta';
                    updateData.checkedIn = true;
                    updateData.checkInTime = new Date().toISOString().slice(0, 19);
                  } else {
                    updateData.bungalowId = null;
                    updateData.bedNumber = null;
                  }
                }
              } else {
                updateData.bungalowId = null;
                updateData.bedNumber = null;
                updateData.checkedIn = false;
              }
              return { ...p, ...updateData };
            }
            return p;
          });

          onUpdateParticipants(updated);
          onAddLog(
            'Kafile Toplu Kararı',
            `'${convoyName}' kafilesindeki tüm katılımcıların (${convoyMembers.length} kişi) müracaat durumu toplu olarak '${action}' yapıldı.`
          );
          setViewingConvoyLeader(null);
        };

        return (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="bg-blue-700 p-2 rounded-xl border border-blue-600">
                    <Users className="w-5 h-5 text-blue-100" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base leading-tight">Kafile Başvuruları Ayrı İnceleme Paneli</h3>
                    <p className="text-3xs text-blue-200 font-mono mt-0.5">Kafile: {convoyName}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingConvoyLeader(null)}
                  className="text-blue-100 hover:text-white p-1 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Kafile Bilgi Kartı */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50/30 p-4 rounded-xl border border-blue-100/60 text-xs">
                  <div>
                    <span className="text-3xs font-black text-blue-850 uppercase block mb-1">Kafile Sorumlusu (Lider)</span>
                    <p className="font-black text-gray-900 text-sm">{leader.name}</p>
                    <p className="text-3xs text-gray-400 font-mono mt-0.5">T.C.: {leader.identityNumber}</p>
                    {leader.phone && <p className="text-gray-600 mt-1">📞 {leader.phone}</p>}
                    {leader.email && <p className="text-gray-600">✉️ {leader.email}</p>}
                  </div>
                  
                  <div>
                    <span className="text-3xs font-black text-blue-850 uppercase block mb-1">Köken Şehir / İlçe</span>
                    <p className="font-bold text-gray-800 text-xs">{leader.district ? `${leader.district}, ` : ''}{leader.city}</p>
                    <p className="text-gray-500 mt-1 line-clamp-2" title={leader.address}>📍 {leader.address || 'Adres detayı belirtilmedi.'}</p>
                  </div>

                  <div>
                    <span className="text-3xs font-black text-blue-850 uppercase block mb-1">Kafile İstatistikleri</span>
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-3xs font-extrabold text-center">
                      <div className="bg-yellow-50 border border-yellow-150 p-1.5 rounded-lg text-yellow-800">
                        <span className="block text-xs font-black">{pendingCount}</span> Bekleyen
                      </div>
                      <div className="bg-emerald-50 border border-emerald-150 p-1.5 rounded-lg text-emerald-800">
                        <span className="block text-xs font-black">{approvedCount}</span> Onaylı/Kampta
                      </div>
                      <div className="bg-purple-50 border border-purple-150 p-1.5 rounded-lg text-purple-800">
                        <span className="block text-xs font-black">{waitingCount}</span> Yedek
                      </div>
                      <div className="bg-red-50 border border-red-150 p-1.5 rounded-lg text-red-800">
                        <span className="block text-xs font-black">{rejectedCount}</span> Reddedilen
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kafile Toplu Karar Mekanizması */}
                <div className="bg-[#f0f4f8] p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-black text-gray-900">Kafile Toplu Karar Mekanizması</h4>
                    <p className="text-3xs text-gray-550 font-bold">Kafilenin tüm üyelerine aynı kararı tek tıkla uygulayabilirsiniz.</p>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleConvoyBulkAction('Reddedildi')}
                      className="flex-1 sm:flex-none py-1.5 px-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-3xs font-black rounded-xl transition cursor-pointer"
                    >
                      Tüm Kafileyi Reddet
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConvoyBulkAction('Yedek Listede')}
                      className="flex-1 sm:flex-none py-1.5 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-3xs font-black rounded-xl transition cursor-pointer"
                    >
                      Tüm Kafileyi Yedeğe Al
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConvoyBulkAction('Onaylandı')}
                      className="flex-1 sm:flex-none py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-3xs font-black rounded-xl transition shadow-sm cursor-pointer"
                    >
                      Tüm Kafileyi Onayla
                    </button>
                  </div>
                </div>

                {/* Katılımcı Listesi */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-[#0B3B24] uppercase tracking-wider border-b pb-1">Kafilenin Katılımcı Listesi ({convoyMembers.length} Kişi)</h4>
                  
                  <div className="divide-y divide-gray-150 border border-gray-150 rounded-xl overflow-hidden bg-white">
                    {convoyMembers.map((member) => {
                      const hasHealthIssues = member.allergies !== 'Yok' || member.chronicDiseases !== 'Yok' || member.medications !== 'Yok';
                      
                      return (
                        <div key={member.id} className="p-3 hover:bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          
                          {/* İsim ve T.C. */}
                          <div className="min-w-[180px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-gray-900">{member.name}</span>
                              {member.isConvoyLeader && (
                                <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">Sorumlu</span>
                              )}
                            </div>
                            <p className="text-3xs text-gray-400 font-mono mt-0.5">T.C.: {member.identityNumber} | ID: {member.id}</p>
                          </div>

                          {/* Kategori, Yaş & Cinsiyet */}
                          <div className="text-2xs text-gray-600 min-w-[120px]">
                            <p><strong>Kategori:</strong> {member.category}</p>
                            <p className="text-3xs"><strong>Cinsiyet:</strong> {member.gender} | <strong>Doğum:</strong> {member.birthDate}</p>
                          </div>

                          {/* Sağlık Beyan Durumu */}
                          <div className={`text-3xs p-2 rounded-lg max-w-[220px] shrink-0 ${hasHealthIssues ? 'bg-red-50 border border-red-100 text-red-800' : 'bg-gray-50 text-gray-500'}`}>
                            {hasHealthIssues ? (
                              <div>
                                {member.allergies !== 'Yok' && <p><strong>Alerji:</strong> {member.allergies}</p>}
                                {member.chronicDiseases !== 'Yok' && <p><strong>Kronik:</strong> {member.chronicDiseases}</p>}
                                {member.healthNote && <p><strong>Not:</strong> {member.healthNote}</p>}
                              </div>
                            ) : (
                              <span>Sağlık Beyanı Temiz (Herhangi bir engel yok)</span>
                            )}
                          </div>

                          {/* Yerleşim / Oda Durumu */}
                          <div className="text-3xs text-neutral-600 min-w-[120px]">
                            {member.bungalowId ? (
                              <p className="text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                🛖 {member.bungalowId} - Yatak {member.bedNumber}
                              </p>
                            ) : (
                              <p className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                📌 {member.autoAllocate ? '⚡ Otomatik Yerleşecek' : 'Manuel Seçim Bekliyor'}
                              </p>
                            )}
                          </div>

                          {/* Durum Badge */}
                          <div className="shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                member.status === 'Onaylandı' || member.status === 'Kampta'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : member.status === 'Reddedildi'
                                  ? 'bg-red-100 text-red-800 border-red-250'
                                  : member.status === 'Yedek Listede'
                                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                                  : 'bg-yellow-100 text-yellow-850 border-yellow-200'
                              }`}
                            >
                              {member.status}
                            </span>
                          </div>

                          {/* Üye İşlemleri */}
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => setEditingParticipant(member)}
                              className="p-1 px-1.5 border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold rounded text-3xs flex items-center gap-0.5 cursor-pointer"
                              title="Bilgilerini Düzenle"
                            >
                              <Pencil className="w-2.5 h-2.5" /> Düzenle
                            </button>
                            {member.status !== 'Onaylandı' && member.status !== 'Kampta' && (
                              <button
                                onClick={() => handleStatusChange(member.id, 'Onaylandı')}
                                className="p-1 px-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded text-3xs flex items-center gap-0.5 cursor-pointer"
                                title="Onayla"
                              >
                                <Check className="w-2.5 h-2.5" /> Onayla
                              </button>
                            )}
                            {member.status !== 'Reddedildi' && (
                              <button
                                onClick={() => handleStatusChange(member.id, 'Reddedildi')}
                                className="p-1 px-1.5 border border-red-200 text-red-650 hover:bg-red-50 font-bold rounded text-3xs flex items-center gap-0.5 cursor-pointer"
                                title="Reddet"
                              >
                                <X className="w-2.5 h-2.5" /> Reddet
                              </button>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 border-t border-gray-150 p-4 px-6 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setViewingConvoyLeader(null)}
                  className="py-2 px-6 bg-gray-800 hover:bg-gray-900 text-white font-black rounded-xl text-xs transition cursor-pointer"
                >
                  Kapat
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
