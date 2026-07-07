//aici este logica de simulare la fiecare editare, cati tokeni ar trimite fiecare abordare
//naiv trimite tot istoricul (toate instructiunile + toate codurile intermediare)
//DCS  trimite doar cod curent + top-K instructiuni relevante (ce face aplicatia reala)

import { getEncoding } from "js-tiktoken"
import { initialCode, editsList } from "./edits"

//un prompt de marimea celui real din /api/edit
//(il numaram o data, e constant in ambele abordari)
const SYSTEM_PROMPT = `Ești un expert React care MODIFICĂ un site existent.
Primești codul curent al unui site React (componenta App) și o instrucțiune de modificare.
Aplică EXACT modificarea cerută și păstrează tot restul neschimbat — structură, secțiuni, stil, culori.
REGULI STRICTE:
- Exportă o singură funcție numită exact "App" ca default export
- Doar React cu CSS inline. ZERO librării externe, iconițe DOAR din "lucide-react"
- Nu include import pentru React — e disponibil global
- Răspunde DOAR cu codul React complet modificat, fără markdown, fără explicații`

//cate instructiuni relevante injecteaza DCS (la fel ca match_count din aplicatie)
const DCS_TOP_K = 5

//encoder-ul tiktoken (cl100k_base = encoding-ul folosit de modelele moderne)
const enc = getEncoding("cl100k_base")

function countTokens(text: string): number
{
  return enc.encode(text).length
}

//simuleaza codul rezultat dupa editarea k
//unele editari adauga sectiuni (cresc codul), altele doar modifica (nu-l cresc)
//crestem codul cu un mic delta deterministic ca sa reflectam cresterea reala
function codeAfterEdit(step: number): string
{
  let code = initialCode

  //fiecare a doua editare "adauga" o sectiune noua (creste codul)
  //celelalte doar modifica valori (codul ramane la fel)
  for(let i = 0; i < step; i++)
  {
    if(i % 2 === 0)
    {
      //simulam o sectiune adaugata — un bloc realist de cod
      code += `

      {/* sectiune adaugata la editarea ${i + 1} */}
      <section style={{ padding: "4rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700 }}>
          ${editsList[i].slice(0, 40)}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          <div style={{ padding: "1.5rem", borderRadius: 12, background: "#fafafa" }}>Element</div>
          <div style={{ padding: "1.5rem", borderRadius: 12, background: "#fafafa" }}>Element</div>
          <div style={{ padding: "1.5rem", borderRadius: 12, background: "#fafafa" }}>Element</div>
        </div>
      </section>`
    }
  }

  return code
}

export type SimPoint =
{
  edit: number          //numarul editarii (1...50)
  naiveTokens: number   //tokeni trimisi de abordarea naiva
  dcsTokens: number     //tokeni trimisi de DCS
}

//ruleaza simularea completa si intoarce datele pentru grafic
export function runSimulation(): SimPoint[]
{
  const points: SimPoint[] = []
  const systemTokens = countTokens(SYSTEM_PROMPT)

  for(let k = 1; k <= editsList.length; k++)
  {
    //NAIV: system + tot istoricul (instructiuni + coduri intermediare) + instructiunea curenta
    let naiveTokens = systemTokens
    for(let i = 0; i < k; i++)
    {
      //fiecare pas anterior aduce instructiunea lui + codul rezultat la acel pas
      naiveTokens += countTokens(editsList[i])
      naiveTokens += countTokens(codeAfterEdit(i + 1))
    }

    // DCS: system + cod curent (unul singur) + top-K instructiuni relevante + instructiunea curenta 
    let dcsTokens = systemTokens
    dcsTokens += countTokens(codeAfterEdit(k))   //codul curent necesar in ambele abordari
    //top-K instructiuni relevante (text scurt) — aproximam cu ultimele K instructiuni
    const relevant = editsList.slice(Math.max(0, k - DCS_TOP_K), k)
    for(const instr of relevant)
    {
      dcsTokens += countTokens(instr)
    }

    points.push({ edit: k, naiveTokens, dcsTokens })
  }

  return points
}

//cateva cifre cheie pentru afisare (la ultima editare)
export function summary(points: SimPoint[])
{
  const last = points[points.length - 1]
  const economie = Math.round((1 - last.dcsTokens / last.naiveTokens) * 100)
  return {
    lastEdit: last.edit,
    naiveTokens: last.naiveTokens,
    dcsTokens: last.dcsTokens,
    economiePercent: economie,
  }
}