'use client'

import { Contrast } from 'lucide-react'
import { useAccessibility } from '@/lib/a11y/AccessabilityContext'

export default function ContrastFAB()
{
  const { highContrast, toggleContrast } = useAccessibility()

  return (
    <button
      onClick={toggleContrast}
      aria-label={highContrast ? 'Dezactivează contrastul ridicat' : 'Activează contrastul ridicat'}
      aria-pressed={highContrast}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 2000,
        width: '52px',
        height: '52px',
        borderRadius: '9999px',
        border: 'none',
        cursor: 'pointer',
        background: highContrast ? '#111' : '#fff',
        boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
      }}
    >
      <Contrast size={22} color={highContrast ? '#fff' : '#333'} />
    </button>
  )
}