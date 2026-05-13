# Trip Planner (Mobile First)

A React + Vite Banff trip planner designed for mobile screens, with swipeable photo galleries, daily weather, and per-day trip details.

## Features

- Scrollable date chips for the full trip
- Per-day sections for:
  - Weather
  - Location
  - Accommodations
  - Itinerary
  - Resources & links
  - Pictures placeholder area
- Swipeable image galleries for location and accommodation photos
- Live weather card using Open-Meteo
- 5-day weather outlook
- Mobile-first layout with card-based UI

## Run locally

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Folder structure

```text
src/
  App.tsx
  App.css
  assets/
    locations/
    accommodations/
  components/
    DateChips.tsx
    ImageGallery.tsx
    WeatherCard.tsx
  hooks/
    useTripPlannerState.ts
    useWeatherByDay.ts
  services/
    weatherService.ts
```

## Architecture

### `components/`
Reusable UI building blocks.

- `DateChips.tsx`: horizontal day selector
- `ImageGallery.tsx`: reusable swipeable image gallery with dot indicators
- `WeatherCard.tsx`: weather summary and 5-day outlook card

### `hooks/`
Custom React hooks for app state and data loading.

- `useTripPlannerState.ts`: selected day + gallery index state
- `useWeatherByDay.ts`: weather loading lifecycle and state management

### `services/`
API and data-fetching utilities.

- `weatherService.ts`: Open-Meteo fetch logic, city mapping, and weather-condition helpers

## Where to edit trip details

Trip day content is still defined in [src/App.tsx](src/App.tsx).

Each day entry contains:

- `location`
- `accommodations`
- `itinerary`
- `resources`
- `photosNote`

## Where to add images

Add gallery images to:

- `src/assets/locations/day1` through `src/assets/locations/day10`
- `src/assets/accommodations/day1`, `day2`, `day6`, `day8`, `day10`

Images are auto-discovered and rendered in the galleries.
