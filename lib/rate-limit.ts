//rate-limiter care limiteaza cate requesturi poate face un userintr o fereasta de timp
//fiecare user are un bucket la primul request fiind pornita o fereastra de un minut
//cat timp e sub limita contorul creste, daca depaseste -> 429 too many requests
//dupa ce trece minutul fereastra se reseteaza
type Bucket = {count: number; resetAt: number}
const buckets = new Map<string, Bucket>()

type Result = {ok: boolean; remaining: number; resetIn: number}

//verifica si inregistreaza un request pentru o cheie (ex: userId)
//limit = cate request-uri permise, windowMs = fereastra de timp in milisecunde
export function rateLimit(key: string, limit: number, windowMs: number) : Result
{   const now = Date.now()
    const bucket = buckets.get(key)

    //daca nu exista bucket sau fereastra a expirat pornim una noua
    if (!bucket || now > bucket.resetAt)
    {
        buckets.set(key, { count: 1, resetAt: now + windowMs })
        return { ok: true, remaining: limit - 1, resetIn: windowMs }
    }

    //in fereastra curenta daca a depasit limita refuzam
    if (bucket.count >= limit)
    {
      return { ok: false, remaining: 0, resetIn: bucket.resetAt - now }
    }

    //altfel incrementam si permitem
    bucket.count++
    return { ok: true, remaining: limit - bucket.count, resetIn: bucket.resetAt - now }
  
}

//curatam periodic bucket-urile expirate (sa nu creasca memoria la infinit)
setInterval(() =>
    {
      const now = Date.now()
      for (const [key, bucket] of buckets)
      {
        if (now > bucket.resetAt) buckets.delete(key)
      }
    }, 60_000)