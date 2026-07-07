//pagina de start a siteului contine un rand pentru introducerea promptului,sugestii
//rapide si siteuri deja faacute de user
//latrimiterea promptului userul e redirectionat catre editor page folosind
//useRouter din nextjs 

'use client'


import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { ArrowRight, Wand2, ShoppingBag, FileText, Utensils, Briefcase } from 'lucide-react'
import AppSidebar from './AppSidebar'
import { useRouter } from 'next/navigation'


type Site = {
  id: string
  name: string
  title: string | null
  current_version: number
  updated_at: string
  subdomain: string | null
}


const suggestions = [
  { label: 'Portfolio', icon: Briefcase },
  { label: 'Magazin online', icon: ShoppingBag },
  { label: 'Blog', icon: FileText },
  { label: 'Restaurant', icon: Utensils },
]


//transforma un timestamp intr-un text relativ (ex: "acum 3 zile")
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'chiar acum'
  if (min < 60) return `acum ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `acum ${h} ${h === 1 ? 'oră' : 'ore'}`
  const d = Math.floor(h / 24)
  if (d === 1) return 'ieri'
  if (d < 7) return `acum ${d} zile`
  const w = Math.floor(d / 7)
  if (w < 4) return `acum ${w} ${w === 1 ? 'săptămână' : 'săptămâni'}`
  return new Date(iso).toLocaleDateString('ro-RO')
}


export default function StartPage() {
  const [prompt, setPrompt] = useState('')
  const [sites, setSites] = useState<Site[]>([])
  const [sitesLoading, setSitesLoading] = useState(true)


  //folosind react router evitam refresh-ul la schimbarea paginilor
  const router=useRouter();


  //incarcam site-urile reale ale userului la mount
  useEffect(() => {
    const loadSites = async () => {
      try {
        const res = await fetch('/api/sites')
        const data = await res.json()
        if (data.sites) setSites(data.sites)
      } catch {
        console.error('Sites fetch failed')
      } finally {
        setSitesLoading(false)
      }
    }
    loadSites()
  }, [])


  //encode uri component e folosit pentru a putea trimite promptul in url
  //schimba promptul in forma:brutaria%20petru
  const handleSubmit = () => {
    if (!prompt.trim()) return
    router.push(`/dashboard/editor/new?prompt=${encodeURIComponent(prompt)}`)
  }
 


  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'var(--font-jakarta), sans-serif', display: 'flex', flexDirection: 'column' }}>


      {/* topbar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.75rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)',
        background: '#fff', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AppSidebar />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <svg width="22" height="22" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M105,52 A48,48 0 1,0 105,148" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
              <line x1="112" y1="52" x2="112" y2="148" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
              <path d="M112,52 Q148,52 148,76 Q148,100 112,100" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
              <path d="M112,100 Q152,100 152,124 Q152,148 112,148" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
              <circle cx="76" cy="164" r="6" fill="#111" opacity="0.4"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Click &amp;&amp; Build</span>
          </div>
        </div>
        <UserButton />
      </header>

 
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', gap: '2rem' }}>


        {/* titlu */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: '#fbeaf0', border: '1px solid rgba(233,30,99,0.15)',
            borderRadius: '20px', padding: '0.3rem 0.9rem', marginBottom: '1.25rem',
          }}>
            <Wand2 size={12} color="#e91e63" />
            <span style={{ fontSize: '0.75rem', color: '#e91e63', fontWeight: 600 }}>AI Website Generator</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Ce site construim azi?
          </h1>
          <p style={{ color: '#888', margin: '0.75rem 0 0', fontSize: '1rem' }}>
            Descrie-l în câteva cuvinte și AI-ul se ocupă de rest
          </p>
        </div>


        {/* input */}
        <div style={{
          width: '100%', maxWidth: '620px', background: '#fff',
          border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '16px',
          padding: '1rem 1rem 1rem 1.25rem',
          display: 'flex', alignItems: 'flex-end', gap: '0.75rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
            placeholder="ex: un site pentru brutăria mea din Cluj, cu meniu și formular de contact..."
            rows={2}
            style={{
              flex: 1, border: 'none', outline: 'none', resize: 'none',
              fontSize: '0.95rem', color: '#111', background: 'transparent',
              fontFamily: 'var(--font-jakarta), sans-serif', lineHeight: 1.5,
            }}
          />
          <button onClick={handleSubmit} style={{
            width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
            background: prompt.trim() ? '#e91e63' : '#f0f0f0', border: 'none',
            cursor: prompt.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}>
            <ArrowRight size={16} color={prompt.trim() ? '#fff' : '#bbb'} />
          </button>
        </div>


        {/* sugestii */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {suggestions.map(({ label, icon: Icon }) => (
            <button key={label} onClick={() => setPrompt(label)} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem', borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.1)', background: '#fff',
              cursor: 'pointer', fontSize: '0.85rem', color: '#555',
              fontFamily: 'var(--font-jakarta), sans-serif', transition: 'border-color 0.15s, color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#e91e63'; e.currentTarget.style.color = '#e91e63' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = '#555' }}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>


        {/* site-uri recente */}
        <div style={{ width: '100%', maxWidth: '620px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>
            Site-urile tale recente
          </p>

          {sitesLoading ? (
            <p style={{ fontSize: '0.85rem', color: '#bbb' }}>Se încarcă...</p>
          ) : sites.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#bbb' }}>Încă nu ai site-uri. Creează primul mai sus!</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.6rem',
            }}>
              {sites.map(site => (
                <button key={site.id} style={{
                  textAlign: 'left', padding: '0.85rem 1rem', borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.08)', background: '#fff',
                  cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#e91e63'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(233,30,99,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                  onClick={() => router.push(`/dashboard/editor/${site.id}`)}
                >
                  <p style={{ margin: '0 0 2px', fontSize: '0.875rem', fontWeight: 600, color: '#111' }}>{site.title || site.name}</p>
                  <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#aaa' }}>{timeAgo(site.updated_at)}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#e91e63', opacity: 0.7 }}>
                    {site.subdomain ? `${site.subdomain}.clickandbuild.ro` : `v${site.current_version}`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}