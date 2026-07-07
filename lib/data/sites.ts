//aici are loc integrarea dcs in proiect
//functia create site salveaza datele esentiale ale siteului provenite din build/route.ts
//si construieste storeul impreuna cu emmbeduirea promptului original
//add version adauga o noua delta dupa fiecare editare + embedding peinsructiune
//pentru retrival sem,antic
//reconstruct version aduga storeului k versiuni pentru rollbackul la o sectiune prestailita
//rollback to se asigura ca dupa ce se construieste codul cerut rolbackul creat e o noua versiune a siteului
//versiunea originala pre-rollaback trebuind sa ramna si ea separata(nu vreau sa sterg versiuni prin rollback 
//sau sa construiesc deasupra lor si sa nu mai pot ajunge la original)
//get relevant versions alege cele 5 delte semnificative,functia match_versions din sql face 
//cosine similarity intre vectori si ii alege pei cei apropiati in spatiul semantic
import { supabaseAdmin } from '@/lib/supabase/admin'
import { reconstructFromVersions } from '@/lib/data/reconstruct'
import { createPatch } from 'diff'
import { slugify } from '@/lib/data/slugify'

async function embed(text: string): Promise<number[]>
{ const res = await fetch('https://api.openai.com/v1/embeddings', 
  { method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  })

  const data = await res.json()

  if (!data.data) {
    console.error('Embedding error:', JSON.stringify(data))   
    throw new Error('Embedding failed')
  }

  return data.data[0].embedding
}

export async function createSite(
  userId: string,
  params: {name: string; prompt: string; title: string; colors:string[]; code:string}
)
{
  //se insereaza siteul cu codul curent ca cod initial
  const {data: site,error} = await supabaseAdmin
  .from('sites')
  .insert({
    clerk_user_id: userId,
    name: params.name,
    prompt: params.prompt,
    title: params.title,
    colors: params.colors,
    current_code: params.code,
    current_version: 0, //aici se constituie storul deci e versiunea 0,de baza
  })
  .select()
  .single()

  if (error || !site) 
  {
    console.error('Supabase error complet:', error)
    console.error('Cauza:', (error as any)?.cause)
    throw new Error('createSite failed: ' + error?.message)
  }

  //se construieste storeul,iarasi se salveaza codul complet,primul nod al arborelui
  const {data: version} = await supabaseAdmin
    .from('site_versions')
    .insert({
      site_id: site.id,
      version_number: 0,
      instruction: params.prompt,
      diff: null,
      base_code: params.code,
    })
    .select()
    .single()

  if(version) 
  { //embeddingul e folosite DOAR pentru cautare
    const embedding = await embed(params.prompt)
    await supabaseAdmin.from('version_embeddings').insert({
      version_id: version.id,
      site_id: site.id,
      embedding,
    })
  }
  
  return site
}


// dupa editare se apendeaza o noua delta
export async function addVersion(
  userId: string,
  siteId: string,
  params: { instruction: string; newCode: string }
) {
  // verificăm că site-ul e al userului si luăm starea curentă
  const { data: site } = await supabaseAdmin
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .eq('clerk_user_id', userId)   
    .single()

  if (!site) throw new Error('Site negăsit sau acces refuzat')

  const nextVersion = site.current_version + 1

  // diff-ul între codul vechi și cel nou
  const diff = createPatch(
    `v${nextVersion}`,
    site.current_code || '',
    params.newCode
  )

  // găsim id-ul versiunii părinte (cea curentă) pentru lanț/branching
  const { data: parent } = await supabaseAdmin
    .from('site_versions')
    .select('id')
    .eq('site_id', siteId)
    .eq('version_number', site.current_version)
    .single()

  // inserăm delta node-ul
  const { data: version } = await supabaseAdmin
    .from('site_versions')
    .insert({
      site_id: siteId,
      version_number: nextVersion,
      parent_id: parent?.id ?? null,
      instruction: params.instruction,
      diff,
      base_code: null,  
    })
    .select()
    .single()

  // embedding pe instrucțiune 
  if (version) {
    const embedding = await embed(params.instruction)
    await supabaseAdmin.from('version_embeddings').insert({
      version_id: version.id,
      site_id: siteId,
      embedding,
    })
  }

  // actualizăm starea curentă a site-ului
  await supabaseAdmin
    .from('sites')
    .update({ current_code: params.newCode, current_version: nextVersion })
    .eq('id', siteId)
    .eq('clerk_user_id', userId)

  return version
}

// reconstruieste codul la o versiune k aleasa pe user,fce operatia Target=Store + k diff
export async function reconstructVersion(
  userId: string,
  siteId: string,
  targetVersion: number
): Promise<string> {
  // verificăm proprietatea ca situl apartine userului care face requestul
  const { data: site } = await supabaseAdmin
    .from('sites')
    .select('id')
    .eq('id', siteId)
    .eq('clerk_user_id', userId)
    .single()

  if (!site) throw new Error('Site negăsit sau acces refuzat')

  // luăm toate versiunile 0..K în ordine
  const { data: versions } = await supabaseAdmin
    .from('site_versions')
    .select('version_number, diff, base_code')
    .eq('site_id', siteId)
    .lte('version_number', targetVersion)
    .order('version_number', { ascending: true })

  return reconstructFromVersions(versions || [])
}

//  adauga o versiune noua cu codul reconstruit 
export async function rollbackTo(userId: string, siteId: string, targetVersion: number) {
  // reconstruim codul la versiunea ceruta
  const code = await reconstructVersion(userId, siteId, targetVersion)
  // il salvam ca o versiune NOUA (nu mutam pointerul inapoi)
  await addVersion(userId, siteId, {
    instruction: `Rollback la versiunea ${targetVersion}`,
    newCode: code,
  })
  return code
}

// retrivalul pentru gasireadeltelor prin functia match_versions din sql
export async function getRelevantVersions(
  userId: string,
  siteId: string,
  instruction: string,
  count=5
)
{ //gasirea siteului pentru versiunile userului
  const {data: site} = await supabaseAdmin
    .from('sites')
    .select('id')
    .eq('id', siteId)
    .eq('clerk_user_id', userId)
    .single()
  if (!site) throw new Error('Site negăsit sau acces refuzat')

  const embedding= await embed(instruction)
  const {data} = await supabaseAdmin.rpc('match_versions', 
  { query_embedding: embedding,
    match_site_id: siteId,
    match_count: count,

  })

  return data || []

}

//listeaza toate siteurile userului pentru afisarea din start page
export async function listSites(userId: string) {
  const { data } = await supabaseAdmin
    .from('sites')
    .select('id, name, title, current_version, updated_at, subdomain')
    .eq('clerk_user_id', userId)
    .order('updated_at', { ascending: false })

  return data || []
}

// returneaza siteul pentru editare prin DCS
export async function getSite(userId: string, siteId: string)
{ const {data} = await supabaseAdmin
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .eq('clerk_user_id', userId)
    .single()

  return data
}

// listeaza versiunile unui site 
export async function listVersions(userId: string, siteId: string) {
  // verificam proprietatea + luam versiunea curenta
  const { data: site } = await supabaseAdmin
    .from('sites')
    .select('current_version')
    .eq('id', siteId)
    .eq('clerk_user_id', userId)
    .single()

  if (!site) throw new Error('Site negăsit sau acces refuzat')

  const { data } = await supabaseAdmin
    .from('site_versions')
    .select('id, version_number, instruction, created_at')
    .eq('site_id', siteId)
    .order('version_number', { ascending: false })   // cele mai noi sus

  return { versions: data || [], currentVersion: site.current_version }
}



//publica un site: genereaza un subdomain unic din titlu si il salveaza
export async function publishSite(userId: string, siteId: string): Promise<string>
{
  //verificam proprietatea + luam titlul
  const { data: site } = await supabaseAdmin
    .from('sites')
    .select('title, name, subdomain')
    .eq('id', siteId)
    .eq('clerk_user_id', userId)
    .single()

  if (!site) throw new Error('Site negăsit sau acces refuzat')

  //daca e deja publicat, intoarcem subdomain-ul existent
  if (site.subdomain) return site.subdomain

  const base = slugify(site.title || site.name || 'site')

  //gasim un subdomain liber: incercam base, base-2, base-3...
  let candidate = base
  let suffix = 1
  while (true)
  {
    const { data: existing } = await supabaseAdmin
      .from('sites')
      .select('id')
      .eq('subdomain', candidate)
      .maybeSingle()

    if (!existing) break          //e liber
    suffix++
    candidate = `${base}-${suffix}`
  }

  //salvam subdomain-ul
  await supabaseAdmin
    .from('sites')
    .update({ subdomain: candidate })
    .eq('id', siteId)
    .eq('clerk_user_id', userId)

  return candidate
}

//ia un site dupa subdomain pentru afisarea publica
//nu mai verificam url-ul pentru ca e public siteul
export async function getSiteBySubdomain(subdomain: string)
{
  const { data } = await supabaseAdmin
    .from('sites')
    .select('title, current_code, subdomain')
    .eq('subdomain', subdomain)
    .maybeSingle()

  return data
}