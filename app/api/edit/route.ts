//endpointul primeste codul curent si instructiunea curenta
//dcs alege 5 delte similare prin cosine similarity care sunt 
//apoi injectate in prompt, la final salvandu se delta noua + difful pe cod

import { auth } from "@clerk/nextjs/server";
import { getSite, getRelevantVersions, addVersion } from "@/lib/data/sites";
import { NextRequest, NextResponse } from "next/server";
import { editSchema } from "@/lib/validation/schemas";
import { rateLimit } from "@/lib/rate-limit";


//extrage textul din raspunsul Responses API
function extractOutputText(data: any): string {
  return (
    data.output_text ||
    data.output
      ?.flatMap((item: any) => item.content || [])
      ?.map((content: any) => content.text || "")
      ?.join("\n") ||
    ""
  );
}


//curata codul de markdown/backticks
function cleanCode(raw: string): string {
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



//editarea unui site prin DCS
export async function POST(req: NextRequest)
{ try
  { const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Neautentificat" }, { status: 401 });


    //rate limiting: max 20 editari pe minut per user
    const rl = rateLimit(`edit:${userId}`, 20, 60_000);
    if (!rl.ok)
    { return NextResponse.json(
        { error: `Prea multe cereri. Încearcă din nou în ${Math.ceil(rl.resetIn / 1000)} secunde.` },
        { status: 429 }
      );
    }


    const body = await req.json().catch(() => null);
    const parsed = editSchema.safeParse(body);
    if (!parsed.success)
    { return NextResponse.json(
        { error: "Date invalide", detalii: parsed.error.issues.map(i => i.message) },
        { status: 400 }
      );
    }
    const { siteId, instruction } = parsed.data;


    //starea curenta a siteului de editat
    const site = await getSite(userId, siteId);
    if (!site) return NextResponse.json({ error: "Site negasit" }, { status: 404 });


    //selectam 5 delte importante pentru a injecta in api call
    const relevant = await getRelevantVersions(userId, siteId, instruction, 5);
    const context = relevant
      .map((v: any) => `- (v${v.version_number}) "${v.instruction}"`)
      .join("\n");


    const response = await fetch("https://api.openai.com/v1/responses",
    { method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify
      ({
        model: "gpt-5.5",
        reasoning: { effort: "low" },
        instructions: `Ești un expert React care MODIFICĂ un site existent.


        Primești codul curent al unui site React (componenta App) și o instrucțiune de modificare.
        Aplică EXACT modificarea cerută și păstrează tot restul neschimbat — structură, secțiuni, stil, culori.


        CONTEXT din editările anterioare relevante (pentru a înțelege intenția userului):
        ${context || "Nicio editare anterioară relevantă."}


        REGULI STRICTE:
        - Exportă o singură funcție numită exact "App" ca default export
        - Doar React cu CSS inline. ZERO librării externe, iconițe DOAR din "lucide-react"
        - Nu include import pentru React — e disponibil global
        - NU accesa React prin destructurare (const { useState } = React) și NU importa hook-uri. Folosește direct useState, useEffect etc. — sunt deja disponibile global.
        - ATENȚIE la sintaxa JSX: toate prop-urile de event folosesc forma exactă onClick={...}, onMouseEnter={...}, onMouseLeave={...} cu ACOLADE { }, niciodată paranteze. Verifică fiecare handler înainte de a finaliza.
        - Răspunde DOAR cu codul React complet modificat, fără markdown, fără explicații
        - Folosește DOAR iconițe care există cu siguranță în lucide-react. Dacă nu ești 100% sigur că o iconiță există, NU o folosi — alege una sigură (ex: Zap în loc de Lightning, Trash2, Menu, X, Check, Star, Heart, ArrowRight, Mail, Phone, MapPin). În caz de dubiu, folosește un <div> sau un caracter în loc de iconiță inexistentă.`,
        input: `COD CURENT:
${site.current_code}


INSTRUCȚIUNE DE MODIFICARE:
${instruction}`,
      })
    });


    if (!response.ok)
    { const err = await response.text();
      console.error("Eroare OpenAI:", err);
      return NextResponse.json({ error: "Editarea a esuat" }, { status: 500 });
    }


    const data = await response.json();
    const code = cleanCode(extractOutputText(data));


    if (!code)
      return NextResponse.json({ error: "Modelul nu a returnat cod valid" }, { status: 500 });


    //salvam delta (addVersion calculeaza difful fata de codul vechi + embedding pe instructiune)
    await addVersion(userId, siteId, { instruction, newCode: code });


    return NextResponse.json({ code });
  }
  catch(error)
  { console.error("Eroare /api/edit:", error);
    return NextResponse.json({ error: "Editarea a esuat" }, { status: 500 });
  }
}