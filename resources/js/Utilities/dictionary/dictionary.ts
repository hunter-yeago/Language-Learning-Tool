import { capitalizeFirstLetter } from '../strings/capitalize_first_letter'

interface Grammar {
  number?: string[]
}

interface Form {
  form: string
  grammar?: Grammar[]
}

interface Lexeme {
  partOfSpeech: string
  forms?: Form[]
}

export function findPluralForm(lexemes: Lexeme[]): string | null {
  for (const lexeme of lexemes) {
    if (lexeme.partOfSpeech === 'noun' && lexeme.forms) {
      const plural = lexeme.forms.find((form) => form.grammar?.some((grammar) => grammar.number?.includes('plural')))
      return plural ? capitalizeFirstLetter(plural.form) : null
    }
  }
  return null
}
