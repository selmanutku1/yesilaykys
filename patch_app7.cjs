const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const strToFind = `              </span>
            </button>
          )}`;

const replacement = `              </span>
            </button>
          )}

          {hasAccess('olay-kayit') && (
            <button
              onClick={() => handleActiveTabChange('olay-kayit')}
              title="Olay Kayıt Sistemi"
              className={\`flex items-center rounded-xl text-xs font-bold transition-all text-left \${
                isSidebarCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'px-3 py-2.5 gap-3'
              } \${
                activeTab === 'olay-kayit'
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }\`}
            >
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span className={\`\${isSidebarCollapsed ? 'lg:hidden' : 'block'}\`}>
                Olay Kayıt Sistemi
              </span>
            </button>
          )}`;

code = code.replace(
  /              <\/span>\n            <\/button>\n          \)}/,
  replacement
);

fs.writeFileSync('src/App.tsx', code);
