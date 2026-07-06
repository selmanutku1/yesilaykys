const fs = require('fs');

let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf8');

code = code.replace(
  /interface SettingsViewProps \{/,
  `interface SettingsViewProps {\n  currentUser: LoginUser;`
);

code = code.replace(
  /export default function SettingsView\(\{/,
  `export default function SettingsView({\n  currentUser,`
);

code = code.replace(
  /\{\/\* User Management Panel \*\/\}/,
  `{/* User Management Panel */}\n          {currentUser.role === 'admin' && (`
);

code = code.replace(
  /<\/div>\n      <\/div>\n    <\/div>\n  \);\n\}/,
  `</div>\n          )}\n        </div>\n      </div>\n    </div>\n  );\n}`
);

fs.writeFileSync('src/components/SettingsView.tsx', code);
