#!/bin/bash
sed -i -e 's/import { LoginUser, USERS_LIST } from '\'\.\.\/App\''/import { LoginUser } from '\'\.\.\/App\''/g' src/components/LoginView.tsx
sed -i -e 's/interface LoginViewProps {/interface LoginViewProps {\n  users: LoginUser[];/g' src/components/LoginView.tsx
sed -i -e 's/export default function LoginView({ onLogin }: LoginViewProps) {/export default function LoginView({ onLogin, users }: LoginViewProps) {/g' src/components/LoginView.tsx
sed -i -e 's/USERS_LIST/users/g' src/components/LoginView.tsx
