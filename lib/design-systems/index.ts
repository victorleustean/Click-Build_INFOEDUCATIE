import fs from 'fs'
import path from 'path'

export type DesignSystem = {
  id: string
  name: string
  description: string  
  file: string
}

const data: DesignSystem[] = [
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Bloguri, reviste, site-uri de știri, conținut text-heavy',
    file: 'editorial.md',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Portfolio, SaaS, produse tech, landing pages curate',
    file: 'minimal.md',
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Restaurante, cafenele, brutării, afaceri locale, branduri calde',
    file: 'warm.md',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Entertainment, muzică, evenimente, branduri creative energice',
    file: 'bold.md',
  },
]

//construim pathul catre folder
//process.cwd foloseste separatorul corect pentru orice sistem de operare
const dir=path.join(process.cwd(), 'lib', 'design-systems')

//traieste cat timp serverul e pornit intre apeluri
//este un array de obiecte de tip design system plus un camp content pentru
//continutul fiecarui fisier .md
let cache: (DesignSystem & {content: string})[] | null = null

export function getDesignSystems() {
    //daca nu au fost citite fisiere
    //creeam un obiect nou cu tipul ds si continutul .md
    if(!cache) {
        cache = data.map(d => ({
            ...d,
            content: fs.readFileSync(path.join(dir, d.file), 'utf-8'),
        }))
    }
    return cache
}