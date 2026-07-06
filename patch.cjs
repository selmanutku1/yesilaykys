const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf8');
let panel = fs.readFileSync('user_panel.tsx', 'utf8');

const insertionIndex = code.lastIndexOf('        </div>\n      </div>\n    </div>\n  );\n}');
if (insertionIndex !== -1) {
  code = code.substring(0, insertionIndex) + panel + '\n' + code.substring(insertionIndex);
  fs.writeFileSync('src/components/SettingsView.tsx', code);
  console.log('Successfully injected panel');
} else {
  console.log('Could not find insertion point');
}
