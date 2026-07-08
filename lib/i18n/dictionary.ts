//dictionar RO/EN pentru interfata aplicatiei

export const dictionaries = {
  ro: {
    //navigatie (BubbleMenu + Footer)
    'nav.home': 'Acasă',
    'nav.about': 'Despre noi',
    'nav.projects': 'Proiecte',
    'nav.plans': 'Abonamente',
    'nav.contact': 'Contact',

    //Hero
    'hero.title': 'Construiește-ți site-ul în câteva secunde',
    'hero.subtitle': 'Click && Build transformă ideile tale în site-uri reale — fără cod, fără complicații. Descrie ce vrei și lasă AI-ul să construiască',
    'hero.signup': 'Înregistrare',
    'hero.signin': 'Conectare',

    //About
    'about.title': 'Visurile tale devin realitate cu Click && Build',
    'about.card1.title': 'Generare AI',
    'about.card1.desc': 'Descrie site-ul tău în câteva cuvinte și AI-ul construiește totul pentru tine — layout, conținut și stil.',
    'about.card2.title': 'Rapid ca un click',
    'about.card2.desc': 'De la idee la site live în secunde. Fără cod, fără așteptare, fără bătăi de cap.',
    'about.card3.title': 'Publicat instant',
    'about.card3.desc': 'Site-ul tău ajunge online imediat, cu domeniu propriu și hosting inclus.',
    'about.cta': 'Încearcă acum',

    //Projects 
    'projects.title': 'Proiectele utilizatorilor',

    //Benchmark
    'benchmark.badge': 'Tehnologie proprie · DCS',
    'benchmark.title': 'Editezi de 50 de ori. Costul rămâne mic.',
    'benchmark.subtitle': 'Majoritatea generatoarelor AI retrimit toată conversația la fiecare modificare, iar costul explodează. Sistemul nostru de gestionare a contextului (DCS) injectează doar ce e relevant — așa editările rămân rapide și ieftine oricât de mult lucrezi la site.',
    'benchmark.run': 'Rulează simularea',
    'benchmark.running': 'Se rulează...',
    'benchmark.axisX': 'Numărul editării',
    'benchmark.axisY': 'Tokeni trimiși',
    'benchmark.legendNaive': 'Abordare clasică',
    'benchmark.legendDcs': 'Click && Build (DCS)',
    'benchmark.tokens': 'tokeni',
    'benchmark.editLabel': 'Editarea',
    'benchmark.resultPrefix': 'La a',
    'benchmark.resultMid': '-a editare:',
    'benchmark.resultTokens': 'mai puțini tokeni',
    'benchmark.resultSuffix': 'decât abordarea clasică.',

    //Contact 
    'contact.title': 'Gata să începi?',
    'contact.subtitle': 'Alătură-te miilor de utilizatori care își construiesc site-ul cu Click && Build — gratuit, acum.',
    'contact.cta': 'Creează-ți contul gratuit',

    //Footer
    'footer.rights': '© 2026 Click && Build. Toate drepturile rezervate.',
  },
  en: {
    //navigatie (BubbleMenu + Footer) 
    'nav.home': 'Home',
    'nav.about': 'About us',
    'nav.projects': 'Projects',
    'nav.plans': 'Plans',
    'nav.contact': 'Contact',

    //Hero
    'hero.title': 'Build your website in seconds',
    'hero.subtitle': 'Click && Build turns your ideas into real websites — no code, no hassle. Describe what you want and let the AI build it',
    'hero.signup': 'Sign up',
    'hero.signin': 'Sign in',

    //About
    'about.title': 'Your dreams come true with Click && Build',
    'about.card1.title': 'AI Generation',
    'about.card1.desc': 'Describe your website in a few words and the AI builds everything for you — layout, content and style.',
    'about.card2.title': 'Fast as a click',
    'about.card2.desc': 'From idea to live site in seconds. No code, no waiting, no headaches.',
    'about.card3.title': 'Published instantly',
    'about.card3.desc': 'Your website goes online immediately, with its own domain and hosting included.',
    'about.cta': 'Try it now',

    //Projects 
    'projects.title': 'User projects',

    //Benchmark
    'benchmark.badge': 'Own technology · DCS',
    'benchmark.title': 'Edit 50 times. The cost stays low.',
    'benchmark.subtitle': 'Most AI generators resend the entire conversation with every change, and the cost explodes. Our context management system (DCS) injects only what is relevant — so edits stay fast and cheap no matter how much you work on the site.',
    'benchmark.run': 'Run the simulation',
    'benchmark.running': 'Running...',
    'benchmark.axisX': 'Edit number',
    'benchmark.axisY': 'Tokens sent',
    'benchmark.legendNaive': 'Classic approach',
    'benchmark.legendDcs': 'Click && Build (DCS)',
    'benchmark.tokens': 'tokens',
    'benchmark.editLabel': 'Edit',
    'benchmark.resultPrefix': 'At edit',
    'benchmark.resultMid': ':',
    'benchmark.resultTokens': 'fewer tokens',
    'benchmark.resultSuffix': 'than the classic approach.',

    //Contact 
    'contact.title': 'Ready to start?',
    'contact.subtitle': 'Join thousands of users building their website with Click && Build — free, now.',
    'contact.cta': 'Create your free account',

    //Footer
    'footer.rights': '© 2026 Click && Build. All rights reserved.',
  },
} as const

export type Lang = keyof typeof dictionaries
export type DictKey = keyof typeof dictionaries['ro']