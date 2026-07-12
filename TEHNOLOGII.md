# Tehnologii și resurse externe

Acest fișier listează transparent **tot** ce e infrastructură, librărie sau serviciu extern folosit în Click && Build — nimic din ce urmează nu e revendicat drept contribuție proprie.

Ce **este** contribuție proprie (DCS, pipeline-ul de orchestrare, stratul de acces la date, sistemul de internaționalizare, suita de teste) e detaliat în [documentația tehnică](./docs/Click-and-Build-Documentatie.pdf) și în [README](./README.md#dcs--delta-context-system).

---

## Frontend

| Tehnologie | Rol în proiect |
|---|---|
| [Next.js 16](https://nextjs.org/) | Framework (App Router, Turbopack) |
| [React](https://react.dev/) | Bibliotecă UI |
| [TypeScript](https://www.typescriptlang.org/) | Limbaj |
| [Tailwind CSS](https://tailwindcss.com/) | Utilitare CSS |
| [shadcn/ui](https://ui.shadcn.com/) | Componente UI de bază (Button, Card, ScrollArea) |
| [React Bits](https://reactbits.dev/) | Componente vizuale animate de pe landing (Grainient, BubbleMenu, TextType, ElectricBorder, FlowingMenu) |
| [lucide-react](https://lucide.dev/) | Set de iconițe |
| [Recharts](https://recharts.org/) | Graficul din pagina de benchmark |

## Backend & date

| Tehnologie | Rol în proiect |
|---|---|
| [Supabase](https://supabase.com/) | PostgreSQL găzduit, cu extensia `pgvector` |
| [Zod](https://zod.dev/) | Validarea datelor de intrare pe toate rutele API |
| [diff](https://www.npmjs.com/package/diff) | `createPatch` / `applyPatch` — mecanica de bază peste care e construit lanțul de delte DCS |
| [js-tiktoken](https://github.com/dqbd/tiktoken) | Numărarea tokenilor în simularea de benchmark |

## Inteligență artificială

| Serviciu | Rol în proiect |
|---|---|
| [OpenAI](https://platform.openai.com/) — `gpt-4o-mini` | Generarea cuvintelor-cheie pentru imagini și alegerea design system-ului |
| [OpenAI](https://platform.openai.com/) — `gpt-5.5` | Generarea și editarea codului React al site-urilor |
| [OpenAI](https://platform.openai.com/) — `text-embedding-3-small` | Embeddings pentru retrieval-ul semantic din DCS |
| [Unsplash API](https://unsplash.com/developers) | Imagini reale pentru site-urile generate |

## Autentificare

| Tehnologie | Rol în proiect |
|---|---|
| [Clerk](https://clerk.com/) | Autentificare, sesiuni, componenta de management al contului |

## Testare & CI/CD

| Tehnologie | Rol în proiect |
|---|---|
| [Vitest](https://vitest.dev/) | Framework de testare unitară |
| [GitHub Actions](https://github.com/features/actions) | Integrare continuă — rulează testele la fiecare push |

## Găzduire

| Tehnologie | Rol în proiect |
|---|---|
| [Vercel](https://vercel.com/) | Găzduirea aplicației (producție) |

## Fonturi

| Resursă | Rol în proiect |
|---|---|
| [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Google Fonts) | Fontul principal al interfeței |