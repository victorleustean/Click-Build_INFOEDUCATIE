import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
  return (
    <section style={{
      padding: '5rem 1.5rem',
      textAlign: 'center',
      background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(233,30,99,0.08) 100%)',
      paddingTop: '15rem'
    }}>
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 700,
        color: '#111',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        margin: '0 0 3rem 0',
      }}>
        Abonamente
      </h1>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <PricingTable
          appearance={{
            variables: {
              colorPrimary: '#e91e63',
              colorBackground: '#ffffff',
              colorText: '#111111',
              colorTextSecondary: '#555555',
              borderRadius: '12px',
              fontFamily: 'var(--font-jakarta), sans-serif',
              fontWeight: { normal: 400, medium: 500, bold: 700 },
            },
            elements: {
              pricingTableCard: {
                boxShadow: 'none',
                border: '1px solid rgba(233,30,99,0.15)',
              },
            },
          }}
        />
      </div>
    </section>
  )
}