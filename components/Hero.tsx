'use client'

import React, { useState, useEffect } from 'react'
import Grainient from '@/components/React_Bits/Grainient'
import BubbleMenu from './React_Bits/BubbleMenu';
import { Button } from './ShadCN/button';
import TextType from './React_Bits/TextType';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { useLanguage } from '@/lib/i18n/LanguageContext';


const Hero = () => {
  const { t, lang, setLang } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)

  //detectam ecranul mic ca sa simplificam navbar-ul pe mobil
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const items = [
    { label: t('nav.home'), href: '#acasa', ariaLabel: t('nav.home'), rotation: -8, hoverStyles: { bgColor: '#e91e63', textColor: '#ffffff' } },
    { label: t('nav.about'), href: '#despre', ariaLabel: t('nav.about'), rotation: 8, hoverStyles: { bgColor: '#e91e63', textColor: '#ffffff' } },
    { label: t('nav.projects'), href: '#proiecte', ariaLabel: t('nav.projects'), rotation: 8, hoverStyles: { bgColor: '#e91e63', textColor: '#ffffff' } },
    { label: t('nav.plans'), href: '#abonamente', ariaLabel: t('nav.plans'), rotation: 8, hoverStyles: { bgColor: '#e91e63', textColor: '#ffffff' } },
    { label: t('nav.contact'), href: '#contact', ariaLabel: t('nav.contact'), rotation: -8, hoverStyles: { bgColor: '#e91e63', textColor: '#ffffff' } },
  ];

  //butonul de limba cu steag — aceeasi marime ca butonul de meniu (56px)
  const langButton = (
    <button
        onClick={() => setLang(lang === 'ro' ? 'en' : 'ro')}
        aria-label={lang === 'ro' ? 'Switch to English' : 'Schimbă în română'}
        style={{
            width: '56px',
            height: '56px',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            background: '#f7f3f5',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            fontSize: '1.5rem',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}
    >
        {lang === 'ro' ? 'EN' : 'RO'}
    </button>
  )

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <Grainient
            color1="#E91E63"
            color2="#ffffff"
            color3="#E91E63"
            timeSpeed={0.25}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
        />

        {/* desktop: navbar bubble complet + toggle de limba langa butonul de meniu */}
        {!isMobile && (
          <>
            <BubbleMenu
                logo={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                        <svg width="36" height="36" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M105,52 A48,48 0 1,0 105,148" fill="none" stroke="#111111" strokeWidth="8" strokeLinecap="round"/>
                            <line x1="112" y1="52" x2="112" y2="148" stroke="#111111" strokeWidth="8" strokeLinecap="round"/>
                            <path d="M112,52 Q148,52 148,76 Q148,100 112,100" fill="none" stroke="#111111" strokeWidth="8" strokeLinecap="round"/>
                            <path d="M112,100 Q152,100 152,124 Q152,148 112,148" fill="none" stroke="#111111" strokeWidth="8" strokeLinecap="round"/>
                            <circle cx="76" cy="164" r="6" fill="#111111" opacity="0.4"/>
                        </svg>
                        Click &amp;&amp; Build
                    </span>
                }
                items={items}
                menuAriaLabel="Toggle navigation"
                menuBg="#f7f3f5"
                menuContentColor="#000000"
                useFixedPosition={false}
                animationEase="power3.out"
                animationDuration={0.5}
                staggerDelay={0.12}
            />

            {/* toggle de limba — pozitionat langa butonul de meniu, aceeasi marime */}
            <div style={{ position: 'absolute', top: '2rem', right: '6.5rem', zIndex: 1002 }}>
                {langButton}
            </div>
          </>
        )}

        {/* mobil: bara simpla — doar logo + toggle de limba (fara meniu) */}
        {isMobile && (
          <div style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.25rem',
              right: '1.25rem',
              zIndex: 1002,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
          }}>
              <span style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap',
                  background: '#f7f3f5', padding: '0.5rem 1rem', borderRadius: '9999px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}>
                  <svg width="28" height="28" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <path d="M105,52 A48,48 0 1,0 105,148" fill="none" stroke="#111111" strokeWidth="8" strokeLinecap="round"/>
                      <line x1="112" y1="52" x2="112" y2="148" stroke="#111111" strokeWidth="8" strokeLinecap="round"/>
                      <path d="M112,52 Q148,52 148,76 Q148,100 112,100" fill="none" stroke="#111111" strokeWidth="8" strokeLinecap="round"/>
                      <path d="M112,100 Q152,100 152,124 Q152,148 112,148" fill="none" stroke="#111111" strokeWidth="8" strokeLinecap="round"/>
                      <circle cx="76" cy="164" r="6" fill="#111111" opacity="0.4"/>
                  </svg>
                  Click &amp;&amp; Build
              </span>
              {langButton}
          </div>
        )}

        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '0 1.5rem',
            textAlign: 'center',
            pointerEvents: 'none',
        }}>
            <div style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
                <TextType
                    text={[t('hero.title')]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    deletingSpeed={50}
                    showCursor
                    cursorCharacter="_"
                />
            </div>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)', color: '#333', margin: 0, maxWidth: '800px', lineHeight: 1.6, opacity: 0.85 }}>
                {t('hero.subtitle')}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', pointerEvents: 'all' }}>
            <SignUpButton forceRedirectUrl="/dashboard">
    <Button size="lg">{t('hero.signup')}</Button>
</SignUpButton>
<SignInButton forceRedirectUrl="/dashboard">
    <Button size="lg" variant="outline">{t('hero.signin')}</Button>
</SignInButton>
            </div>
        </div>
    </div>
  )
}

export default Hero