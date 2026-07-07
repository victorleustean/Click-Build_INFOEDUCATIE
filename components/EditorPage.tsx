//pagina principala de constructie a siteurilor, partea de chat cu ai e in stanga 
//preview-ul codului,codul propriu-zis si istoricul versiunilor sunt in dreapta 
//sugestiile sunt generate autmoat din promptul provenit din start
'use client'


import { useState, useRef, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ShadCN/button'
import { ScrollArea } from '@/components/ShadCN/scroll-area'
import { ArrowRight, Globe, MessageSquare, Eye } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import SuggestionCard from './SuggestionCard'
import AppSidebar from './AppSidebar'
import PreviewPanel from './PreviewPanel'


type Message = { role: 'user' | 'ai'; text: string }
type Suggestion = { title: string; audience: string; colors: string[] }
type Version = { id: string; version_number: number; instruction: string | null; created_at: string }


const tabs = ['preview', 'cod', 'istoric'] as const
type Tab = typeof tabs[number]


export default function EditorPage({ siteId: routeSiteId }: { siteId: string }) {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get('prompt')

  //un site existent se deschide cand siteId din URL e real (nu "new")
  const isExisting = !!routeSiteId && routeSiteId !== 'new'

  //daca userul vine din start page promptul sau se afiseaza sub mesajul de bun venit 
  //folosind promptul sau, daca nu afiseaza doar mesajul de bun venit
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Salut! Descrie-mi site-ul și îl construim împreună.' },
    ...(initialPrompt ? [{ role: 'user' as const, text: initialPrompt }] : []),
  ])
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('preview')
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  //daca site-ul exista deja, sarim peste cardul de sugestii (a fost deja acceptat candva)
  const [suggestionAccepted, setSuggestionAccepted] = useState(isExisting)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [buildLoading, setBuildLoading] = useState(false)

  //siteId-ul real: din URL daca site-ul exista deja, altfel null pana se salveaza la build
  const [siteId, setSiteId] = useState<string | null>(isExisting ? routeSiteId : null)
  const [editLoading, setEditLoading] = useState(false)
  //incarcarea unui site existent la deschidere
  const [siteLoading, setSiteLoading] = useState(isExisting)
  //titlul site-ului existent (din DB), pentru bara de sus
  const [siteName, setSiteName] = useState<string | null>(null)

  //istoricul versiunilor (DCS timeline) + starea de rollback
  const [versions, setVersions] = useState<Version[]>([])
  const [currentVersion, setCurrentVersion] = useState<number>(0)
  const [versionsLoading, setVersionsLoading] = useState(false)
  const [rollbackLoading, setRollbackLoading] = useState(false)

  //pentru publicarea siteului
  const [publishing, setPublishing] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)

  //layout mobil: comutam intre chat si preview (pe desktop ambele sunt vizibile)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat')

  //detectam ecranul mic 
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  //de fiecare data cand se schimba messages pagina face scroll smooth la ultimul mesaj 
  //se re-ruleaza dpar cand messages se schimba
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  //facem un request catre functia serverless din backkend /api/suggestion
  const fetchSuggestion = async (prompt: string) => {
    setSuggestionLoading(true)
    try {
      const res = await fetch('/api/suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setSuggestion(data)
    } catch {
      console.error('Suggestion fetch failed')
    } finally {
      setSuggestionLoading(false)
    }
  }


  //la deschiderea unui site existent generam sugestii doar daca e site nou cu prompt
  useEffect(() => {
    if (!isExisting && initialPrompt) fetchSuggestion(initialPrompt)
  }, [initialPrompt, isExisting])


  //incarcam codul curent al unui site existent la mount
  useEffect(() => {
    if (!isExisting) return

    const loadSite = async () => {
      setSiteLoading(true)
      try {
        const res = await fetch(`/api/site/${routeSiteId}`)
        const data = await res.json()
        if (data.site) {
          setGeneratedCode(data.site.current_code)
          setSiteName(data.site.title || data.site.name)
          //daca e deja publicat, pregatim link-ul public
          if (data.site.subdomain) {
            setPublishedUrl(`${window.location.origin}/s/${data.site.subdomain}`)
          }
        }
      } catch {
        console.error('Site load failed')
      } finally {
        setSiteLoading(false)
      }
    }

    loadSite()
  }, [isExisting, routeSiteId])


  //incarcam istoricul versiunilor pentru timeline
  const loadVersions = async () => {
    if (!siteId) return
    setVersionsLoading(true)
    try {
      const res = await fetch(`/api/site/${siteId}/versions`)
      const data = await res.json()
      if (data.versions) setVersions(data.versions)
      if (typeof data.currentVersion === 'number') setCurrentVersion(data.currentVersion)
    } catch {
      console.error('Versions fetch failed')
    } finally {
      setVersionsLoading(false)
    }
  }


  //reincarcam istoricul cand deschidem tab-ul sau cand se schimba codul (dupa edit/rollback)
  useEffect(() => {
    if (activeTab === 'istoric' && siteId) loadVersions()
  }, [activeTab, siteId, generatedCode])


  const handleAccept = async (s: Suggestion) => {
    setSuggestionAccepted(true)
    setBuildLoading(true)
    //pe mobil aratam preview-ul ca sa vada generarea
    setMobileView('preview')
    try {
      const res = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: initialPrompt, title: s.title, colors: s.colors }),
      })
      const data = await res.json()
      if (data.code) setGeneratedCode(data.code)
      if (data.siteId) setSiteId(data.siteId)   //retinem site-ul salvat pentru editari
    } catch {
      console.error('Build failed')
    } finally {
      setBuildLoading(false)
    }
  }


  const handleReject = () => {
    setSuggestion(null)
    if (initialPrompt) fetchSuggestion(initialPrompt)
  }


  //fiecare mesaj declanseaza un edit prin /api/edit (DCS injecteaza contextul relevant)
  const handleSend = async () => {
    if (!input.trim() || editLoading || buildLoading) return
    if (!siteId) {
      //site-ul inca nu e salvat (generarea initiala nu s-a terminat)
      setMessages(prev => [...prev, { role: 'ai', text: 'Așteaptă să se termine generarea inițială.' }])
      return
    }

    const instruction = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: instruction }])
    setEditLoading(true)

    try {
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, instruction }),
      })
      const data = await res.json()

      if (data.code) {
        setGeneratedCode(data.code)   //re-randeaza preview-ul (iframe-ul are key={code})
        setMessages(prev => [...prev, { role: 'ai', text: 'Am aplicat modificarea.' }])
        setMobileView('preview')   //pe mobil comutam la preview ca sa vada rezultatul
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Nu am putut aplica modificarea.' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'A apărut o eroare la editare.' }])
    } finally {
      setEditLoading(false)
    }
  }


  //rollback la o versiune anterioara — reconstruieste codul din lantul de delte
  const handleRollback = async (version: number) => {
    if (!siteId || rollbackLoading) return
    setRollbackLoading(true)
    try {
      const res = await fetch(`/api/site/${siteId}/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version }),
      })
      const data = await res.json()
      if (data.code) {
        setGeneratedCode(data.code)
        setActiveTab('preview')   //sarim inapoi la preview ca sa vada rezultatul
        setMobileView('preview')  //pe mobil comutam la preview
        setMessages(prev => [...prev, { role: 'ai', text: `Am revenit la versiunea ${version}.` }])
      }
    } catch {
      console.error('Rollback failed')
    } finally {
      setRollbackLoading(false)
    }
  }

  //butonul de trimitere e activ doar cand putem edita
  const canSend = !!input.trim() && !!siteId && !editLoading && !buildLoading

  //ce afisam in bara de sus ca nume
  const headerTitle = siteName || (suggestionAccepted && suggestion ? suggestion.title : 'Site nou')

  //publica site-ul — genereaza un subdomain si afiseaza link-ul public
  const handlePublish = async () => {
    if (!siteId || publishing) return
    setPublishing(true)
    try {
      const res = await fetch(`/api/site/${siteId}/publish`, { method: 'POST' })
      const data = await res.json()
      if (data.subdomain) {
        const url = `${window.location.origin}/s/${data.subdomain}`
        setPublishedUrl(url)
        setMessages(prev => [...prev, { role: 'ai', text: `Site publicat! Link: ${url}` }])
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Publicarea a eșuat.' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'A apărut o eroare la publicare.' }])
    } finally {
      setPublishing(false)
    }
  }

  //pe desktop ambele panouri sunt vizibile; pe mobil doar cel selectat
  const showChat = !isMobile || mobileView === 'chat'
  const showPreview = !isMobile || mobileView === 'preview'


  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-jakarta), sans-serif', background: '#fafafa' }}>


      {/* bara de sus */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.6rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.07)',
        background: '#fff', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AppSidebar />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <svg width="20" height="20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M105,52 A48,48 0 1,0 105,148" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
              <line x1="112" y1="52" x2="112" y2="148" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
              <path d="M112,52 Q148,52 148,76 Q148,100 112,100" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
              <path d="M112,100 Q152,100 152,124 Q152,148 112,148" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round"/>
              <circle cx="76" cy="164" r="6" fill="#111" opacity="0.4"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Click &amp;&amp; Build</span>
          </div>
          {/* numele site-ului — ascuns pe mobil ca sa nu se inghesuie */}
          {!isMobile && (
            <>
              <span style={{ fontSize: '0.8rem', color: '#ddd' }}>|</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#555' }}>
                {headerTitle}
              </span>
            </>
          )}
        </div>


        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {suggestionAccepted && suggestion && !isMobile && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {suggestion.colors.map((c, i) => (
                <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }} />
              ))}
            </div>
          )}
          {publishedUrl ? (
            <Button
              size="sm"
              onClick={() => window.open(publishedUrl, '_blank')}
              style={{ background: '#111', color: '#fff', gap: '0.4rem' }}
            >
              <Globe size={13} /> Vezi site
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={!siteId || publishing}
              style={{
                background: siteId ? '#e91e63' : '#ccc',
                color: '#fff', gap: '0.4rem',
                cursor: siteId && !publishing ? 'pointer' : 'default',
              }}
            >
              <Globe size={13} /> {publishing ? 'Se publică...' : 'Publică'}
            </Button>
          )}
          {/* managerul Clerk — ascuns pe mobil (e deja in sidebar) */}
          {!isMobile && <UserButton />}
        </div>
      </header>


      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>


        {/* chat panel — pe mobil full-width si doar cand mobileView e 'chat' */}
        <div style={{
          width: isMobile ? '100%' : '360px', flexShrink: 0,
          borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,0.07)',
          display: showChat ? 'flex' : 'none', flexDirection: 'column', background: '#fff',
        }}>


          {/* cardul de sugestii — doar pentru site nou */}
          {!suggestionAccepted && (
            <SuggestionCard
              suggestion={suggestion}
              loading={suggestionLoading}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          )}


          {/* mesaje */}
          <ScrollArea style={{ flex: 1, padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '80%', padding: '0.6rem 0.9rem',
                    borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: msg.role === 'user' ? '#e91e63' : '#f4f4f5',
                    color: msg.role === 'user' ? '#fff' : '#111',
                    fontSize: '0.875rem', lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>


          {/* input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: '0.5rem',
              background: '#f7f7f7', borderRadius: '12px',
              padding: '0.6rem 0.6rem 0.6rem 1rem',
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder="Descrie o modificare..."
                rows={1}
                style={{
                  flex: 1, border: 'none', outline: 'none', resize: 'none',
                  fontSize: '0.875rem', background: 'transparent',
                  fontFamily: 'var(--font-jakarta), sans-serif', lineHeight: 1.5, color: '#111',
                }}
              />
              <button onClick={handleSend} disabled={!canSend} style={{
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                background: canSend ? '#e91e63' : '#e5e5e5', border: 'none',
                cursor: canSend ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}>
                <ArrowRight size={14} color={canSend ? '#fff' : '#bbb'} />
              </button>
            </div>
          </div>
        </div>


        {/* preview panel — pe mobil full-width si doar cand mobileView e 'preview' */}
        <div style={{ flex: 1, display: showPreview ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden' }}>


          {/* taburile */}
          <div style={{
            display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.07)',
            background: '#fff', padding: '0 1rem', flexShrink: 0,
          }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '0.65rem 1rem', border: 'none', background: 'transparent',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                color: activeTab === tab ? '#e91e63' : '#888',
                borderBottom: activeTab === tab ? '2px solid #e91e63' : '2px solid transparent',
                fontFamily: 'var(--font-jakarta), sans-serif',
                textTransform: 'capitalize', transition: 'color 0.15s',
              }}>
                {tab}
              </button>
            ))}
          </div>


          {/* continutul taburilor — siteLoading arata spinner la incarcarea unui site existent */}
          <PreviewPanel
            code={generatedCode}
            loading={buildLoading || editLoading || siteLoading}
            activeTab={activeTab}
            versions={versions}
            currentVersion={currentVersion}
            versionsLoading={versionsLoading}
            rollbackLoading={rollbackLoading}
            onRollback={handleRollback}
          />
        </div>
      </div>


      {/* comutator Chat/Preview — doar pe mobil */}
      {isMobile && (
        <div style={{
          display: 'flex', borderTop: '1px solid rgba(0,0,0,0.08)',
          background: '#fafafa', flexShrink: 0,
        }}>
          <button onClick={() => setMobileView('chat')} style={{
            flex: 1, padding: '0.7rem 0', border: 'none', cursor: 'pointer',
            background: mobileView === 'chat' ? '#fff' : 'transparent',
            borderTop: mobileView === 'chat' ? '2px solid #e91e63' : '2px solid transparent',
            color: mobileView === 'chat' ? '#e91e63' : '#999',
            fontSize: '0.8rem', fontWeight: 500, fontFamily: 'var(--font-jakarta), sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
          }}>
            <MessageSquare size={14} /> Chat
          </button>
          <button onClick={() => setMobileView('preview')} style={{
            flex: 1, padding: '0.7rem 0', border: 'none', cursor: 'pointer',
            background: mobileView === 'preview' ? '#fff' : 'transparent',
            borderTop: mobileView === 'preview' ? '2px solid #e91e63' : '2px solid transparent',
            color: mobileView === 'preview' ? '#e91e63' : '#999',
            fontSize: '0.8rem', fontWeight: 500, fontFamily: 'var(--font-jakarta), sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
          }}>
            <Eye size={14} /> Preview
          </button>
        </div>
      )}
    </div>
  )
}