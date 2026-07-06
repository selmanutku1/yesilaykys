#!/bin/bash
sed -i -e "s/const \[isDarkMode, setIsDarkMode\] = useState<boolean>(false);/const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {\n    const saved = localStorage.getItem('kys_dark_mode');\n    if (saved !== null) return saved === 'true';\n    return window.matchMedia('(prefers-color-scheme: dark)').matches;\n  });/g" src/App.tsx
sed -i -e "s/document.documentElement.classList.add('dark');/document.documentElement.classList.add('dark');\n      localStorage.setItem('kys_dark_mode', 'true');/g" src/App.tsx
sed -i -e "s/document.documentElement.classList.remove('dark');/document.documentElement.classList.remove('dark');\n      localStorage.setItem('kys_dark_mode', 'false');/g" src/App.tsx
