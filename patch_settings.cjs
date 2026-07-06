const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf8');

// clean up multiple declarations if any
code = code.replace(/  users: LoginUser\[\];\n  onUpdateUsers: \(updated: LoginUser\[\]\) => void;\n/g, '');
code = code.replace(/  users,\n  onUpdateUsers,\n/g, '');
code = code.replace(/import \{ LoginUser \} from '\.\.\/App';\n/g, '');

code = code.replace(/import \{ CampCenter, CampPeriod, SystemLog \} from '\.\.\/types';/, `import { CampCenter, CampPeriod, SystemLog } from '../types';\nimport { LoginUser } from '../App';`);

code = code.replace(/interface SettingsViewProps \{/, `interface SettingsViewProps {\n  users: LoginUser[];\n  onUpdateUsers: (updated: LoginUser[]) => void;`);

code = code.replace(/export default function SettingsView\(\{/, `export default function SettingsView({\n  users,\n  onUpdateUsers,`);

fs.writeFileSync('src/components/SettingsView.tsx', code);
