import { HIRAGANA_STROKES, POKEMON_NAMES } from "./odai";

it('Stroke exists for each names', () => {
  POKEMON_NAMES.forEach(name => {
    name.split('').forEach(char => {
      expect(HIRAGANA_STROKES[char]).toBeDefined()
    })
  })
})