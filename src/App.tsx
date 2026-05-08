import { useMemo, useState } from 'react'
import './App.css'

type TripDay = {
  dateLabel: string
  location: {
    name: string
    imageLabel: string
    imageSrc?: string
  }
  accommodations: {
    name: string
    imageLabel: string
    imageSrc?: string
  }
  itinerary: string[]
  resources: {
    title: string
    url: string
  }[]
  photosNote: string
}

const tripStartDate = new Date(2026, 5, 28)
const tripLength = 9
const publicAsset = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`

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
  'Banff Arrival & Town Stroll',
  'Downtown Banff (Banff Ave & Mountain View)',
  'Bow Falls & Banff Springs Area',
  'Lake Minnewanka Scenic Drive',
  'Johnston Canyon Trails',
  'Moraine Lake Viewpoint',
  'Lake Louise Lakeshore',
  'Icefields Parkway Stops',
  'Calgary City Highlights',
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

tripDays[0].accommodations = {
  ...tripDays[0].accommodations,
  name: 'Banff Hotel (Night 1)',
}

tripDays[1] = {
  ...tripDays[1],
  location: {
    name: 'Downtown Banff (Banff Ave & Mountain View)',
    imageLabel: 'Banff town and mountain view',
    imageSrc: publicAsset('day2-location.png'),
  },
  accommodations: {
    name: 'Canmore Lodging',
    imageLabel: 'Accommodation exterior',
    imageSrc: publicAsset('day2-accomodation.png'),
  },
  itinerary: [
    'Breakfast and coffee in Banff town',
    'Explore Banff Avenue and local shops',
    'Scenic sunset walk and dinner nearby',
  ],
  photosNote: 'Add favorite Day 2 street and mountain photos here.',
}

tripDays[2].location = {
  ...tripDays[2].location,
  imageLabel: 'Day 3 location view',
  imageSrc: publicAsset('day3-location.png'),
}

tripDays[3].location = {
  ...tripDays[3].location,
  imageLabel: 'Day 4 location view',
  imageSrc: publicAsset('day4-location.png'),
}

tripDays[4].location = {
  ...tripDays[4].location,
  imageLabel: 'Day 5 location view',
  imageSrc: publicAsset('day5-location.png'),
}

tripDays[5].location = {
  ...tripDays[5].location,
  imageLabel: 'Day 6 location view',
  imageSrc: publicAsset('day6-location.png'),
}

tripDays[6].location = {
  ...tripDays[6].location,
  imageLabel: 'Day 7 location view',
  imageSrc: publicAsset('day7-location.png'),
}

tripDays[7].location = {
  ...tripDays[7].location,
  imageLabel: 'Day 8 location view',
  imageSrc: publicAsset('day8-location.png'),
}

tripDays[8].location = {
  ...tripDays[8].location,
  imageLabel: 'Day 9 location view',
  imageSrc: publicAsset('day9-location.png'),
}

for (let dayIndex = 1; dayIndex <= 4; dayIndex += 1) {
  tripDays[dayIndex].accommodations = {
    ...tripDays[dayIndex].accommodations,
    name: 'Canmore Mountain Lodge',
    imageLabel: 'Accommodation used for Days 2 through 5',
    imageSrc: publicAsset('day2-accomodation.png'),
  }
}

for (let dayIndex = 5; dayIndex <= 6; dayIndex += 1) {
  tripDays[dayIndex].accommodations = {
    ...tripDays[dayIndex].accommodations,
    name: 'Lake Louise Lodge',
    imageLabel: 'Accommodation used for Days 6 and 7',
    imageSrc: publicAsset('day6-accomodation.png'),
  }
}

for (let dayIndex = 7; dayIndex <= 8; dayIndex += 1) {
  tripDays[dayIndex].accommodations = {
    ...tripDays[dayIndex].accommodations,
    name: 'Calgary Downtown Hotel',
    imageLabel: 'Accommodation used for Days 8 and 9',
    imageSrc: publicAsset('day8-accomodation.png'),
  }
}

function App() {
  const [selectedIndex, setSelectedIndex] = useState(1)
  const [visibleStart, setVisibleStart] = useState(0)

  const visibleWindowSize = 5
  const maxStart = Math.max(0, tripDays.length - visibleWindowSize)

  const adjustVisibleWindow = (nextIndex: number) => {
    setVisibleStart((previous) => {
      if (nextIndex < previous) {
        return nextIndex
      }

      if (nextIndex >= previous + visibleWindowSize) {
        return Math.min(maxStart, nextIndex - visibleWindowSize + 1)
      }

      return previous
    })
  }

  const selectDate = (index: number) => {
    const boundedIndex = Math.max(0, Math.min(tripDays.length - 1, index))
    setSelectedIndex(boundedIndex)
    adjustVisibleWindow(boundedIndex)
  }

  const visibleDates = useMemo(
    () => tripDays.slice(visibleStart, visibleStart + visibleWindowSize),
    [visibleStart, visibleWindowSize],
  )

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
          <button
            type="button"
            className="arrow-btn"
            onClick={() => selectDate(selectedIndex - 1)}
            disabled={selectedIndex === 0}
            aria-label="Previous date"
          >
            ◀
          </button>

          <div className="date-chips" role="list">
            {visibleDates.map((tripDay, localIndex) => {
              const absoluteIndex = visibleStart + localIndex
              const [month, day] = tripDay.dateLabel.split(' ')

              return (
                <button
                  key={tripDay.dateLabel}
                  type="button"
                  className={`date-chip ${absoluteIndex === selectedIndex ? 'active' : ''}`}
                  onClick={() => selectDate(absoluteIndex)}
                  aria-current={absoluteIndex === selectedIndex ? 'date' : undefined}
                >
                  <span>{month}</span>
                  <strong>{day}</strong>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="arrow-btn"
            onClick={() => selectDate(selectedIndex + 1)}
            disabled={selectedIndex === tripDays.length - 1}
            aria-label="Next date"
          >
            ▶
          </button>
        </nav>

        <section className="content-section">
          <h2>Location 📍</h2>
          <article className="card">
            {selectedDay.location.imageSrc ? (
              <img
                src={selectedDay.location.imageSrc}
                alt={selectedDay.location.imageLabel}
                className="day-image"
              />
            ) : (
              <div className="image-placeholder">{selectedDay.location.imageLabel}</div>
            )}
            <p className="card-title">{selectedDay.location.name}</p>
          </article>
        </section>

        <section className="content-section">
          <h2>Accommodations 🏨</h2>
          <article className="card">
            {selectedDay.accommodations.imageSrc ? (
              <img
                src={selectedDay.accommodations.imageSrc}
                alt={selectedDay.accommodations.imageLabel}
                className="day-image"
              />
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
