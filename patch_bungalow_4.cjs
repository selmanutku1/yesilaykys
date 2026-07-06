const fs = require('fs');
let code = fs.readFileSync('src/components/BungalowView.tsx', 'utf8');

const strToFind = `  // Smart Auto-allocation motor honoring gender segregation for security/KVKK guidelines!
  const handleAutoAllocate = () => {
    let unassigned = participants.filter(
      (p) => !p.bungalowId && p.status === "Onaylandı",
    );
    if (unassigned.length === 0) {
      alert("Yerleştirilecek bekleyen onaylı yeni katılımcı bulunamadı.");
      return;
    }

    const updatedParticipants = [...participants];
    let count = 0;

    // Loop through each bungalow to find vacant beds
    for (const bg of centerBungalows) {
      const bOccupants = updatedParticipants.filter(
        (p) => p.bungalowId === bg.id,
      );

      // Find free bed indices
      const filledBeds = bOccupants.map((o) => o.bedNumber);

      for (let bed = 1; bed <= bg.capacity; bed++) {
        if (!filledBeds.includes(bed)) {
          // Find candidates matching room gender constraint and camp period rules
          const candidateIndex = unassigned.findIndex((cand) => {
            return canAssignToBungalow(cand, bg.id, updatedParticipants).allowed;
          });

          if (candidateIndex !== -1) {
            const candidate = unassigned[candidateIndex];

            // Apply assignment
            const pIdx = updatedParticipants.findIndex(
              (p) => p.id === candidate.id,
            );
            updatedParticipants[pIdx] = {
              ...updatedParticipants[pIdx],
              bungalowId: bg.id,
              bedNumber: bed,
              status: "Kampta",
              checkedIn: true,
              checkInTime: new Date().toISOString().slice(0, 19),
            };

            // Remove from local unassigned pool
            unassigned.splice(candidateIndex, 1);
            count++;
          }
        }
      }
    }

    onUpdateParticipants(updatedParticipants);
    onAddLog(
      "Otomatik Yerleşim",
      \`Akıllı yerleşim algoritması çalıştırıldı. \${count} katılımcı yaş/cinsiyet uyumuna göre uygun bungalovlara yerleştirildi.\`,
    );
    alert(
      \`Başarılı: \${count} katılımcı kriterlere göre bungalovlara yerleştirildi!\`,
    );
  };`;

const replacement = `  // Smart Auto-allocation motor honoring gender segregation for security/KVKK guidelines!
  const executeSmartAllocation = async () => {
    setIsAllocating(true);
    
    // Simulate complex rule processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    let unassigned = participants.filter(
      (p) => !p.bungalowId && p.status === "Onaylandı",
    );
    
    if (unassigned.length === 0) {
      alert("Yerleştirilecek bekleyen onaylı yeni katılımcı bulunamadı.");
      setIsAllocating(false);
      setShowSmartAllocationModal(false);
      return;
    }

    const updatedParticipants = [...participants];
    let count = 0;

    // A basic implementation of "groupTogether" rule: sort unassigned by convoyName first
    if (smartRules.groupTogether) {
      unassigned.sort((a, b) => (a.convoyName || '').localeCompare(b.convoyName || ''));
    }

    // Loop through each bungalow to find vacant beds
    for (const bg of centerBungalows) {
      const bOccupants = updatedParticipants.filter(
        (p) => p.bungalowId === bg.id,
      );

      const filledBeds = bOccupants.map((o) => o.bedNumber);

      for (let bed = 1; bed <= bg.capacity; bed++) {
        if (!filledBeds.includes(bed)) {
          // Find candidates matching room gender constraint and camp period rules
          let candidateIndex = -1;
          
          if (smartRules.groupTogether && bOccupants.length > 0) {
            // try to find someone from same group as existing occupants
            const currentGroups = new Set(bOccupants.map(o => o.convoyName).filter(Boolean));
            candidateIndex = unassigned.findIndex((cand) => {
              return canAssignToBungalow(cand, bg.id, updatedParticipants).allowed && 
                     cand.convoyName && currentGroups.has(cand.convoyName);
            });
          }
          
          // Fallback if no matching group or rule not applied
          if (candidateIndex === -1) {
            candidateIndex = unassigned.findIndex((cand) => {
              return canAssignToBungalow(cand, bg.id, updatedParticipants).allowed;
            });
          }

          if (candidateIndex !== -1) {
            const candidate = unassigned[candidateIndex];

            // Apply assignment
            const pIdx = updatedParticipants.findIndex(
              (p) => p.id === candidate.id,
            );
            updatedParticipants[pIdx] = {
              ...updatedParticipants[pIdx],
              bungalowId: bg.id,
              bedNumber: bed,
              status: "Kampta",
              checkedIn: true,
              checkInTime: new Date().toISOString().slice(0, 19),
            };
            unassigned.splice(candidateIndex, 1);
            count++;
          }
        }
      }
    }

    onUpdateParticipants(updatedParticipants);
    onAddLog(
      "Akıllı Yerleştirme",
      \`Seçili kurallara göre \${count} katılımcı otomatik olarak odalara yerleştirildi.\`,
    );
    
    setIsAllocating(false);
    setShowSmartAllocationModal(false);
  };`;

code = code.replace(strToFind, replacement);
fs.writeFileSync('src/components/BungalowView.tsx', code);
