export function handleMentionKeyDown(
    e: KeyboardEvent,
    mentionOpen: boolean,
    mention: any,
    { closeMention, selectActiveMention, submit, onCancel }: any
  ) {
    if (e.isComposing || e.keyCode === 229) return
  
    if (mentionOpen) {
      if (e.key === "Escape") {
        e.preventDefault()
        closeMention()
        return true
      }
      if (e.key === "Tab" && mention.flat().length > 0) {
        e.preventDefault()
        selectActiveMention()
        return true
      }
    }
  
    if (e.key === "Escape") {
      e.preventDefault()
      onCancel()
      return true
    }
  
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
      return true
    }
  
    return false
  }