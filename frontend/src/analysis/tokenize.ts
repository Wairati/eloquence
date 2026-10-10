export interface Token {
  /** Lower-case form used for matching, with curly apostrophes straightened. */
  word: string
  /** Character offsets in the original transcript, for highlighting. */
  start: number
  end: number
}

// Letters or digits, allowing inner apostrophes and hyphens: "don't", "well-known".
const WORD = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu

export function tokenize(text: string): Token[] {
  return Array.from(text.matchAll(WORD), (m) => ({
    word: m[0].toLowerCase().replaceAll('’', "'"),
    start: m.index,
    end: m.index + m[0].length,
  }))
}
