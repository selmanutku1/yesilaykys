#!/bin/bash
sed -i -e '950,970c\
          {hasAccess('\''teknik'\'') && (\
            <button\
              onClick={() => {\
                if (activeTab === '\''teknik'\'') {\
                  setIsTeknikMenuOpen(!isTeknikMenuOpen);\
                } else {\
                  handleActiveTabChange('\''teknik'\'');\
                  setIsTeknikMenuOpen(true);\
                }\
              }}\
              title="Teknik İşler & Talepler"\
              className={`flex items-center rounded-xl text-xs font-bold transition-all text-left ${\
                isSidebarCollapsed ? '\''lg:justify-center lg:px-2 py-2.5'\'' : '\''px-3 py-2.5 gap-3'\''\
              } ${\
                activeTab === '\''teknik'\'' \
                  ? '\''bg-emerald-700 text-white shadow-xs'\'' \
                  : '\''text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'\''\
              }`}\
            >\
              <Wrench className="w-4 h-4 shrink-0" />\
              <span className={`flex-1 ${isSidebarCollapsed ? '\''lg:hidden'\'' : '\''block'\''}`}>\
                Teknik İşler &amp; Talepler\
              </span>\
              {!isSidebarCollapsed && activeTab === '\''teknik'\'' && (\
                isTeknikMenuOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />\
              )}\
            </button>\
          )}' src/App.tsx
