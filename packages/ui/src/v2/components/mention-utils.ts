/**
 * Extracts mention query from textarea value at cursor position
 */
export function extractMentionQuery(
  value: string,
  cursorPosition: number,
): { query: string; start: number; end: number } | undefined {
  const beforeCursor = value.slice(0, cursorPosition)
  const match = beforeCursor.match(/@(\S*)$/)
  
  if (!match) return undefined
  
  return {
    query: match[1] ?? "",
    start: cursorPosition - match[0].length,
    end: cursorPosition,
  }
}

/**
 * Inserts selected mention into text
 */
export function insertMention(
  value: string,
  mentionPath: string,
  start: number,
  end: number,
): { value: string; cursorPosition: number } {
  const newValue = `${value.slice(0, start)}@${mentionPath} ${value.slice(end)}`
  const cursorPosition = start + mentionPath.length + 2
  
  return { value: newValue, cursorPosition }
}
