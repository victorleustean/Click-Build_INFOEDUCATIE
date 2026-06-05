//pagina principala de constructie a siteurilor, partea de chat cu ai e in stanga 
//preview-ul codului,codul propriu-zis si paginile sunt in dreapta 
//sugestiile sunt generate autmoat din promptul provenit din start
'use client'


import { useState, useRef, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ShadCN/button'
import { ScrollArea } from '@/components/ShadCN/scroll-area'
import { ArrowRight, Globe } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import SuggestionCard from './SuggestionCard'
import AppSidebar from './AppSidebar'


type Message = { role: 'user' | 'ai'; text: string }
type Suggestion = { title: string; audience: string; colors: string[] }


const tabs = ['preview', 'cod', 'pagini'] as const
type Tab = typeof tabs[number]


export default function EditorPage({ siteId }: { siteId: string }) {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get('prompt')

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
  const [suggestionAccepted, setSuggestionAccepted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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


  useEffect(() => {
    if (initialPrompt) fetchSuggestion(initialPrompt)
  }, [initialPrompt])


  const handleAccept = (s: Suggestion) => {
    setSuggestionAccepted(true)
    console.log('Accepted:', s)
  }


  const handleReject = () => {
    setSuggestion(null)
    if (initialPrompt) fetchSuggestion(initialPrompt)
  }


  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [
      ...prev,
      { role: 'user', text: input },
      { role: 'ai', text: 'Am înțeles! Aplic modificarea acum...' }
    ])
    setInput('')
  }


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
          <span style={{ fontSize: '0.8rem', color: '#ddd' }}>|</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#555' }}>
            {suggestionAccepted && suggestion ? suggestion.title : 'Site nou'}
          </span>
        </div>


        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {suggestionAccepted && suggestion && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {suggestion.colors.map((c, i) => (
                <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }} />
              ))}
            </div>
          )}
          <Button size="sm" style={{ background: '#e91e63', color: '#fff', gap: '0.4rem' }}>
            <Globe size={13} /> Publică
          </Button>
          <UserButton />
        </div>
      </header>


      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>


        {/* chat panel */}
        <div style={{
          width: '360px', flexShrink: 0,
          borderRight: '1px solid rgba(0,0,0,0.07)',
          display: 'flex', flexDirection: 'column', background: '#fff',
        }}>


          {/* cardul de sugestii */}
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
              <button onClick={handleSend} style={{
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                background: input.trim() ? '#e91e63' : '#e5e5e5', border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}>
                <ArrowRight size={14} color={input.trim() ? '#fff' : '#bbb'} />
              </button>
            </div>
          </div>
        </div>


        {/* preview panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>


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


          {/* continutul taburilor*/}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
            {activeTab === 'preview' && (
              <div style={{ textAlign: 'center', color: '#bbb' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: '#efefef', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 1rem',
                }}>
                  <Globe size={28} color="#ddd" />
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, color: '#ccc' }}>Preview site</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#ddd' }}>Apare după prima generare</p>
              </div>
            )}
            {activeTab === 'cod' && (
              <div style={{ width: '100%', height: '100%', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#444', fontSize: '0.85rem', fontFamily: 'monospace' }}>// codul generat apare aici</p>
              </div>
            )}
            {activeTab === 'pagini' && (
              <div style={{ textAlign: 'center', color: '#ccc' }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Nicio pagină încă</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

