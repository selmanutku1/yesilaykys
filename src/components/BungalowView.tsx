/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bungalow, Participant } from '../types';
import { Home, UserMinus, UserPlus, Sparkles, User, ShieldAlert, Trash2, Plus, RefreshCw } from 'lucide-react';
import { INITIAL_BUNGALOWS } from '../data';

interface BungalowViewProps {
  bungalows: Bungalow[];
  selectedCenterId: string;
  onUpdateBungalows: (updated: Bungalow[]) => void;
  participants: Participant[];
  onUpdateParticipants: (updated: Participant[]) => void;
  onAddLog: (action: string, details: string) => void;
}

export default function BungalowView({
  bungalows,
  selectedCenterId,
  onUpdateBungalows,
  participants,
  onUpdateParticipants,
  onAddLog,
}: BungalowViewProps) {
  const [selectedBungalowId, setSelectedBungalowId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Lider' | 'Standart'>('All');
  const [assignTarget, setAssignTarget] = useState<{ bungalowId: string; bedNumber: number } | null>(null);

  // New Bungalow additions form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBungalowName, setNewBungalowName] = useState('');
  const [newBungalowType, setNewBungalowType] = useState<'Lider' | 'Standart'>('Standart');
  const [newBungalowCapacity, setNewBungalowCapacity] = useState<number>(6);

  const handleAddBungalowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBungalowName.trim()) {
      alert('Lütfen Bungalov Adı giriniz.');
      return;
    }

    // Generate next prefix-ID based on existing ones
    const prefix = newBungalowType === 'Lider' ? 'LDR' : 'STD';
    const existingIds = bungalows
      .filter((b) => b.id.startsWith(prefix) && b.campCenterId === selectedCenterId)
      .map((b) => {
        const match = b.id.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      });
    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    const generatedId = `${prefix}-${nextNum}-${selectedCenterId}`;

    const newBung: Bungalow = {
      id: generatedId,
      name: newBungalowName,
      type: newBungalowType,
      capacity: newBungalowCapacity,
      campCenterId: selectedCenterId,
    };

    onUpdateBungalows([...bungalows, newBung]);
    onAddLog(
      'Bungalov Eklendi',
      `Yeni bungalov kütüğe eklendi: '${newBung.name}' (${newBung.type}, Yatak: ${newBung.capacity}).`
    );
    
    // Reset Form
    setNewBungalowName('');
    setShowAddForm(false);
  };

  const handleDeleteBungalow = (bungalowId: string) => {
    const occupants = getOccupants(bungalowId);
    if (occupants.length > 0) {
      alert(
        `Erişim Engellendi: Bu bungalovda şu an ${occupants.length} kayıtlı çocuk kalmaktadır. Silme işleminden önce lütfen odadaki katılımcıları tahliye ediniz.`
      );
      return;
    }

    const cell = bungalows.find((b) => b.id === bungalowId);
    if (!cell) return;

    if (confirm(`'${cell.name}' bungalovunu envanterden tamamen silmek istediğinize emin misiniz?`)) {
      onUpdateBungalows(bungalows.filter((b) => b.id !== bungalowId));
      setSelectedBungalowId(null);
      onAddLog('Bungalov Silindi', `'${cell.name}' odası envanter kontrolünden silindi.`);
    }
  };

  const handleApplyYesilayTemplate = () => {
    if (
      confirm(
        "Sistemdeki mevcut bungalov kütüğünü silerek Yeşilay temalı 3 Lider ve 30 Standart (4'er kişilik, toplam 33 oda) bungalov şablonunu uygulamak istediğinize emin misiniz?"
      )
    ) {
      onUpdateBungalows(INITIAL_BUNGALOWS);
      onAddLog(
        "Grup Şablonu Güncellendi",
        "Sistemdeki tüm odalar Yeşilay temalı ve 4'er kişilik 33 odaya (3 Lider, 30 Standart) dönüştürüldü."
      );
      setSelectedBungalowId(null);
      alert("Başarılı: 3 Lider ve 30 Standart Yeşilay temalı bungalov şeması başarıyla uygulandı!");
    }
  };

  // Specific Bungalows for ONLY the selected Center
  const centerBungalows = bungalows.filter((b) => b.campCenterId === selectedCenterId);

  // Get occupants for a specific bungalow
  const getOccupants = (bungalowId: string) => {
    return participants.filter((p) => p.bungalowId === bungalowId);
  };

  // Get unassigned but approved/waiting participants who can be assigned to bungalows
  const unassignedParticipants = participants.filter(
    (p) => !p.bungalowId && (p.status === 'Onaylandı' || p.status === 'Başvuru Yapıldı')
  );

  // Filter bungalows based on tab selection
  const filteredBungalows = centerBungalows.filter(
    (b) => filterType === 'All' || b.type === filterType
  );

  // Handle participant removal from a bed
  const handleRemoveParticipant = (participantId: string) => {
    const target = participants.find((p) => p.id === participantId);
    if (!target) return;

    const updated = participants.map((p) => {
      if (p.id === participantId) {
        return { ...p, bungalowId: null, bedNumber: null, status: 'Onaylandı' as const };
      }
      return p;
    });

    onUpdateParticipants(updated);
    onAddLog(
      'Konaklama İptal',
      `${target.name} kişisi ${target.bungalowId}-Yatak ${target.bedNumber} konumundan çıkarıldı.`
    );
  };

  // Handle manual bed assignment of a participant
  const handleAssignParticipant = (participantId: string, bungalowId: string, bedNumber: number) => {
    const pat = participants.find((p) => p.id === participantId);
    if (!pat) return;

    const bung = bungalows.find((b) => b.id === bungalowId);
    if (!bung) return;

    // Strict validation: Verify gender consistency in standard room
    const currentOccupants = getOccupants(bungalowId);
    if (currentOccupants.length > 0) {
      const activeGender = currentOccupants[0].gender;
      if (activeGender !== pat.gender) {
        alert(
          `Güvenlik Uyarısı: Bu bungalovda şu an ${activeGender} katılımcılar kalmaktadır. ${pat.gender} bir katılımcı aynı bungalova yerleştirilemez!`
        );
        return;
      }
    }

    const updated = participants.map((p) => {
      if (p.id === participantId) {
        return {
          ...p,
          bungalowId,
          bedNumber,
          status: 'Kampta' as const,
          checkedIn: true,
          checkInTime: new Date().toISOString().slice(0, 19),
        };
      }
      return p;
    });

    onUpdateParticipants(updated);
    setAssignTarget(null);
    onAddLog(
      'Konaklama Ataması',
      `${pat.name} isimli katılımcı el ile ${bungalowId} (Yatak ${bedNumber}) hücresine yerleştirildi.`
    );
  };

  // Smart Auto-allocation motor honoring gender segregation for security/KVKK guidelines!
  const handleAutoAllocate = () => {
    let unassigned = participants.filter((p) => !p.bungalowId && p.status === 'Onaylandı');
    if (unassigned.length === 0) {
      alert('Yerleştirilecek bekleyen onaylı yeni katılımcı bulunamadı.');
      return;
    }

    const updatedParticipants = [...participants];
    let count = 0;

    // Loop through each bungalow to find vacant beds
    for (const bg of centerBungalows) {
      const bOccupants = updatedParticipants.filter((p) => p.bungalowId === bg.id);
      
      // Determine existing gender of room, if any
      let roomGender: 'Erkek' | 'Kız' | null = null;
      if (bOccupants.length > 0) {
        roomGender = bOccupants[0].gender;
      }

      // Find free bed indices
      const filledBeds = bOccupants.map((o) => o.bedNumber);
      
      for (let bed = 1; bed <= bg.capacity; bed++) {
        if (!filledBeds.includes(bed)) {
          // Find candidates matching room gender constraint or any candidate if room is empty
          const candidateIndex = unassigned.findIndex((cand) => {
            if (roomGender === null) return true; // Empty room can host any gender
            return cand.gender === roomGender;
          });

          if (candidateIndex !== -1) {
            const candidate = unassigned[candidateIndex];
            
            // Apply assignment
            const pIdx = updatedParticipants.findIndex((p) => p.id === candidate.id);
            updatedParticipants[pIdx] = {
              ...updatedParticipants[pIdx],
              bungalowId: bg.id,
              bedNumber: bed,
              status: 'Kampta',
              checkedIn: true,
              checkInTime: new Date().toISOString().slice(0, 19)
            };

            // Set roomGender so next beds in this empty room will match this candidate's gender
            if (roomGender === null) {
              roomGender = candidate.gender;
            }

            // Remove from local unassigned pool
            unassigned.splice(candidateIndex, 1);
            count++;
          }
        }
      }
    }

    onUpdateParticipants(updatedParticipants);
    onAddLog(
      'Otomatik Yerleşim',
      `Akıllı yerleşim algoritması çalıştırıldı. ${count} katılımcı yaş/cinsiyet uyumuna göre uygun bungalovlara yerleştirildi.`
    );
    alert(`Başarılı: ${count} katılımcı kriterlere göre bungalovlara yerleştirildi!`);
  };

  const selectedBungalow = bungalows.find((b) => b.id === selectedBungalowId);
  const selectedOccupants = selectedBungalowId ? getOccupants(selectedBungalowId) : [];

  return (
    <div className="space-y-6" id="bungalow-management-root">
      {/* Header and Smart Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-sans">
            <Home className="w-5 h-5 text-emerald-600" />
            Bungalov Konaklama Kontrolü
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Toplam {centerBungalows.reduce((sum, b) => sum + b.capacity, 0)} yatak kapasiteli Lider ve Standart bungalovların doluluk takibi ve otomatik akıllı yerleşimi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 self-stretch sm:self-auto shrink-0">
          <button
            onClick={handleApplyYesilayTemplate}
            className="bg-amber-50 text-amber-800 hover:bg-amber-100 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            title="Sistemdeki tüm odaları siller; Yeşilay temalı 3 Lider ve 30 Standart (4'er kişilik) oda yerleşim şablonunu uygular."
          >
            <RefreshCw className="w-4 h-4" />
            Yeşilay Düzeni Uygula (3+30)
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Yeni Bungalov Ekle
          </button>

          <button
            onClick={handleAutoAllocate}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            Akıllı Otomatik Yerleştirme
          </button>
        </div>
      </div>

      {/* Inline Bungalow Addition Form */}
      {showAddForm && (
        <form onSubmit={handleAddBungalowSubmit} className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4 animate-fade-in text-xs">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              Yeni Odalı Bungalov Tanımla (Kamp: {selectedCenterId})
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 font-extrabold text-xs"
            >
              Kapat
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-4xs text-gray-400 font-black uppercase block">Bungalov / Oda Adı</label>
              <input
                type="text"
                placeholder="e.g. Standard Bungalov 12"
                value={newBungalowName}
                onChange={(e) => setNewBungalowName(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded text-xs focus:outline-emerald-600 font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-4xs text-gray-400 font-black uppercase block">Oda Sınıfı (Blok)</label>
              <select
                value={newBungalowType}
                onChange={(e) => {
                  const val = e.target.value as 'Lider' | 'Standart';
                  setNewBungalowType(val);
                  setNewBungalowCapacity(val === 'Lider' ? 4 : 6);
                }}
                className="w-full p-2 border border-gray-200 bg-white rounded text-xs font-bold"
              >
                <option value="Standart">Standart Odası</option>
                <option value="Lider">Lider Odası (Küçük Grup)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-4xs text-gray-400 font-black uppercase block">Yatak Kapasitesi (Kişi)</label>
              <input
                type="number"
                min={1}
                max={12}
                value={newBungalowCapacity}
                onChange={(e) => setNewBungalowCapacity(parseInt(e.target.value) || 6)}
                className="w-full p-2 border border-gray-200 rounded text-xs font-bold focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:underline text-2xs cursor-pointer font-bold"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-2xs font-extrabold hover:bg-emerald-800 transition shadow-xs cursor-pointer"
            >
              Odayı Envantere Ekle
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Grid Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Room Filter Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setFilterType('All')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                filterType === 'All' ? 'bg-white text-emerald-950 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tüm Bungalovlar ({centerBungalows.length})
            </button>
            <button
              onClick={() => setFilterType('Lider')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                filterType === 'Lider' ? 'bg-white text-emerald-950 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lider ({centerBungalows.filter((b) => b.type === 'Lider').length})
            </button>
            <button
              onClick={() => setFilterType('Standart')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                filterType === 'Standart' ? 'bg-white text-emerald-950 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Standart ({centerBungalows.filter((b) => b.type === 'Standart').length})
            </button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredBungalows.map((bg) => {
              const occupants = getOccupants(bg.id);
              const filledCount = occupants.length;
              const isFull = filledCount === bg.capacity;
              const percent = Math.round((filledCount / bg.capacity) * 100);

              // Determine gender color indicator of the room
              let roomGenderTheme = 'border-gray-200 bg-white';
              if (filledCount > 0) {
                const firstUser = occupants[0];
                roomGenderTheme =
                  firstUser.gender === 'Kız'
                    ? 'border-pink-200 bg-pink-50/10'
                    : 'border-blue-200 bg-blue-50/10';
              }

              return (
                <div
                  key={bg.id}
                  onClick={() => {
                    setSelectedBungalowId(bg.id);
                    setAssignTarget(null);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${roomGenderTheme} ${
                    selectedBungalowId === bg.id ? 'ring-2 ring-emerald-600 border-transparent shadow' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span
                        className={`text-2xs font-extrabold px-1.5 py-0.5 rounded ${
                          bg.type === 'Lider'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {bg.type}
                      </span>
                      <h4 className="font-bold text-xs text-gray-800 mt-1">{bg.name}</h4>
                    </div>
                    <span className="text-2xs font-bold text-gray-500 font-mono">
                      {filledCount}/{bg.capacity}
                    </span>
                  </div>

                  {/* Bed visual bubbles */}
                  <div className="grid grid-cols-6 gap-1 mt-3">
                    {Array.from({ length: bg.capacity }).map((_, idx) => {
                      const bedNum = idx + 1;
                      const occupier = occupants.find((o) => o.bedNumber === bedNum);
                      return (
                        <div
                          key={bedNum}
                          className={`aspect-square rounded flex items-center justify-center text-[9px] font-bold ${
                            occupier
                              ? occupier.gender === 'Kız'
                                ? 'bg-pink-500 text-white'
                                : 'bg-blue-600 text-white'
                              : 'bg-gray-150 text-gray-400 border border-dashed border-gray-300'
                          }`}
                          title={occupier ? `${bedNum}. Yatak: ${occupier.name}` : `${bedNum}. Yatak Boş`}
                        >
                          {bedNum}
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isFull
                          ? 'bg-red-500'
                          : bg.type === 'Lider'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Bungalow Cabin Details Column */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm self-start">
          {selectedBungalow ? (
            <div className="space-y-4">
              <div className="border-b pb-3 border-gray-150 flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-gray-400 prose">Seçili Bungalov</span>
                  <h3 className="text-base font-bold text-gray-900 mt-0.5">{selectedBungalow.name}</h3>
                  <p className="text-2xs text-gray-500 mt-1 font-semibold flex items-center gap-1">
                    Kapasite: {selectedBungalow.capacity} Kişilik | Konum: {selectedBungalow.type} Blok
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteBungalow(selectedBungalow.id)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg text-3xs font-extrabold flex items-center gap-1 transition cursor-pointer shrink-0 ml-2"
                  title="Bungalovu Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Odaları Sil
                </button>
              </div>

              {/* Beds list */}
              <div className="space-y-2">
                <h4 className="text-2xs font-extrabold text-gray-400 tracking-wider uppercase">Yatak Düzeni ve Katılımcılar</h4>
                {Array.from({ length: selectedBungalow.capacity }).map((_, idx) => {
                  const bedNum = idx + 1;
                  const occupant = selectedOccupants.find((o) => o.bedNumber === bedNum);

                  return (
                    <div
                      key={bedNum}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 text-xs bg-gray-50/50"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-3xs ${
                            occupant
                              ? occupant.gender === 'Kız'
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-blue-100 text-blue-700'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {bedNum}
                        </span>
                        <div>
                          {occupant ? (
                            <div>
                              <p className="font-bold text-gray-800 leading-snug">{occupant.name}</p>
                              <p className="text-3xs font-mono text-gray-400 mt-0.5">
                                {occupant.gender} | T.C.: {occupant.identityNumber.slice(0, 3)}****
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Boş / Yerleştirilmeyi bekliyor</span>
                          )}
                        </div>
                      </div>

                      {occupant ? (
                        <button
                          onClick={() => handleRemoveParticipant(occupant.id)}
                          className="text-red-600 hover:bg-red-50 p-1.5 rounded transition"
                          title="Yataktan Çıkar"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setAssignTarget({ bungalowId: selectedBungalow.id, bedNumber: bedNum })}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 p-1.5 rounded-lg transition font-semibold text-3xs flex items-center gap-1"
                        >
                          <UserPlus className="w-3 h-3" /> Yerleştir
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Manual Assign Selector Panel */}
              {assignTarget && (
                <div className="p-3.5 bg-yellow-50 border border-yellow-200 rounded-lg text-xs space-y-2">
                  <h4 className="font-bold text-yellow-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Katılımcı Seç (Yatak {assignTarget.bedNumber})
                  </h4>
                  {unassignedParticipants.length > 0 ? (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {unassignedParticipants.map((up) => (
                        <button
                          key={up.id}
                          onClick={() =>
                            handleAssignParticipant(up.id, assignTarget.bungalowId, assignTarget.bedNumber)
                          }
                          className="w-full text-left p-1.5 rounded bg-white hover:bg-gray-100 text-2xs flex items-center justify-between border border-yellow-150"
                        >
                          <div>
                            <span className="font-bold text-gray-800">{up.name}</span>
                            <span className="text-[10px] text-gray-400 block">{up.gender} • T.C.: {up.identityNumber.slice(0,3)}...</span>
                          </div>
                          <span className="text-3xs font-semibold text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-50">Seç</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-3xs text-yellow-700 italic">Yerleştirilebilecek yeni onaylanmış katılımcı bulunmuyor.</p>
                  )}
                  <button
                    onClick={() => setAssignTarget(null)}
                    className="text-gray-400 hover:text-gray-600 text-[10px] block font-bold"
                  >
                    Vazgeç
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <Home className="w-12 h-12 text-gray-200 stroke-1 mb-2" />
              <p className="text-xs font-semibold">Detayları İncelemek İçin Bir Bungalov Seçin</p>
              <p className="text-3xs mt-1">Soldaki bento bungalov gridinden merak ettiğiniz bir odayı haritadan tıklayabilirsiniz.</p>
            </div>
          )}

          {/* Color Guides */}
          <div className="mt-6 border-t pt-4 text-3xs text-gray-500 space-y-1.5">
            <span className="font-bold text-gray-400 block uppercase tracking-wider">Renk Kodları ve Kurallar</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-pink-500 inline-block"></span>
              <span>Kız Katılımcı Oturumu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block"></span>
              <span>Erkek Katılımcı Oturumu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded border border-dashed border-gray-300 bg-white inline-block"></span>
              <span>Boş ve Müsait Yatak</span>
            </div>
            <p className="text-[10px] text-emerald-800 font-medium bg-emerald-50/50 p-2 rounded border border-emerald-100 flex items-start gap-1 mt-3">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Güvenlik İlkesi:</strong> Standart odalarda karma cinsiyet kesinlikle engellenir. Bir yatak seçimi yapıldığında otomatik olarak mevcut oda sakini ile cinsiyet kontrolü yapılır.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
