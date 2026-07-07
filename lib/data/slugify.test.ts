import { describe, it, expect } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it('transforma un titlu simplu in slug', () => {
    expect(slugify('Floraria Sofia')).toBe('floraria-sofia')
  })

  it('scoate diacriticele romanesti', () => {
    expect(slugify('Brutăria Petrișor')).toBe('brutaria-petrisor')
    expect(slugify('Cofetăria Înghețată')).toBe('cofetaria-inghetata')
  })

  it('inlocuieste caracterele speciale cu liniute', () => {
    expect(slugify('Cafe & Bistro!')).toBe('cafe-bistro')
    expect(slugify('Web 3.0 Studio')).toBe('web-3-0-studio')
  })

  it('nu lasa liniute la capete', () => {
    expect(slugify('  Salon de Frumusete  ')).toBe('salon-de-frumusete')
    expect(slugify('!!!Start!!!')).toBe('start')
  })

  it('limiteaza lungimea la 40 de caractere', () => {
    const lung = 'acesta este un titlu foarte foarte foarte lung care depaseste limita'
    expect(slugify(lung).length).toBeLessThanOrEqual(40)
  })

  it('foloseste fallback "site" cand nu ramane nimic valid', () => {
    expect(slugify('!!!')).toBe('site')
    expect(slugify('   ')).toBe('site')
    expect(slugify('...')).toBe('site')
  })
})