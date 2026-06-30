/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Participant, HealthIncident } from '../types';
import { 
  HeartHandshake, 
  AlertOctagon, 
  Plus, 
  Stethoscope, 
  ShieldAlert, 
  User, 
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { HelpTooltip } from './HelpTooltip';

interface HealthViewProps {
  participants: Participant[];
  healthIncidents: HealthIncident[];
  onAddHealthIncident: (incident: HealthIncident) => void;
  onAddLog: (action: string, details: string) => void;
}

export default function HealthView({
  participants,
  healthIncidents,
  onAddHealthIncident,
  onAddLog,
}: HealthViewProps) {
  const [selectedPatId, setSelectedPatId] = useState('');
  const [complaint, setComplaint] = useState('');
  const [treatment, setTreatment] = useState('');
  const [prescription, setPrescription] = useState('');
  const [status, setStatus] = useState<'Kontrol Altında' | 'Müşahade' | 'Sevk Edildi'>('Kontrol Altında');
  
  // Collapsible accordion states
  const [isAllergyTrackerOpen, setIsAllergyTrackerOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);

  const activeInCamp = participants.filter((p) => p.status === 'Kampta');

  // Filter out any participants who has severe allergies or chronic illnesses
  const hazardousParticipants = activeInCamp.filter(
    (p) => 
      (p.allergies && p.allergies.toLowerCase() !== 'yok' && p.allergies.toLowerCase() !== 'belirtilmedi' && p.allergies.toLowerCase() !== 'saptanamayan alerji yok') || 
      (p.chronicDiseases && p.chronicDiseases.toLowerCase() !== 'yok' && p.chronicDiseases.toLowerCase() !== 'belirtilmedi')
  );

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatId || !complaint || !treatment) {
      alert('Lütfen gönüllü, şikayet ve uygulanan tedavi alanlarını doldurunuz.');
      return;
    }

    const patient = participants.find((p) => p.id === selectedPatId);
    if (!patient) return;

    const newIncident: HealthIncident = {
      id: `H0${healthIncidents.length + 1}`,
      participantId: selectedPatId,
      staffId: 'S06', // Hemşire Elif Aslan
      dateTime: new Date().toISOString().slice(0, 19),
      complaint,
      treatment,
      prescription,
      status,
    };

    onAddHealthIncident(newIncident);
    onAddLog(
      'Sağlık Müdahalesi',
      `Revirde ${patient.name} için müdahale yapıldı. Şikayet: ${complaint}. Durum: ${status}`
    );

    // Clear form
    setSelectedPatId('');
    setComplaint('');
    setTreatment('');
    setPrescription('');
    setStatus('Kontrol Altında');

    alert('Sağlık müdahale kaydı revir defterine başarıyla işlendi!');
  };

  const getPatientName = (pId: string) => {
    return participants.find((p) => p.id === pId)?.name || 'Bilinmeyen Katılımcı';
  };

  return (
    <div className="space-y-6" id="health-revir-component-root">
      {/* Overview block */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-sans">
          <HeartHandshake className="w-5 h-5 text-emerald-600" />
          Revir, Sağlık Takibi &amp; Acil Müdahale
          <HelpTooltip content="Kamptaki hastaların revir kayıtları, ilaç takipleri ve riskli (alerjik/kronik) vaka kayıtları bu modülde yer alır." />
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Kamptaki çocukların alerji beyanları, ilaç saatleri ve revir doktoru müdahale kayıt defteri.
        </p>
      </div>

      {/* Critical allergy monitor alerts box */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div 
          onClick={() => setIsAllergyTrackerOpen(!isAllergyTrackerOpen)}
          className="flex justify-between items-center cursor-pointer select-none pb-2 border-b border-gray-100"
        >
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-600" />
            Yiyecek &amp; Çevre Alerjisi Kritik Takip Ekranı (Anlık Alarm)
            <span className="bg-red-100 text-red-800 text-3xs font-extrabold px-2 py-0.5 rounded-full">
              {hazardousParticipants.length} Riskli Vaka
            </span>
          </h3>
          <button type="button" className="text-gray-400 hover:text-gray-650 p-1">
            {isAllergyTrackerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isAllergyTrackerOpen && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-150">
            {hazardousParticipants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {hazardousParticipants.map((hp) => (
                  <div
                    key={hp.id}
                    className="p-3 rounded-lg border border-red-150 bg-red-50/5 text-xs space-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-1 bg-red-650 h-full"></div>
                    <div className="flex gap-2 items-start">
                      <span className="font-extrabold text-red-700 font-mono bg-red-100/50 p-1 rounded">
                        {hp.bungalowId || 'Oda Yok'}
                      </span>
                      <div>
                        <p className="font-extrabold text-gray-900 text-xs">{hp.name}</p>
                        <p className="text-3xs text-gray-500 mt-0.5">Metrik Tel: {hp.phone || 'Belirtilmedi'}</p>
                      </div>
                    </div>

                    <div className="mt-2 text-3xs text-gray-650 space-y-0.5 pt-1.5 border-t border-red-100">
                      <p><strong>Alerji:</strong> <span className="font-bold text-red-700">{hp.allergies}</span></p>
                      <p><strong>Kronik Sıkıntı:</strong> {hp.chronicDiseases}</p>
                      {hp.medications && <p><strong>Rutin İlaç:</strong> {hp.medications}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">Kampta aktif olarak kayıtlı kritik alerjen beyanı olan gönüllü bulunmuyor.</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revir Intervention logger form */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <div 
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className="flex justify-between items-center cursor-pointer select-none pb-2 border-b border-gray-100"
          >
            <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-700" /> Revir Defterine Giriş Ekle
            </h3>
            <button type="button" className="text-gray-400 hover:text-emerald-700 p-1">
              {isAddFormOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {isAddFormOpen ? (
            <form onSubmit={handleCreateIncident} className="space-y-3.5 text-xs pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <div>
                <label className="block text-3xs font-extrabold text-gray-500 mb-1">
                  Katılımcıyı Seç *
                </label>
                <select
                  value={selectedPatId}
                  onChange={(e) => setSelectedPatId(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600 bg-white"
                  required
                >
                  <option value="">-- Kamptaki Gönüllüyü Seç --</option>
                  {activeInCamp.map((ac) => (
                    <option key={ac.id} value={ac.id}>
                      {ac.name} ({ac.bungalowId || 'Oda Yok'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-3xs font-extrabold text-gray-500 mb-1">
                  Şikayeti ve Belirtiler *
                </label>
                <textarea
                  placeholder="Örn: Ateşi çıktı 38.2°C, hafif karın ağrısı var..."
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600"
                  rows={3}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-3xs font-extrabold text-gray-500 mb-1">
                  Uygulanan Tedavi &amp; İlaç *
                </label>
                <textarea
                  placeholder="Örn: 1 ölçek Calpol verildi, 1 saat revirde gözlem altında dinlendirildi..."
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-600"
                  rows={3}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-3xs font-extrabold text-gray-500 mb-1">
                  Ekstra Reçete Edilen İlaçlar (Varsa)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Minoset 500mg, Günde 2 kez tok"
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded"
                />
              </div>

              <div>
                <label className="block text-3xs font-extrabold text-gray-500 mb-1">
                  Güncel Sağlık Durumu *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2 border border-gray-200 bg-white rounded"
                >
                  <option value="Kontrol Altında">Kontrol Altında (Odasında Dinleniyor)</option>
                  <option value="Müşahade">Müşahade (Revirde Gözetimde)</option>
                  <option value="Sevk Edildi">Sevk Edildi (İlçe Devlet Hastanesine)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-lg cursor-pointer"
              >
                Kaydı Revir Defterine İşle
              </button>
            </form>
          ) : (
            <p className="text-3xs text-gray-400 italic text-center py-2">Kaydetmek veya giriş yapmak için yukarıya tıklayıp açınız.</p>
          )}
        </div>

        {/* History of Revir Incidents logs */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 pb-2 border-b flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            Aktif Revir Defteri Kayıtları
          </h3>

          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {healthIncidents.map((hi) => (
              <div
                key={hi.id}
                className="p-3 border border-gray-150 rounded-lg text-xs space-y-2 bg-gray-50/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-extrabold text-emerald-950 text-xs">
                      {getPatientName(hi.participantId)}
                    </span>
                    <p className="text-3xs text-gray-400 mt-0.5">{new Date(hi.dateTime).toLocaleString()}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      hi.status === 'Kontrol Altında'
                        ? 'bg-green-100 text-green-800'
                        : hi.status === 'Müşahade'
                        ? 'bg-yellow-101 text-yellow-850'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {hi.status}
                  </span>
                </div>

                <div className="text-2xs text-gray-650 space-y-1">
                  <p><strong>Şikayet:</strong> {hi.complaint}</p>
                  <p><strong>Uygulanan Tedavi:</strong> {hi.treatment}</p>
                  {hi.prescription && <p><strong>Verilen İlaç:</strong> <span className="font-mono text-red-700">{hi.prescription}</span></p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yeşilay Emergency Action Protocol Cheat Sheet */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <div 
            onClick={() => setIsProtocolOpen(!isProtocolOpen)}
            className="flex justify-between items-center cursor-pointer select-none pb-2 border-b border-gray-100"
          >
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
              Acil Durum Protokolü (KYS Kılavuz)
            </h3>
            <button type="button" className="text-gray-400 hover:text-red-600 p-1">
              {isProtocolOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {isProtocolOpen ? (
            <div className="space-y-3.5 text-2xs leading-relaxed text-gray-650 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-3 border border-red-100 bg-red-50/10 rounded-lg">
                <h4 className="font-bold text-red-900 mb-1 flex items-center gap-1">
                  <span>1.</span> Şiddetli Alerjik Reaksiyon (Anafilaksi)
                </h4>
                <p>
                  Nefes darlığı veya şişlik görüldüğünde hemen revirdeki <strong>adrenalin oto-enjektörünü</strong> uygulayın. Adrenalin saatini not edin ve 112’yi arayarak "Kamp Merkezinde Anafilaksi Vakası" diye ihbarda bulunun. İlgili kişilere haber verin.
                </p>
              </div>

              <div className="p-3 border border-amber-100 bg-amber-50/15 rounded-lg">
                <h4 className="font-bold text-amber-900 mb-1">
                  <span>2.</span> Güneş &amp; Isı Aşımı (Güneş Çarpması)
                </h4>
                <p>
                  Hastayı gölge veya serin odaya taşıyın. Giysilerini gevşetin. Soğuk ıslak bezlerle kompres uygulayın. Bilinci yerindeyse yavaşça sıvı verin. Kesinlikle ateş düşürücü ilaç vermeyin.
                </p>
              </div>

              <div className="p-3 border border-emerald-100 bg-emerald-50/10 rounded-lg">
                <h4 className="font-bold text-emerald-900 mb-1">
                  <span>3.</span> Astım Atakları Kontrolü
                </h4>
                <p>
                  Katılımcının yanındaki mavi fısfısını (salbütamol) 2-4 puf kullandırtın. Eğilip dirsekleri dize koyup nefes almasını sağlayın. Sakin kalması için telkin edin. 10 dk içinde düzelmezse ambulans çağırın.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-3xs text-gray-400 italic text-center py-2">Protokol adımlarını incelemek için yukarıya tıklayıp açınız.</p>
          )}
        </div>
      </div>
    </div>
  );
}
