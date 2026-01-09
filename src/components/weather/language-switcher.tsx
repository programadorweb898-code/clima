'use client';

import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageContext } from '@/context/language-context';

export function LanguageSwitcher() {
  const { lang, setLang } = useContext(LanguageContext);

  return (
    <div className="flex justify-center gap-1">
      <Button
        variant={lang === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLang('en')}
      >
        EN
      </Button>
      <Button
        variant={lang === 'es' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLang('es')}
      >
        ES
      </Button>
    </div>
  );
}
