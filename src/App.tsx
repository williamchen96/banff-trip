import { useState } from 'react'
import './App.css'

type TripDay = {
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
}

const tripStartDate = new Date(2026, 5, 28)
const tripLength = 10

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

const tripDays: TripDay[] = Array.from({ length: tripLength }, (_, index) => {
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
  tripDays[index].location = {
    ...tripDays[index].location,
    name: locationName,
  }
})

customResourcesByDay.forEach((resources, index) => {
  tripDays[index].resources = resources
})

tripDays[0] = {
  ...tripDays[0],
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

tripDays[1] = {
  ...tripDays[1],
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

tripDays[2].location = {
  ...tripDays[2].location,
  imageLabel: 'Day 3 location view',
  imageSrcs: getLocationImages(2),
}

tripDays[2].itinerary = [
  'Lake louise day ( 6:30 bus ) 🚌',
  'Hard hiking ( 6 hr , R9.5mile, E520m) 🏔️',
  'Plain of six->lake agnes->beehive hiking',
  'Plain of six tea /lake agnes tea house',
  'Birthday dinner ( Banff Restaurant )'
]

tripDays[3].location = {
  ...tripDays[3].location,
  imageLabel: 'Day 4 location view',
  imageSrcs: getLocationImages(3),
}

tripDays[3].itinerary = [
  'Golden skybridge/Emerald Kayak day 🚠🛶',
  'Easy day',
  'Golden Sky bridge ( Zipline, Railrider option)',
  'Lake Emerald ( Kayak or Canoe ) 🛶',
  'BBQ Dinner 🍖'
]

tripDays[4].location = {
  ...tripDays[4].location,
  imageLabel: 'Day 5 location view',
  imageSrcs: getLocationImages(4),
}

tripDays[4].itinerary = [
  'Lake Moraine Day (6:30 bus) 🚌',
  'Hard hiking ( 5.5 hr , R6.9mile, E725m) 🏔️',
  'Sentinal pass hiking',
  'Canmore dinner ( restaurant ) or BBQ'
]

tripDays[5].location = {
  ...tripDays[5].location,
  imageLabel: 'Day 6 location view',
  imageSrcs: getLocationImages(5),
}

tripDays[5].itinerary = [
    'Icefield parkway/Columbia ice field day 🚗',
    'Easy day',
    'Icefield parkway scenic drive (Unesco Heritage) 🚗',
    '(stop; peyto lake, mistaya canyon, parke ridge trail)',
    'Columbia icefield tour ( 3:30~6:30PM) 🚌',
    'BBQ Dinner 🍖'
]

tripDays[6].location = {
  ...tripDays[6].location,
  imageLabel: 'Day 7 location view',
  imageSrcs: getLocationImages(6),
}

tripDays[6].itinerary = [
  'Hot spring / spirit island(cruise) day ♨️🛳️',
  'Hard day',
  'Sulphur skyline hiking ( 4hr, R5 mile, E700m)',
  'Mitte hot spring ( sulphur skyline enterance, 2 hr ) ♨️',
  'Maligne lake curise ( 3:30~5:00PM) 🛳️', 
  'BBQ Dinner 🍖'
]

tripDays[7].location = { 
  ...tripDays[7].location,
  imageLabel: 'Day 8 location view',
  imageSrcs: getLocationImages(7),
}

tripDays[7].itinerary = [
    'hinton->Jesper->banff->Calgery',
    'Easy day',
    'Pyramid Lake Trail & Pyramid island hiking 🏔',
    'Icefield parkway drive ( Unesco Heritage) 🚗',
    ' ( Stop; Sunwatpta fall, Athabasca falls )',
    'Calgery Dinner ( Restaur, if late togo food)',
]   

tripDays[8].location = {
  ...tripDays[8].location,
  imageLabel: 'Day 9 location view',
  imageSrcs: getLocationImages(8),
}

tripDays[8].itinerary = [
    'Calgery Stampede Festival all day 🎉',
    'Easy Day',
    'Rodeo show  ( 1:30 PM ~ 3 :30 PM) 🐂',
    ' Stampede night show  ( 7:30~9:30PM)',
    'Festival food truck ( lunch/snack/dinner ) 🌭🍔🍟',
]

tripDays[9] = {
  ...tripDays[9],
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
  tripDays[dayIndex].accommodations = {
    ...tripDays[dayIndex].accommodations,
    name: 'Canmore Mountain Lodge',
    imageLabel: 'Accommodation used for Days 2 through 5',
    imageSrcs: getAccommodationImages(dayIndex),
  }
}

for (let dayIndex = 5; dayIndex <= 6; dayIndex += 1) {
  tripDays[dayIndex].accommodations = {
    ...tripDays[dayIndex].accommodations,
    name: 'Lake Louise Lodge',
    imageLabel: 'Accommodation used for Days 6 and 7',
    imageSrcs: getAccommodationImages(dayIndex),
  }
}

for (let dayIndex = 7; dayIndex <= 8; dayIndex += 1) {
  tripDays[dayIndex].accommodations = {
    ...tripDays[dayIndex].accommodations,
    name: 'Calgary Downtown Hotel',
    imageLabel: 'Accommodation used for Days 8 and 9',
    imageSrcs: getAccommodationImages(dayIndex),
  }
}

function App() {
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
    setter(prev => ({ ...prev, [dayIdx]: index }))
  }

  const selectDate = (index: number) => {
    const boundedIndex = Math.max(0, Math.min(tripDays.length - 1, index))
    setSelectedIndex(boundedIndex)
  }

  const selectedDay = tripDays[selectedIndex]

  return (
    <main className="app-shell">
      <section className="phone-layout">
        <header className="page-header">
          <h1>Banff Trip 2026</h1>
          <p className="emoji-line" aria-hidden="true">
            🇨🇦 🏔️
          </p>
        </header>

        <nav className="date-nav" aria-label="Trip dates">
          <div className="date-chips" role="list">
            {tripDays.map((tripDay, index) => {
              const [month, day] = tripDay.dateLabel.split(' ')

              return (
                <button
                  key={tripDay.dateLabel}
                  type="button"
                  className={`date-chip ${index === selectedIndex ? 'active' : ''}`}
                  onClick={() => selectDate(index)}
                  aria-current={index === selectedIndex ? 'date' : undefined}
                >
                  <span>{month}</span>
                  <strong>{day}</strong>
                </button>
              )
            })}
          </div>
        </nav>

        <section className="content-section">
          <h2>Location 📍</h2>
          <article className="card">
            {selectedDay.location.imageSrcs && selectedDay.location.imageSrcs.length > 0 ? (
              <div className="gallery-wrap">
                <div
                  className="gallery-scroll"
                  onScroll={e => onGalleryScroll(e, setLocationImageIndices, selectedIndex)}
                >
                  {selectedDay.location.imageSrcs.map((src, i) => (
                    <img key={src} src={src} alt={`${selectedDay.location.imageLabel} ${i + 1}`} className="day-image" />
                  ))}
                </div>
                {selectedDay.location.imageSrcs.length > 1 && (
                  <div className="gallery-dots">
                    {selectedDay.location.imageSrcs.map((_, i) => (
                      <span
                        key={i}
                        className={`gallery-dot${i === (locationImageIndices[selectedIndex] || 0) ? ' active' : ''}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="image-placeholder">{selectedDay.location.imageLabel}</div>
            )}
            <p className="card-title">{selectedDay.location.name}</p>
          </article>
        </section>

        <section className="content-section">
          <h2>Accommodations 🏨</h2>
          <article className="card">
            {selectedDay.accommodations.imageSrcs && selectedDay.accommodations.imageSrcs.length > 0 ? (
              <div className="gallery-wrap">
                <div
                  className="gallery-scroll"
                  onScroll={e => onGalleryScroll(e, setAccommodationImageIndices, selectedIndex)}
                >
                  {selectedDay.accommodations.imageSrcs.map((src, i) => (
                    <img key={src} src={src} alt={`${selectedDay.accommodations.imageLabel} ${i + 1}`} className="day-image" />
                  ))}
                </div>
                {selectedDay.accommodations.imageSrcs.length > 1 && (
                  <div className="gallery-dots">
                    {selectedDay.accommodations.imageSrcs.map((_, i) => (
                      <span
                        key={i}
                        className={`gallery-dot${i === (accommodationImageIndices[selectedIndex] || 0) ? ' active' : ''}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="image-placeholder">{selectedDay.accommodations.imageLabel}</div>
            )}
            <p className="card-title">{selectedDay.accommodations.name}</p>
          </article>
        </section>

        <section className="content-section">
          <h2>Itinerary 📋</h2>
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
          <h2>Pictures 📷</h2>
          <article className="card text-card">
            <p>{selectedDay.photosNote}</p>
          </article>
        </section>
      </section>
    </main>
  )
}

export default App
