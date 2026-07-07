import { describe, it, expect } from 'vitest'
import { cleanGeneratedCode } from './buildHtml'

describe('cleanGeneratedCode', () => {
  it('scoate import-urile din react', () => {
    const cod = `import React, { useState } from 'react'\nfunction App() { return null }`
    const rezultat = cleanGeneratedCode(cod)
    expect(rezultat).not.toContain("from 'react'")
  })

  it('scoate import-ul de createRoot', () => {
    const cod = `import { createRoot } from 'react-dom/client'\nfunction App() {}`
    expect(cleanGeneratedCode(cod)).not.toContain('react-dom/client')
  })

  it('scoate destructurarea din React', () => {
    const cod = `const { useState, useEffect } = React;\nfunction App() {}`
    const rezultat = cleanGeneratedCode(cod)
    expect(rezultat).not.toContain('= React')
  })

  it('transforma import-ul lucide in destructurare din proxy', () => {
    const cod = `import { Globe, Menu } from 'lucide-react'\nfunction App() {}`
    const rezultat = cleanGeneratedCode(cod)
    expect(rezultat).toContain('const { Globe, Menu } = Lucide;')
    expect(rezultat).not.toContain("from 'lucide-react'")
  })

  it('transforma export default function App in function App', () => {
    const cod = `export default function App() { return null }`
    const rezultat = cleanGeneratedCode(cod)
    expect(rezultat).toContain('function App')
    expect(rezultat).not.toContain('export default function App')
  })

  it('scoate export default App la final', () => {
    const cod = `function App() {}\nexport default App;`
    const rezultat = cleanGeneratedCode(cod)
    expect(rezultat).not.toMatch(/export\s+default\s+App/)
  })

  it('scoate fence-urile de markdown ```tsx', () => {
    const cod = '```tsx\nfunction App() {}\n```'
    const rezultat = cleanGeneratedCode(cod)
    expect(rezultat).not.toContain('```')
  })

  it('escapeaza </script ca sa nu rupa iframe-ul', () => {
    const cod = `function App() { return '</script>' }`
    const rezultat = cleanGeneratedCode(cod)
    expect(rezultat).not.toContain('</script')
    expect(rezultat).toContain('<\\/script')
  })
})