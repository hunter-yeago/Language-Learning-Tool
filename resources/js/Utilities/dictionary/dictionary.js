import { capitalizeFirstLetter } from '../strings/capitalize_first_letter'

export function findPluralForm(lexemes) {
  for (const lexeme of lexemes) {
    if (lexeme.partOfSpeech === 'noun' && lexeme.forms) {
      const plural = lexeme.forms.find((form) => form.grammar?.some((grammar) => grammar.number?.includes('plural')))
      return plural ? capitalizeFirstLetter(plural.form) : null
    }
  }
  return null
}
