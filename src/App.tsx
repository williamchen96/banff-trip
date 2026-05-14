import { useRef, useState } from 'react'
import './App.css'
import { DateChips } from './components/DateChips'
import { ImageGallery } from './components/ImageGallery'
import { ItineraryModal } from './components/ItineraryModal'
import { PhotoUpload, type PhotoUploadHandle } from './components/PhotoUpload'
import { TripCountdown } from './components/TripCountdown'
import { WeatherCard } from './components/WeatherCard'
import { useCollaborativeTrip } from './hooks/useCollaborativeTrip'
import { useTripPlannerState } from './hooks/useTripPlannerState'
import { useWeatherByDay } from './hooks/useWeatherByDay'
import { dayWeatherCity } from './services/weatherService'
import type { TripDay } from './services/tripTypes'

const tripStartDate = new Date(2026, 5, 28)
const tripLength = 10

const locationMapQueries = [
  'Calgary International Airport',
  'Downtown Banff Avenue Banff AB',
  'Bow Falls Banff Springs Hotel Banff AB',
  'Lake Minnewanka Banff AB',
  'Johnston Canyon Banff AB',
  'Moraine Lake Banff AB',
  'Lake Louise Lakeshore Banff AB',
  'Icefields Parkway Alberta',
  'Downtown Calgary AB',
  'Calgary International Airport',
]

const getMapsUrl = (query: string) => {
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent || ''
    const isAppleDevice = /iPhone|iPad|iPod|Macintosh/i.test(ua)

    if (isAppleDevice) {
      return `https://maps.apple.com/?q=${encodeURIComponent(query)}`
    }
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

const locationImageModules = import.meta.glob('./assets/locations/day*/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const accommodationImageModules = import.meta.glob('./assets/accommodations/day*/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const sortGalleryFiles = (fileA: string, fileB: string, featuredPrefix: string) => {
  const aIsFeatured = fileA.startsWith(featuredPrefix)
  const bIsFeatured = fileB.startsWith(featuredPrefix)

  if (aIsFeatured && !bIsFeatured) {
    return -1
  }

  if (!aIsFeatured && bIsFeatured) {
    return 1
  }

  return fileA.localeCompare(fileB, undefined, { numeric: true })
}

const buildImageMap = (modules: Record<string, string>, featuredSuffix: 'location' | 'accomodation') => {
  const imageMap: Record<number, { fileName: string; imageUrl: string }[]> = {}

  Object.entries(modules).forEach(([modulePath, imageUrl]) => {
    const match = modulePath.match(/day(\d+)\/([^/]+)$/)

    if (!match) {
      return
    }

    const dayIndex = Number(match[1]) - 1
    const fileName = match[2]

    if (!imageMap[dayIndex]) {
      imageMap[dayIndex] = []
    }

    imageMap[dayIndex].push({ fileName, imageUrl })
  })

  return Object.fromEntries(
    Object.entries(imageMap).map(([dayIndex, entries]) => {
      const featuredPrefix = `day${Number(dayIndex) + 1}-${featuredSuffix}`
      const sortedEntries = [...entries].sort((entryA, entryB) =>
        sortGalleryFiles(entryA.fileName, entryB.fileName, featuredPrefix),
      )

      return [Number(dayIndex), sortedEntries.map((entry) => entry.imageUrl)]
    }),
  ) as Record<number, string[]>
}

const locationImagesByDay = buildImageMap(locationImageModules, 'location')
const accommodationImagesByDay = buildImageMap(accommodationImageModules, 'accomodation')

const getLocationImages = (dayNumber: number): string[] => locationImagesByDay[dayNumber] ?? []

const getAccommodationImages = (dayNumber: number): string[] => {
  const accommodationMap: Record<number, number> = { 0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 5, 6: 5, 7: 7, 8: 7, 9: 9 }
  return accommodationImagesByDay[accommodationMap[dayNumber]] ?? []
}

const defaultTripDays: TripDay[] = Array.from({ length: tripLength }, (_, index) => {
  const currentDate = new Date(tripStartDate)
  currentDate.setDate(tripStartDate.getDate() + index)

  const monthLabel = currentDate.toLocaleString('en-US', { month: 'short' })
  const dayLabel = currentDate.getDate()

  return {
    dateLabel: `${monthLabel} ${dayLabel}`,
  location: {
    name: `Location for Day ${index + 1}`,
    imageLabel: 'location photo placeholder',
  },
  accommodations: {
    name: `Hotel for Day ${index + 1}`,
    imageLabel: 'accommodation photo placeholder',
  },
  itinerary: [
    `Morning plan for ${monthLabel} ${dayLabel}`,
    `Afternoon activity for ${monthLabel} ${dayLabel}`,
    `Dinner or evening plan for ${monthLabel} ${dayLabel}`,
  ],
  resources: [
    {
      title: `Map + directions for ${monthLabel} ${dayLabel}`,
      url: 'https://example.com/map',
    },
    {
      title: `Reservation details for ${monthLabel} ${dayLabel}`,
      url: 'https://example.com/reservation',
    },
  ],
  photosNote: 'Add photos from this day after the trip.',
  }
})

const customLocationNames = [
  'Calgary International Airport',
  'Downtown Banff (Banff Ave & Mountain View)',
  'Bow Falls & Banff Springs Area',
  'Lake Minnewanka Scenic Drive',
  'Johnston Canyon Trails',
  'Moraine Lake Viewpoint',
  'Lake Louise Lakeshore',
  'Icefields Parkway Stops',
  'Calgary City Highlights',
  'Return to Chicago',
]

const customResourcesByDay = [
  [
    {
      title: 'Banff visitor map and planning',
      url: 'https://www.banfflakelouise.com',
    },
    {
      title: 'Parks Canada Banff info',
      url: 'https://parks.canada.ca/pn-np/ab/banff',
    },
  ],
  [
    {
      title: 'Banff Avenue map',
      url: 'https://www.banfflakelouise.com',
    },
    {
      title: 'Canmore local guide',
      url: 'https://www.explorecanmore.ca',
    },
  ],
  [
    {
      title: 'Bow Falls trail and access',
      url: 'https://www.banfflakelouise.com/things-to-do/sightseeing/bow-falls',
    },
    {
      title: 'Banff Springs Hotel area',
      url: 'https://www.fairmont.com/banff-springs/',
    },
  ],
  [
    {
      title: 'Lake Minnewanka boat cruise',
      url: 'https://www.banffjaspercollection.com/attractions/lake-minnewanka-cruise/',
    },
    {
      title: 'Parks Canada: Lake Minnewanka',
      url: 'https://parks.canada.ca/pn-np/ab/banff/activ/minnewanka',
    },
  ],
  [
    {
      title: 'Johnston Canyon trail details',
      url: 'https://www.banfflakelouise.com/things-to-do/sightseeing/johnston-canyon',
    },
    {
      title: 'Parks Canada trail conditions',
      url: 'https://parks.canada.ca/pn-np/ab/banff/activ/randonee-hiking',
    },
  ],
  [
    {
      title: 'Moraine Lake shuttle info',
      url: 'https://parks.canada.ca/pn-np/ab/banff/visit/parkbus/louise',
    },
    {
      title: 'Moraine Lake visitor guide',
      url: 'https://www.banfflakelouise.com/things-to-do/sightseeing/moraine-lake',
    },
  ],
  [
    {
      title: 'Lake Louise lakeshore activities',
      url: 'https://www.banfflakelouise.com/lake-louise',
    },
    {
      title: 'Parks Canada: Lake Louise area',
      url: 'https://parks.canada.ca/pn-np/ab/banff/visit/attractions/lakelouise',
    },
  ],
  [
    {
      title: 'Icefields Parkway highlights',
      url: 'https://www.icefieldsparkway.com',
    },
    {
      title: 'Jasper-Banff drive conditions',
      url: 'https://511.alberta.ca',
    },
  ],
  [
    {
      title: 'Calgary top attractions',
      url: 'https://www.visitcalgary.com/things-to-do',
    },
    {
      title: 'Calgary transit and getting around',
      url: 'https://www.calgarytransit.com',
    },
  ],
  [
    {
      title: 'Calgary Pearson International Airport',
      url: 'https://www.yyc.com',
    },
    {
      title: 'Flight information',
      url: 'https://www.yyc.com/en-US/Passengers.html',
    },
  ],
]

customLocationNames.forEach((locationName, index) => {
  defaultTripDays[index].location = {
    ...defaultTripDays[index].location,
    name: locationName,
  }
})

customResourcesByDay.forEach((resources, index) => {
  defaultTripDays[index].resources = resources
})

defaultTripDays[0] = {
  ...defaultTripDays[0],
  location: {
    name: 'Calgary International Airport',
    imageLabel: 'Calgary Airport exterior',
    imageSrcs: getLocationImages(0),
  },
  accommodations: {
    name: 'Delta Hotels by Marriott Calgary Airport In-Terminal',
    imageLabel: 'Calgary Airport hotel exterior',
    imageSrcs: getAccommodationImages(0),
  },
  itinerary: [
    'ORD -> YYC AA 1632 ( 8:50PM~11:43PM ) ✈️',
  ],
}

defaultTripDays[1] = {
  ...defaultTripDays[1],
  location: {
    name: 'Downtown Banff (Banff Ave & Mountain View)',
    imageLabel: 'Banff town and mountain view',
    imageSrcs: getLocationImages(1),
  },
  accommodations: {
    name: 'Canmore Lodging',
    imageLabel: 'Accommodation exterior',
    imageSrcs: getAccommodationImages(1),
  },
  itinerary: [
    'RentCar -> H-mart Shopping ( w/brunch)',
    'Easy Day',
    'Johnston canyon hiking (2hr) 🏔️',
    'Open top touring (1.5hr)',
    'Banff Gondola (1.5hr) 🚠',
    'BBQ Dinner 🍖'
  ],
  photosNote: 'Add favorite Day 2 street and mountain photos here.',
}

defaultTripDays[2].location = {
  ...defaultTripDays[2].location,
  imageLabel: 'Day 3 location view',
  imageSrcs: getLocationImages(2),
}

defaultTripDays[2].itinerary = [
  'Lake louise day ( 6:30 bus ) 🚌',
  'Hard hiking ( 6 hr , R9.5mile, E520m) 🏔️',
  'Plain of six->lake agnes->beehive hiking',
  'Plain of six tea /lake agnes tea house',
  'Birthday dinner ( Banff Restaurant )'
]

defaultTripDays[3].location = {
  ...defaultTripDays[3].location,
  imageLabel: 'Day 4 location view',
  imageSrcs: getLocationImages(3),
}

defaultTripDays[3].itinerary = [
  'Golden skybridge/Emerald Kayak day 🚠🛶',
  'Easy day',
  'Golden Sky bridge ( Zipline, Railrider option)',
  'Lake Emerald ( Kayak or Canoe ) 🛶',
  'BBQ Dinner 🍖'
]

defaultTripDays[4].location = {
  ...defaultTripDays[4].location,
  imageLabel: 'Day 5 location view',
  imageSrcs: getLocationImages(4),
}

defaultTripDays[4].itinerary = [
  'Lake Moraine Day (6:30 bus) 🚌',
  'Hard hiking ( 5.5 hr , R6.9mile, E725m) 🏔️',
  'Sentinal pass hiking',
  'Canmore dinner ( restaurant ) or BBQ'
]

defaultTripDays[5].location = {
  ...defaultTripDays[5].location,
  imageLabel: 'Day 6 location view',
  imageSrcs: getLocationImages(5),
}

defaultTripDays[5].itinerary = [
    'Icefield parkway/Columbia ice field day 🚗',
    'Easy day',
    'Icefield parkway scenic drive (Unesco Heritage) 🚗',
    '(stop; peyto lake, mistaya canyon, parke ridge trail)',
    'Columbia icefield tour ( 3:30~6:30PM) 🚌',
    'BBQ Dinner 🍖'
]

defaultTripDays[6].location = {
  ...defaultTripDays[6].location,
  imageLabel: 'Day 7 location view',
  imageSrcs: getLocationImages(6),
}

defaultTripDays[6].itinerary = [
  'Hot spring / spirit island(cruise) day ♨️🛳️',
  'Hard day',
  'Sulphur skyline hiking ( 4hr, R5 mile, E700m)',
  'Mitte hot spring ( sulphur skyline enterance, 2 hr ) ♨️',
  'Maligne lake curise ( 3:30~5:00PM) 🛳️', 
  'BBQ Dinner 🍖'
]

defaultTripDays[7].location = {
  ...defaultTripDays[7].location,
  imageLabel: 'Day 8 location view',
  imageSrcs: getLocationImages(7),
}

defaultTripDays[7].itinerary = [
    'hinton->Jesper->banff->Calgery',
    'Easy day',
    'Pyramid Lake Trail & Pyramid island hiking 🏔',
    'Icefield parkway drive ( Unesco Heritage) 🚗',
    ' ( Stop; Sunwatpta fall, Athabasca falls )',
    'Calgery Dinner ( Restaur, if late togo food)',
]   

defaultTripDays[8].location = {
  ...defaultTripDays[8].location,
  imageLabel: 'Day 9 location view',
  imageSrcs: getLocationImages(8),
}

defaultTripDays[8].itinerary = [
    'Calgery Stampede Festival all day 🎉',
    'Easy Day',
    'Rodeo show  ( 1:30 PM ~ 3 :30 PM) 🐂',
    ' Stampede night show  ( 7:30~9:30PM)',
    'Festival food truck ( lunch/snack/dinner ) 🌭🍔🍟',
]

defaultTripDays[9] = {
  ...defaultTripDays[9],
  location: {
    name: 'Return to Chicago',
    imageLabel: 'Calgary Airport departure',
    imageSrcs: getLocationImages(9),
  },
  accommodations: {
    name: '✈️',
    imageLabel: 'Calgary Downtown Hotel',
    imageSrcs: getAccommodationImages(9),
  },
  itinerary: [
    'Calgary Brunch 🥞',
    'Rental Car Return (12:00PM) 🚗',
    'YYC -> ORD AA 2389 ( 1:53PM~6:38PM ) ✈️',
  ],
  photosNote: 'Safe travels!',
}

for (let dayIndex = 1; dayIndex <= 4; dayIndex += 1) {
  defaultTripDays[dayIndex].accommodations = {
    ...defaultTripDays[dayIndex].accommodations,
    name: 'Canmore Mountain Lodge',
    imageLabel: 'Accommodation used for Days 2 through 5',
    imageSrcs: getAccommodationImages(dayIndex),
  }
}

for (let dayIndex = 5; dayIndex <= 6; dayIndex += 1) {
  defaultTripDays[dayIndex].accommodations = {
    ...defaultTripDays[dayIndex].accommodations,
    name: 'Lake Louise Lodge',
    imageLabel: 'Accommodation used for Days 6 and 7',
    imageSrcs: getAccommodationImages(dayIndex),
  }
}

for (let dayIndex = 7; dayIndex <= 8; dayIndex += 1) {
  defaultTripDays[dayIndex].accommodations = {
    ...defaultTripDays[dayIndex].accommodations,
    name: 'Calgary Downtown Hotel',
    imageLabel: 'Accommodation used for Days 8 and 9',
    imageSrcs: getAccommodationImages(dayIndex),
  }
}

function App() {
  const photoUploadRef = useRef<PhotoUploadHandle>(null)
  const [isPhotoUploading, setIsPhotoUploading] = useState(false)

  const {
    tripDays,
    saveTripDays,
  } = useCollaborativeTrip({
    tripId: 'banff-2026',
    defaultTripDays,
  })

  const {
    selectedIndex,
    locationImageIndices,
    setLocationImageIndices,
    accommodationImageIndices,
    setAccommodationImageIndices,
    selectDate,
    onGalleryScroll,
  } = useTripPlannerState(tripDays.length)
  const { weatherByDay, weatherLoaded } = useWeatherByDay(tripDays.length)

  const selectedDay = tripDays[selectedIndex]
  const selectedWeather = weatherByDay[selectedIndex]
  const selectedWeatherCity = dayWeatherCity[selectedIndex] ?? dayWeatherCity[dayWeatherCity.length - 1]
  const selectedLocationQuery = locationMapQueries[selectedIndex] ?? selectedDay.location.name

  const openInMaps = () => {
    window.open(getMapsUrl(selectedLocationQuery), '_blank', 'noopener,noreferrer')
  }

  const saveSelectedDay = async (nextDay: TripDay) => {
    const nextTripDays = tripDays.map((day, dayIndex) => (dayIndex === selectedIndex ? nextDay : day))
    await saveTripDays(nextTripDays)
  }

  return (
    <main className="app-shell">
      <section className="phone-layout">
        <header className="page-header">
          <h1>Banff Trip 2026</h1>
          <p className="emoji-line" aria-hidden="true">
            🇨🇦 🏔️
          </p>
          <TripCountdown targetDate={tripStartDate} />
        </header>

        <DateChips tripDays={tripDays} selectedIndex={selectedIndex} onSelectDate={selectDate} />

        <WeatherCard
          selectedWeather={selectedWeather}
          selectedWeatherCity={selectedWeatherCity}
          weatherLoaded={weatherLoaded}
        />

        <section className="content-section">
          <h2>Location 📍</h2>
          <article className="card">
            {selectedDay.location.imageSrcs && selectedDay.location.imageSrcs.length > 0 ? (
              <ImageGallery
                images={selectedDay.location.imageSrcs}
                imageLabel={selectedDay.location.imageLabel}
                dayIndex={selectedIndex}
                activeIndex={locationImageIndices[selectedIndex] || 0}
                galleryKey={`location-gallery-${selectedIndex}`}
                onScroll={(e) => onGalleryScroll(e, setLocationImageIndices, selectedIndex)}
              />
            ) : (
              <div className="image-placeholder">{selectedDay.location.imageLabel}</div>
            )}
            <p className="card-title">{selectedDay.location.name}</p>
            <button type="button" className="map-link-btn" onClick={openInMaps}>
              Open in Maps
            </button>
          </article>
        </section>

        <section className="content-section">
          <h2>Accommodations 🏨</h2>
          <article className="card">
            {selectedDay.accommodations.imageSrcs && selectedDay.accommodations.imageSrcs.length > 0 ? (
              <ImageGallery
                images={selectedDay.accommodations.imageSrcs}
                imageLabel={selectedDay.accommodations.imageLabel}
                dayIndex={selectedIndex}
                activeIndex={accommodationImageIndices[selectedIndex] || 0}
                galleryKey={`accommodation-gallery-${selectedIndex}`}
                onScroll={(e) => onGalleryScroll(e, setAccommodationImageIndices, selectedIndex)}
              />
            ) : (
              <div className="image-placeholder">{selectedDay.accommodations.imageLabel}</div>
            )}
            <p className="card-title">{selectedDay.accommodations.name}</p>
          </article>
        </section>

        <section className="content-section">
          <div className="section-header">
            <h2>Itinerary 📋</h2>
            <ItineraryModal
              itinerary={selectedDay.itinerary}
              onSave={async (newItinerary) => {
                const nextDay = { ...selectedDay, itinerary: newItinerary }
                await saveSelectedDay(nextDay)
              }}
            />
          </div>
          <article className="card text-card">
            <ul>
              {selectedDay.itinerary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="content-section">
          <h2>Resources &amp; Links 🔗</h2>
          <article className="card text-card">
            <ul>
              {selectedDay.resources.map((resource) => (
                <li key={resource.title}>
                  <a href={resource.url} target="_blank" rel="noreferrer">
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="content-section last-section">
          <div className="section-header">
            <h2>Pictures 📷</h2>
            <button
              type="button"
              className="itinerary-edit-btn"
              onClick={() => photoUploadRef.current?.trigger()}
              disabled={isPhotoUploading}
            >
              {isPhotoUploading ? 'Uploading...' : '📤 Upload'}
            </button>
          </div>
          <article className="card photo-card">
            <PhotoUpload
              ref={photoUploadRef}
              uploadedPhotos={selectedDay.uploadedPhotos ?? []}
              dayIndex={selectedIndex}
              tripId="banff-2026"
              onPhotosChanged={async (newUrls) => {
                const nextDay = { ...selectedDay, uploadedPhotos: newUrls }
                await saveSelectedDay(nextDay)
              }}
              onUploadingChange={setIsPhotoUploading}
            />
          </article>
        </section>
      </section>
    </main>
  )
}

export default App
