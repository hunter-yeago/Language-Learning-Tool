/**
 * Capitalizes the first letter of a string while leaving the rest unchanged.
 * Useful for formatting dictionary entries and proper nouns.
 *
 * @param string - The string to capitalize
 * @returns The string with the first character converted to uppercase
 *
 * @example
 * capitalizeFirstLetter('hello') // Returns: "Hello"
 * capitalizeFirstLetter('HELLO') // Returns: "HELLO" (only first letter is affected)
 * capitalizeFirstLetter('benevolent') // Returns: "Benevolent"
 */
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
