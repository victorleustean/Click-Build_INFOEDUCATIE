//schemele garanteaza forma si limitele datelor inainte sa fie folosite
//prompt inte 3-2000 de caractere pentru a preveni prompturi goale sau prea lungi
//siteId trebuie sa fie uuid valid pentru a nu fi introduse valori ciudate in queryuri
//si colors trebuie sa fie hex valide pentru a preveni xss prin culori malitioase in style
import { z } from "zod"

//validare pentru endpointul build la generarea uni site nou
export const buildSchema = z.object
({  prompt: z.string()
        .trim()
        .min(3,"Promptul e prea scurt")
        .max(2000, "Promptul e prea lung"),
    title: z.string()
        .trim()
        .max(120, "Titlul e prea lung")
        .optional()
        .default(""),
    colors: z.array
    (
        z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Culoare invalidă")
    ).max(6, "Prea multe culori").optional(),
})

//validare pentru endpointul edit la modificarea unui site existent
export const editSchema = z.object
({  siteId: z.string().uuid("siteId invalid"),
    instruction: z.string()
        .trim()
        .min(2, "Instructiunea e prea scurta")
        .max(1000, "Instructiunea e prea larga"),
})

//validare pentru endpointul suggestion la generarea de sugestii
export const suggestionSchema = z.object
({  prompt: z.string()
        .trim()
        .min(3, "Promptul e prea scurt")
        .max(2000, "Promptul e prea lung"),
})

