import { capitalizeFirstLetter } from '../strings/capitalize_first_letter'

/**
 * Represents grammatical properties of a word form.
 */
interface Grammar {
  number?: string[]
}

/**
 * Represents a specific form of a word (e.g., singular, plural).
 */
interface Form {
  form: string
  grammar?: Grammar[]
}

/**
 * Represents a lexeme with its part of speech and possible forms.
 */
interface Lexeme {
  partOfSpeech: string
  forms?: Form[]
}

/**
 * Searches through lexemes to find the plural form of a noun.
 * Used in the dictionary feature to display plural forms when available.
 *
 * The function:
 * 1. Iterates through all lexemes looking for nouns
 * 2. Checks the forms array for entries with 'plural' in their grammar.number
 * 3. Returns the first plural form found, capitalized
 *
 * @param lexemes - Array of lexemes from a dictionary entry
 * @returns The capitalized plural form if found, null otherwise
 *
 * @example
 * const lexemes = [{
 *   partOfSpeech: 'noun',
 *   forms: [
 *     { form: 'cat', grammar: [{ number: ['singular'] }] },
 *     { form: 'cats', grammar: [{ number: ['plural'] }] }
 *   ]
 * }]
 * findPluralForm(lexemes) // Returns: "Cats"
 *
 * @example
 * const nonNounLexemes = [{ partOfSpeech: 'verb', forms: [] }]
 * findPluralForm(nonNounLexemes) // Returns: null
 */
export function findPluralForm(lexemes: Lexeme[]): string | null {
  // Iterate through each lexeme in the dictionary entry
  for (const lexeme of lexemes) {
    // Only process noun lexemes that have forms defined
    if (lexeme.partOfSpeech === 'noun' && lexeme.forms) {
      // Search through the forms to find one marked as plural
      // Check if any grammar object has 'plural' in its number array
      const plural = lexeme.forms.find((form) => form.grammar?.some((grammar) => grammar.number?.includes('plural')))

      // If a plural form was found, capitalize and return it; otherwise return null
      return plural ? capitalizeFirstLetter(plural.form) : null
    }
  }

  // Return null if no noun lexemes were found or none had plural forms
  return null
}
