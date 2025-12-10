// frontend/components/ui/ThemeToggle.tsx
'use client';
import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return (localStorage.getItem('theme') || 'dark') === 'dark';
    } catch { return true; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch {}
  }, [isDark]);

  return (
    <button onClick={() => setIsDark(d => !d)} className="px-3 py-1 border rounded">
      {isDark ? 'Dark' : 'Light'}
    </button>
  );
}
