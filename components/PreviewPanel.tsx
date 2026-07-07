'use client'

import { buildPreviewHtml } from '@/lib/preview/buildHtml'
import { Globe, RotateCcw } from 'lucide-react'


type Tab = 'preview' | 'cod' | 'istoric'

type Version = { id: string; version_number: number; instruction: string | null; created_at: string }

type Props = {
  code: string | null
  loading: boolean
  activeTab: Tab
  versions: Version[]
  currentVersion: number
  versionsLoading: boolean
  rollbackLoading: boolean
  onRollback: (version: number) => void
}

export default function PreviewPanel({ code, loading, activeTab, versions, currentVersion, versionsLoading, rollbackLoading, onRollback }: Props) {
  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7f7f7',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f0f0f0',
            borderTop: '3px solid #e91e63',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />

        <p style={{ color: '#aaa', fontSize: '0.85rem' }}>
          Se generează site-ul...
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minHeight: 0,
      }}
    >
      {activeTab === 'preview' && (
        code ? (
          <iframe
            key={code}
            srcDoc={buildPreviewHtml(code)}
            sandbox="allow-scripts"
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              minHeight: 0,
              border: 'none',
              background: '#ffffff',
            }}
            title="Preview site"
          />
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f7f7f7',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: '#efefef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Globe size={28} color="#ddd" />
            </div>

            <p
              style={{
                margin: 0,
                fontSize: '0.95rem',
                color: '#ccc',
                fontWeight: 500,
              }}
            >
              Preview site
            </p>

            <p style={{ margin: 0, fontSize: '0.8rem', color: '#ddd' }}>
              Apare după prima generare
            </p>
          </div>
        )
      )}

      {activeTab === 'cod' && (
        <div
          style={{
            flex: 1,
            background: '#0a0a0a',
            overflow: 'auto',
            padding: '1.5rem',
          }}
        >
          <pre
            style={{
              color: '#e5e5e5',
              fontSize: '0.8rem',
              lineHeight: 1.7,
              margin: 0,
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
            }}
          >
            {code || '// codul generat apare aici'}
          </pre>
        </div>
      )}

      {activeTab === 'istoric' && (
        <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem', background: '#fafafa' }}>
          {versionsLoading ? (
            <p style={{ color: '#bbb', fontSize: '0.85rem' }}>Se încarcă istoricul...</p>
          ) : versions.length === 0 ? (
            <p style={{ color: '#bbb', fontSize: '0.85rem' }}>Niciun istoric încă.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 640, margin: '0 auto' }}>
              {versions.map(v => {
                const isCurrent = v.version_number === currentVersion
                return (
                  <div key={v.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                    padding: '0.75rem 1rem', borderRadius: '10px',
                    border: isCurrent ? '1px solid #e91e63' : '1px solid rgba(0,0,0,0.08)',
                    background: isCurrent ? '#fdf2f6' : '#fff',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isCurrent ? '#e91e63' : '#f0f0f0',
                        color: isCurrent ? '#fff' : '#888', fontSize: '0.78rem', fontWeight: 700,
                      }}>
                        v{v.version_number}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {v.version_number === 0 ? 'Generare inițială' : (v.instruction || 'Modificare')}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#aaa' }}>
                          {new Date(v.created_at).toLocaleString('ro-RO')}
                        </p>
                      </div>
                    </div>
                    {isCurrent ? (
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#e91e63', flexShrink: 0 }}>curent</span>
                    ) : (
                      <button
                        onClick={() => onRollback(v.version_number)}
                        disabled={rollbackLoading}
                        style={{
                          flexShrink: 0, padding: '0.4rem 0.8rem', borderRadius: '8px',
                          border: '1px solid rgba(0,0,0,0.12)', background: '#fff',
                          cursor: rollbackLoading ? 'default' : 'pointer',
                          fontSize: '0.78rem', fontWeight: 500, color: '#555',
                          fontFamily: 'var(--font-jakarta), sans-serif',
                          display: 'flex', alignItems: 'center', gap: '0.35rem',
                          opacity: rollbackLoading ? 0.6 : 1,
                        }}
                      >
                        <RotateCcw size={13} /> Revino
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}