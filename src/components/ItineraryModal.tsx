import { useState } from 'react'

type ItineraryModalProps = {
  itinerary: string[]
  onSave: (newItinerary: string[]) => void
}

export function ItineraryModal({ itinerary, onSave }: ItineraryModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editText, setEditText] = useState(itinerary.join('\n'))
  const [isSaving, setIsSaving] = useState(false)

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
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Enter each itinerary item on a new line"
                className="itinerary-textarea"
              />
              <p className="textarea-help">Each line will be a separate item in your itinerary</p>
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
