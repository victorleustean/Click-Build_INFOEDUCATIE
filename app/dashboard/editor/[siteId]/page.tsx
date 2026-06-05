import EditorPage from '@/components/EditorPage'
import { use } from 'react'


export default function Page({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params)
  return <EditorPage siteId={siteId} />
}