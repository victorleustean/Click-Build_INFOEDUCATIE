//endpointul principal al aplicatiei,unde se creeaza propiu-zis siteurile
//gpt-4o-mini genereaza keywords pe baza titlului si promptului de la user
//apoi folosind acele keywords facem fetch catre unsplash si returnam imagini real ca url
//modelul mai alege si un design system din cele 4 din folderul-lib/design-sstems care are
//rol de indrumare in design a modeluli, pe baza acestor date gpt 5.5 genreaza app.tsx
//salvarea cosdului se face folosind dcs
import { getDesignSystems } from "@/lib/design-systems";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSite } from "@/lib/data/sites";
import { buildSchema } from "@/lib/validation/schemas";
import { rateLimit } from "@/lib/rate-limit";

//gpt 4o-mini genereza 3 keywords pentru imagini care vor fi apoi cautate prin unsplash
//functia genereaza un array de string-uri cu keywords
async function generateImageKeywords(
  prompt: string,
  title: string
): Promise<string[]> 
{
  try {
    const res = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: 
        {
          Authorization: 
          `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 30,
          messages: [
            {
              role: "system",
              content: `Ești un expert în căutarea de imagini stock.
              Pe baza descrierii unui site, generează 3 termeni de căutare în engleză pentru Unsplash.
              Termenii trebuie să descrie CONCRET ce ar trebui să arate imaginile site-ului, nu concepte abstracte.
              Gândește-te ce fotografii reale ar avea sens pe acel site.
              Răspunde DOAR cu un JSON array de string-uri.
              Imaginile trebuie să reflecte mai mult tema dată de user și scopul, nu neapărat titlul.

              Exemplu:
              Input: "site pentru o brutărie artizanală"
              Output: ["fresh bread bakery", "croissant pastry", "bakery interior"]`,
            },
            {
              role: "user",
              content: `Descriere site: ${prompt}. Titlu: ${title}`,
            },
          ],
        }),
      }
    );

    const data = await res.json();
    const content= data.choices?.[0]?.message?.content?.trim();

    return JSON.parse(content);
  } catch {
    return [title];
  }
}

//folosind keywords cautam prin api-ul unsplash
async function fetchImages(keywords: string[]): Promise<string[]> 
{ const query=keywords.join(' ');
  
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );

  const data=await res.json();

  if(!data.results?.length) return [];

  return data.results.map
  ( 
    //latimea fotografiilor e automata setata la 1200 pixeli
    (photo: any) => `${photo.urls.regular}&w=1200`
  );
}

//design systems exports cacheuit id,numele,descrierea si fisierul + un camp pentru contentul fiecarui fisier
//importam aceste informatii si cautam still potrivit prin api requestul catre chat gpt-4o-mini
async function pickDesignSystem(prompt: string, title: string): Promise<string>
{ const systems = getDesignSystems()
  //din cacheul transmis din index selectam id-ul ai descrierea fisierului .md
  const options = systems.map(d => `- ${d.id}: ${d.description}`).join('\n')

  try
  { const res=await fetch('https://api.openai.com/v1/chat/completions',
    { method: 'POST',
      headers:
      { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 10,
        messages: 
        [ 
          {
            role: 'system',
            content: `Alege cel mai potrivit stil de design pentru site-ul descris.
            Opțiuni:
            ${options}
            Răspunde DOAR cu id-ul stilului (ex: warm), fără altceva.`
          },
          { role: 'user', content: `Site: ${prompt}. Titlu: ${title}` }
        ]
      })
    })
    const data = await res.json()
    const id=data.choices[0].message.content?.trim().toLowerCase()
    //cauta in systems id-ul selectat de a,in caz de eroare returneza primul document .md
    return systems.find(d => d.id === id)?.content || systems[0].content
  } catch {
    return systems[0].content
  }
}

//gpt 5.5 genereaza siteul folosind imaginile si designul determinate mai sus
//exportam codul curatat si imaginile
export async function POST(req: NextRequest)
{ try
  { //nu lasam un user neautentificat sa apeleze endpointul
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Neautentificat" }, { status: 401 });

    //rate limiting: max 10 generari pe minut per user (generarea e scumpa)
    const rl = rateLimit(`build:${userId}`, 10, 60_000);
    if (!rl.ok)
    { return NextResponse.json(
        { error: `Prea multe cereri. Încearcă din nou în ${Math.ceil(rl.resetIn / 1000)} secunde.` },
        { status: 429 }
       );
    }


    //validam input-ul inainte sa-l folosim 
    const body = await req.json().catch(() => null);
    const parsed = buildSchema.safeParse(body);
    if (!parsed.success)
    { return NextResponse.json(
        { error: "Date invalide", detalii: parsed.error.issues.map(i => i.message) },
        { status: 400 }
      );
    }
    const { prompt, title, colors } = parsed.data;


    const keywords = await generateImageKeywords(prompt, title);
    const images = await fetchImages(keywords);
    const designSystem = await pickDesignSystem(prompt, title);


    const response = await fetch("https://api.openai.com/v1/responses",
      { method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify
        ({
          model: "gpt-5.5",
          instructions: `Ești un web designer și React developer de top. Generezi site-uri React complete, frumoase și moderne, dintr-un singur fișier. Un design frumos, modern și profesional este prioritatea ta numărul unu.
 
          DESIGN SYSTEM (SURSĂ DE INSPIRAȚIE, NU REGULĂ STRICTĂ):
          Mai jos primești un design system extras dintr-un site real. Folosește-l ca GHID pentru direcția vizuală — tipografie, spacing, geometria componentelor (radius, butoane, carduri), layout, elevație, principii de design. NU îl copia cuvânt cu cuvânt și nu te simți obligat să implementezi totul; alege ideile care se potrivesc temei site-ului și adaptează-le creativ. Scopul e un site care simte că aparține aceleiași familii de design, nu o clonă identică.
 
          === DESIGN SYSTEM ===
          ${designSystem}
          === SFÂRȘIT DESIGN SYSTEM ===
 
          CULORI — PRIORITATE ABSOLUTĂ:
          Culorile și titlul sunt alese de utilizator și au prioritate peste design system. Folosește culorile utilizatorului ca paletă principală (accent, secundar, fundal/text). Ignoră paleta de culori din design system — de acolo iei DOAR principiile de layout, tipografie și stilul componentelor, nu culorile.
 
          CALITATEA DESIGN-ULUI (foarte important):
          - Conținut realist și relevant pentru domeniu — FĂRĂ Lorem Ipsum, fără text placeholder
          - Ierarhie vizuală clară: titluri mari și expresive, spacing generos, contrast bun între text și fundal
          - Animații subtile: fade-in la apariție, tranziții pe hover la carduri și butoane
          - Atenție la tipografie, aliniere și ritmul vertical al secțiunilor
 
          REGULI TEHNICE REACT:
          - Exportă o singură funcție numită exact "App" ca default export
          - Folosește doar React cu CSS inline (obiecte de stil). ZERO librării externe
          - Poți importa iconițe DOAR din "lucide-react"
          - Nu include import pentru React — e disponibil global
          - Pentru responsivitate folosește un state "isMobile" cu window.innerWidth + un listener pe "resize" (CSS inline NU suportă media queries). Breakpoint principal la 768px
          - Pentru efecte hover folosește onMouseEnter/onMouseLeave (CSS inline NU suportă :hover)
          - Codul trebuie complet funcțional, fără TODO sau placeholder-uri
          - Folosește imaginile Unsplash furnizate ca src pentru tag-uri <img>, cu objectFit: "cover"
          - Secțiuni recomandate: navbar, hero, despre, servicii/produse, galerie, testimoniale, contact, footer
          - LIMBA: detectează limba în care e scrisă descrierea utilizatorului și generează TOT textul site-ului în ACEEAȘI limbă. Dacă descrierea e în engleză, tot conținutul site-ului e în engleză; dacă e în română, în română. Potrivește limba conținutului cu limba cererii utilizatorului.
          - NU accesa React prin destructurare (const { useState } = React) și NU importa hook-uri. Folosește direct useState, useEffect etc. — sunt deja disponibile global.
          - Folosește DOAR iconițe care există cu siguranță în lucide-react. Dacă nu ești 100% sigur că o iconiță există, NU o folosi — alege una sigură (ex: Zap în loc de Lightning, Trash2, Menu, X, Check, Star, Heart, ArrowRight, Mail, Phone, MapPin). În caz de dubiu, folosește un <div> sau un caracter în loc de iconiță inexistentă.
          - ATENȚIE la sintaxa JSX: toate prop-urile de event folosesc forma exactă onClick={...}, onMouseEnter={...}, onMouseLeave={...} cu ACOLADE { }, niciodată paranteze. Verifică fiecare handler înainte de a finaliza.
 
          FOARTE IMPORTANT:
          - Răspunde DOAR cu codul React pur
          - Fără markdown, fără backtick-uri, fără explicații
          - Nu include text conversațional sau pași de lucru
          - Dacă nu poți genera complet, returnează o componentă App simplă, dar validă`,
                  input: `Construiește un site complet pentru: ${prompt}
          Titlu: ${title || "Site-ul meu"}
          Culori temă (alese de utilizator, prioritare): ${colors?.join(", ") || "#e91e63, #111111, #ffffff"}
          Imagini Unsplash disponibile (folosește-le ca src pentru imagini):
          ${images.map((url, i) => `img${i + 1}: ${url}`).join("\n")}`
        })
      });
   
    if(!response.ok)
    { const err = await response.text();
      console.error("Eroare OpenAI:", err);
      return NextResponse.json({error: "Generarea codului a esuat"});
    }


    const data = await response.json();
    const code = cleanCode(extractOutputText(data));


    if (!code)
    { console.error("OpenAI response fara cod:", JSON.stringify(data, null, 2));
      return NextResponse.json({ error: "Modelul nu a returnat cod valid" });
    }


    //se salveaza automat site-ul + versiunea 0 (STORE) 
    let siteId: string | null = null;
    try
    { const site = await createSite(userId, {
        name: title || "Site nou",
        prompt,
        title: title || "Site nou",
        colors: colors || [],
        code,
      });
      siteId = site.id;
    }
    catch(e)
    { console.error("Salvarea site-ului a esuat:", e); }


    return NextResponse.json({ code, images, siteId });
  }
  catch(error)
  { console.error("Eroare /api/build:", error);
    return NextResponse.json({ error: "Generarea codului a esuat" });
  }
}




function extractOutputText(data: any): string 
{
  return (
    data.output_text ||
    data.output
      ?.flatMap((item: any) => item.content || [])
      ?.map((content: any) => content.text || "")
      ?.join("\n") ||
    ""
  );
}

function cleanCode(raw: string): string 
{
  let code = raw.trim();


  const fenced = code.match(/```(?:tsx|jsx|ts|js|typescript|javascript)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) code = fenced[1].trim();


  const start = [
    code.search(/(^|\n)\s*import\s+/),
    code.search(/(^|\n)\s*export\s+default\s+function\s+App\b/),
    code.search(/(^|\n)\s*function\s+App\s*\(/),
    code.search(/(^|\n)\s*const\s+App\s*=/),
  ].filter(i => i >= 0);


  if (start.length) code = code.slice(Math.min(...start)).trim();


  return code
    .replace(/^```(?:tsx|jsx|ts|js|typescript|javascript)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}