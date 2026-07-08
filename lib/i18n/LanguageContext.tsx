'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { dictionaries, Lang, DictKey } from './dictionary'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: DictKey) => string }

const LanguageContext = createContext<Ctx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode })
{
  const [lang, setLang] = useState<Lang>('ro')

  //la mount citim limba salvata (daca userul a ales deja una)
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null
    if (saved === 'ro' || saved === 'en') setLang(saved)
  }, [])

  //cand se schimba limba o salvam
  const changeLang = (l: Lang) => {
    setLang(l)
    if (typeof window !== 'undefined') window.localStorage.setItem('lang', l)
  }

  const t = (key: DictKey) => dictionaries[lang][key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage()
{
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage trebuie folosit în interiorul LanguageProvider')
  return ctx
}