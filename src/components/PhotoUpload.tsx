import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

type PhotoUploadProps = {
  uploadedPhotos: string[]
  dayIndex: number
  tripId: string
  onPhotosChanged: (newUrls: string[]) => Promise<void>
  onUploadingChange?: (isUploading: boolean) => void
}

export type PhotoUploadHandle = {
  trigger: () => void
  requestRemoveCurrent: () => void
}

export const PhotoUpload = forwardRef<PhotoUploadHandle, PhotoUploadProps>(
  function PhotoUpload({ uploadedPhotos, dayIndex, tripId, onPhotosChanged, onUploadingChange }, ref) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

    useImperativeHandle(ref, () => ({
      trigger: () => fileInputRef.current?.click(),
      requestRemoveCurrent: () => {
        if (uploadedPhotos.length > 0) {
          setShowRemoveConfirm(true)
        }
      },
    }))

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (!files.length) return

      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase is not configured.')
        return
      }

      setIsUploading(true)
      onUploadingChange?.(true)
      setError(null)

      const newUrls: string[] = []

      for (const file of files) {
        const ext = file.name.split('.').pop() ?? 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const storagePath = `${tripId}/day${dayIndex + 1}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('trip-photos')
          .upload(storagePath, file, { upsert: false })

        if (uploadError) {
          setError(`Upload failed: ${uploadError.message}`)
          setIsUploading(false)
          onUploadingChange?.(false)
          return
        }

        const { data: publicUrlData } = supabase.storage
          .from('trip-photos')
          .getPublicUrl(storagePath)

        newUrls.push(publicUrlData.publicUrl)
      }

      const combined = [...uploadedPhotos, ...newUrls]
      await onPhotosChanged(combined)
      setActiveIndex(combined.length - newUrls.length)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setIsUploading(false)
      onUploadingChange?.(false)
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      const index = Math.round(el.scrollLeft / el.offsetWidth)
      setActiveIndex(index)
    }

    const handleRemovePhoto = async () => {
      const updated = uploadedPhotos.filter((_, i) => i !== activeIndex)
      await onPhotosChanged(updated)
      setShowRemoveConfirm(false)
      
      // Adjust activeIndex if needed
      if (activeIndex >= updated.length && updated.length > 0) {
        setActiveIndex(updated.length - 1)
      } else {
        setActiveIndex(0)
      }
    }

    return (
      <>
        <div className="photo-upload-section">
          {uploadedPhotos.length > 0 ? (
            <div className="gallery-wrap">
              <div className="gallery-scroll" onScroll={handleScroll}>
                {uploadedPhotos.map((src, i) => (
                  <img key={src} src={src} alt={`Uploaded photo ${i + 1}`} className="day-image" />
                ))}
              </div>
              {uploadedPhotos.length > 1 && (
                <div className="gallery-dots">
                  {uploadedPhotos.map((_, i) => (
                    <span
                      key={i}
                      className={`gallery-dot${i === activeIndex ? ' active' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="photo-upload-placeholder">
              {isUploading ? 'Uploading...' : 'Upload photos after the trip 📸'}
            </p>
          )}

          {error && <p className="photo-upload-error">{error}</p>}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="photo-file-input"
            onChange={handleFileChange}
          />
        </div>

        {/* Remove Confirmation Modal */}
        {showRemoveConfirm && (
          <div className="modal-overlay" onClick={() => setShowRemoveConfirm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Remove Photo?</h3>
                <button type="button" className="modal-close-btn" onClick={() => setShowRemoveConfirm(false)}>
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this photo? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowRemoveConfirm(false)}>
                  Cancel
                </button>
                <button type="button" className="modal-danger-btn" onClick={handleRemovePhoto}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
)

