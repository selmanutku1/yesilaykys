#!/bin/bash
sed -i -e '/import { CampCenter, CampPeriod, SystemLog } from '\'\.\.\/types\''/c\import { CampCenter, CampPeriod, SystemLog } from '\'\.\.\/types\'';\nimport { LoginUser } from '\'\.\.\/App\'';' src/components/SettingsView.tsx
sed -i -e 's/interface SettingsViewProps {/interface SettingsViewProps {\n  users: LoginUser[];\n  onUpdateUsers: (updated: LoginUser[]) => void;/g' src/components/SettingsView.tsx
sed -i -e '/onAddLog: (action: string, details: string) => void;/a \  users: LoginUser[];\n  onUpdateUsers: (updated: LoginUser[]) => void;' src/components/SettingsView.tsx
sed -i -e '/onUpdatePeriods,/a \  users,\n  onUpdateUsers,' src/components/SettingsView.tsx
