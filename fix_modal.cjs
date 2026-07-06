const fs = require('fs');
let code = fs.readFileSync('src/components/BungalowView.tsx', 'utf8');

// The corrupted start part:
const findStr1 = `              {/* Informative text about the rules */}
              <div className="bg-gray-        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">`;

const replaceStr1 = `              {/* Informative text about the rules */}
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3.5 text-3xs text-gray-500 leading-normal">
                <p className="font-medium">
                  <strong className="text-gray-700">Çözüm Önerisi:</strong> Katılımcıyı yerleştirmeden önce odadaki mevcut katılımcıları boşaltabilir ya da bu katılımcı için uygun cinsiyetteki başka bir bungalov seçebilirsiniz.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setConflictInfo(null)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg transition text-xs cursor-pointer shadow-xs"
              >
                Anladım, Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Allocation Modal */}
      {showSmartAllocationModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">`;

code = code.replace(findStr1, replaceStr1);
fs.writeFileSync('src/components/BungalowView.tsx', code);
