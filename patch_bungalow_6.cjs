const fs = require('fs');
let code = fs.readFileSync('src/components/BungalowView.tsx', 'utf8');

const strToFind = `                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:shadow-3xs transition opacity-70">
                  <div className="flex items-center h-5 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={smartRules.mixExperience}`;

const replacement = `                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:shadow-3xs transition opacity-70">
                  <div className="flex items-center h-5 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={smartRules.separatePrevious}
                      onChange={(e) => setSmartRules({...smartRules, separatePrevious: e.target.checked})}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600" 
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-800">Geçmişte Birlikte Kalanları Dağıt</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Daha önceki dönemlerde aynı odayı paylaşmış katılımcıları farklı odalara yerleştirerek kaynaşmayı artırır.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:shadow-3xs transition opacity-70">
                  <div className="flex items-center h-5 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={smartRules.mixExperience}`;

code = code.replace(strToFind, replacement);
fs.writeFileSync('src/components/BungalowView.tsx', code);
