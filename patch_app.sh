#!/bin/bash
sed -i -e '/const \[shifts, setShifts\] = useState<ShiftAssignment\[\]>(INITIAL_SHIFTS);/a \  const \[users, setUsers\] = useState<LoginUser\[\]>(USERS_LIST);' src/App.tsx
sed -i -e 's/<LoginView onLogin={handleLogin} \/>/<LoginView onLogin={handleLogin} users={users} \/>/g' src/App.tsx
sed -i -e 's/<SettingsView/<SettingsView\n              users={users}\n              onUpdateUsers={setUsers}/g' src/App.tsx
