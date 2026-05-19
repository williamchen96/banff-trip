import { useRef, useState } from 'react'

type ItineraryModalProps = {
  itinerary: string[]
  onSave: (newItinerary: string[]) => void
}

export function ItineraryModal({ itinerary, onSave }: ItineraryModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editText, setEditText] = useState(itinerary.join('\n'))
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleOpenModal = () => {
    setEditText(itinerary.join('\n'))
    setIsOpen(true)
  }

  const handleSave = async () => {
    const cleanedItinerary = editText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    setIsSaving(true)
    await onSave(cleanedItinerary)
    setIsSaving(false)
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const updateSelection = (nextValue: string, start: number, end: number) => {
    setEditText(nextValue)

    requestAnimationFrame(() => {
      if (!textareaRef.current) {
        return
      }

      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(start, end)
    })
  }

  const applyInlineWrap = (prefix: string, suffix = prefix) => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = editText.slice(start, end) || 'text'

    const nextValue = `${editText.slice(0, start)}${prefix}${selectedText}${suffix}${editText.slice(end)}`
    const nextStart = start + prefix.length
    const nextEnd = nextStart + selectedText.length
    updateSelection(nextValue, nextStart, nextEnd)
  }

  const applyLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const lineStart = editText.lastIndexOf('\n', start - 1) + 1
    const lineEndIndex = editText.indexOf('\n', end)
    const lineEnd = lineEndIndex === -1 ? editText.length : lineEndIndex
    const selectedBlock = editText.slice(lineStart, lineEnd)

    const transformedBlock = selectedBlock
      .split('\n')
      .map((line) => (line.trim().length ? `${prefix}${line.replace(/^([#>-]|\d+\.\s|[-*+]\s)+/, '')}` : line))
      .join('\n')

    const nextValue = `${editText.slice(0, lineStart)}${transformedBlock}${editText.slice(lineEnd)}`
    updateSelection(nextValue, lineStart, lineStart + transformedBlock.length)
  }

  const applyNumberedList = () => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const lineStart = editText.lastIndexOf('\n', start - 1) + 1
    const lineEndIndex = editText.indexOf('\n', end)
    const lineEnd = lineEndIndex === -1 ? editText.length : lineEndIndex
    const selectedBlock = editText.slice(lineStart, lineEnd)

    let itemNumber = 1
    const transformedBlock = selectedBlock
      .split('\n')
      .map((line) => {
        if (!line.trim().length) {
          return line
        }

        const cleanLine = line.replace(/^([#>-]|\d+\.\s|[-*+]\s)+/, '')
        const value = `${itemNumber}. ${cleanLine}`
        itemNumber += 1
        return value
      })
      .join('\n')

    const nextValue = `${editText.slice(0, lineStart)}${transformedBlock}${editText.slice(lineEnd)}`
    updateSelection(nextValue, lineStart, lineStart + transformedBlock.length)
  }

  const insertLink = () => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = editText.slice(start, end) || 'link text'
    const markdown = `[${selectedText}](https://)`
    const nextValue = `${editText.slice(0, start)}${markdown}${editText.slice(end)}`
    const urlStart = start + selectedText.length + 3
    const urlEnd = urlStart + 'https://'.length

    updateSelection(nextValue, urlStart, urlEnd)
  }

  return (
    <>
      <button type="button" className="itinerary-edit-btn" onClick={handleOpenModal}>
        ✏️ Edit
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Itinerary</h3>
              <button type="button" className="modal-close-btn" onClick={handleClose}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="itinerary-toolbar" role="toolbar" aria-label="Itinerary formatting">
                <button type="button" className="toolbar-btn" onClick={() => applyInlineWrap('**')}>
                  B
                </button>
                <button type="button" className="toolbar-btn" onClick={() => applyInlineWrap('*')}>
                  I
                </button>
                <button type="button" className="toolbar-btn" onClick={insertLink}>
                  🔗
                </button>
                <button type="button" className="toolbar-btn" onClick={() => applyLinePrefix('# ')}>
                  H1
                </button>
                <button type="button" className="toolbar-btn" onClick={() => applyLinePrefix('## ')}>
                  H2
                </button>
                <button type="button" className="toolbar-btn" onClick={() => applyLinePrefix('### ')}>
                  H3
                </button>
                <button type="button" className="toolbar-btn" onClick={() => applyLinePrefix('- ')}>
                  • List
                </button>
                <button type="button" className="toolbar-btn" onClick={applyNumberedList}>
                  1. List
                </button>
              </div>

              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Write itinerary in Markdown. Use toolbar for bold, italic, links, headings (font size), and lists."

                className="itinerary-textarea"
              />
              <p className="textarea-help">Toolbar applies Markdown to selected text. H1/H2/H3 controls heading size.</p>
            </div>

            <div className="modal-footer">
              <button type="button" className="modal-cancel-btn" onClick={handleClose}>
                Cancel
              </button>
              <button type="button" className="modal-save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
