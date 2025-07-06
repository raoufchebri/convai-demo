"use client";

import { useEffect, useState } from 'react';
import { BackgroundWave } from './background-wave';

export function ThemeWrapper() {
  const [theme, setTheme] = useState<'gray' | 'pink' | 'green' | 'blue'>('gray');

  useEffect(() => {
    // Read theme from body attribute
    const updateTheme = () => {
      const bodyTheme = document.body.getAttribute('data-theme') as 'gray' | 'pink' | 'green' | 'blue';
      if (bodyTheme && ['gray', 'pink', 'green', 'blue'].includes(bodyTheme)) {
        setTheme(bodyTheme);
      }
    };

    // Initial check
    updateTheme();

    // Watch for changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  return <BackgroundWave theme={theme} />;
} 