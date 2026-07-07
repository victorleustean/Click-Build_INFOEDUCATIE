'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { runSimulation, summary, type SimPoint } from '@/lib/benchmark/simulate'
import { TrendingUp, Play } from 'lucide-react'

export default function BenchmarkSection()
{
  const [data, setData] = useState<SimPoint[] | null>(null)
  const [running, setRunning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)


  useEffect(() =>
  {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])


  const handleRun = () =>
  {
    setRunning(true)
    setTimeout(() =>
    {
      setData(runSimulation())
      setRunning(false)
    }, 100)
  }

  const stats = data ? summary(data) : null

  return (
    <section style={{
      padding: isMobile ? '3.5rem 1.25rem' : '5rem 1.5rem', background: '#fff',
      fontFamily: 'var(--font-jakarta), sans-serif',
    }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>


        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: '#fbeaf0', border: '1px solid rgba(233,30,99,0.15)',
            borderRadius: 20, padding: '0.3rem 0.9rem', marginBottom: '1rem',
          }}>
            <TrendingUp size={12} color="#e91e63" />
            <span style={{ fontSize: '0.75rem', color: '#e91e63', fontWeight: 600, marginTop: '5rem' }}>Tehnologie proprie · DCS</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Editezi de 50 de ori. Costul rămâne mic.
          </h2>
          <p style={{ color: '#888', margin: '1rem auto 0', fontSize: isMobile ? '0.95rem' : '1.05rem', maxWidth: 640, lineHeight: 1.6 }}>
            Majoritatea generatoarelor AI retrimit toată conversația la fiecare modificare, iar costul explodează.
            Sistemul nostru de gestionare a contextului (DCS) injectează doar ce e relevant — așa editările rămân
            rapide și ieftine oricât de mult lucrezi la site.
          </p>
        </div>


        {!data && (
          <div style={{ textAlign: 'center' }}>
            <button onClick={handleRun} disabled={running} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#e91e63', color: '#fff', border: 'none',
              padding: '0.85rem 1.75rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600,
              cursor: running ? 'default' : 'pointer', opacity: running ? 0.7 : 1,
              fontFamily: 'var(--font-jakarta), sans-serif',
            }}>
              <Play size={16} /> {running ? 'Se rulează...' : 'Rulează simularea'}
            </button>
          </div>
        )}


        {data && stats && (
          <>
            <div style={{ background: '#fafafa', borderRadius: 16, padding: isMobile ? '1rem 0.5rem 0.5rem' : '1.5rem 1rem 1rem', border: '1px solid rgba(0,0,0,0.07)' }}>
              <ResponsiveContainer width="100%" height={isMobile ? 300 : 380}>
                <LineChart data={data} margin={{ top: 10, right: isMobile ? 10 : 24, left: isMobile ? 0 : 6, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ececec" />
                  <XAxis
                    dataKey="edit"
                    label={isMobile ? undefined : { value: 'Numărul editării', position: 'insideBottom', offset: -10, fontSize: 13, fill: '#999' }}
                    tick={{ fontSize: 11, fill: '#bbb' }}
                  />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    label={isMobile ? undefined : { value: 'Tokeni trimiși', angle: -90, position: 'insideLeft', fontSize: 13, fill: '#999' }}
                    tick={{ fontSize: 11, fill: '#bbb' }}
                    width={isMobile ? 36 : 60}
                  />
                  <Tooltip
                    formatter={(value: number) => [value.toLocaleString('ro-RO') + ' tokeni', '']}
                    labelFormatter={(label) => `Editarea ${label}`}
                    contentStyle={{ borderRadius: 10, border: '1px solid #eee', fontSize: 13 }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="line" wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
                  <Line type="monotone" dataKey="naiveTokens" name="Abordare clasică" stroke="#bbb" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="dcsTokens" name="Click && Build (DCS)" stroke="#e91e63" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p style={{ textAlign: 'center', margin: '1.5rem 0 0', fontSize: isMobile ? '0.92rem' : '1rem', color: '#555' }}>
              La a {stats.lastEdit}-a editare: <strong style={{ color: '#e91e63', fontWeight: 700 }}>{stats.economiePercent}% mai puțini tokeni</strong> decât abordarea clasică.
            </p>
          </>
        )}

      </div>
    </section>
  )
}