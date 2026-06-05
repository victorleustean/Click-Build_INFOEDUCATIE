import { SignUpButton } from '@clerk/nextjs'
import { Button } from './ShadCN/button'

const Contact = () => {
  return (
    <section style={{
      padding: '8rem 1.5rem',
      textAlign: 'center',
      background: 'linear-gradient(to bottom, rgba(233,30,99,0.08) 0%, rgba(233,30,99,0.18) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
    }}>
      <h1 style={{
        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
        fontWeight: 700,
        color: '#111',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        margin: 0,
        maxWidth: '700px',
      }}>
        Gata să începi?
      </h1>
      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.35rem)',
        color: '#333',
        margin: 0,
        maxWidth: '500px',
        lineHeight: 1.6,
        opacity: 0.85,
      }}>
        Alătură-te miilor de utilizatori care își construiesc site-ul cu Click &amp;&amp; Build — gratuit, acum.
      </p>
      <SignUpButton forceRedirectUrl="/dashboard">
    <Button size="lg" style={{ backgroundColor: '#e91e63', color: '#fff', fontSize: '1rem', padding: '0.75rem 2.5rem', marginTop: '0.5rem' }}>
        Creează-ți contul gratuit
    </Button>
</SignUpButton>
    </section>
  )
}

export default Contact