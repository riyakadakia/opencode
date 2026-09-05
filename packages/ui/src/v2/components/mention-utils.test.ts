import { describe, expect, test } from "bun:test"
import { extractMentionQuery, insertMention } from "./mention-utils"

describe("extractMentionQuery", () => {
  test("extracts mention query when @ is present", () => {
    const result = extractMentionQuery("Hello @use", 10)
    expect(result).toEqual({ query: "use", start: 6, end: 10 })
  })

  test("extracts empty query for just @", () => {
    const result = extractMentionQuery("Hello @", 7)
    expect(result).toEqual({ query: "", start: 6, end: 7 })
  })

  test("returns undefined when no @ is present", () => {
    const result = extractMentionQuery("Hello world", 11)
    expect(result).toBeUndefined()
  })

  test("returns undefined when @ is not at end of word", () => {
    const result = extractMentionQuery("Hello @user more", 12)
    expect(result).toBeUndefined()
  })
})

describe("insertMention", () => {
  test("inserts mention and returns new value and cursor position", () => {
    const result = insertMention("Hello ", "user.tsx", 6, 6)
    expect(result.value).toBe("Hello @user.tsx ")
    expect(result.cursorPosition).toBe(16)
  })

  test("replaces partial mention with full mention", () => {
    const result = insertMention("Hello @us", "user.tsx", 6, 9)
    expect(result.value).toBe("Hello @user.tsx ")
    expect(result.cursorPosition).toBe(16)
  })

  test("handles mention in middle of text", () => {
    const result = insertMention("Hello @user and more", "component.tsx", 6, 11)
    expect(result.value).toBe("Hello @component.tsx  and more")
    expect(result.cursorPosition).toBe(21)
  })
})
