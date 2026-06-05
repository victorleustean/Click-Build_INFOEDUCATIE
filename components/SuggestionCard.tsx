'use client'

import { Button } from '@/components/ShadCN/button'
import { RefreshCw, Check } from 'lucide-react'

type Suggestion = {
  title: string
  audience: string
  colors: string[]
}

type Props = {
  suggestion: Suggestion | null
  loading: boolean
  onAccept: (s: Suggestion) => void
  onReject: () => void
}

export default function SuggestionCard({ suggestion, loading, onAccept, onReject }: Props) {
  if (loading) {
    return (
      <div style={{
        margin: '0.75rem', padding: '1rem', borderRadius: '12px',
        border: '1px solid rgba(0,0,0,0.08)', background: '#fff',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        fontSize: '0.85rem', color: '#aaa',
      }}>
        <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
        Se generează sugestii...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!suggestion) return null

  return (
    <div style={{
      margin: '0.75rem', padding: '1rem', borderRadius: '12px',
      border: '1px solid rgba(233,30,99,0.2)', background: '#fff',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>
      <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Sugestie AI
      </p>

      <div>
        <p style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: 700, color: '#111' }}>
          {suggestion.title}
        </p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>
          {suggestion.audience}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        {suggestion.colors.map((color, i) => (
          <div key={i} style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: color, border: '1px solid rgba(0,0,0,0.1)',
          }} title={color} />
        ))}
        <span style={{ fontSize: '0.75rem', color: '#aaa', marginLeft: '0.25rem' }}>
          {suggestion.colors.join(' · ')}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          size="sm"
          style={{ flex: 1, background: '#e91e63', color: '#fff', gap: '0.4rem' }}
          onClick={() => onAccept(suggestion)}
        >
          <Check size={13} /> Acceptă
        </Button>
        <Button
          size="sm"
          variant="outline"
          style={{ flex: 1, gap: '0.4rem' }}
          onClick={onReject}
        >
          <RefreshCw size={13} /> Regenerează
        </Button>
      </div>
    </div>
  )
}