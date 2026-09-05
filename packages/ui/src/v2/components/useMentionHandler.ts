import { createSignal } from "solid-js"
import { useFilteredList } from "../../hooks"

export function useMentionHandler(
  getTextareaRef: () => HTMLTextAreaElement | undefined,
  local: any,
) {
  const [mentionOpen, setMentionOpen] = createSignal(false)

  const closeMention = () => {
    setMentionOpen(false)
    mention.clear()
  }

  const currentMention = () => {
    const textarea = getTextareaRef()
    if (!textarea) return
    if (!local.mention) return
    if (textarea.selectionStart !== textarea.selectionEnd) return

    const end = textarea.selectionStart
    const match = textarea.value.slice(0, end).match(/@(\S*)$/)
    if (!match) return

    return {
      query: match[1] ?? "",
      start: end - match[0].length,
      end,
    }
  }

  const selectMention = (item: { path: string } | undefined) => {
    if (!item) return

    const textarea = getTextareaRef()
    const query = currentMention()
    if (!textarea || !query) return

    const value = `${textarea.value.slice(0, query.start)}@${item.path} ${textarea.value.slice(query.end)}`
    const cursor = query.start + item.path.length + 2

    local.onInput(value)
    closeMention()

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  const mention = useFilteredList<{ path: string }>({
    items: async (query: string) => {
      if (!local.mention) return []
      if (!query.trim()) return []
      const paths = await local.mention.items(query)
      return paths.map((path: string) => ({ path }))
    },
    key: (item: {path: string}) => item.path,
    filterKeys: ["path"],
    skipFilter: () => true,
    onSelect: selectMention,
  })

  const syncMention = () => {
    const item = currentMention()
    if (!item) {
      closeMention()
      return
    }

    setMentionOpen(true)
    mention.onInput(item.query)
  }

  const selectActiveMention = () => {
    const items = mention.flat()
    if (items.length === 0) return
    const active = mention.active()
    selectMention(items.find((item) => item.path === active) ?? items[0])
  }

  return {
    mentionOpen,
    closeMention,
    selectMention,
    mention,
    syncMention,
    selectActiveMention,
  }
}