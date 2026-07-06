const fs = require('fs');
let code = fs.readFileSync('src/components/BungalowView.tsx', 'utf8');

// Add AlertTriangle to imports if not there
if (!code.includes('AlertTriangle')) {
  code = code.replace(
    /import \{([^\}]+)\} from "lucide-react";/,
    "import { $1, AlertTriangle } from \"lucide-react\";"
  );
}

// 1. Add risks inside filteredBungalows.map
const mapStrFind = `            {filteredBungalows.map((bg) => {
              const occupants = getOccupants(bg.id);
              const filledCount = occupants.length;`;
              
const mapStrReplace = `            {filteredBungalows.map((bg) => {
              const occupants = getOccupants(bg.id);
              const filledCount = occupants.length;
              const risks = analyzeBungalowRisks(occupants);
              const hasRisks = risks.length > 0;`;

code = code.replace(mapStrFind, mapStrReplace);

// 2. Add AlertTriangle to the card
const cardHeaderFind = `                       <span
                         className={\`font-bold text-[8px] \${bg.isClosed ? "text-gray-500" : isFull && !hasMatchedOccupant ? "text-white" : "text-gray-800"} leading-none truncate\`}
                       >
                         {bg.id}
                       </span>
                     </div>`;

const cardHeaderReplace = `                       <span
                         className={\`font-bold text-[8px] \${bg.isClosed ? "text-gray-500" : isFull && !hasMatchedOccupant ? "text-white" : "text-gray-800"} leading-none truncate\`}
                       >
                         {bg.id}
                       </span>
                       {hasRisks && <AlertTriangle className="w-2.5 h-2.5 text-amber-500 ml-0.5 shrink-0" />}
                     </div>`;

code = code.replace(cardHeaderFind, cardHeaderReplace);

// 3. Add Risk warnings inside the Modal
const modalHeaderFind = `              <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ArrowUpDown className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base leading-none">
                      {bg.name} - Yerleşim Düzenleme Paneli
                    </h3>
                    <p className="text-3xs md:text-2xs text-gray-500 mt-1 font-semibold">
                      Kapasite: {bg.capacity} Kişi | Konum: {bg.type} Blok | {filledCount} / {bg.capacity} Dolu
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedBungalowId(null);
                    setAssignTarget(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>`;

const modalHeaderReplace = `              <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ArrowUpDown className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base leading-none">
                      {bg.name} - Yerleşim Düzenleme Paneli
                    </h3>
                    <p className="text-3xs md:text-2xs text-gray-500 mt-1 font-semibold">
                      Kapasite: {bg.capacity} Kişi | Konum: {bg.type} Blok | {filledCount} / {bg.capacity} Dolu
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedBungalowId(null);
                    setAssignTarget(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {analyzeBungalowRisks(occupants).length > 0 && (
                <div className="bg-amber-50 p-3 border-b border-amber-200 shrink-0 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h4 className="font-bold text-amber-900 text-xs">Uyumsuzluk Riski Tespit Edildi!</h4>
                  </div>
                  <ul className="list-disc pl-5 text-xs text-amber-800 space-y-0.5 font-medium">
                    {analyzeBungalowRisks(occupants).map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}`;

code = code.replace(modalHeaderFind, modalHeaderReplace);

fs.writeFileSync('src/components/BungalowView.tsx', code);
