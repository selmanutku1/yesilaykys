#!/bin/bash
sed -i -e '/{isDarkMode ? <Sun className="w-4 h-4" \/> : <Moon className="w-4 h-4" \/>}/a\
            <\/button>\
            <button\
              onClick={() => window.print()}\
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition"\
              title="Ekranı Yazdır"\
            >\
              <Printer className="w-4 h-4" />' src/App.tsx
