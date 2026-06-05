import {NextRequest, NextResponse} from 'next/server'


//Genereaza titlu,culorile si publicul tinta folosind gpt-4o-mini
export async function POST(req: NextRequest) {
    //citim datele trimise
    const {prompt}=await req.json();

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

    const data=await response.json()
    const text=data.choices[0].message.content

    try {
        const parsed=JSON.parse(text)
        return NextResponse.json(parsed)
    } catch {
        return NextResponse.json({error: 'Parse error'}, {status:500})
    }
}