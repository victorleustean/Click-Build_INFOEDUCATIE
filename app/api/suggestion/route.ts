//Genereaza titlu,culorile si publicul tinta folosind gpt-4o-mini
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { suggestionSchema } from '@/lib/validation/schemas'
import { rateLimit } from '@/lib/rate-limit'



export async function POST(req: NextRequest) {
    //nu lasam un user neautentificat sa apeleze endpointul
    const {userId} = await auth()
    if (!userId) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

    //rate limiting: max 30 sugestii pe minut per user
    const rl = rateLimit(`suggestion:${userId}`, 30, 60_000)
    if (!rl.ok) {
        return NextResponse.json(
            { error: `Prea multe cereri. Încearcă din nou în ${Math.ceil(rl.resetIn / 1000)} secunde.` },
            { status: 429 }
        )
    }

    //citim datele trimisevalidand inputul inainte
    const body = await req.json().catch(() => null)
    const parsed = suggestionSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Date invalide", detalii: parsed.error.issues.map(i => i.message) },
            { status: 400 }
        )
    }
    const { prompt } = parsed.data

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            max_tokens: 200,
            messages: [
                {
                    role: 'system',
                    content: `  Ești un asistent care sugerează un titlu, publicul țintă și 3 culori pentru un site web.
                                Răspunde DOAR cu JSON valid, fără text suplimentar, în acest format exact:
                                {
                                    "title": "Numele site-ului",
                                    "audience": "Publicul țintă în 1 propoziție scurtă",
                                    "colors": ["#hex1", "#hex2", "#hex3"]
                                }`
                },
                {
                    role: 'user',
                    content: `Utilizatorul vrea să construiască: ${prompt}`
                }
            ]
        })
    })

    //tratam cazul cand OpenAI raspunde cu eroare
    if (!response.ok) {
        const err = await response.text()
        console.error("Eroare OpenAI:", err)
        return NextResponse.json({ error: "Generarea sugestiei a esuat" }, { status: 500 })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) {
        return NextResponse.json({ error: "Raspuns gol de la model" }, { status: 500 })
    }

    try {
        const parsed = JSON.parse(text)
        return NextResponse.json(parsed)
    } catch {
        return NextResponse.json({ error: 'Parse error' }, { status: 500 })
    }
}