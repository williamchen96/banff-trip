type ImageGalleryProps = {
  images: string[]
  imageLabel: string
  dayIndex: number
  activeIndex: number
  galleryKey: string
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
}

export function ImageGallery({ images, imageLabel, dayIndex, activeIndex, galleryKey, onScroll }: ImageGalleryProps) {
  return (
    <div className="gallery-wrap">
      <div key={galleryKey} className="gallery-scroll" onScroll={onScroll}>
        {images.map((src, imageIndex) => (
          <img key={src} src={src} alt={`${imageLabel} ${imageIndex + 1}`} className="day-image" />
        ))}
      </div>
      {images.length > 1 && (
        <div className="gallery-dots">
          {images.map((_, imageIndex) => (
            <span
              key={`${dayIndex}-${imageIndex}`}
              className={`gallery-dot${imageIndex === activeIndex ? ' active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
