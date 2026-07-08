'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function LanguageToggle()
{
  const { lang, setLang } = useLanguage()

  return (
    <button
      onClick={() => setLang(lang === 'ro' ? 'en' : 'ro')}
      aria-label={lang === 'ro' ? 'Switch to English' : 'Schimbă în română'}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.3rem',
        padding: '0.35rem 0.6rem', borderRadius: '8px',
        border: '1px solid rgba(0,0,0,0.12)', background: '#fff',
        cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: '#555',
        fontFamily: 'var(--font-jakarta), sans-serif',
      }}
    >
      {lang === 'ro' ? '🇷🇴 RO' : '🇬🇧 EN'}
    </button>
  )
}