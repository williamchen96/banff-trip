import { useState } from 'react'

export const useTripPlannerState = (tripLength: number) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [locationImageIndices, setLocationImageIndices] = useState<Record<number, number>>({})
  const [accommodationImageIndices, setAccommodationImageIndices] = useState<Record<number, number>>({})

  const onGalleryScroll = (
    e: React.UIEvent<HTMLDivElement>,
    setter: React.Dispatch<React.SetStateAction<Record<number, number>>>,
    dayIdx: number,
  ) => {
    const el = e.currentTarget
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setter((prev) => ({ ...prev, [dayIdx]: index }))
  }

  const selectDate = (index: number) => {
    const boundedIndex = Math.max(0, Math.min(tripLength - 1, index))
    setLocationImageIndices((prev) => ({ ...prev, [boundedIndex]: 0 }))
    setAccommodationImageIndices((prev) => ({ ...prev, [boundedIndex]: 0 }))
    setSelectedIndex(boundedIndex)
  }

  return {
    selectedIndex,
    locationImageIndices,
    setLocationImageIndices,
    accommodationImageIndices,
    setAccommodationImageIndices,
    selectDate,
    onGalleryScroll,
  }
}
