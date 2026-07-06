const fs = require('fs');
let code = fs.readFileSync('src/components/BungalowView.tsx', 'utf8');

const modalCode = `      {/* Smart Allocation Modal */}
      {showSmartAllocationModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 flex items-center gap-3 relative">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm shadow-inner">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-black text-white tracking-wide">
                Akıllı Otomatik Yerleştirme
              </h2>
              <button
                onClick={() => setShowSmartAllocationModal(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 bg-gray-50/50">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Seçtiğiniz kurallar doğrultusunda, bekleyen katılımcılar boş yataklara en uygun şekilde yerleştirilecektir. Lütfen uygulamak istediğiniz kuralları seçin.
              </p>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:shadow-3xs transition">
                  <div className="flex items-center h-5 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={smartRules.groupTogether}
                      onChange={(e) => setSmartRules({...smartRules, groupTogether: e.target.checked})}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600" 
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-800">Kamp Gruplarını Birlikte Tut</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Aynı kafile veya kamp grubundan gelen katılımcılar aynı odalara öncelikli atanır.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:shadow-3xs transition opacity-70">
                  <div className="flex items-center h-5 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={smartRules.schoolTogether}
                      onChange={(e) => setSmartRules({...smartRules, schoolTogether: e.target.checked})}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600" 
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-800">Aynı Okuldan Gelenleri Grupla</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Profilde belirtilen okul veya şehir bilgisine göre benzer katılımcıları bir araya getirir.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:shadow-3xs transition opacity-70">
                  <div className="flex items-center h-5 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={smartRules.noiseSensitivity}
                      onChange={(e) => setSmartRules({...smartRules, noiseSensitivity: e.target.checked})}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600" 
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-800">Gürültü Hassasiyetine Göre Ayır</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Hafif uyuyanları ve sessizlik isteyenleri daha sakin konumlardaki odalara yerleştirir.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:shadow-3xs transition opacity-70">
                  <div className="flex items-center h-5 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={smartRules.mixExperience}
                      onChange={(e) => setSmartRules({...smartRules, mixExperience: e.target.checked})}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600" 
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-800">Deneyim Karması</span>
                    <span className="block text-xs text-gray-500 mt-0.5">İlk kez kampa katılanları, daha önce deneyimi olan kampçılarla eşleştirerek uyumu artırır.</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-white flex justify-end gap-3">
              <button
                onClick={() => setShowSmartAllocationModal(false)}
                className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition text-xs cursor-pointer"
                disabled={isAllocating}
              >
                İptal Et
              </button>
              <button
                onClick={executeSmartAllocation}
                disabled={isAllocating}
                className={\`cursor-pointer px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg transition text-xs flex items-center gap-2 shadow-sm \${isAllocating ? 'opacity-70 cursor-not-allowed' : 'hover:from-emerald-700 hover:to-teal-700'}\`}
              >
                {isAllocating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Hesaplanıyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Yerleşimi Başlat
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Genel Confirm Modal */}`;

code = code.replace(/      \{\/\* Genel Confirm Modal \*\/\}/, modalCode);
fs.writeFileSync('src/components/BungalowView.tsx', code);
