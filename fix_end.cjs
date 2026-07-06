const fs = require('fs');
let code = fs.readFileSync('src/components/BungalowView.tsx', 'utf8');

const regex = /              <button\n                onClick=\{executeSmartAllocation\}[\s\S]*?\)\}\n              <\/button>\n            <\/div>\n          <\/div>\n        <\/div>\n      \)\}\n[\s\S]*/m;

const replacement = `              <button
                onClick={executeSmartAllocation}
                disabled={isAllocating}
                className={\`cursor-pointer px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg transition text-xs flex items-center gap-2 shadow-sm \${isAllocating ? 'opacity-70 cursor-not-allowed' : 'hover:from-emerald-700 hover:to-teal-700'}\`}
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
                    Başlat
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/BungalowView.tsx', code);
