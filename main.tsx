import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  AlertCircle, 
  Clock, 
  User, 
  Tag, 
  MapPin, 
  ClipboardList, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  DollarSign, 
  Download, 
  Sparkles, 
  Send, 
  PlusCircle, 
  Eye, 
  ShieldAlert, 
  Smartphone, 
  Mail, 
  History, 
  Check, 
  X,
  Lock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Database,
  Calendar,
  Printer,
  Filter
} from 'lucide-react';
import { TechnicalIssue, SupplyRequest, TechnicalActionLog, TechnicalStatusChange, UserRole, Task, ShiftAssignment } from '../types';

interface TechnicalOperationsViewProps {
  selectedCenterId: string;
  tasks: Task[];
  shifts: ShiftAssignment[];
  onUpdateTasks: (tasks: Task[]) => void;
  onUpdateShifts: (shifts: ShiftAssignment[]) => void;
  onAddLog: (action: string, details: string) => void;
  activeSubView?: 'dashboard' | 'issues' | 'requests' | 'ai-copilot' | 'reports' | 'areas' | 'vardiya';
  onChangeSubView?: (view: 'dashboard' | 'issues' | 'requests' | 'ai-copilot' | 'reports' | 'areas' | 'vardiya') => void;
}

export default function TechnicalOperationsView({
  selectedCenterId,
  tasks,
  shifts,
  onUpdateTasks,
  onUpdateShifts,
  onAddLog,
  activeSubView = 'dashboard',
  onChangeSubView
}: TechnicalOperationsViewProps) {
  // ---------------------------------------------------------
  // State Storage
  // ---------------------------------------------------------
  const [issues, setIssues] = useState<TechnicalIssue[]>([]);
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>('Kamp Müdürü'); // Default to Manager (Yönetici)
  
  // Accordion active panels
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isIssuesOpen, setIsIssuesOpen] = useState(false);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [isAreasOpen, setIsAreasOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isVardiyaOpen, setIsVardiyaOpen] = useState(false);

  useEffect(() => {
    if (activeSubView) {
      setIsDashboardOpen(activeSubView === 'dashboard');
      setIsIssuesOpen(activeSubView === 'issues');
      setIsRequestsOpen(activeSubView === 'requests');
      setIsAiCopilotOpen(activeSubView === 'ai-copilot');
      setIsReportsOpen(activeSubView === 'reports');
      setIsAreasOpen(activeSubView === 'areas');
      setIsVardiyaOpen(activeSubView === 'vardiya');
    }
  }, [activeSubView]);

  const setSubTab = (tab: 'dashboard' | 'issues' | 'requests' | 'ai-copilot' | 'reports' | 'areas' | 'vardiya') => {
    if (onChangeSubView) {
      onChangeSubView(tab);
    } else {
      if (tab === 'dashboard') setIsDashboardOpen(true);
      if (tab === 'issues') setIsIssuesOpen(true);
      if (tab === 'requests') setIsRequestsOpen(true);
      if (tab === 'ai-copilot') setIsAiCopilotOpen(true);
      if (tab === 'areas') setIsAreasOpen(true);
      if (tab === 'reports') setIsReportsOpen(true);
      if (tab === 'vardiya') setIsVardiyaOpen(true);
    }

    setTimeout(() => {
      const el = document.getElementById(`tech-acc-${tab}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Selected entities for detailed modal views
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  
  // Create state models
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('bungalov');

  // Rapor / Döküm Filtre ve Modal Durumları
  const [reportStartDate, setReportStartDate] = useState<string>('2026-06-15');
  const [reportEndDate, setReportEndDate] = useState<string>('2026-06-25');
  const [reportSelectedAreas, setReportSelectedAreas] = useState<string[]>(['bungalov', 'gol', 'spor', 'yemekhane', 'konferans', 'diger']);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAreaPdfModalOpen, setIsAreaPdfModalOpen] = useState(false);
  const [areaStartDate, setAreaStartDate] = useState<string>('');
  const [areaEndDate, setAreaEndDate] = useState<string>('');
  const [showPrintWarning, setShowPrintWarning] = useState(false);

  // New Issue Form inputs
  const [issueReporter, setIssueReporter] = useState('');
  const [issueLocation, setIssueLocation] = useState('');
  const [issueCategory, setIssueCategory] = useState<'Elektrik' | 'Su / Tesisat' | 'İnternet / IT' | 'Mobilya / Donanım' | 'Güvenlik' | 'Temizlik' | 'Diğer'>('Elektrik');
  const [issueDescription, setIssueDescription] = useState('');
  const [issuePriority, setIssuePriority] = useState<'Düşük' | 'Orta' | 'Yüksek' | 'Kritik'>('Orta');
  const [issueAssignedTo, setIssueAssignedTo] = useState('Teknik Departman');
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [activePhotoInModal, setActivePhotoInModal] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      setIsCameraActive(true);
      // Wait for React to render the video element, then set srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Kameraya erişilemedi. Lütfen kamera izinlerini kontrol edin veya galeriden yüklemeyi deneyin.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setAttachedPhotos(prev => [...prev, dataUrl]);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAttachedPhotos(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Sync active photo in modal when a different issue is loaded
  useEffect(() => {
    if (selectedIssueId) {
      const issue = issues.find(i => i.id === selectedIssueId);
      if (issue) {
        setActivePhotoInModal(issue.photoUrls?.[0] || issue.photoUrl || null);
      }
    } else {
      setActivePhotoInModal(null);
    }
  }, [selectedIssueId, issues]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const closeNewIssueModal = () => {
    setIsNewIssueModalOpen(false);
    setAttachedPhotos([]);
    stopCamera();
  };

  // Action Log Form inputs (Inside selected issue detail)
  const [actionTitle, setActionTitle] = useState('');
  const [partsReplaced, setPartsReplaced] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [actionCost, setActionCost] = useState('');
  const [actionStaff, setActionStaff] = useState('');

  // Department description & priority adjustments
  const [deptNote, setDeptNote] = useState('');
  const [adjustedPriority, setAdjustedPriority] = useState<'Düşük' | 'Orta' | 'Yüksek' | 'Kritik'>('Orta');

  // New Request Form inputs
  const [reqTitle, setReqTitle] = useState('');
  const [reqDetails, setReqDetails] = useState('');
  const [reqDepartment, setReqDepartment] = useState('Eğitim / Aktivite');
  const [reqQuantity, setReqQuantity] = useState(1);
  const [reqPriority, setReqPriority] = useState<'Düşük' | 'Orta' | 'Yüksek' | 'Kritik'>('Orta');
  const [reqNeededDate, setReqNeededDate] = useState('2026-06-30');

  // System Notifications simulator list
  const [notifications, setNotifications] = useState<{
    id: string;
    text: string;
    timestamp: string;
    type: 'alert' | 'success' | 'info' | 'critical';
    channel: string;
  }[]>([
    { id: 'N1', text: 'Yeni teknik arıza oluşturuldu: Konferans Salonu projeksiyon sorunu.', timestamp: '2026-06-18 11:15', type: 'info', channel: 'Sistem İçi + E-Posta' },
    { id: 'N2', text: 'Kritik Seviye SLA Süre Aşımı Uyarısı: STD-5 Sıcak Su Sorunu çözülmedi!', timestamp: '2026-06-18 10:30', type: 'critical', channel: 'SMS + WhatsApp' },
    { id: 'N3', text: 'Satın alma talebi onaylandı: Acil İlkyardım Sarf Malzemesi.', timestamp: '2026-06-18 09:20', type: 'success', channel: 'Sistem İçi' },
  ]);

  // Load from local storage
  useEffect(() => {
    const savedIssues = localStorage.getItem(`kys_technical_issues_${selectedCenterId}`);
    const savedRequests = localStorage.getItem(`kys_supply_requests_${selectedCenterId}`);
    
    if (savedIssues) {
      setIssues(JSON.parse(savedIssues));
    } else {
      // Import from data.ts
      import('../data').then((module) => {
        const filtered = module.INITIAL_TECHNICAL_ISSUES.map(item => ({
          ...item,
          campCenterId: selectedCenterId
        }));
        setIssues(filtered);
        localStorage.setItem(`kys_technical_issues_${selectedCenterId}`, JSON.stringify(filtered));
      });
    }

    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    } else {
      import('../data').then((module) => {
        const filtered = module.INITIAL_SUPPLY_REQUESTS.map(item => ({
          ...item,
          campCenterId: selectedCenterId
        }));
        setRequests(filtered);
        localStorage.setItem(`kys_supply_requests_${selectedCenterId}`, JSON.stringify(filtered));
      });
    }
  }, [selectedCenterId]);

  // Sync to local storage
  const syncIssues = (newIssues: TechnicalIssue[]) => {
    setIssues(newIssues);
    localStorage.setItem(`kys_technical_issues_${selectedCenterId}`, JSON.stringify(newIssues));
  };

  const syncRequests = (newRequests: SupplyRequest[]) => {
    setRequests(newRequests);
    localStorage.setItem(`kys_supply_requests_${selectedCenterId}`, JSON.stringify(newRequests));
  };

  // Helper: Trigger custom multi-channel notifications
  const triggerNotification = (text: string, type: 'alert' | 'success' | 'info' | 'critical', priority: string) => {
    let channels = 'Sistem İçi';
    if (priority === 'Kritik') {
      channels = 'Sistem İçi + SMS + WhatsApp';
    } else if (priority === 'Yüksek') {
      channels = 'Sistem İçi + E-Posta';
    }

    const newNotification = {
      id: `N${Date.now()}`,
      text,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type,
      channel: channels
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  // ---------------------------------------------------------
  // SLA & Alert Configurations & Calculators
  // ---------------------------------------------------------
  const SLA_TARGET_HOURS = {
    Kritik: 2,
    Yüksek: 6,
    Orta: 24,
    Düşük: 72
  };

  const isSlaBreached = (issue: TechnicalIssue) => {
    if (issue.status === 'Çözüldü' || issue.status === 'Kapatıldı') return false;
    
    const createdDate = new Date(issue.dateTime);
    const currentDate = new Date(); // Simulating system current time
    const diffMs = currentDate.getTime() - createdDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours > SLA_TARGET_HOURS[issue.priority];
  };

  const getRemainingSlaText = (issue: TechnicalIssue) => {
    if (issue.status === 'Çözüldü' || issue.status === 'Kapatıldı') return 'Tamamlandı';
    
    const createdDate = new Date(issue.dateTime);
    const targetHours = SLA_TARGET_HOURS[issue.priority];
    const targetTime = createdDate.getTime() + targetHours * 60 * 60 * 1000;
    const now = new Date().getTime();
    const diffMs = targetTime - now;

    if (diffMs < 0) {
      const positiveDiff = Math.abs(diffMs) / (1000 * 60 * 60);
      return `Süre Aşımı: -${positiveDiff.toFixed(1)} sa`;
    } else {
      const remainingHours = diffMs / (1000 * 60 * 60);
      return `Kalan SLA: ${remainingHours.toFixed(1)} sa`;
    }
  };

  // ---------------------------------------------------------
  // CRUD Issue Actions
  // ---------------------------------------------------------
  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueReporter || !issueLocation || !issueDescription) {
      alert('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    const newIssue: TechnicalIssue = {
      id: `AR-${new Date().getFullYear()}-${String(issues.length + 1).padStart(4, '0')}`,
      dateTime: new Date().toISOString().slice(0, 19),
      reporter: issueReporter,
      location: issueLocation,
      category: issueCategory,
      description: issueDescription,
      priority: issuePriority,
      photoUrl: attachedPhotos[0] || undefined,
      photoUrls: attachedPhotos,
      assignedTo: issueAssignedTo || 'Genel Teknik Ekip',
      status: 'Yeni Kayıt',
      statusHistory: [
        { status: 'Yeni Kayıt', timestamp: new Date().toISOString().slice(0, 19), updatedBy: issueReporter }
      ],
      actionLogs: [],
      campCenterId: selectedCenterId
    };

    const updated = [newIssue, ...issues];
    syncIssues(updated);
    
    // Logs and Notifications
    onAddLog('Teknik Arıza', `${newIssue.id} nolu '${issueCategory}' arıza kaydı oluşturuldu. Yer: ${issueLocation}`);
    triggerNotification(`Yeni arıza kaydı oluşturuldu: ${newIssue.id} - ${newIssue.location}`, 'info', issuePriority);

    // Reset Form
    setIssueReporter('');
    setIssueLocation('');
    setIssueDescription('');
    setAttachedPhotos([]);
    stopCamera();
    setIssueAssignedTo('Teknik Departman');
    setIsNewIssueModalOpen(false);
  };

  const handleUpdateStatus = (issueId: string, newStatus: TechnicalIssue['status']) => {
    const updated = issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: newStatus,
          statusHistory: [
            ...issue.statusHistory,
            { status: newStatus, timestamp: new Date().toISOString().slice(0, 19), updatedBy: activeRole }
          ]
        };
      }
      return issue;
    });

    syncIssues(updated);
    onAddLog('Arıza Güncelleme', `${issueId} nolu arıza durumu '${newStatus}' olarak güncellendi.`);
    triggerNotification(`${issueId} nolu arıza durumu '${newStatus}' olarak güncellendi.`, 'success', 'Orta');
  };

  const handleAddActionLog = (e: React.FormEvent, issueId: string) => {
    e.preventDefault();
    if (!actionTitle || !actionNotes) {
      alert('Lütfen işlem başlığı ve notlarını yazınız.');
      return;
    }

    const newLog: TechnicalActionLog = {
      id: `AL-${String(Date.now()).slice(-4)}`,
      action: actionTitle,
      partsReplaced: partsReplaced || undefined,
      notes: actionNotes,
      cost: actionCost ? parseFloat(actionCost) : undefined,
      creator: actionStaff || activeRole,
      date: new Date().toISOString().slice(0, 19)
    };

    const updated = issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          actionLogs: [...issue.actionLogs, newLog]
        };
      }
      return issue;
    });

    syncIssues(updated);
    onAddLog('Arıza Teknik Müdahale', `${issueId} nolu arızaya müdahale eklendi: ${actionTitle}`);
    
    // Reset Log Input Form
    setActionTitle('');
    setPartsReplaced('');
    setActionNotes('');
    setActionCost('');
    setActionStaff('');
  };

  const handleDeptModifyIssue = (issueId: string) => {
    const updated = issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          priority: adjustedPriority,
          description: deptNote ? `${issue.description} \n(Departman Notu: ${deptNote})` : issue.description
        };
      }
      return issue;
    });

    syncIssues(updated);
    onAddLog('Arıza Sorumlu Güncellemesi', `${issueId} arızasının departman öncelik ve açıklaması düzenlendi.`);
    setDeptNote('');
  };

  // ---------------------------------------------------------
  // CRUD Supply Request Actions
  // ---------------------------------------------------------
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle || !reqDetails || !reqQuantity) {
      alert('Lütfen tüm talep alanlarını doldurunuz.');
      return;
    }

    const newRequest: SupplyRequest = {
      id: `TL-${new Date().getFullYear()}-${String(requests.length + 1).padStart(4, '0')}`,
      requester: activeRole === 'Kamp Müdürü' ? 'Ahmet Yılmaz' : 'Saha Sorumlusu',
      department: reqDepartment,
      title: reqTitle,
      details: reqDetails,
      quantity: Number(reqQuantity),
      priority: reqPriority,
      neededDate: reqNeededDate,
      status: 'Talep Oluşturuldu',
      campCenterId: selectedCenterId
    };

    const updated = [newRequest, ...requests];
    syncRequests(updated);

    onAddLog('Eksik Malzeme Talebi', `${newRequest.id} nolu '${reqTitle}' satın alma talebi açıldı.`);
    triggerNotification(`Yeni satın alma talebi oluşturuldu: ${newRequest.id}`, 'info', reqPriority);

    setReqTitle('');
    setReqDetails('');
    setReqQuantity(1);
    setIsNewRequestModalOpen(false);
  };

  const handleUpdateRequestStatus = (reqId: string, newStatus: SupplyRequest['status']) => {
    const updated = requests.map(req => {
      if (req.id === reqId) {
        return { ...req, status: newStatus };
      }
      return req;
    });

    syncRequests(updated);
    onAddLog('Talep Durum Değişikliği', `${reqId} nolu tedarik talebi durumu '${newStatus}' yapıldı.`);
    triggerNotification(`${reqId} nolu tedarik talebi '${newStatus}' yapıldı.`, 'success', 'Orta');
  };

  // ---------------------------------------------------------
  // Reporting Data Generators & Exporters
  // ---------------------------------------------------------
  const getMostFrequentIssues = () => {
    const count: Record<string, number> = {};
    issues.forEach(issue => {
      count[issue.category] = (count[issue.category] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1]);
  };

  const getIssuesForArea = (areaKey: string) => {
    // Filter issues for the selected camp center
    const centerIssues = issues.filter(i => i.campCenterId === selectedCenterId);
    
    switch (areaKey) {
      case 'bungalov':
        return centerIssues.filter(i => 
          i.location.toLowerCase().includes('bungalov') || 
          i.location.toLowerCase().includes('std-') || 
          i.location.toLowerCase().includes('ldr-') ||
          i.location.toLowerCase().includes('kulübe') ||
          i.location.toLowerCase().includes('oda')
        );
      case 'gol':
        return centerIssues.filter(i => 
          i.location.toLowerCase().includes('göl') || 
          i.location.toLowerCase().includes('gölet') || 
          i.location.toLowerCase().includes('iskele') ||
          i.location.toLowerCase().includes('lake')
        );
      case 'spor':
        return centerIssues.filter(i => 
          i.location.toLowerCase().includes('spor') || 
          i.location.toLowerCase().includes('saha') || 
          i.location.toLowerCase().includes('futbol') || 
          i.location.toLowerCase().includes('basketbol') ||
          i.location.toLowerCase().includes('pota')
        );
      case 'yemekhane':
        return centerIssues.filter(i => 
          i.location.toLowerCase().includes('yemekhane') || 
          i.location.toLowerCase().includes('mutfak') || 
          i.location.toLowerCase().includes('sebil')
        );
      case 'konferans':
        return centerIssues.filter(i => 
          i.location.toLowerCase().includes('konferans') || 
          i.location.toLowerCase().includes('salon')
        );
      default:
        // 'diger' - does not match any of the above
        return centerIssues.filter(i => {
          const loc = i.location.toLowerCase();
          const isBungalov = loc.includes('bungalov') || loc.includes('std-') || loc.includes('ldr-') || loc.includes('kulübe') || loc.includes('oda');
          const isGol = loc.includes('göl') || loc.includes('gölet') || loc.includes('iskele') || loc.includes('lake');
          const isSpor = loc.includes('spor') || loc.includes('saha') || loc.includes('futbol') || loc.includes('basketbol') || loc.includes('pota');
          const isYemekhane = loc.includes('yemekhane') || loc.includes('mutfak') || loc.includes('sebil');
          const isKonferans = loc.includes('konferans') || loc.includes('salon');
          return !(isBungalov || isGol || isSpor || isYemekhane || isKonferans);
        });
    }
  };

  const exportToCSV = (type: 'issues' | 'requests') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (type === 'issues') {
      csvContent += "ID,Tarih,Bildiren,Konum,Kategori,Oncelik,Atanan,Durum,Aciklama\n";
      issues.forEach(issue => {
        csvContent += `"${issue.id}","${issue.dateTime}","${issue.reporter}","${issue.location}","${issue.category}","${issue.priority}","${issue.assignedTo}","${issue.status}","${issue.description.replace(/"/g, '""')}"\n`;
      });
    } else {
      csvContent += "ID,Talep Eden,Departman,Baslik,Miktar,Oncelik,Istenen Tarih,Durum\n";
      requests.forEach(req => {
        csvContent += `"${req.id}","${req.requester}","${req.department}","${req.title}",${req.quantity},"${req.priority}","${req.neededDate}","${req.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KYS_${type === 'issues' ? 'Teknik_Arizalar' : 'Tedarik_Talepleri'}_${selectedCenterId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (window.self !== window.top) {
      setShowPrintWarning(true);
    } else {
      window.print();
    }
  };

  // ---------------------------------------------------------
  // AI Recommendations Engine Heuristics
  // ---------------------------------------------------------
  const aiRecommendations = () => {
    const analysis: { title: string; desc: string; severity: 'warning' | 'info' | 'critical'; type: string }[] = [];
    
    // 1. Repeating issues check
    const locations = issues.map(i => i.location);
    const repeats = locations.filter((item, index) => locations.indexOf(item) !== index);
    const uniqueRepeats = Array.from(new Set(repeats));
    
    if (uniqueRepeats.length > 0) {
      uniqueRepeats.forEach(loc => {
        const count = issues.filter(i => i.location === loc).length;
        if (count >= 2) {
          analysis.push({
            title: `Tekrarlayan Arıza Tespiti: ${loc}`,
            desc: `Bu konumda son 30 gün içerisinde ${count} adet arıza bildirilmiştir. Kalıcı altyapı incelemesi önerilmektedir.`,
            severity: 'warning',
            type: 'repeating'
          });
        }
      });
    }

    // 2. Precautionary Maintenance
    const plumbingIssues = issues.filter(i => i.category === 'Su / Tesisat');
    if (plumbingIssues.length >= 2) {
      analysis.push({
        title: 'Önleyici Sıhhi Tesisat Bakımı Uyarısı',
        desc: 'Kamp su / tesisat arızalarında artış gözlemlendi. Kireçlenme ve basınç düşürücü vanaların kontrol periyodu öne çekilmelidir.',
        severity: 'info',
        type: 'maintenance'
      });
    }

    const electricIssues = issues.filter(i => i.category === 'Elektrik');
    if (electricIssues.length >= 2) {
      analysis.push({
        title: 'Elektrik Dağıtım Hatları Kontrolü',
        desc: 'Yüksek akım çeken aydınlatma ve projeksiyon arızaları tespit edilmiştir. Ana panolardaki kaçak akım röleleri test edilmelidir.',
        severity: 'info',
        type: 'maintenance'
      });
    }

    // 3. Equipment break rate stats
    analysis.push({
      title: 'Sık Arıza Veren Ekipman Analizi (KYS Copilot)',
      desc: 'Kamp geneli arıza frekanslarına göre, pirinç vana contaları ve IT ağ kabloları en çok parça değişimi gerektiren sarflardır. Tedarik deposunda güvenlik stoğu seviyesi %20 artırılmalıdır.',
      severity: 'info',
      type: 'stat'
    });

    return analysis;
  };

  // ---------------------------------------------------------
  // Filtering & Role Permissions
  // ---------------------------------------------------------
  // Filter by Center ID
  const centerIssues = issues.filter(issue => issue.campCenterId === selectedCenterId);
  const centerRequests = requests.filter(req => req.campCenterId === selectedCenterId);

  // Role permissions filtering
  // Personel can only see issues/requests they reported.
  // Others can see all.
  const visibleIssues = centerIssues.filter(issue => {
    if (activeRole === 'Gönüllü') {
      return issue.reporter.includes('Emre') || issue.reporter.includes('Derya') || issue.reporter === 'Gönüllü Saha Personeli';
    }
    return true;
  });

  const visibleRequests = centerRequests.filter(req => {
    if (activeRole === 'Gönüllü') {
      return req.requester.includes('Saha') || req.requester.includes('Gönüllü');
    }
    return true;
  });

  // Calculate Metrics
  const openIssues = centerIssues.filter(i => i.status !== 'Kapatıldı' && i.status !== 'Çözüldü').length;
  const criticalIssues = centerIssues.filter(i => i.priority === 'Kritik' && i.status !== 'Kapatıldı' && i.status !== 'Çözüldü').length;
  const pendingRequests = centerRequests.filter(r => r.status === 'Talep Oluşturuldu' || r.status === 'Yönetici Onayında' || r.status === 'Satın Alma Sürecinde').length;
  const completedJobs = centerIssues.filter(i => i.status === 'Çözüldü' || i.status === 'Kapatıldı').length;

  // Render Priorities colors helper
  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'Kritik': return 'bg-red-100 text-red-700 border-red-200';
      case 'Yüksek': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Orta': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Yeni Kayıt': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'İnceleniyor': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'İşleme Alındı': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Çözüldü': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'Reddedildi': return 'bg-red-50 text-red-700 border-red-200';
      case 'Tamamlandı': 
      case 'Tedarik Edildi':
      case 'Teslim Edildi': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Yönetici Onayında': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6" id="tech-ops-view-wrapper">
      
      {/* ---------------------------------------------------------
          Interactive Role Selector & Module Introduction
         --------------------------------------------------------- */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
              <Wrench className="w-5 h-5" />
            </span>
            <h1 className="text-base font-bold text-gray-900 font-sans tracking-tight">
              Teknik Arıza, Tedarik &amp; Görev Takip Portalı
            </h1>
          </div>
          <p className="text-2xs text-gray-500 font-medium mt-1">
            Kamp içi sıhhi tesisat, elektrik, donanım, IT arızaları ile malzeme ihtiyaç taleplerinin SLA takipli koordinasyon merkezi.
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------
          Collapsible Accordion Panels for Technical Operations
         --------------------------------------------------------- */}
      <div className="space-y-5">
        
        {/* Accordion: Vardiya */}
        {false && (
          <div id="tech-acc-vardiya" className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden mt-6">
            <div className="p-5 bg-gradient-to-r from-emerald-50/20 to-transparent border-b border-gray-100 flex items-start sm:items-center gap-2.5">
              <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                <Clock className="w-4 h-4" />
              </span>
              <div className="text-left">
                <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block sm:whitespace-nowrap">Vardiya ve Görevlerim</span>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Teknik ekip vardiya çizelgesi ve günlük iş emirleri.</p>
              </div>
            </div>
            
            <div className="p-5 space-y-6 animate-in fade-in slide-in-from-top-1 duration-150">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Today's Shifts */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 mb-4">
                       <Clock className="w-5 h-5 text-emerald-600" />
                       Teknik Vardiya Çizelgesi
                    </h3>
                    <div className="space-y-3">
                      {shifts.filter(s => s.department === 'Teknik').map(shift => (
                        <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                              {shift.staffName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{shift.staffName}</p>
                              <p className="text-[10px] text-gray-500">{shift.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-emerald-600">{shift.startTime} - {shift.endTime}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{shift.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Teknik Tasks */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 mb-4">
                       <Wrench className="w-5 h-5 text-emerald-600" />
                       Teknik İş Emirleri
                    </h3>
                    <div className="space-y-3">
                       {tasks.filter(t => t.department === 'Teknik').map(task => (
                         <div key={task.id} className={`p-4 rounded-xl border transition-all ${task.status === 'Tamamlandı' ? 'bg-emerald-50/50 border-emerald-100 opacity-75' : 'bg-white border-gray-100 shadow-xs'}`}>
                            <div className="flex justify-between items-start gap-4">
                               <div className="flex-1">
                                  <h4 className={`text-xs font-bold mb-1 ${task.status === 'Tamamlandı' ? 'text-emerald-800 line-through' : 'text-gray-900'}`}>
                                    {task.title}
                                  </h4>
                                  <p className="text-[11px] text-gray-500 leading-relaxed">{task.description}</p>
                                  <div className="flex items-center gap-3 mt-3">
                                     <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                                        task.priority === 'Kritik' ? 'bg-rose-100 text-rose-700' : 
                                        task.priority === 'Yüksek' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                                     }`}>
                                        {task.priority}
                                     </span>
                                  </div>
                               </div>
                               <button 
                                 onClick={() => {
                                    const updated = tasks.map(t => t.id === task.id ? { ...t, status: (t.status === 'Tamamlandı' ? 'Bekliyor' : 'Tamamlandı') as any } : t);
                                    onUpdateTasks(updated);
                                    onAddLog('Görev Durumu Değiştirildi', `Teknik görev: ${task.title}`);
                                 }}
                                 className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${task.status === 'Tamamlandı' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-emerald-100 hover:text-emerald-600'}`}
                               >
                                 <Check className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Accordion 1: Dashboard */}
        {(!activeSubView || activeSubView === 'dashboard') && (
          <div id="tech-acc-dashboard" className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden">
            {!activeSubView ? (
              <div 
                onClick={() => onChangeSubView ? onChangeSubView('dashboard') : setIsDashboardOpen(!isDashboardOpen)}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50/75 hover:bg-gray-50 cursor-pointer select-none transition duration-150 gap-4"
              >
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <div className="text-left">
                    <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block sm:whitespace-nowrap">Yönetici Kontrol Paneli</span>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">SLA hedefleri, departman bazlı iş yükü ve genel teknik veriler.</p>
                  </div>
                </div>
                <button type="button" className="text-gray-400 hover:text-emerald-700 p-1 shrink-0">
                  {isDashboardOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <div className="p-5 bg-gradient-to-r from-emerald-50/20 to-transparent border-b border-gray-100 flex items-start sm:items-center gap-2.5">
                <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block sm:whitespace-nowrap">Yönetici Kontrol Paneli</span>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">SLA hedefleri, departman bazlı iş yükü ve genel teknik veriler.</p>
                </div>
              </div>
            )}
            
            {(isDashboardOpen || activeSubView === 'dashboard') && (
              <div className={`${!activeSubView ? 'p-5 border-t border-gray-100' : 'p-5'} space-y-6 animate-in fade-in slide-in-from-top-1 duration-150`}>
              <div className="space-y-6" id="tech-dashboard-panel">
          
          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex items-center gap-3">
              <div className="p-2 bg-yellow-50 text-yellow-700 rounded-lg shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-4xs font-extrabold text-gray-400 uppercase tracking-wider block">Açık Arıza</span>
                <span className="text-base font-extrabold text-gray-900 block mt-0.5">{openIssues}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-700 rounded-lg shrink-0 animate-pulse">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-4xs font-extrabold text-gray-400 uppercase tracking-wider block">Kritik Arıza</span>
                <span className="text-base font-extrabold text-red-600 block mt-0.5">{criticalIssues}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-700 rounded-lg shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <span className="text-4xs font-extrabold text-gray-400 uppercase tracking-wider block">Bekleyen Talep</span>
                <span className="text-base font-extrabold text-gray-900 block mt-0.5">{pendingRequests}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-3xs flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-4xs font-extrabold text-gray-400 uppercase tracking-wider block">Tamamlanan İşler</span>
                <span className="text-base font-extrabold text-emerald-800 block mt-0.5">{completedJobs}</span>
              </div>
            </div>
          </div>

          {/* SLA Tracking Gauge & Department Load Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visual SLA Breakdown Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  SLA / Hedef Müdahale Durumu
                </h3>
                <p className="text-4xs text-gray-400 mt-0.5">Öncelik sınıfına göre hedeflenen çözüm oranları</p>
              </div>

              <div className="my-4 space-y-3">
                <div>
                  <div className="flex justify-between text-3xs font-bold text-gray-600 mb-1">
                    <span>Kritik (2 Saat)</span>
                    <span className="text-red-600">1/1 Aşım</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-3xs font-bold text-gray-600 mb-1">
                    <span>Yüksek (6 Saat)</span>
                    <span className="text-orange-600">50% Zamanında</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-3xs font-bold text-gray-600 mb-1">
                    <span>Orta (24 Saat)</span>
                    <span className="text-emerald-700">100% Zamanında</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 text-4xs text-emerald-800">
                <strong>SLA Kuralı:</strong> Çözüm gecikmelerinde sistem otomatik olarak Kamp Müdürü ve İlgili Koordinatörlere SMS ve WhatsApp alarm bildirimi fırlatır.
              </div>
            </div>

            {/* Department-wise Density & Performance (SVG Representation) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-700" />
                  Yük Dağılımı &amp; Personel Performansı
                </h3>
                <p className="text-4xs text-gray-400 mt-0.5">Departman bazlı iş dağılım ağırlıkları</p>
              </div>

              {/* Graphic Chart in SVG */}
              <div className="py-4 flex items-center justify-center">
                <svg viewBox="0 0 200 100" className="w-full max-h-[120px]">
                  {/* Grid Lines */}
                  <line x1="20" y1="10" x2="180" y2="10" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="20" y1="45" x2="180" y2="45" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="20" y1="80" x2="180" y2="80" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* Bars */}
                  {/* Tesisat */}
                  <rect x="40" y="30" width="16" height="50" fill="#059669" rx="2" />
                  <text x="48" y="94" textAnchor="middle" fontSize="8" fill="#9ca3af" className="font-bold">Su</text>
                  
                  {/* Elektrik */}
                  <rect x="80" y="15" width="16" height="65" fill="#f59e0b" rx="2" />
                  <text x="88" y="94" textAnchor="middle" fontSize="8" fill="#9ca3af" className="font-bold">Elk</text>
                  
                  {/* IT */}
                  <rect x="120" y="45" width="16" height="35" fill="#10b981" rx="2" />
                  <text x="128" y="94" textAnchor="middle" fontSize="8" fill="#9ca3af" className="font-bold">IT</text>

                  {/* Güvenlik */}
                  <rect x="160" y="60" width="16" height="20" fill="#ef4444" rx="2" />
                  <text x="168" y="94" textAnchor="middle" fontSize="8" fill="#9ca3af" className="font-bold">Güv</text>

                  {/* Values */}
                  <text x="48" y="25" textAnchor="middle" fontSize="8" fill="#059669" className="font-extrabold">25%</text>
                  <text x="88" y="10" textAnchor="middle" fontSize="8" fill="#f59e0b" className="font-extrabold">45%</text>
                  <text x="128" y="40" textAnchor="middle" fontSize="8" fill="#10b981" className="font-extrabold">20%</text>
                  <text x="168" y="55" textAnchor="middle" fontSize="8" fill="#ef4444" className="font-extrabold">10%</text>
                </svg>
              </div>

              <div className="text-[10px] text-gray-500 font-bold flex justify-between">
                <span>En Yoğun: Elektrik Departmanı</span>
                <span className="text-emerald-700">Ort. Çözüm: 1.4 sa</span>
              </div>
            </div>

            {/* Dynamic System Notifications Logs */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  SLA / Bildirim Haberleşme İstasyonu
                </h3>
                <p className="text-4xs text-gray-400 mt-0.5">En son gönderilen E-posta, SMS ve Push bildirimleri</p>
              </div>

              <div className="my-3 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-2 rounded-lg bg-gray-50 border border-gray-150 text-[10px] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        notif.type === 'critical' ? 'bg-red-100 text-red-700' :
                        notif.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {notif.type.toUpperCase()}
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono">{notif.timestamp}</span>
                    </div>
                    <p className="text-gray-700 font-bold leading-tight">{notif.text}</p>
                    <div className="text-[9px] text-emerald-800 font-extrabold flex items-center gap-1">
                      <Mail className="w-2.5 h-2.5" />
                      <span>{notif.channel}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <span className="text-[9px] text-gray-400 italic">Tüm sistem altyapısı SMTP ve SMS gateway ile entegredir.</span>
              </div>
            </div>
          </div>

          {/* Quick SLA Breaches Warning Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs">
              <h4 className="text-xs font-extrabold text-red-700 mb-3 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                Kritik SLA Süre Aşım Alarmları
              </h4>
              <div className="space-y-2">
                {centerIssues.filter(isSlaBreached).length === 0 ? (
                  <p className="text-3xs text-gray-400 italic">Şu an aktif olarak SLA süresini aşmış bir teknik arıza bulunmuyor.</p>
                ) : (
                  centerIssues.filter(isSlaBreached).map(issue => (
                    <div key={issue.id} className="p-2 border border-red-200 bg-red-50/50 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="text-3xs font-extrabold text-red-800 font-mono block">{issue.id}</span>
                        <span className="text-xs font-bold text-gray-800 block mt-0.5">{issue.location} - {issue.category}</span>
                      </div>
                      <span className="text-3xs font-extrabold text-white bg-red-600 px-2 py-1 rounded">
                        {getRemainingSlaText(issue)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Maintenance Predictor Quick Widget */}
            <div className="bg-emerald-55 border border-emerald-150 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-emerald-900 mb-1 flex items-center gap-1.5 font-sans">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
                  KYS AI Akıllı Tahmin İstasyonu
                </h4>
                <p className="text-4xs text-emerald-800">Geçmiş verileri analiz eden makine öğrenmesi önerileri</p>
              </div>
              <div className="my-3 space-y-2">
                <div className="text-xs text-emerald-950 font-bold">
                  ⚡ <strong>Öneri:</strong> Beykoz kampındaki termosifon vanalarında kireçlenmeye bağlı sızıntı riski tespit edildi. Haftalık rutin tesisat turu yapılması önerilir.
                </div>
              </div>
              <button 
                onClick={() => setSubTab('ai-copilot')}
                className="text-3xs font-extrabold text-emerald-900 hover:text-emerald-950 bg-white border border-emerald-250 hover:border-emerald-350 px-3 py-1.5 rounded-lg w-fit transition flex items-center gap-1 cursor-pointer"
              >
                <span>AI Detaylarına Git</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}

      {/* Accordion 2: Issues */}
      {(!activeSubView || activeSubView === 'issues') && (
        <div id="tech-acc-issues" className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden">
          {!activeSubView ? (
            <div 
              onClick={() => onChangeSubView ? onChangeSubView('issues') : setIsIssuesOpen(!isIssuesOpen)}
              className="flex justify-between items-start sm:items-center p-4 bg-gray-50/75 hover:bg-gray-50 cursor-pointer select-none transition duration-150"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                  <Wrench className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block">Arıza &amp; Bakım Defteri ({visibleIssues.length})</span>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Saha personeli tarafından girilen aktif elektrik, su, donanım arıza kayıtları.</p>
                </div>
              </div>
              <button type="button" className="text-gray-400 hover:text-emerald-700 p-1 shrink-0 ml-2">
                {isIssuesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <div className="p-5 bg-gradient-to-r from-emerald-50/20 to-transparent border-b border-gray-100 flex items-start sm:items-center gap-2.5">
              <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                <Wrench className="w-4 h-4" />
              </span>
              <div>
                <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block">Arıza &amp; Bakım Defteri ({visibleIssues.length})</span>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Saha personeli tarafından girilen aktif elektrik, su, donanım arıza kayıtları.</p>
              </div>
            </div>
          )}
          
          {(isIssuesOpen || activeSubView === 'issues') && (
            <div className={`${!activeSubView ? 'p-5 border-t border-gray-100' : 'p-5'} space-y-4 animate-in fade-in slide-in-from-top-1 duration-150`}>
            <div className="space-y-4" id="tech-issues-list-view">
          
          {/* Action and Filter Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">Aktif Teknik Arıza Kayıtları</h2>
              <p className="text-[10px] text-gray-500">Arızaları filtreleyebilir, detaylarını inceleyebilir ve müdahale geçmişi ekleyebilirsiniz.</p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={() => setIsNewIssueModalOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-3xs py-2 px-3 rounded-xl transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Yeni Arıza Bildir</span>
              </button>
            </div>
          </div>

          {/* Table / List layout for technical issues */}
          <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-3xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-4xs font-extrabold text-gray-400 uppercase tracking-widest">
                    <th className="p-3">Bildirim No</th>
                    <th className="p-3">Tarih</th>
                    <th className="p-3">Bildiren</th>
                    <th className="p-3">Lokasyon / Kategori</th>
                    <th className="p-3 text-center">Öncelik</th>
                    <th className="p-3 text-center">Durum</th>
                    <th className="p-3">SLA / Kalan Süre</th>
                    <th className="p-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {visibleIssues.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-400 italic">
                        Kayıtlı teknik arıza bulunmamaktadır.
                      </td>
                    </tr>
                  ) : (
                    visibleIssues.map((issue) => {
                      const breached = isSlaBreached(issue);
                      return (
                        <tr 
                          key={issue.id} 
                          className={`hover:bg-neutral-50/60 transition ${
                            breached ? 'bg-red-50/40 hover:bg-red-50/60' : ''
                          }`}
                        >
                          <td className="p-3 font-extrabold text-neutral-800 font-mono">
                            {issue.id}
                            {breached && (
                              <span className="ml-1 text-red-600 inline-block font-sans animate-pulse" title="SLA Gecikmesi var!">
                                ⚠️
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-gray-400 text-3xs font-medium">
                            {issue.dateTime.replace('T', ' ')}
                          </td>
                          <td className="p-3 font-bold text-gray-700">
                            {issue.reporter}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-gray-900">{issue.location}</div>
                            <div className="text-3xs text-gray-400 font-medium">{issue.category}</div>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-full ${getPriorityBadge(issue.priority)}`}>
                              {issue.priority}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-full ${getStatusBadge(issue.status)}`}>
                              {issue.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-3xs font-extrabold">
                            <span className={breached ? 'text-red-600 font-extrabold' : 'text-neutral-500'}>
                              {getRemainingSlaText(issue)}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedIssueId(issue.id);
                                setDeptNote('');
                                setAdjustedPriority(issue.priority);
                              }}
                              className="inline-flex items-center gap-1 py-1 px-2 border border-gray-200 hover:border-emerald-500 rounded bg-white hover:bg-emerald-50 text-emerald-800 text-3xs font-extrabold transition cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Müdahale &amp; Detay</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}

      {/* Accordion 3: Requests */}
      {(!activeSubView || activeSubView === 'requests') && (
        <div id="tech-acc-requests" className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden">
          {!activeSubView ? (
            <div 
              onClick={() => onChangeSubView ? onChangeSubView('requests') : setIsRequestsOpen(!isRequestsOpen)}
              className="flex justify-between items-start sm:items-center p-4 bg-gray-50/75 hover:bg-gray-50 cursor-pointer select-none transition duration-150"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                  <ClipboardList className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block">Eksik &amp; Tedarik Talepleri ({visibleRequests.length})</span>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Sarf malzeme, teknik araç-gereç ve departman ihtiyaçlarının onay ve satın alma süreçleri.</p>
                </div>
              </div>
              <button type="button" className="text-gray-400 hover:text-emerald-700 p-1 shrink-0 ml-2">
                {isRequestsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <div className="p-5 bg-gradient-to-r from-emerald-50/20 to-transparent border-b border-gray-100 flex items-start sm:items-center gap-2.5">
              <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                <ClipboardList className="w-4 h-4" />
              </span>
              <div>
                <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block">Eksik &amp; Tedarik Talepleri ({visibleRequests.length})</span>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Sarf malzeme, teknik araç-gereç ve departman ihtiyaçlarının onay ve satın alma süreçleri.</p>
              </div>
            </div>
          )}
          
          {(isRequestsOpen || activeSubView === 'requests') && (
            <div className={`${!activeSubView ? 'p-5 border-t border-gray-100' : 'p-5'} space-y-4 animate-in fade-in slide-in-from-top-1 duration-150`}>
            <div className="space-y-4" id="tech-requests-list-view">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">Eksik Malzeme ve Tedarik Talepleri</h2>
              <p className="text-[10px] text-gray-500">Sarf malzeme, teknik araç-gereç ve departman ihtiyaçlarının onay ve satın alma süreçleri.</p>
            </div>

            <button
              onClick={() => setIsNewRequestModalOpen(true)}
              className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-3xs py-2 px-3 rounded-xl transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Yeni Tedarik Talebi Aç</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-3xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-4xs font-extrabold text-gray-400 uppercase tracking-widest">
                    <th className="p-3">Talep No</th>
                    <th className="p-3">Talep Eden</th>
                    <th className="p-3">Departman</th>
                    <th className="p-3">Talep Başlığı / Detay</th>
                    <th className="p-3 text-center">Adet</th>
                    <th className="p-3 text-center">Öncelik</th>
                    <th className="p-3">İstenen Tarih</th>
                    <th className="p-3 text-center">Durum</th>
                    <th className="p-3 text-right">Yönetici Onay İşlemleri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {visibleRequests.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-gray-400 italic">
                        Kayıtlı malzeme tedarik talebi bulunmamaktadır.
                      </td>
                    </tr>
                  ) : (
                    visibleRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-neutral-50/60 transition">
                        <td className="p-3 font-extrabold text-neutral-800 font-mono">
                          {req.id}
                        </td>
                        <td className="p-3 font-bold text-gray-700">
                          {req.requester}
                        </td>
                        <td className="p-3 font-medium text-gray-500">
                          {req.department}
                        </td>
                        <td className="p-3 max-w-xs">
                          <div className="font-bold text-gray-900 truncate">{req.title}</div>
                          <div className="text-3xs text-gray-400 font-medium truncate mt-0.5">{req.details}</div>
                        </td>
                        <td className="p-3 text-center font-bold text-gray-800">
                          {req.quantity}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-full ${getPriorityBadge(req.priority)}`}>
                            {req.priority}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500 text-3xs font-medium">
                          {req.neededDate}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-full ${getRequestStatusBadge(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {/* Manager controls inside table row */}
                          {activeRole === 'Kamp Müdürü' ? (
                            <div className="flex gap-1 justify-end">
                              {req.status === 'Talep Oluşturuldu' || req.status === 'Yönetici Onayında' ? (
                                <>
                                  <button
                                    onClick={() => handleUpdateRequestStatus(req.id, 'Satın Alma Sürecinde')}
                                    className="p-1 border border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded"
                                    title="Onayla ve Satın Almaya Gönder"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateRequestStatus(req.id, 'Reddedildi')}
                                    className="p-1 border border-red-200 text-red-800 hover:bg-red-50 rounded"
                                    title="Talebi Reddet"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : req.status === 'Satın Alma Sürecinde' ? (
                                <button
                                  onClick={() => handleUpdateRequestStatus(req.id, 'Tedarik Edildi')}
                                  className="text-[9px] font-extrabold bg-emerald-700 text-white px-1.5 py-0.5 rounded cursor-pointer"
                                >
                                  Tedarik Edildi
                                </button>
                              ) : (req.status === 'Tedarik Edildi' || req.status === 'Teslim Edildi') ? (
                                <button
                                  onClick={() => handleUpdateRequestStatus(req.id, 'Tamamlandı')}
                                  className="text-[9px] font-extrabold bg-gray-100 border border-gray-300 text-gray-700 px-1.5 py-0.5 rounded cursor-pointer"
                                >
                                  Kapat
                                </button>
                              ) : (
                                <span className="text-3xs text-gray-400 font-medium italic">Kilitli</span>
                              )}
                            </div>
                          ) : (
                            <div className="text-3xs text-gray-400 italic">
                              <Lock className="w-2.5 h-2.5 inline mr-1 text-gray-300" />
                              Yalnızca Yönetici
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}

      {/* Accordion 4: AI Copilot */}
      {(!activeSubView || activeSubView === 'ai-copilot') && (
        <div id="tech-acc-ai-copilot" className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden">
          {!activeSubView ? (
            <div 
              onClick={() => onChangeSubView ? onChangeSubView('ai-copilot') : setIsAiCopilotOpen(!isAiCopilotOpen)}
              className="flex justify-between items-start sm:items-center p-4 bg-gray-50/75 hover:bg-gray-50 cursor-pointer select-none transition duration-150"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </span>
                <div>
                  <span className="font-extrabold text-xs text-amber-750 uppercase tracking-wider block">KYS AI Öngörü &amp; Bakım</span>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Yapay zeka ile arıza tahminleri, planlı bakım önerileri ve karar destek önerileri.</p>
                </div>
              </div>
              <button type="button" className="text-gray-400 hover:text-emerald-700 p-1 shrink-0 ml-2">
                {isAiCopilotOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <div className="p-5 bg-gradient-to-r from-emerald-50/20 to-transparent border-b border-gray-100 flex items-start sm:items-center gap-2.5">
              <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                <Sparkles className="w-4 h-4 text-amber-500" />
              </span>
              <div>
                <span className="font-extrabold text-xs text-amber-750 uppercase tracking-wider block">KYS AI Öngörü &amp; Bakım</span>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Yapay zeka ile arıza tahminleri, planlı bakım önerileri ve karar destek önerileri.</p>
              </div>
            </div>
          )}
          
          {(isAiCopilotOpen || activeSubView === 'ai-copilot') && (
            <div className={`${!activeSubView ? 'p-5 border-t border-gray-100' : 'p-5'} space-y-6 animate-in fade-in slide-in-from-top-1 duration-150`}>
              <div className="space-y-6" id="tech-ai-copilot">
          <div className="p-5 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm border border-emerald-900">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <h2 className="text-base font-extrabold font-sans">KYS AI Copilot Akıllı Analiz Portalı</h2>
              </div>
              <p className="text-2xs text-emerald-100 font-medium mt-1">
                Makine öğrenmesi modelleri ile geçmiş arıza loglarını tarayarak benzerlik analizi yapar ve tekrarlayan problemleri önceden uyarır.
              </p>
            </div>
            <div className="bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-700 text-3xs font-mono">
              Status: Heuristic AI Engine Online
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Active AI Alert Board */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs space-y-4">
              <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                Aktif AI Altyapı Analiz Önerileri
              </h3>
              
              <div className="space-y-3">
                {aiRecommendations().map((rec, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border flex gap-3 ${
                    rec.severity === 'warning' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="shrink-0 mt-0.5">
                      {rec.severity === 'warning' ? (
                        <AlertCircle className="w-5 h-5 text-orange-600 animate-pulse" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-neutral-800 text-xs">{rec.title}</h4>
                      <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{rec.desc}</p>
                      {rec.type === 'repeating' && (
                        <div className="mt-2 text-3xs font-extrabold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full w-fit">
                          Sıcak Su / Isıtıcı Sık Arıza
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Preventive Maintenance Table */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-emerald-700" />
                  Öngörüsel Bakım Takvimi (Predictive Maintenance)
                </h3>
                <p className="text-4xs text-gray-400">Veri analiziyle planlanan tahmini teknik revizyon tarihleri</p>
              </div>

              <div className="my-4 divide-y divide-gray-100">
                <div className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-extrabold text-gray-800 block">Isıtıcı Rezistans Değişimi</span>
                    <span className="text-3xs text-gray-400 block mt-0.5">Beykoz Bungalovları (30 Adet)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-orange-700 bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                      Sonraki Bakım: 5 Gün Sonra
                    </span>
                    <span className="text-4xs text-gray-400 block mt-0.5">Korelasyon Skoru: 94%</span>
                  </div>
                </div>

                <div className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-extrabold text-gray-800 block">IT Switch &amp; Router Toz Temizliği</span>
                    <span className="text-3xs text-gray-400 block mt-0.5">Saha Odaları &amp; Revir</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      Gereksinim: Beklemede
                    </span>
                    <span className="text-4xs text-gray-400 block mt-0.5">Korelasyon Skoru: 40%</span>
                  </div>
                </div>

                <div className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-extrabold text-gray-800 block">Yemekhane Su Arıtma Filtre Değişimi</span>
                    <span className="text-3xs text-gray-400 block mt-0.5">Mutfak &amp; Sebil Üniteleri</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200">
                      Bakım Tarihi Geçti!
                    </span>
                    <span className="text-4xs text-red-500 block mt-0.5">Kritik Tesisat Riski</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl text-[10px] leading-relaxed text-gray-500">
                💡 <strong>Heuristic Analiz:</strong> Geçen dönem Beykoz kampında filtre değişimi geciktiği için 2 gün sebil dışı kalma gözlendi. KYS AI, bu dönem aksama olmaması için uyarıyor.
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}

      {/* Accordion 5: Reports */}
      {(!activeSubView || activeSubView === 'reports') && (
        <div id="tech-acc-reports" className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden">
          {!activeSubView ? (
            <div 
              onClick={() => onChangeSubView ? onChangeSubView('reports') : setIsReportsOpen(!isReportsOpen)}
              className="flex justify-between items-start sm:items-center p-4 bg-gray-50/75 hover:bg-gray-50 cursor-pointer select-none transition duration-150"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                  <FileText className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block">Analiz &amp; Raporlar</span>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Teknik dökümler hazırlama, maliyet analiz raporları ve resmi onay çıktıları.</p>
                </div>
              </div>
              <button type="button" className="text-gray-400 hover:text-emerald-700 p-1 shrink-0 ml-2">
                {isReportsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <div className="p-5 bg-gradient-to-r from-emerald-50/20 to-transparent border-b border-gray-100 flex items-start sm:items-center gap-2.5">
              <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block">Analiz &amp; Raporlar</span>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Teknik dökümler hazırlama, maliyet analiz raporları ve resmi onay çıktıları.</p>
              </div>
            </div>
          )}
          
          {(isReportsOpen || activeSubView === 'reports') && (
            <div className={`${!activeSubView ? 'p-5 border-t border-gray-100' : 'p-5'} space-y-6 animate-in fade-in slide-in-from-top-1 duration-150`}>
            <div className="space-y-6" id="tech-reports-view">
          
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h2 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">Teknik Raporlama &amp; Dosya Dışa Aktarım</h2>
              <p className="text-[10px] text-gray-500">Operasyon verimlilik raporlarını inceleyebilir ve Excel uyumlu CSV formatında indirebilirsiniz.</p>
            </div>
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-3xs font-extrabold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Yazdır / PDF Al</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CSV Exporters Cards */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs space-y-4">
              <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Sistem Veri Yedekleri (Excel / CSV)</h3>
              
              <div className="space-y-3">
                <div className="p-3 border border-gray-150 rounded-xl flex justify-between items-center bg-gray-50/50">
                  <div>
                    <span className="font-extrabold text-gray-800 text-xs block">Tüm Teknik Arıza Defteri</span>
                    <span className="text-4xs text-gray-400 block mt-0.5">{issues.length} Arıza Kaydı</span>
                  </div>
                  <button
                    onClick={() => exportToCSV('issues')}
                    className="py-1.5 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-3xs font-extrabold rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>CSV İndir</span>
                  </button>
                </div>

                <div className="p-3 border border-gray-150 rounded-xl flex justify-between items-center bg-gray-50/50">
                  <div>
                    <span className="font-extrabold text-gray-800 text-xs block">Tedarik ve Satın Alma Talepleri</span>
                    <span className="text-4xs text-gray-400 block mt-0.5">{requests.length} Malzeme Talebi</span>
                  </div>
                  <button
                    onClick={() => exportToCSV('requests')}
                    className="py-1.5 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-3xs font-extrabold rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>CSV İndir</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Freq analysis statistics card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs space-y-4">
              <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">En Çok Arıza Çıkaran Kategoriler</h3>
              
              <div className="space-y-2">
                {getMostFrequentIssues().length === 0 ? (
                  <p className="text-3xs text-gray-400 italic">Yeterli arıza analizi bulunmamaktadır.</p>
                ) : (
                  getMostFrequentIssues().map(([category, count]) => {
                    const pct = Math.round((count / issues.length) * 100) || 0;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span>{category}</span>
                          <span className="text-gray-500">{count} Adet (%{pct})</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-700 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}

      {/* Accordion 6: Areas */}
      {(!activeSubView || activeSubView === 'areas') && (
        <div id="tech-acc-areas" className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden">
          {!activeSubView ? (
            <div 
              onClick={() => onChangeSubView ? onChangeSubView('areas') : setIsAreasOpen(!isAreasOpen)}
              className="flex justify-between items-start sm:items-center p-4 bg-gray-50/75 hover:bg-gray-50 cursor-pointer select-none transition duration-150"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </span>
                <div>
                  <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block">Alan Bazlı İşlem &amp; Masraf</span>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Bungalovlar, göl, spor tesisleri, yemekhane ve idari ortak alanlar.</p>
                </div>
              </div>
              <button type="button" className="text-gray-400 hover:text-emerald-700 p-1 shrink-0 ml-2">
                {isAreasOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <div className="p-5 bg-gradient-to-r from-emerald-50/20 to-transparent border-b border-gray-100 flex items-start sm:items-center gap-2.5">
              <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                <MapPin className="w-4 h-4 text-emerald-600" />
              </span>
              <div>
                <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider block">Alan Bazlı İşlem &amp; Masraf</span>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Bungalovlar, göl, spor tesisleri, yemekhane ve idari ortak alanlar.</p>
              </div>
            </div>
          )}
          
          {(isAreasOpen || activeSubView === 'areas') && (
            <div className={`${!activeSubView ? 'p-5 border-t border-gray-100' : 'p-5'} space-y-6 animate-in fade-in slide-in-from-top-1 duration-150`}>
              {(() => {
        const AREAS_CONFIG = [
          { key: 'bungalov', label: 'Bungalovlar', desc: 'Misafir ve personel konaklama birimleri (STD & LDR kabinleri).', color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50/40', textCol: 'text-emerald-800' },
          { key: 'gol', label: 'Göl ve Çevresi', desc: 'Yaylagöl göleti, cankurtaran iskelesi ve su pompası tesisatları.', color: 'from-blue-500 to-cyan-600', bgLight: 'bg-blue-50/40', textCol: 'text-blue-800' },
          { key: 'spor', label: 'Spor Tesisleri', desc: 'Basketbol, futbol, voleybol sahaları ve macera parkurları.', color: 'from-orange-500 to-amber-600', bgLight: 'bg-orange-50/40', textCol: 'text-orange-800' },
          { key: 'yemekhane', label: 'Yemekhane & Mutfak', desc: 'Endüstriyel mutfak ekipmanları, yemek salonu ve su sebilleri.', color: 'from-purple-500 to-indigo-600', bgLight: 'bg-purple-50/40', textCol: 'text-purple-800' },
          { key: 'konferans', label: 'Konferans Salonu', desc: 'Kapalı amfi, ses, ışık ve projeksiyon sistemleri.', color: 'from-red-500 to-rose-600', bgLight: 'bg-red-50/40', textCol: 'text-red-800' },
          { key: 'diger', label: 'Diğer Ortak Alanlar', desc: 'Revir, giriş-çıkış turnikeleri, idari bina ve çevre çitleri.', color: 'from-gray-500 to-slate-600', bgLight: 'bg-gray-50/40', textCol: 'text-gray-800' }
        ];

        const activeAreaConfig = AREAS_CONFIG.find(c => c.key === selectedArea) || AREAS_CONFIG[0];
        const activeAreaIssues = getIssuesForArea(selectedArea);
        
        // Calculate total cost for the active area
        const activeAreaTotalCost = activeAreaIssues.reduce((sum, issue) => {
          const issueSum = issue.actionLogs?.reduce((logSum, log) => logSum + (log.cost || 0), 0) || 0;
          return sum + issueSum;
        }, 0);

        const activeAreaActiveCount = activeAreaIssues.filter(i => i.status !== 'Çözüldü' && i.status !== 'Kapatıldı').length;
        const activeAreaResolvedCount = activeAreaIssues.filter(i => i.status === 'Çözüldü' || i.status === 'Kapatıldı').length;

        // Flatten action logs for the active area to show the masraf list!
        const activeAreaActionLogs = activeAreaIssues.flatMap(issue => 
          (issue.actionLogs || []).map(log => ({
            ...log,
            issueId: issue.id,
            location: issue.location,
            category: issue.category
          }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Filter based on selected date range for the active area
        const filteredActiveAreaActionLogs = activeAreaActionLogs.filter(log => {
          if (areaStartDate && log.date < areaStartDate) return false;
          if (areaEndDate && log.date > areaEndDate) return false;
          return true;
        });

        const filteredAreaTotalCost = filteredActiveAreaActionLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

        return (
          <div className="space-y-6 animate-fade-in" id="area-technical-dashboard">
            
            <div className="flex flex-col gap-1">
              <h2 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">Tesis Alanları Teknik İşlem &amp; Masraf Kontrolü</h2>
              <p className="text-[10px] text-gray-500">
                Bungalovlar, göl, spor tesisleri, yemekhane ve konferans salonu gibi alanlardaki arıza geçmişlerini, yapılan müdahaleleri ve maliyet detaylarını canlı takip edin.
              </p>
            </div>

            {/* Rapor & Döküm Hazırlama Paneli */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-3xs space-y-4" id="report-generation-panel">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-emerald-700" />
                  <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Tarih ve Alan Bazlı Resmi Döküm Hazırlama</h3>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  Resmi Raporlama Aracı
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Range Inputs */}
                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    1. Rapor Tarih Aralığı
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] text-gray-400 font-semibold block mb-0.5">Başlangıç</span>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          value={reportStartDate}
                          onChange={(e) => setReportStartDate(e.target.value)}
                          className="w-full pl-8 pr-2 py-1 text-xs border border-gray-200 rounded-lg text-gray-700 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-semibold block mb-0.5">Bitiş</span>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          value={reportEndDate}
                          onChange={(e) => setReportEndDate(e.target.value)}
                          className="w-full pl-8 pr-2 py-1 text-xs border border-gray-200 rounded-lg text-gray-700 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories Selection Checklist */}
                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                      2. Rapora Dahil Edilecek Tesis Alanları
                    </label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setReportSelectedAreas(AREAS_CONFIG.map(c => c.key))}
                        className="text-[9px] text-emerald-700 hover:underline font-bold cursor-pointer"
                      >
                        Tümünü Seç
                      </button>
                      <span className="text-gray-300 text-3xs">|</span>
                      <button 
                        onClick={() => setReportSelectedAreas([])}
                        className="text-[9px] text-gray-500 hover:underline font-bold cursor-pointer"
                      >
                        Temizle
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {AREAS_CONFIG.map((area) => {
                      const isChecked = reportSelectedAreas.includes(area.key);
                      return (
                        <label 
                          key={area.key}
                          className={`flex items-center gap-2 p-2 border rounded-xl cursor-pointer transition ${
                            isChecked 
                              ? 'bg-emerald-50/30 border-emerald-300 text-emerald-900 font-semibold' 
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setReportSelectedAreas(reportSelectedAreas.filter(k => k !== area.key));
                              } else {
                                setReportSelectedAreas([...reportSelectedAreas, area.key]);
                              }
                            }}
                            className="rounded text-emerald-700 focus:ring-emerald-600 w-3.5 h-3.5 border-gray-300 cursor-pointer"
                          />
                          <span className="text-[10px] truncate">{area.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Button to Generate Document */}
              <div className="pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[10px] text-gray-400">
                  * Seçilen aralıktaki arıza bildirimleri, bakım kayıtları, usta müdahaleleri ve malzeme/yedek parça harcamaları bir araya getirilerek döküm belgesi oluşturulur.
                </p>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  disabled={reportSelectedAreas.length === 0}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 shadow-3xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Döküman Oluştur &amp; Yazdır (PDF)</span>
                </button>
              </div>
            </div>

            {/* Area Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AREAS_CONFIG.map((area) => {
                const areaIssues = getIssuesForArea(area.key);
                const activeCount = areaIssues.filter(i => i.status !== 'Çözüldü' && i.status !== 'Kapatıldı').length;
                const resolvedCount = areaIssues.filter(i => i.status === 'Çözüldü' || i.status === 'Kapatıldı').length;
                const totalCost = areaIssues.reduce((sum, issue) => {
                  const issueSum = issue.actionLogs?.reduce((logSum, log) => logSum + (log.cost || 0), 0) || 0;
                  return sum + issueSum;
                }, 0);

                const isSelected = selectedArea === area.key;

                return (
                  <div 
                    key={area.key}
                    onClick={() => setSelectedArea(area.key)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-full relative ${
                      isSelected 
                        ? 'bg-emerald-50/25 border-emerald-600 shadow-3xs ring-1 ring-emerald-600' 
                        : 'bg-white border-gray-150 hover:border-gray-300 hover:shadow-3xs'
                    }`}
                  >
                    {/* Decorative tag for selected */}
                    {isSelected && (
                      <span className="absolute -top-2.5 -right-2 bg-emerald-700 text-white font-extrabold px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider">
                        Seçili Alan
                      </span>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${area.color}`}></div>
                        <h3 className="text-xs font-bold text-gray-800">{area.label}</h3>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{area.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[8px] font-extrabold text-gray-400 uppercase block tracking-wider">Toplam Harcanan</span>
                        <span className="text-sm font-extrabold text-neutral-800">
                          {totalCost > 0 ? `₺ ${totalCost.toLocaleString('tr-TR')}` : '₺ 0'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-extrabold text-gray-400 uppercase block tracking-wider">Durum Dağılımı</span>
                        <span className="text-[10px] font-bold text-gray-700 block">
                          <span className="text-emerald-700">{resolvedCount} Çözülen</span>
                          {activeCount > 0 && (
                            <span className="text-amber-600 ml-1.5">({activeCount} Aktif)</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Selection Section */}
            <div className="bg-white border border-gray-150 rounded-2xl shadow-3xs overflow-hidden">
              <div className="p-4 border-b border-gray-150 bg-gradient-to-r from-gray-50 to-white flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${activeAreaConfig.color}`}></div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                      {activeAreaConfig.label} Detaylı Analiz &amp; Geçmiş Defteri
                    </h3>
                    <p className="text-[10px] text-gray-400">Bu alana ait tüm teknik arıza kayıtları ve maliyet dağılımları.</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {(areaStartDate || areaEndDate) && (
                    <div className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-4xs font-bold">
                      Filtrelenen Tutar: <strong className="ml-0.5">₺ {filteredAreaTotalCost.toLocaleString('tr-TR')}</strong>
                    </div>
                  )}
                  <div className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-4xs font-bold">
                    Toplam Harcanan: <strong className="ml-0.5">₺ {activeAreaTotalCost.toLocaleString('tr-TR')}</strong>
                  </div>
                  <div className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-4xs font-bold">
                    {activeAreaIssues.length} Toplam Kayıt
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-150">
                
                {/* Left Column: Technical Operations History */}
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-4 h-4 text-emerald-700" />
                      1. Teknik İşlem Geçmişi (Arıza Kayıtları)
                    </h4>
                    <span className="text-3xs text-gray-400 font-semibold">{activeAreaIssues.length} Kayıt Listeleniyor</span>
                  </div>

                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                    {activeAreaIssues.length === 0 ? (
                      <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <Wrench className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-3xs text-gray-400 font-medium italic">Bu alana ait henüz bir arıza kaydı oluşturulmamıştır.</p>
                      </div>
                    ) : (
                      activeAreaIssues.map((issue) => {
                        const isResolved = issue.status === 'Çözüldü' || issue.status === 'Kapatıldı';
                        const prioColors = 
                          issue.priority === 'Kritik' ? 'bg-red-50 text-red-700 border-red-100' :
                          issue.priority === 'Yüksek' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                          issue.priority === 'Orta' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                          'bg-gray-50 text-gray-700 border-gray-100';

                        return (
                          <div 
                            key={issue.id}
                            className="p-3 border border-gray-150 rounded-xl hover:bg-gray-50/50 transition flex flex-col justify-between gap-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[9px] text-gray-400 font-extrabold">{issue.id}</span>
                                  <span className="text-4xs text-gray-400 font-medium">({new Date(issue.dateTime).toLocaleDateString('tr-TR')})</span>
                                </div>
                                <span className="text-xs font-bold text-gray-800 block mt-0.5">{issue.description}</span>
                                <span className="text-3xs text-gray-500 block mt-0.5">
                                  <strong className="text-gray-600 font-semibold">Konum:</strong> {issue.location} &bull; <strong className="text-gray-600 font-semibold">Bildiren:</strong> {issue.reporter}
                                </span>
                              </div>
                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <span className={`px-1.5 py-0.5 border text-[8px] font-extrabold rounded uppercase tracking-wide ${prioColors}`}>
                                  {issue.priority}
                                </span>
                                <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded-md ${
                                  isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {issue.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-100">
                              <span className="text-4xs text-gray-400 font-semibold">Atanan: {issue.assignedTo}</span>
                              <button
                                onClick={() => setSelectedIssueId(issue.id)}
                                className="text-[9px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 transition cursor-pointer"
                              >
                                <span>Detay &amp; Loglar</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column: Cost and Operations spent details */}
                <div className="p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-700" />
                      2. Yapılan Masraf &amp; Harcanan Malzeme Geçmişi
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAreaPdfModalOpen(true)}
                      className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-3xs font-black transition flex items-center gap-1.5 shadow-3xs cursor-pointer active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PDF Olarak Aktar</span>
                    </button>
                  </div>

                  {/* Date range filter picker */}
                  <div className="p-3 bg-gray-50/80 border border-gray-200/60 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                        <Filter className="w-3 h-3 text-emerald-700" />
                        Tarih Bazlı Filtreleme
                      </span>
                      {(areaStartDate || areaEndDate) && (
                        <button
                          type="button"
                          onClick={() => {
                            setAreaStartDate('');
                            setAreaEndDate('');
                          }}
                          className="text-[9px] text-emerald-700 hover:underline font-bold cursor-pointer"
                        >
                          Temizle
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[8px] text-gray-400 font-bold block mb-0.5">Başlangıç Tarihi</span>
                        <div className="relative">
                          <Calendar className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
                          <input
                            type="date"
                            value={areaStartDate}
                            onChange={(e) => setAreaStartDate(e.target.value)}
                            className="w-full pl-7 pr-1 py-1 text-3xs border border-gray-200 rounded-lg text-gray-700 font-semibold focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-[8px] text-gray-400 font-bold block mb-0.5">Bitiş Tarihi</span>
                        <div className="relative">
                          <Calendar className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
                          <input
                            type="date"
                            value={areaEndDate}
                            onChange={(e) => setAreaEndDate(e.target.value)}
                            className="w-full pl-7 pr-1 py-1 text-3xs border border-gray-200 rounded-lg text-gray-700 font-semibold focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                    {filteredActiveAreaActionLogs.length === 0 ? (
                      <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <DollarSign className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-3xs text-gray-400 font-medium italic">Belirtilen kriterlerde masraf kaydı bulunmamıştır.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200 bg-gray-50/50">
                                <th className="p-2 text-3xs font-extrabold text-gray-400 uppercase tracking-wider">Tarih</th>
                                <th className="p-2 text-3xs font-extrabold text-gray-400 uppercase tracking-wider">Müdahale &amp; Detay</th>
                                <th className="p-2 text-3xs font-extrabold text-gray-400 uppercase tracking-wider">Değişen Malzeme</th>
                                <th className="p-2 text-3xs font-extrabold text-gray-400 uppercase tracking-wider text-right">Tutar</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {filteredActiveAreaActionLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50/30 transition text-[11px]">
                                  <td className="p-2 text-gray-400 font-semibold font-mono whitespace-nowrap text-3xs text-[10px]">
                                    {new Date(log.date).toLocaleDateString('tr-TR')}
                                  </td>
                                  <td className="p-2">
                                    <span className="font-bold text-gray-800 block text-xs">{log.action}</span>
                                    <span className="text-[10px] text-gray-400 italic block">{log.notes || 'Not eklenmemiş.'}</span>
                                    <span className="text-[9px] text-emerald-800 font-semibold block mt-0.5">Usta/Yetkili: {log.creator}</span>
                                  </td>
                                  <td className="p-2 text-gray-500 font-medium text-3xs text-[10px]">
                                    {log.partsReplaced || <span className="text-gray-300 italic">-</span>}
                                  </td>
                                  <td className="p-2 text-right font-extrabold text-gray-800 text-3xs text-[10px] whitespace-nowrap">
                                    {log.cost && log.cost > 0 ? `₺ ${log.cost.toLocaleString('tr-TR')}` : '₺ 0'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Cumulative Spent Block */}
                        <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl mt-4 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-[9px] font-extrabold text-emerald-900 uppercase block tracking-wider font-sans">
                              {areaStartDate || areaEndDate ? 'Filtrelenmiş Toplam Harcama' : 'Kümülatif Toplam Harcama'}
                            </span>
                            <span className="text-4xs text-gray-500 block mt-0.5">{filteredActiveAreaActionLogs.length} Adet masraf kalemi dahil edilmiştir.</span>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-emerald-800 font-sans">
                              ₺ {filteredAreaTotalCost.toLocaleString('tr-TR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}
        </div>
      )}
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------
          DETAYLI MÜDAHALE & ARIZA LOGI MODAL
          --------------------------------------------------------- */}
      {selectedIssueId && (() => {
        const selectedIssue = issues.find(i => i.id === selectedIssueId);
        if (!selectedIssue) return null;
        
        const breached = isSlaBreached(selectedIssue);
        const canAddLogs = activeRole === 'Eğitmen' || activeRole === 'Kamp Koordinatörü' || activeRole === 'Kamp Müdürü';
        const canModifyPrio = activeRole === 'Kamp Koordinatörü' || activeRole === 'Kamp Müdürü';
        const canClose = activeRole === 'Kamp Müdürü';

        return (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl border border-neutral-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-5 sm:p-6 space-y-5">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-3 border-gray-150">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-neutral-800 text-sm">
                      {selectedIssue.id}
                    </span>
                    <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-full ${getPriorityBadge(selectedIssue.priority)}`}>
                      {selectedIssue.priority}
                    </span>
                    <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-full ${getStatusBadge(selectedIssue.status)}`}>
                      {selectedIssue.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs mt-1">
                    {selectedIssue.location} - {selectedIssue.category}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedIssueId(null)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Details and Actions Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-150 space-y-2">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Sorun Tanımı &amp; Açıklama</span>
                    <p className="text-xs text-gray-800 font-bold leading-relaxed whitespace-pre-wrap">{selectedIssue.description}</p>
                    <div className="flex gap-4 pt-2 text-[10px] text-gray-400 font-medium border-t border-gray-200">
                      <div><strong>Bildiren:</strong> {selectedIssue.reporter}</div>
                      <div><strong>Tarih:</strong> {selectedIssue.dateTime.replace('T', ' ')}</div>
                    </div>
                  </div>

                  {/* Photo Section */}
                  <div className="p-3 border border-gray-150 rounded-xl space-y-2 bg-gray-50/20">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase block">
                      Ekli Fotoğraflar / Dosyalar ({selectedIssue.photoUrls?.length || (selectedIssue.photoUrl ? 1 : 0)})
                    </span>
                    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border border-dashed border-gray-300 relative overflow-hidden">
                      {activePhotoInModal ? (
                        <img 
                          src={activePhotoInModal} 
                          alt="Arıza Resmi" 
                          className="w-full h-full object-contain bg-neutral-950" 
                        />
                      ) : (
                        <div className="text-center p-3 text-[10px] text-gray-400">
                          <span className="block text-lg">📷</span>
                          <span>Dosya Eklenmedi (Heuristic PDF Raporu Hazır)</span>
                        </div>
                      )}
                    </div>

                    {/* Thumbnails row */}
                    {selectedIssue.photoUrls && selectedIssue.photoUrls.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-gray-300">
                        {selectedIssue.photoUrls.map((photo, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setActivePhotoInModal(photo)}
                            className={`w-12 h-12 rounded border-2 shrink-0 overflow-hidden transition-all ${
                              activePhotoInModal === photo 
                                ? 'border-emerald-600 scale-95 shadow-xs' 
                                : 'border-gray-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={photo} alt={`Küçük Resim ${pIdx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SLA Countdown widget */}
                  <div className={`p-3 rounded-xl border ${
                    breached ? 'bg-red-50/60 border-red-200 text-red-800' : 'bg-emerald-50/40 border-emerald-150 text-emerald-800'
                  } flex justify-between items-center`}>
                    <div className="text-3xs font-bold uppercase tracking-wider">
                      <span>SLA Çözüm Hedefi: </span>
                      <strong className="block text-xs mt-0.5">{SLA_TARGET_HOURS[selectedIssue.priority]} Saat</strong>
                    </div>
                    <div className="text-right font-mono font-extrabold text-xs">
                      {getRemainingSlaText(selectedIssue)}
                    </div>
                  </div>

                  {/* State Actions Buttons */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase block">Durum Güncelle (Test)</span>
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
                      <button
                        onClick={() => handleUpdateStatus(selectedIssue.id, 'İnceleniyor')}
                        className="py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 transition cursor-pointer"
                      >
                        İncelemeye Al
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedIssue.id, 'İşleme Alındı')}
                        className="py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition cursor-pointer"
                      >
                        İşleme Al (Müdahale)
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedIssue.id, 'Çözüldü')}
                        className="py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition cursor-pointer"
                      >
                        Çözüldü İşaretle
                      </button>
                      {canClose ? (
                        <button
                          onClick={() => handleUpdateStatus(selectedIssue.id, 'Kapatıldı')}
                          className="py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-lg transition cursor-pointer"
                        >
                          Arızayı Kapat (Yönetici)
                        </button>
                      ) : (
                        <div className="py-1.5 bg-gray-50 border text-gray-400 rounded-lg text-center select-none" title="Yalnızca Kamp Müdürü kapatabilir.">
                          🔒 Kapatma Yetkisi Yok
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Timeline History & Action Logging Column */}
                <div className="space-y-4">
                  
                  {/* Action Logs History */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase block">Yapılan Teknik Müdahaleler ({selectedIssue.actionLogs.length})</span>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {selectedIssue.actionLogs.length === 0 ? (
                        <p className="text-3xs text-gray-400 italic">Henüz müdahale yapılmamış.</p>
                      ) : (
                        selectedIssue.actionLogs.map((log) => (
                          <div key={log.id} className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
                            <div className="flex justify-between text-3xs font-extrabold">
                              <span className="text-emerald-800">{log.action}</span>
                              <span className="text-gray-400 font-mono">{log.date.replace('T', ' ')}</span>
                            </div>
                            <p className="text-gray-600 font-medium">{log.notes}</p>
                            {log.partsReplaced && (
                              <div className="text-[10px] text-gray-500">
                                🔧 <strong>Değişen Parça:</strong> {log.partsReplaced}
                              </div>
                            )}
                            {log.cost !== undefined && (
                              <div className="text-[10px] text-gray-700 font-extrabold flex items-center gap-0.5">
                                <DollarSign className="w-3 h-3 text-emerald-700" />
                                <span>Gider: {log.cost} ₺</span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add action log form */}
                  {canAddLogs ? (
                    <form onSubmit={(e) => handleAddActionLog(e, selectedIssue.id)} className="p-3 border border-gray-150 rounded-xl space-y-2 bg-emerald-50/10">
                      <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Yeni Teknik Müdahale Ekle</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Yapılan İşlem *"
                          value={actionTitle}
                          onChange={(e) => setActionTitle(e.target.value)}
                          className="w-full p-1.5 border border-gray-200 rounded text-3xs bg-white focus:outline-emerald-600"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Değişen Parça (Varsa)"
                          value={partsReplaced}
                          onChange={(e) => setPartsReplaced(e.target.value)}
                          className="w-full p-1.5 border border-gray-200 rounded text-3xs bg-white focus:outline-emerald-600"
                        />
                      </div>
                      <textarea
                        placeholder="Teknik notlar ve detaylar... *"
                        value={actionNotes}
                        onChange={(e) => setActionNotes(e.target.value)}
                        className="w-full p-1.5 border border-gray-200 rounded text-3xs bg-white focus:outline-emerald-600 h-12"
                        required
                      ></textarea>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Maliyet Bilgisi (₺)"
                          value={actionCost}
                          onChange={(e) => setActionCost(e.target.value)}
                          className="w-full p-1.5 border border-gray-200 rounded text-3xs bg-white focus:outline-emerald-600"
                        />
                        <button
                          type="submit"
                          className="w-full bg-emerald-750 text-white font-extrabold text-3xs py-1.5 rounded transition cursor-pointer"
                        >
                          Kaydet &amp; Logla
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-250 rounded-xl text-center text-3xs text-gray-400">
                      🔒 Teknik Müdahale Ekleme Yetkiniz Yok. (Teknik Ekip / Yönetici Yetkisi Gerekir)
                    </div>
                  )}

                  {/* Departman Sorumlusu Controls */}
                  {canModifyPrio && (
                    <div className="p-3 border border-gray-150 rounded-xl space-y-2">
                      <span className="text-[10px] font-extrabold text-gray-500 uppercase block">Departman Yetkili Alanı</span>
                      <div className="flex gap-2">
                        <select
                          value={adjustedPriority}
                          onChange={(e) => setAdjustedPriority(e.target.value as any)}
                          className="p-1 border border-gray-200 rounded text-3xs bg-white focus:outline-emerald-600"
                        >
                          <option value="Düşük">Düşük Öncelik</option>
                          <option value="Orta">Orta Öncelik</option>
                          <option value="Yüksek">Yüksek Öncelik</option>
                          <option value="Kritik">Kritik Öncelik</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Departman ek açıklaması..."
                          value={deptNote}
                          onChange={(e) => setDeptNote(e.target.value)}
                          className="flex-1 p-1 border border-gray-200 rounded text-3xs bg-white focus:outline-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeptModifyIssue(selectedIssue.id)}
                          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 font-extrabold text-3xs px-2 py-1 rounded transition cursor-pointer"
                        >
                          Uygula
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Change Timeline Logs */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase block">Statü Zaman Damgası Geçmişi</span>
                    <div className="space-y-1">
                      {selectedIssue.statusHistory.map((sh, sIdx) => (
                        <div key={sIdx} className="text-4xs text-gray-400 flex justify-between border-b pb-0.5 font-medium">
                          <span>• {sh.status} ({sh.updatedBy})</span>
                          <span>{sh.timestamp.replace('T', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ---------------------------------------------------------
          NEW TECHNICAL ISSUE DIALOG MODAL
         --------------------------------------------------------- */}
      {isNewIssueModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-neutral-200 max-w-md w-full shadow-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-2 border-gray-150">
              <h3 className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-700" />
                Teknik Arıza / Aksaklık Bildirimi
              </h3>
              <button
                onClick={closeNewIssueModal}
                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="space-y-3 text-xs">
              <div>
                <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">Bildiren Personel *</label>
                <input
                  type="text"
                  required
                  placeholder="örn. Emre Şen (Grup Lideri)"
                  value={issueReporter}
                  onChange={(e) => setIssueReporter(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">Arıza Lokasyonu *</label>
                  <input
                    type="text"
                    required
                    placeholder="örn. Bungalov STD-14"
                    value={issueLocation}
                    onChange={(e) => setIssueLocation(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">Kategori *</label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value as any)}
                    className="w-full p-2 border border-gray-200 rounded bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Elektrik">Elektrik</option>
                    <option value="Su / Tesisat">Su / Tesisat</option>
                    <option value="İnternet / IT">İnternet / IT</option>
                    <option value="Mobilya / Donanım">Mobilya / Donanım</option>
                    <option value="Güvenlik">Güvenlik</option>
                    <option value="Temizlik">Temizlik</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">Öncelik Seviyesi *</label>
                  <select
                    value={issuePriority}
                    onChange={(e) => setIssuePriority(e.target.value as any)}
                    className="w-full p-2 border border-gray-200 bg-white rounded focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Düşük">Düşük</option>
                    <option value="Orta">Orta</option>
                    <option value="Yüksek">Yüksek</option>
                    <option value="Kritik">Kritik (2sa SLA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">Atanan Departman</label>
                  <input
                    type="text"
                    placeholder="örn. Teknik Departman (Murat Usta)"
                    value={issueAssignedTo}
                    onChange={(e) => setIssueAssignedTo(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">Arıza Açıklaması *</label>
                <textarea
                  required
                  placeholder="Lütfen arızanın sebebini ve detaylarını açıklayınız..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white h-20"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-0.5">Arıza Fotoğrafları (Maksimum Destek)</label>
                
                {/* Selected photos preview strip */}
                {attachedPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 max-h-24 overflow-y-auto">
                    {attachedPhotos.map((photo, idx) => (
                      <div key={idx} className="relative group aspect-square rounded overflow-hidden border border-gray-300">
                        <img src={photo} alt={`Önizleme ${idx+1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAttachedPhotos(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition shadow-xs cursor-pointer"
                          title="Fotoğrafı Sil"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Video Stream for live camera */}
                {isCameraActive && (
                  <div className="relative border border-emerald-500 rounded-xl overflow-hidden bg-neutral-900 flex flex-col items-center">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full max-h-52 object-cover bg-black"
                    />
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 px-3">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-4xs px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Kareyi Yakala</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="bg-gray-800/85 hover:bg-gray-900/85 text-white font-extrabold text-4xs px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Kapat</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Trigger Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCameraActive) {
                        stopCamera();
                      } else {
                        startCamera();
                      }
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 border rounded-xl text-4xs font-extrabold transition-all cursor-pointer ${
                      isCameraActive 
                        ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
                        : 'bg-emerald-50 border-emerald-150 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isCameraActive ? 'Kamerayı Kapat' : 'Kameradan Çek'}</span>
                  </button>

                  <label className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-4xs font-extrabold transition-all cursor-pointer">
                    <PlusCircle className="w-3.5 h-3.5 text-gray-500" />
                    <span>Galeriden Yükle</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-150">
                <button
                  type="button"
                  onClick={closeNewIssueModal}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-lg cursor-pointer"
                >
                  Bildirimi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------
          NEW SUPPLY REQUEST DIALOG MODAL
         --------------------------------------------------------- */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-neutral-200 max-w-md w-full shadow-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-2 border-gray-150">
              <h3 className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-emerald-700" />
                Eksik / Malzeme Tedarik Talebi
              </h3>
              <button
                onClick={() => setIsNewRequestModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div>
                <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">Talep Başlığı / Malzeme Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="örn. Voleybol Topu ve Ağ Seti"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">Departman *</label>
                  <select
                    value={reqDepartment}
                    onChange={(e) => setReqDepartment(e.target.value)}
                    className="w-full p-2 border border-gray-200 bg-white rounded focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Eğitim / Aktivite">Eğitim / Aktivite</option>
                    <option value="Sağlık / Revir">Sağlık / Revir</option>
                    <option value="Teknik / Tesisat">Teknik / Tesisat</option>
                    <option value="Yemekhane / Mutfak">Yemekhane / Mutfak</option>
                    <option value="Güvenlik">Güvenlik</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">Talep Edilen Miktar / Adet *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={reqQuantity}
                    onChange={(e) => setReqQuantity(Number(e.target.value))}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">İstenen Termin Tarihi *</label>
                  <input
                    type="date"
                    required
                    value={reqNeededDate}
                    onChange={(e) => setReqNeededDate(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">Öncelik *</label>
                  <select
                    value={reqPriority}
                    onChange={(e) => setReqPriority(e.target.value as any)}
                    className="w-full p-2 border border-gray-200 bg-white rounded focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Düşük">Düşük</option>
                    <option value="Orta">Orta</option>
                    <option value="Yüksek">Yüksek</option>
                    <option value="Kritik">Kritik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold text-gray-500 uppercase mb-1">Talep Nedeni / Detay Açıklaması *</label>
                <textarea
                  required
                  placeholder="Malzemenin aciliyet gerekçesini ve teknik özelliklerini belirtiniz..."
                  value={reqDetails}
                  onChange={(e) => setReqDetails(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white h-24"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-lg cursor-pointer"
                >
                  Talebi Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------
          RESMİ RAPOR & DÖKÜM MODAL (PRINT FRIENDLY)
         --------------------------------------------------------- */}
      {isReportModalOpen && (() => {
        // Find center name
        const campCenterName = selectedCenterId === 'C01' ? 'Yaylagöl Yeşilay Gençlik Kampı' : 'Riva Yeşilay Gençlik Kampı';
        
        const AREAS_CONFIG = [
          { key: 'bungalov', label: 'Bungalovlar' },
          { key: 'gol', label: 'Göl ve Çevresi' },
          { key: 'spor', label: 'Spor Tesisleri' },
          { key: 'yemekhane', label: 'Yemekhane & Mutfak' },
          { key: 'konferans', label: 'Konferans Salonu' },
          { key: 'diger', label: 'Diğer Ortak Alanlar' }
        ];

        // Filter issues based on date range and reportSelectedAreas
        const filteredReportIssues = issues.filter(issue => {
          if (issue.campCenterId !== selectedCenterId) return false;
          
          // Check date range
          const issueDate = issue.dateTime.substring(0, 10); // YYYY-MM-DD
          if (issueDate < reportStartDate || issueDate > reportEndDate) return false;
          
          // Determine issue's area key
          let issueAreaKey = 'diger';
          const loc = issue.location.toLowerCase();
          const isBungalov = loc.includes('bungalov') || loc.includes('std-') || loc.includes('ldr-') || loc.includes('kulübe') || loc.includes('oda');
          const isGol = loc.includes('göl') || loc.includes('gölet') || loc.includes('iskele') || loc.includes('lake');
          const isSpor = loc.includes('spor') || loc.includes('saha') || loc.includes('futbol') || loc.includes('basketbol') || loc.includes('pota');
          const isYemekhane = loc.includes('yemekhane') || loc.includes('mutfak') || loc.includes('sebil');
          const isKonferans = loc.includes('konferans') || loc.includes('salon');
          
          if (isBungalov) issueAreaKey = 'bungalov';
          else if (isGol) issueAreaKey = 'gol';
          else if (isSpor) issueAreaKey = 'spor';
          else if (isYemekhane) issueAreaKey = 'yemekhane';
          else if (isKonferans) issueAreaKey = 'konferans';
          
          return reportSelectedAreas.includes(issueAreaKey);
        });

        // Calculate total cost for report
        const reportTotalCost = filteredReportIssues.reduce((sum, issue) => {
          const issueSum = issue.actionLogs?.reduce((logSum, log) => logSum + (log.cost || 0), 0) || 0;
          return sum + issueSum;
        }, 0);

        const reportActiveCount = filteredReportIssues.filter(i => i.status !== 'Çözüldü' && i.status !== 'Kapatıldı').length;
        const reportResolvedCount = filteredReportIssues.filter(i => i.status === 'Çözüldü' || i.status === 'Kapatıldı').length;

        const handlePrint = () => {
          window.print();
        };

        const handleDownloadCSV = () => {
          let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
          csvContent += "Tarih;Kayıt No;Konum;Kategori;Sorun Açıklaması;Yapılan İşlem;Kullanılan Malzeme;Usta/Yetkili;Maliyet;Durum\r\n";
          
          filteredReportIssues.forEach(i => {
            const dateStr = new Date(i.dateTime).toLocaleDateString('tr-TR');
            const actionStr = i.actionLogs && i.actionLogs.length > 0 ? i.actionLogs.map(l => l.action).join(" | ") : "-";
            const partsStr = i.actionLogs && i.actionLogs.length > 0 ? i.actionLogs.map(l => l.partsReplaced).join(" | ") : "-";
            const creatorStr = i.actionLogs && i.actionLogs.length > 0 ? i.actionLogs.map(l => l.creator).join(" | ") : "-";
            const costSum = i.actionLogs && i.actionLogs.length > 0 ? i.actionLogs.reduce((acc, cur) => acc + (cur.cost || 0), 0) : 0;
            
            csvContent += `"${dateStr}";"${i.id}";"${i.location}";"${i.category}";"${i.description.replace(/"/g, '""')}";"${actionStr.replace(/"/g, '""')}";"${partsStr.replace(/"/g, '""')}";"${creatorStr.replace(/"/g, '""')}";"₺ ${costSum}";"${i.status}"\r\n`;
          });

          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `Teknik_Masraf_Raporu_${reportStartDate}_${reportEndDate}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto print:p-0 print:bg-white print:absolute print:inset-0">
            <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:border-0" id="report-document-modal">
              
              {/* Header - Hidden on Print */}
              <div className="p-4 bg-gray-50 border-b border-gray-150 flex items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-emerald-700" />
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Resmi Rapor ve Teknik Döküm Önizlemesi</h3>
                    <p className="text-[10px] text-gray-400">Belgenizi yazdırabilir veya Excel formatında (CSV) indirebilirsiniz.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadCSV}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-3xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV / Excel İndir</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-3xs font-bold transition flex items-center gap-1.5 shadow-3xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Yazdır (PDF Kaydet)</span>
                  </button>
                  <button
                    onClick={() => setIsReportModalOpen(false)}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rapor Belgesi - Printable Area */}
              <div className="p-8 overflow-y-auto flex-1 space-y-6 print:overflow-visible print:p-0" id="printable-report-document">
                
                {/* Official Header */}
                <div className="border-b-2 border-emerald-800 pb-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-3xs">
                      <svg viewBox="0 0 100 100" className="w-8 h-8">
                        <path d="M52,15 A35,35 0 1,0 85,68 A28,28 0 1,1 85,32 A35,35 0 0,0 52,15 Z" fill="#00AB41" />
                      </svg>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase block leading-none">T.C. YEŞİLAY CEMİYETİ</span>
                      <h2 className="text-sm font-black text-gray-800 mt-0.5">{campCenterName.toUpperCase()}</h2>
                      <span className="text-[9px] font-bold text-gray-500 uppercase block tracking-wider mt-0.5">
                        Yeşilay Uluslararası Kamp Merkezi
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-black text-[9px] uppercase tracking-wider block">
                      RESMİ RAPOR BELGESİ
                    </span>
                    <span className="text-[10px] text-gray-500 block"><strong>Döküm No:</strong> KYS-TR-{new Date().getFullYear()}-{Math.floor(Math.random() * 9000 + 1000)}</span>
                    <span className="text-[10px] text-gray-500 block"><strong>Tarih:</strong> {new Date().toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center space-y-1.5">
                  <h1 className="text-base font-black text-gray-900 tracking-wide uppercase">
                    TEKNİK OPERASYONLAR VE BAKIM-ONARIM MASRAFLARI DÖKÜM RAPORU
                  </h1>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Seçilen Tarih Aralığı: <strong className="text-gray-700">{new Date(reportStartDate).toLocaleDateString('tr-TR')}</strong> ile <strong className="text-gray-700">{new Date(reportEndDate).toLocaleDateString('tr-TR')}</strong> arası teknik işlemler.
                  </p>
                </div>

                {/* Selected Categories Indicator */}
                <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex flex-wrap gap-2 items-center">
                  <span className="text-4xs font-black text-gray-400 uppercase tracking-widest">Dahil Edilen Alanlar:</span>
                  {reportSelectedAreas.map(key => {
                    const label = AREAS_CONFIG.find(c => c.key === key)?.label || key;
                    return (
                      <span key={key} className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[9px] font-bold text-gray-700">
                        {label}
                      </span>
                    );
                  })}
                </div>

                {/* KPI stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 border border-gray-150 rounded-xl text-center bg-gray-50/40">
                    <span className="text-4xs font-bold text-gray-400 uppercase tracking-wider block">Toplam Kayıt Sayısı</span>
                    <span className="text-lg font-black text-gray-800">{filteredReportIssues.length} Adet</span>
                  </div>
                  <div className="p-3 border border-gray-150 rounded-xl text-center bg-emerald-50/20 border-emerald-100">
                    <span className="text-4xs font-bold text-emerald-800 uppercase tracking-wider block">Tamamlanan / Çözülen</span>
                    <span className="text-lg font-black text-emerald-700">{reportResolvedCount} Adet</span>
                  </div>
                  <div className="p-3 border border-gray-150 rounded-xl text-center bg-amber-50/20 border-amber-100">
                    <span className="text-4xs font-bold text-amber-800 uppercase tracking-wider block">Aktif / İşlemde</span>
                    <span className="text-lg font-black text-amber-700">{reportActiveCount} Adet</span>
                  </div>
                  <div className="p-3 border border-gray-150 rounded-xl text-center bg-gray-900 text-white">
                    <span className="text-4xs font-bold text-gray-300 uppercase tracking-wider block">Toplam Tutar</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">₺ {reportTotalCost.toLocaleString('tr-TR')}</span>
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-200">
                    <ClipboardList className="w-4.5 h-4.5 text-emerald-700" />
                    Kategori Bazlı Detaylı İşlem ve Masraf Listesi
                  </h3>

                  {filteredReportIssues.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-gray-200 rounded-xl">
                      <p className="text-xs text-gray-400 font-bold italic">Belirtilen tarih aralığı ve kategorilerde kayıtlı işlem bulunamamıştır.</p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-100/80 border-b border-gray-200 text-4xs uppercase text-gray-500 font-extrabold">
                            <th className="p-2 w-20 text-[9px]">Tarih</th>
                            <th className="p-2 w-24 text-[9px]">Kayıt No</th>
                            <th className="p-2 w-36 text-[9px]">Konum / Alan</th>
                            <th className="p-2 text-[9px]">Sorun Açıklaması</th>
                            <th className="p-2 text-[9px]">Uygulanan Müdahale &amp; Malzeme</th>
                            <th className="p-2 w-24 text-right text-[9px]">Maliyet</th>
                            <th className="p-2 w-20 text-center text-[9px]">Durum</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-[10px] text-gray-700">
                          {filteredReportIssues.map((issue) => {
                            const isResolved = issue.status === 'Çözüldü' || issue.status === 'Kapatıldı';
                            const logs = issue.actionLogs || [];
                            const costSum = logs.reduce((sum, log) => sum + (log.cost || 0), 0);
                            
                            return (
                              <tr key={issue.id} className="hover:bg-gray-50/50">
                                <td className="p-2 font-semibold font-mono whitespace-nowrap">
                                  {new Date(issue.dateTime).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="p-2 font-mono font-bold text-gray-400">
                                  {issue.id}
                                </td>
                                <td className="p-2 font-bold text-gray-800">
                                  {issue.location}
                                </td>
                                <td className="p-2 leading-relaxed text-gray-600 font-medium">
                                  {issue.description}
                                </td>
                                <td className="p-2 text-gray-500 leading-relaxed font-semibold">
                                  {logs.length > 0 ? (
                                    <div className="space-y-1">
                                      {logs.map(log => (
                                        <div key={log.id} className="border-l-2 border-emerald-500 pl-1.5">
                                          <span className="text-gray-800 block text-[9px] font-bold">{log.action}</span>
                                          {log.partsReplaced && <span className="text-[9px] text-gray-400 font-medium italic block">Malzeme: {log.partsReplaced}</span>}
                                          {log.notes && <span className="text-[8px] text-gray-400 block">{log.notes}</span>}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-300 italic">Müdahale logu bulunmuyor.</span>
                                  )}
                                </td>
                                <td className="p-2 text-right font-black text-gray-800 font-mono whitespace-nowrap">
                                  {costSum > 0 ? `₺ ${costSum.toLocaleString('tr-TR')}` : '₺ 0'}
                                </td>
                                <td className="p-2 text-center whitespace-nowrap">
                                  <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                                    isResolved ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}>
                                    {issue.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Official Declarations and Signatures */}
                <div className="pt-8 border-t border-gray-200 space-y-6">
                  <p className="text-[9px] text-gray-400 leading-relaxed text-justify">
                    Yukarıda listelenen teknik arızalar, bakım-onarım faaliyetleri ve bu faaliyetler kapsamında gerçekleştirilen parça değişimleri / maliyet kalemleri Kamp Yönetim Sistemi (KYS) veri tabanından aslına uygun olarak çekilmiş ve raporlaştırılmıştır. İşbu döküm belgesi, Yeşilay Gençlik Kampları koordinasyon standartlarına uygun olarak hazırlanmış olup, bütçe takibi ve operasyonel denetimlerde kullanılmak üzere resmi evrak niteliği taşımaktadır.
                  </p>

                  <div className="grid grid-cols-3 gap-6 text-center pt-4">
                    <div className="space-y-12">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Müşahit / Teknik Sorumlu</span>
                      <div className="space-y-0.5">
                        <strong className="text-[11px] text-gray-800 block">Ahmet Usta / Murat Usta</strong>
                        <span className="text-[9px] text-gray-400 font-bold block">Teknik Hizmetler Birimi</span>
                      </div>
                    </div>
                    <div className="space-y-12">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Kontrol Eden / Koordinatör</span>
                      <div className="space-y-0.5">
                        <strong className="text-[11px] text-gray-800 block">Canan Özdemir</strong>
                        <span className="text-[9px] text-gray-400 font-bold block">Kamp Koordinatörü</span>
                      </div>
                    </div>
                    <div className="space-y-12">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Tasdik Eden / Kamp Müdürü</span>
                      <div className="space-y-0.5">
                        <strong className="text-[11px] text-gray-800 block">Bülent Kaya</strong>
                        <span className="text-[9px] text-gray-400 font-bold block">Yaylagöl Kamp Müdürü</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* ---------------------------------------------------------
          ALAN BAZLI RESMİ RAPOR & MASRAF DÖKÜM MODAL (PRINT FRIENDLY)
         --------------------------------------------------------- */}
      {isAreaPdfModalOpen && (() => {
        // Find center name
        const campCenterName = selectedCenterId === 'C01' ? 'Yaylagöl Yeşilay Gençlik Kampı' : 'Riva Yeşilay Gençlik Kampı';
        
        const activeAreaConfig = [
          { key: 'bungalov', label: 'Bungalovlar' },
          { key: 'gol', label: 'Göl ve Çevresi' },
          { key: 'spor', label: 'Spor Tesisleri' },
          { key: 'yemekhane', label: 'Yemekhane & Mutfak' },
          { key: 'konferans', label: 'Konferans Salonu' },
          { key: 'diger', label: 'Diğer Ortak Alanlar' }
        ].find(c => c.key === selectedArea) || { key: 'bungalov', label: 'Bungalovlar' };

        const activeAreaIssues = getIssuesForArea(selectedArea);

        // Flatten action logs for the active area to show the masraf list
        const activeAreaActionLogs = activeAreaIssues.flatMap(issue => 
          (issue.actionLogs || []).map(log => ({
            ...log,
            issueId: issue.id,
            location: issue.location,
            category: issue.category
          }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Filter based on selected date range for the active area
        const filteredActiveAreaActionLogs = activeAreaActionLogs.filter(log => {
          if (areaStartDate && log.date < areaStartDate) return false;
          if (areaEndDate && log.date > areaEndDate) return false;
          return true;
        });

        const activeAreaTotalCost = filteredActiveAreaActionLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

        const handlePrint = () => {
          window.print();
        };

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto print:p-0 print:bg-white print:absolute print:inset-0">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:border-0" id="area-pdf-modal">
              {/* Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-150 flex items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-emerald-700" />
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Alan Bazlı İşlem ve Masraf Dökümü</h3>
                    <p className="text-[10px] text-gray-400">Seçili alanın işlem masraflarını yazdırabilir veya PDF olarak kaydedebilirsiniz.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-3xs font-bold transition flex items-center gap-1.5 shadow-3xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Yazdır (PDF Kaydet)</span>
                  </button>
                  <button
                    onClick={() => setIsAreaPdfModalOpen(false)}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="p-8 overflow-y-auto flex-1 space-y-6 print:overflow-visible print:p-0" id="printable-area-document">
                
                {/* Official Header */}
                <div className="border-b-2 border-emerald-800 pb-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-3xs">
                      <svg viewBox="0 0 100 100" className="w-8 h-8">
                        <path d="M52,15 A35,35 0 1,0 85,68 A28,28 0 1,1 85,32 A35,35 0 0,0 52,15 Z" fill="#00AB41" />
                      </svg>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase block leading-none">T.C. YEŞİLAY CEMİYETİ</span>
                      <h2 className="text-sm font-black text-gray-800 mt-0.5">{campCenterName.toUpperCase()}</h2>
                      <span className="text-[9px] font-bold text-gray-500 uppercase block tracking-wider mt-0.5">
                        Yeşilay Uluslararası Kamp Merkezi
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-black text-[9px] uppercase tracking-wider block">
                      ALAN MASRAF DÖKÜMÜ
                    </span>
                    <span className="text-[10px] text-gray-500 block"><strong>Tesis Alanı:</strong> {activeAreaConfig.label}</span>
                    <span className="text-[10px] text-gray-500 block"><strong>Tarih:</strong> {new Date().toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center space-y-1.5">
                  <h1 className="text-base font-black text-gray-900 tracking-wide uppercase">
                    {activeAreaConfig.label.toUpperCase()} TEKNİK MÜDAHALE VE MASRAF RAPORU
                  </h1>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {areaStartDate || areaEndDate ? (
                      <>
                        Filtrelenen Tarih Aralığı: <strong className="text-gray-700">{areaStartDate ? new Date(areaStartDate).toLocaleDateString('tr-TR') : 'Başlangıç Tanımsız'}</strong> ile <strong className="text-gray-700">{areaEndDate ? new Date(areaEndDate).toLocaleDateString('tr-TR') : 'Bitiş Tanımsız'}</strong> arası işlemler.
                      </>
                    ) : (
                      "Tüm kayıtlı geçmiş işlem masrafları dökümü."
                    )}
                  </p>
                </div>

                {/* KPI stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-gray-150 rounded-xl text-center bg-gray-50/40">
                    <span className="text-4xs font-bold text-gray-400 uppercase tracking-wider block">Toplam İşlem Sayısı</span>
                    <span className="text-lg font-black text-gray-800">{filteredActiveAreaActionLogs.length} Adet</span>
                  </div>
                  <div className="p-3 border border-gray-150 rounded-xl text-center bg-emerald-50/20 border-emerald-100">
                    <span className="text-4xs font-bold text-emerald-800 uppercase tracking-wider block">Toplam Masraf Tutarı</span>
                    <span className="text-lg font-black text-emerald-700 font-mono">₺ {activeAreaTotalCost.toLocaleString('tr-TR')}</span>
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-200">
                    <ClipboardList className="w-4.5 h-4.5 text-emerald-700" />
                    İşlem Masraf ve Malzeme Detay Listesi
                  </h3>

                  {filteredActiveAreaActionLogs.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-gray-200 rounded-xl">
                      <p className="text-xs text-gray-400 font-bold italic">Belirtilen kriterlerde kayıtlı masraf bulunamamıştır.</p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-100/80 border-b border-gray-200 text-4xs uppercase text-gray-500 font-extrabold">
                            <th className="p-2 w-24 text-[9px]">Tarih</th>
                            <th className="p-2 text-[9px]">Müdahale &amp; Detay</th>
                            <th className="p-2 text-[9px]">Konum / Alan</th>
                            <th className="p-2 text-[9px]">Değişen Parça / Malzeme</th>
                            <th className="p-2 text-[9px] text-right">Tutar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-[10px] font-semibold text-gray-700">
                          {filteredActiveAreaActionLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50/30 transition">
                              <td className="p-2 text-gray-400 font-mono whitespace-nowrap">
                                {new Date(log.date).toLocaleDateString('tr-TR')}
                              </td>
                              <td className="p-2">
                                <span className="font-bold text-gray-900 block">{log.action}</span>
                                <span className="text-[9px] text-gray-400 italic block">{log.notes || 'Not eklenmemiş.'}</span>
                                <span className="text-[8px] text-emerald-800 font-bold block">Yetkili: {log.creator}</span>
                              </td>
                              <td className="p-2 text-gray-600 font-medium">
                                {log.location}
                              </td>
                              <td className="p-2 text-gray-500 font-medium">
                                {log.partsReplaced || <span className="text-gray-300 italic">-</span>}
                              </td>
                              <td className="p-2 text-right font-bold text-gray-900 whitespace-nowrap">
                                {log.cost && log.cost > 0 ? `₺ ${log.cost.toLocaleString('tr-TR')}` : '₺ 0'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50 border-t border-gray-200 font-black text-gray-900">
                            <td className="p-2 text-[10px]" colSpan={4}>Kümülatif Toplam Harcanan Bütçe</td>
                            <td className="p-2 text-right text-[11px] text-emerald-800 font-extrabold whitespace-nowrap">
                              ₺ {activeAreaTotalCost.toLocaleString('tr-TR')}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                {/* Official Declarations and Signatures */}
                <div className="pt-8 border-t border-gray-200 space-y-6">
                  <p className="text-[9px] text-gray-400 leading-relaxed text-justify">
                    Yukarıda listelenen teknik müdahale kayıtları, malzeme sarfları ve maliyet detayları {activeAreaConfig.label} alanı için Yeşilay Gençlik Kampı Teknik Hizmetler veri tabanından aslına uygun olarak çekilmiştir. İşbu masraf döküm raporu Yeşilay Kamp Yönetim Sistemi (KYS) üzerinden üretilmiş olup, bütçe denetimleri ve onay süreçlerinde kullanılmak üzere resmi nitelikte bir belgedir.
                  </p>

                  <div className="grid grid-cols-3 gap-6 text-center pt-4">
                    <div className="space-y-12">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Hazırlayan / Teknisyen</span>
                      <div className="space-y-0.5">
                        <strong className="text-[11px] text-gray-800 block">Murat Usta</strong>
                        <span className="text-[9px] text-gray-400 font-bold block">Teknik Personel</span>
                      </div>
                    </div>
                    <div className="space-y-12">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Kontrol Eden / Koordinatör</span>
                      <div className="space-y-0.5">
                        <strong className="text-[11px] text-gray-800 block">Canan Özdemir</strong>
                        <span className="text-[9px] text-gray-400 font-bold block">Kamp Koordinatörü</span>
                      </div>
                    </div>
                    <div className="space-y-12">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Tasdik Eden / Kamp Müdürü</span>
                      <div className="space-y-0.5">
                        <strong className="text-[11px] text-gray-800 block">Bülent Kaya</strong>
                        <span className="text-[9px] text-gray-400 font-bold block">Yaylagöl Kamp Müdürü</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* Print Warning Modal for iframe */}
      {showPrintWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
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

    </div>
  );
}
