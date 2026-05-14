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
- Shared collaboration mode (Supabase + Google sign-in)
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
    CollaborationPanel.tsx
    DateChips.tsx
    ImageGallery.tsx
    TripCountdown.tsx
    WeatherCard.tsx
  hooks/
    useCollaborativeTrip.ts
    useTripPlannerState.ts
    useWeatherByDay.ts
  services/
    supabaseClient.ts
    tripTypes.ts
    weatherService.ts
```

## Architecture

### `components/`
Reusable UI building blocks.

- `DateChips.tsx`: horizontal day selector
- `ImageGallery.tsx`: reusable swipeable image gallery with dot indicators
- `TripCountdown.tsx`: live countdown timer card
- `WeatherCard.tsx`: weather summary and 5-day outlook card
- `CollaborationPanel.tsx`: shared editing sign-in and day editor UI

### `hooks/`
Custom React hooks for app state and data loading.

- `useTripPlannerState.ts`: selected day + gallery index state
- `useWeatherByDay.ts`: weather loading lifecycle and state management
- `useCollaborativeTrip.ts`: shared trip load/save and auth session handling

### `services/`
API and data-fetching utilities.

- `weatherService.ts`: Open-Meteo fetch logic, city mapping, and weather-condition helpers
- `supabaseClient.ts`: Supabase client bootstrap from env vars
- `tripTypes.ts`: shared `TripDay` type model

## Shared collaboration setup (Option 2)

This app now supports shared editing across devices with Supabase.

### 1) Add environment variables

Create `.env` in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2) Create database table

Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.trips (
  id text primary key,
  trip_data jsonb not null,
  updated_at timestamptz not null default now()
);
```

### 3) Enable Google Auth

- In Supabase Dashboard → Authentication → Providers, enable Google.
- Add your local and deployed callback URLs in Google + Supabase settings.

### 4) Add basic RLS policy (authenticated users)

```sql
alter table public.trips enable row level security;

create policy "authenticated can read trips"
on public.trips for select
to authenticated
using (true);

create policy "authenticated can write trips"
on public.trips for insert
to authenticated
with check (true);

create policy "authenticated can update trips"
on public.trips for update
to authenticated
using (true)
with check (true);
```

Once configured, users can sign in from the Collaboration card and save shared day edits that appear on other devices.

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

## Upload all stock assets to Supabase

To bulk upload all existing images under `src/assets` into Supabase Storage:

1. Ensure your `.env` has:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Make sure your bucket exists (default: `trip-photos`) and allows uploads for your key/policies.

3. Run:

```bash
npm run upload:assets
```

This uploads every image from `src/assets` to:

`trip-photos/stock/...`

with folder structure preserved.
