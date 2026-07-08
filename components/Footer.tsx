'use client'

import React from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()

  const links = [t('nav.home'), t('nav.about'), t('nav.projects'), t('nav.plans'), t('nav.contact')]

  return (
    <footer style={{
      backgroundColor: '#0a0a0a',
      padding: '3rem 1.5rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
    }}>

      {/* logo + nume */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <svg width="32" height="32" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M105,52 A48,48 0 1,0 105,148" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round"/>
          <line x1="112" y1="52" x2="112" y2="148" stroke="#ffffff" strokeWidth="8" strokeLinecap="round"/>
          <path d="M112,52 Q148,52 148,76 Q148,100 112,100" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round"/>
          <path d="M112,100 Q152,100 152,124 Q152,148 112,148" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round"/>
          <circle cx="76" cy="164" r="6" fill="#ffffff" opacity="0.4"/>
        </svg>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', whiteSpace: 'nowrap' }}>
          Click &amp;&amp; Build
        </span>
      </div>

      {/* linkuri */}
      <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {links.map((item) => (
          <a key={item} href="#" style={{
            color: '#888',
            fontSize: '0.9rem',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e91e63')}
            onMouseLeave={e => (e.currentTarget.style.color = '#888')}
          >
            {item}
          </a>
        ))}
      </nav>

      

      {/* copyright */}
      <p style={{ color: '#444', fontSize: '0.8rem', margin: 0 }}>
        {t('footer.rights')}
      </p>

    </footer>
  )
}

export default Footer