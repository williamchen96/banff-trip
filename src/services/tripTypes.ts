export type TripDay = {
  dateLabel: string
  location: {
    name: string
    imageLabel: string
    imageSrcs?: string[]
  }
  accommodations: {
    name: string
    imageLabel: string
    imageSrcs?: string[]
  }
  itinerary: string[]
  resources: {
    title: string
    url: string
  }[]
  photosNote: string
  uploadedPhotos?: string[]
}
