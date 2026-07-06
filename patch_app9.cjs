const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const strToFind = `{activeTab === 'dijital-arsiv' && (
            <DijitalArsivView />
          )}`;

const replacement = `{activeTab === 'dijital-arsiv' && (
            <DijitalArsivView />
          )}

          {activeTab === 'olay-kayit' && (
            <IncidentLogsView
              incidents={incidents}
              onUpdateIncidents={setIncidents}
              onAddLog={addSystemLog}
              currentUserId={currentUser.id}
              currentUserName={currentUser.name}
            />
          )}`;

code = code.replace(strToFind, replacement);
fs.writeFileSync('src/App.tsx', code);
