import { useEffect, useState } from 'react'
import type { TripDay } from '../services/tripTypes'

type CollaborationPanelProps = {
  isConfigured: boolean
  sessionExists: boolean
  statusLabel: string
  isLoading: boolean
  error: string | null
  selectedDay: TripDay
  selectedIndex: number
  onSignIn: () => Promise<void>
  onSignOut: () => Promise<void>
  onSaveSelectedDay: (day: TripDay) => Promise<void>
}

export function CollaborationPanel({
  isConfigured,
  sessionExists,
  statusLabel,
  isLoading,
  error,
  selectedDay,
  selectedIndex,
  onSignIn,
  onSignOut,
  onSaveSelectedDay,
}: CollaborationPanelProps) {
  const [locationName, setLocationName] = useState(selectedDay.location.name)
  const [accommodationName, setAccommodationName] = useState(selectedDay.accommodations.name)
  const [itineraryText, setItineraryText] = useState(selectedDay.itinerary.join('\n'))
  const [photosNote, setPhotosNote] = useState(selectedDay.photosNote)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLocationName(selectedDay.location.name)
    setAccommodationName(selectedDay.accommodations.name)
    setItineraryText(selectedDay.itinerary.join('\n'))
    setPhotosNote(selectedDay.photosNote)
  }, [selectedDay])

  const handleSave = async () => {
    const cleanedItinerary = itineraryText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const nextDay: TripDay = {
      ...selectedDay,
      location: {
        ...selectedDay.location,
        name: locationName.trim() || selectedDay.location.name,
      },
      accommodations: {
        ...selectedDay.accommodations,
        name: accommodationName.trim() || selectedDay.accommodations.name,
      },
      itinerary: cleanedItinerary.length > 0 ? cleanedItinerary : selectedDay.itinerary,
      photosNote: photosNote.trim() || selectedDay.photosNote,
    }

    setIsSaving(true)
    await onSaveSelectedDay(nextDay)
    setIsSaving(false)
  }

  return (
    <section className="content-section">
      <h2>Collaboration 🤝</h2>
      <article className="card collaboration-card">
        <p className="collaboration-status">{statusLabel}</p>

        {error && <p className="collaboration-error">{error}</p>}

        {!isConfigured ? (
          <p className="collaboration-help">
            Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env` to enable shared editing.
          </p>
        ) : !sessionExists ? (
          <button type="button" className="collab-btn" onClick={onSignIn}>
            Sign in with Google
          </button>
        ) : (
          <>
            <div className="collaboration-editor">
              <p className="collab-day-label">Editing Day {selectedIndex + 1}</p>

              <label>
                Location Name
                <input value={locationName} onChange={(e) => setLocationName(e.target.value)} />
              </label>

              <label>
                Accommodation Name
                <input value={accommodationName} onChange={(e) => setAccommodationName(e.target.value)} />
              </label>

              <label>
                Itinerary (one item per line)
                <textarea rows={4} value={itineraryText} onChange={(e) => setItineraryText(e.target.value)} />
              </label>

              <label>
                Photos Note
                <textarea rows={2} value={photosNote} onChange={(e) => setPhotosNote(e.target.value)} />
              </label>
            </div>

            <div className="collab-actions">
              <button type="button" className="collab-btn" onClick={handleSave} disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : 'Save Shared Changes'}
              </button>
              <button type="button" className="collab-btn secondary" onClick={onSignOut}>
                Sign out
              </button>
            </div>
          </>
        )}
      </article>
    </section>
  )
}
