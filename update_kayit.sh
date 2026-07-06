#!/bin/bash
sed -i -e '855,875c\
          {hasAccess('\''kayit'\'') && (\
            <button\
              onClick={() => {\
                if (activeTab === '\''kayit'\'') {\
                  setIsKayitMenuOpen(!isKayitMenuOpen);\
                } else {\
                  handleActiveTabChange('\''kayit'\'');\
                  setIsKayitMenuOpen(true);\
                }\
              }}\
              title="Ön Kayıtlar & Muvafakat"\
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${\
                isSidebarCollapsed ? '\''lg:justify-center lg:px-2 py-2.5'\'' : '\''px-3 py-2.5 gap-3'\''\
              } ${\
                activeTab === '\''kayit'\'' \
                  ? '\''bg-emerald-700 text-white shadow-xs'\'' \
                  : '\''text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'\''\
              }`}\
            >\
              <FileText className="w-4 h-4 shrink-0" />\
              <span className={`flex-1 ${isSidebarCollapsed ? '\''lg:hidden'\'' : '\''block'\''}`}>\
                Ön Kayıtlar &amp; Muvafakat\
              </span>\
              {!isSidebarCollapsed && activeTab === '\''kayit'\'' && (\
                isKayitMenuOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />\
              )}\
            </button>\
          )}' src/App.tsx
