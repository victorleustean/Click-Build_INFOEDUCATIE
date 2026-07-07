import { describe, it, expect } from 'vitest'
import { createPatch } from 'diff'
import { reconstructFromVersions, VersionNode } from './reconstruct'

//construieste un delta node
function deltaNode(versionNumber: number, oldCode: string, newCode: string): VersionNode {
    return {
      version_number: versionNumber,
      diff: createPatch(`v${versionNumber}`, oldCode, newCode),
      base_code: null,
    }
}

describe('reconstructFromVersions', () => {
    it('reconstruieste doar STOREul cand exista doar v0', () => {
      const versions: VersionNode[] = [
        { version_number: 0, diff: null, base_code: 'cod initial' },
      ]
      expect(reconstructFromVersions(versions)).toBe('cod initial')
    })
  
    it('aplica un singur diff peste STORE', () => {
      const v0 = 'linia unu\nlinia doi\n'
      const v1 = 'linia unu\nlinia doi modificata\n'
      const versions: VersionNode[] = [
        { version_number: 0, diff: null, base_code: v0 },
        deltaNode(1, v0, v1),
      ]
      expect(reconstructFromVersions(versions)).toBe(v1)
    })
  
    it('aplica un lant de mai multe diff-uri in ordine', () => {
      const v0 = 'a\nb\nc\n'
      const v1 = 'a\nB\nc\n'      //schimba b in B
      const v2 = 'a\nB\nC\n'      //schimba c in C
      const v3 = 'A\nB\nC\n'      //schimba a in A
      const versions: VersionNode[] = [
        { version_number: 0, diff: null, base_code: v0 },
        deltaNode(1, v0, v1),
        deltaNode(2, v1, v2),
        deltaNode(3, v2, v3),
      ]
      //reconstructia versiunii 3 trebuie sa dea codul final complet
      expect(reconstructFromVersions(versions)).toBe(v3)
    })
  
    it('reconstruieste o versiune intermediara (nu doar ultima)', () => {
      const v0 = 'x\ny\n'
      const v1 = 'x MODIFICAT\ny\n'
      //dam doar v0 si v1 => trebuie sa iasa v1, nu versiuni ulterioare
      const versions: VersionNode[] = [
        { version_number: 0, diff: null, base_code: v0 },
        deltaNode(1, v0, v1),
      ]
      expect(reconstructFromVersions(versions)).toBe(v1)
    })
  
    it('arunca eroare cand nu exista nicio versiune', () => {
        //nu depindem de diacritice in textul erorii, doar de cuvintele cheie
        expect(() => reconstructFromVersions([])).toThrow(/[Nn]icio versiune/)
      })
    
      it('arunca eroare cand un diff din lant nu se poate aplica pe cod', () => {
        //un diff valid ca format dar care asteapta alt continut decat cel din STORE
        //applyPatch va intoarce false => reconstructia trebuie sa arunce eroare
        const v0 = 'linia originala\n'
        const altCod = 'cu totul altceva\n'
        const diffGresit = createPatch('v1', altCod, 'modificat\n')  //diff calculat pe alt cod
        const versions: VersionNode[] = [
          { version_number: 0, diff: null, base_code: v0 },
          { version_number: 1, diff: diffGresit, base_code: null },
        ]
        expect(() => reconstructFromVersions(versions)).toThrow(/Diff invalid/)
      })
  })
  