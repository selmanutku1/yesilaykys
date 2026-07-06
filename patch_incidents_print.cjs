const fs = require('fs');
let code = fs.readFileSync('src/components/IncidentLogsView.tsx', 'utf8');

// 1. Add incidentToPrint state
code = code.replace(
  /const \[newActionTaken, setNewActionTaken\] = useState\(''\);/,
  "const [newActionTaken, setNewActionTaken] = useState('');\n  const [incidentToPrint, setIncidentToPrint] = useState<CampIncident | null>(null);"
);

// 2. Change handlePrintSingleIncident to just set the state
const oldHandlePrint = /const handlePrintSingleIncident = \(incident: CampIncident\) => \{[\s\S]*?    \}\n  \};/;
const newHandlePrint = `const handlePrintSingleIncident = (incident: CampIncident) => {
    setIncidentToPrint(incident);
  };`;

code = code.replace(oldHandlePrint, newHandlePrint);

// 3. Update the main container to hide during print if incidentToPrint is set
code = code.replace(
  /<div className="p-4 lg:p-8 space-y-6">/,
  `<div className={\`p-4 lg:p-8 space-y-6 \${incidentToPrint ? 'print:hidden' : ''}\`}>`
);

// 4. Append the Print Modal to the end of the component
const printModalJSX = `
      {/* Tekli Olay Yazdırma Modalı */}
      {incidentToPrint && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-200 print:absolute print:inset-0 print:bg-white print:z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] print:max-h-none print:border-none print:shadow-none print:w-full print:max-w-none print:mx-0">
            {/* Modal Header (No print) */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 no-print">
              <h2 className="font-bold text-gray-800">Olay Tutanağı Yazdır</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Yazdır / PDF İndir
                </button>
                <button
                  onClick={() => setIncidentToPrint(null)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-lg transition"
                >
                  Kapat
                </button>
              </div>
            </div>

            {/* Print Content */}
            <div className="p-8 overflow-y-auto print:overflow-visible print:p-0">
              <div className="text-center mb-10 border-b-2 border-gray-200 pb-5">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">RESMİ OLAY TUTANAĞI</h1>
                <p className="text-sm text-gray-500 mt-2">Belge No: {incidentToPrint.id} | Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
              </div>

              <div className="flex justify-between mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100 print:bg-transparent print:p-0 print:border-none">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Olay Türü</div>
                    <div className="text-sm font-bold text-gray-900 mt-1">{incidentToPrint.type.toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Olay Tarihi ve Saati</div>
                    <div className="text-sm font-bold text-gray-900 mt-1">{new Date(incidentToPrint.dateTime).toLocaleString('tr-TR')}</div>
                  </div>
                </div>
                <div className="space-y-4 text-right">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Durum</div>
                    <div className="mt-1">
                      <span className={\`text-xs font-bold px-2 py-1 rounded uppercase \${
                        incidentToPrint.status === 'Açık' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }\`}>
                        {incidentToPrint.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Raporlayan (Bildiren)</div>
                    <div className="text-sm font-bold text-gray-900 mt-1">{incidentToPrint.reporterName}</div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Olay Başlığı</h2>
                <div className="text-base font-semibold text-gray-900">{incidentToPrint.title}</div>
              </div>

              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Olayın Detayları (Açıklama)</h2>
                <div className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 border border-gray-200 rounded-xl print:p-0 print:border-none">
                  {incidentToPrint.description}
                </div>
              </div>

              {incidentToPrint.actionTaken && (
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Alınan Aksiyon / Sonuç</h2>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 border border-gray-200 rounded-xl print:p-0 print:border-none">
                    {incidentToPrint.actionTaken}
                  </div>
                </div>
              )}

              <div className="mt-20 pt-8 border-t border-gray-200 flex justify-between text-center">
                <div className="w-1/2 px-4">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-16">Bildiren Yetkili</div>
                  <div className="text-sm font-bold text-gray-900 border-t border-gray-400 pt-2 inline-block min-w-[200px]">
                    {incidentToPrint.reporterName}
                  </div>
                </div>
                <div className="w-1/2 px-4">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-16">Kamp Yöneticisi / Onay</div>
                  <div className="text-sm font-bold text-gray-900 border-t border-gray-400 pt-2 inline-block min-w-[200px]">
                    İmza
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}`;

code = code.replace(/    <\/div>\n  \);\n\}/, printModalJSX + "\n    </div>\n  );\n}");

fs.writeFileSync('src/components/IncidentLogsView.tsx', code);
