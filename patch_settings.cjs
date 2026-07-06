const fs = require('fs');
let code = fs.readFileSync('src/components/IncidentLogsView.tsx', 'utf8');

// Add Printer to lucide-react imports
code = code.replace(
  /import \{ AlertOctagon, ShieldAlert, FileWarning, Plus, Trash2, CheckCircle, Search \} from 'lucide-react';/,
  "import { AlertOctagon, ShieldAlert, FileWarning, Plus, Trash2, CheckCircle, Search, Printer } from 'lucide-react';"
);

// Find the button area and add Print button
const buttonArea = `<button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-red-700 transition"
        >
          {showAddForm ? 'Vazgeç' : <><Plus className="w-4 h-4" /> Yeni Olay Bildir</>}
        </button>`;

const newButtonArea = `<div className="flex items-center gap-2 no-print">
          <button
            onClick={() => window.print()}
            className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-gray-50 transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            PDF / Yazdır
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-red-700 transition shadow-sm"
          >
            {showAddForm ? 'Vazgeç' : <><Plus className="w-4 h-4" /> Yeni Olay Bildir</>}
          </button>
        </div>`;

code = code.replace(buttonArea, newButtonArea);

// Add print classes to elements that should not be printed
code = code.replace(
  /{showAddForm && \(/,
  "{showAddForm && (\n        <div className=\"no-print\">\n"
);
code = code.replace(
  /          <\/div>\n        <\/div>\n      \)}\n\n      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden flex flex-col">/,
  "          </div>\n        </div>\n        </div>\n      )}\n\n      <div className=\"bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden flex flex-col\">"
);

code = code.replace(
  /<div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between bg-gray-50\/50">/,
  "<div className=\"p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between bg-gray-50/50 no-print\">"
);

code = code.replace(
  /<div className="flex md:flex-col items-center justify-end gap-2 shrink-0">/,
  "<div className=\"flex md:flex-col items-center justify-end gap-2 shrink-0 no-print\">"
);

// We need a print header for the report
const printHeader = `<div className="hidden print:block mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 border-b pb-4">Olay Kayıt Raporu</h1>
          <p className="text-gray-500 mt-2 text-sm">Yazdırma Tarihi: {new Date().toLocaleString('tr-TR')}</p>
        </div>`;

code = code.replace(
  /<div className="divide-y divide-gray-100 max-h-\[600px\] overflow-y-auto">/,
  printHeader + "\n        <div className=\"divide-y divide-gray-100 max-h-[600px] overflow-y-auto print:max-h-none\">"
);

fs.writeFileSync('src/components/IncidentLogsView.tsx', code);
