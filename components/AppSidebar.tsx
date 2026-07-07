'use client'

import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ShadCN/sheet'
import { ScrollArea } from '@/components/ShadCN/scroll-area'
import { Button } from '@/components/ShadCN/button'
import { PanelLeft, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Site = {
  id: string
  name: string
  title: string | null
  updated_at: string
}

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
    <svg width="22" height="22" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M105,52 A48,48 0 1,0 105,148" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
      <line x1="112" y1="52" x2="112" y2="148" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
      <path d="M112,52 Q148,52 148,76 Q148,100 112,100" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
      <path d="M112,100 Q152,100 152,124 Q152,148 112,148" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="76" cy="164" r="6" fill="#111" opacity="0.4"/>
    </svg>
    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Click &amp;&amp; Build</span>
  </div>
)


function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 60) return 'recent'
  const h = Math.floor(min / 60)
  if (h < 24) return `acum ${h}h`
  const d = Math.floor(h / 24)
  if (d === 1) return 'ieri'
  if (d < 7) return `acum ${d} zile`
  return new Date(iso).toLocaleDateString('ro-RO')
}

const SidebarContent = () => {
  const router = useRouter()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  //incarcam site-urile reale la deschiderea sidebar-ului
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/sites')
        const data = await res.json()
        if (data.sites) setSites(data.sites)
      } catch {
        console.error('Sites fetch failed')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <Logo />
        <Button
          size="sm"
          style={{ width: '100%', marginTop: '0.85rem', background: '#e91e63', color: '#fff', gap: '0.4rem' }}
          onClick={() => router.push('/dashboard')}
        >
          <Plus size={13} /> Site nou
        </Button>
      </div>

      <ScrollArea style={{ flex: 1 }}>
        <div style={{ padding: '0.75rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem 0.25rem' }}>
            Site-urile tale
          </p>

          {loading ? (
            <p style={{ fontSize: '0.8rem', color: '#bbb', padding: '0.25rem' }}>Se încarcă...</p>
          ) : sites.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#bbb', padding: '0.25rem' }}>Niciun site încă</p>
          ) : (
            sites.map(site => (
              <button key={site.id} style={{
                width: '100%', textAlign: 'left', padding: '0.55rem 0.75rem',
                borderRadius: '8px', border: 'none', background: 'transparent',
                cursor: 'pointer', marginBottom: '2px', fontFamily: 'var(--font-jakarta), sans-serif',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                onClick={() => router.push(`/dashboard/editor/${site.id}`)}
              >
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: '#111' }}>{site.title || site.name}</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#aaa' }}>{timeAgo(site.updated_at)}</p>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <UserButton />
        <div>
          <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500, color: '#111' }}>Contul meu</p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#aaa' }}>Plan Gratuit</p>
        </div>
      </div>
    </div>
  )
}

export default function AppSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" style={{ width: '34px', height: '34px' }}>
          <PanelLeft size={17} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" style={{ padding: 0, width: '260px', fontFamily: 'var(--font-jakarta), sans-serif' }}>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )
}