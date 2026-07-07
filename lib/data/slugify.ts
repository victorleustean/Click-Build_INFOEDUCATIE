//tranforma titlul intr-un url safe
//Floraria Sofia -> floraria-sofia
export function slugify(text: string): string
{ return text
  .toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "") //scoate diacriticele
  .replace(/[^a-z0-9]+/g, "-") //tot ce nu e litera sau cifra e transformat in liniuta
  .replace(/^-+|-+$/g, "")//fara liniuta la capetele textului
  .slice(0, 40) || "site" //limitam lungimea unui url
}