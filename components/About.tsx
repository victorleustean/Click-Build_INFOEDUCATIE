'use client'

import React from 'react'
import ElectricBorder from './React_Bits/ElectricBorder'
import { Card, CardContent } from './ShadCN/card'
import { Button } from './ShadCN/button'
import { Wand2, Zap, Globe } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const About = () => {
  const { t } = useLanguage()

  const cards = [
    {
      icon: <Wand2 size={32} color="#e91e63" />,
      title: t('about.card1.title'),
      description: t('about.card1.desc'),
    },
    {
      icon: <Zap size={32} color="#e91e63" />,
      title: t('about.card2.title'),
      description: t('about.card2.desc'),
    },
    {
      icon: <Globe size={32} color="#e91e63" />,
      title: t('about.card3.title'),
      description: t('about.card3.desc'),
    },
  ]

  return (
    <section style={{
      padding: '5rem 1.5rem',
      textAlign: 'center',
      background: 'linear-gradient(to bottom, rgba(233,30,99,0.08) 0%, rgba(255,255,255,0) 100%)',
    }}>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 3rem 0' }}>
        {t('about.title')}
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
        {cards.map((card, i) => (
          <ElectricBorder key={i} color="#e91e63" speed={1} chaos={0.12} style={{ borderRadius: 16 }}>
            <Card style={{ width: '280px', height: '350px', padding: '2rem', textAlign: 'left' }}>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {card.icon}
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111', margin: 0 }}>{card.title}</h2>
                <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6, margin: 0 }}>{card.description}</p>
              </CardContent>
            </Card>
          </ElectricBorder>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <Button size="lg" style={{ backgroundColor: '#e91e63', color: '#fff', fontSize: '1rem', padding: '0.75rem 2rem' }}>
          {t('about.cta')}
        </Button>
      </div>
    </section>
  )
}

export default About