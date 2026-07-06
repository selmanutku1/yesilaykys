#!/bin/bash
sed -i '/{filteredParticipants.length === 0 ? (/i \
              {selectedForBulk.length > 0 && (\
                <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between shadow-sm animate-in fade-in zoom-in-95">\
                  <div className="flex items-center gap-3">\
                    <div className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-md">\
                      {selectedForBulk.length} Seçili\
                    </div>\
                    <span className="text-xs font-semibold text-emerald-800">Toplu İşlemler:</span>\
                  </div>\
                  <div className="flex items-center gap-2">\
                    <button \
                      onClick={() => {\
                        const toExport = participants.filter(p => selectedForBulk.includes(p.id));\
                        exportBulkBadgesToPdf(toExport);\
                        onAddLog("Toplu Katılımcı Kartı", `${toExport.length} katılımcı için toplu yaka kartı (PDF) oluşturuldu.`);\
                        setSelectedForBulk([]);\
                      }}\
                      className="text-xs font-bold bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-3xs"\
                    >\
                      <Printer className="w-3.5 h-3.5" />\
                      Yaka Kartı Yazdır (8li)\
                    </button>\
                    <select\
                      className="text-xs font-bold bg-white text-gray-700 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"\
                      onChange={(e) => {\
                        if (e.target.value) {\
                          const updated = participants.map(p => selectedForBulk.includes(p.id) ? { ...p, status: e.target.value as any } : p);\
                          onUpdateParticipants(updated);\
                          onAddLog("Toplu Durum Güncellemesi", `${selectedForBulk.length} katılımcının durumu "${e.target.value}" olarak güncellendi.`);\
                          setSelectedForBulk([]);\
                          e.target.value = "";\
                        }\
                      }}\
                      defaultValue=""\
                    >\
                      <option value="" disabled>Durum Değiştir...</option>\
                      <option value="Başvuru Yapıldı">Başvuru Yapıldı</option>\
                      <option value="Onaylandı">Onaylandı</option>\
                      <option value="Kampta">Kampta</option>\
                      <option value="Ayrıldı">Ayrıldı</option>\
                    </select>\
                    <button onClick={() => setSelectedForBulk([])} className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors">\
                      <X className="w-4 h-4" />\
                    </button>\
                  </div>\
                </div>\
              )}' src/components/ParticipantView.tsx
