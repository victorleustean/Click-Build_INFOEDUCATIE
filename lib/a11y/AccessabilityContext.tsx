'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Ctx = { highContrast: boolean; toggleContrast: () => void }

const AccessibilityContext = createContext<Ctx | null>(null)

export function AccessibilityProvider({ children }: { children: ReactNode })
{
  const [highContrast, setHighContrast] = useState(false)

  //la mount citim preferinta salvata (daca userul a activat deja contrastul)
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('contrast') : null
    if (saved === 'high') {
      setHighContrast(true)
      document.documentElement.dataset.contrast = 'high'
    }
  }, [])

  const toggleContrast = () => {
    setHighContrast(prev => {
      const next = !prev
      document.documentElement.dataset.contrast = next ? 'high' : 'normal'
      if (typeof window !== 'undefined') window.localStorage.setItem('contrast', next ? 'high' : 'normal')
      return next
    })
  }

  return (
    <AccessibilityContext.Provider value={{ highContrast, toggleContrast }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility()
{
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error('useAccessibility trebuie folosit în interiorul AccessibilityProvider')
  return ctx
}