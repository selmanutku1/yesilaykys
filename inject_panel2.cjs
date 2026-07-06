const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf8');
let panel = fs.readFileSync('user_panel.tsx', 'utf8');

code = code.replace(/        <\/div>\n      <\/div>\n    <\/div>\n  \);\n}/g, panel + '\n        </div>\n      </div>\n    </div>\n  );\n}');
fs.writeFileSync('src/components/SettingsView.tsx', code);
