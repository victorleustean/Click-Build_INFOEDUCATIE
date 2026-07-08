'use client'

import { SignUpButton } from '@clerk/nextjs'
import { Button } from './ShadCN/button'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const Contact = () => {
  const { t } = useLanguage()

  return (
    <section style={{
      padding: '8rem 1.5rem',
      textAlign: 'center',
      background: 'linear-gradient(to bottom, rgba(233,30,99,0.08) 0%, rgba(233,30,99,0.18) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
    }}>
      <h1 style={{
        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
        fontWeight: 700,
        color: '#111',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        margin: 0,
        maxWidth: '700px',
      }}>
        {t('contact.title')}
      </h1>
      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.35rem)',
        color: '#333',
        margin: 0,
        maxWidth: '500px',
        lineHeight: 1.6,
        opacity: 0.85,
      }}>
        {t('contact.subtitle')}
      </p>
      <SignUpButton forceRedirectUrl="/dashboard">
    <Button size="lg" style={{ backgroundColor: '#e91e63', color: '#fff', fontSize: '1rem', padding: '0.75rem 2.5rem', marginTop: '0.5rem' }}>
        {t('contact.cta')}
    </Button>
</SignUpButton>
    </section>
  )
}

export default Contact