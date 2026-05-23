import React from 'react'
import Grainient from '@/components/React_Bits/Grainient'
import BubbleMenu from './React_Bits/BubbleMenu';
import { Button } from './ShadCN/button';
import TextType from './React_Bits/TextType';
import { SignInButton, SignUpButton } from '@clerk/nextjs';


const items = [
  { label: 'Acasă', href: '#acasa', ariaLabel: 'Acasă', rotation: -8, hoverStyles: { bgColor: '#e91e63', textColor: '#ffffff' } },
  { label: 'Despre noi', href: '#despre', ariaLabel: 'Despre noi', rotation: 8, hoverStyles: { bgColor: '#e91e63', textColor: '#ffffff' } },
  { label: 'Proiecte', href: '#proiecte', ariaLabel: 'Proiecte', rotation: 8, hoverStyles: { bgColor: '#e91e63', textColor: '#ffffff' } },
  { label: 'Abonamente', href: '#abonamente', ariaLabel: 'Abonamente', rotation: 8, hoverStyles: { bgColor: '#e91e63', textColor: '#ffffff' } },
  { label: 'Contact', href: '#contact', ariaLabel: 'Contact', rotation: -8, hoverStyles: { bgColor: '#e91e63', textColor: '#ffffff' } },
];

const Hero = () => {
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
                    text={["Construiește-ți site-ul în câteva secunde"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    deletingSpeed={50}
                    showCursor
                    cursorCharacter="_"
                />
            </div>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)', color: '#333', margin: 0, maxWidth: '800px', lineHeight: 1.6, opacity: 0.85 }}>
                Click &amp;&amp; Build transformă ideile tale în site-uri reale — fără cod, fără complicații. Descrie ce vrei și lasă AI-ul să construiască
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', pointerEvents: 'all' }}>
                <SignUpButton>
                    <Button size="lg">Înregistrare</Button>
                </SignUpButton>
                <SignInButton>
                    <Button size="lg" variant="outline">Conectare</Button>
                </SignInButton>
            </div>
        </div>
    </div>
  )
}

export default Hero