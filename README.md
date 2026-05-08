# Trip Planner (Mobile First)

A React + Vite trip planner template for a Banff trip, designed for mobile screens.

## Features

- Date selector for Jun 26 through Jul 7
- Left/right arrow navigation between dates
- Clickable date chips for direct day selection
- Per-day sections for:
  - Location
  - Accommodations
  - Itinerary
  - Resources & links
  - Pictures placeholder area
- Preloaded test data for all dates

## Run locally

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Where to edit day details

Update the `tripDays` test data in `src/App.tsx`.

Each date entry contains:

- `location`
- `accommodations`
- `itinerary`
- `resources`
- `photosNote`
