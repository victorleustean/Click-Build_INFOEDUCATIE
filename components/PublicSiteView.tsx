'use client'

import { buildPreviewHtml } from '@/lib/preview/buildHtml';
import { useMemo } from 'react'


export default function PublicSiteView({ code, title }: { code: string; title: string | null }) {
  const html = useMemo(() => buildPreviewHtml(code), [code])

  return (
    <iframe
      srcDoc={html}
      sandbox="allow-scripts"
      style={{ width: '100vw', height: '100vh', border: 'none' }}
      title={title || 'Site publicat'}
    />
  )
}