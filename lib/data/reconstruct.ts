//logica de reconstructie din DCS extrasa din reconstructVersion pentru testare

import { applyPatch } from "diff"

export type VersionNode = 
{   version_number: number
    diff: string | null
    base_code: string | null
}

//versions trebuie sa fie ordonate crescator dupa version_number, icepand cu STOREUL
export function reconstructFromVersions(versions: VersionNode[]): string
{   if(!versions || versions.length === 0) throw new Error('Nicio versiune gasita')

    //pornim de la STORE
    let code = versions[0].base_code || ''

    //aplicam diffurile pe rand in lant
    for(let i=1; i <versions.length; i++)
    {   const patched = applyPatch(code, versions[i].diff || '')
        if(patched === false) throw new Error(`Diff invalid la versiunea ${versions[i].version_number}`)
        code = patched
    }
    return code
}