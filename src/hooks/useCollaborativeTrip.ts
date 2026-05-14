import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'
import type { TripDay } from '../services/tripTypes'

const cloneTripDays = (days: TripDay[]) => JSON.parse(JSON.stringify(days)) as TripDay[]

type UseCollaborativeTripArgs = {
  tripId: string
  defaultTripDays: TripDay[]
}

export const useCollaborativeTrip = ({ tripId, defaultTripDays }: UseCollaborativeTripArgs) => {
  const [tripDays, setTripDays] = useState<TripDay[]>(cloneTripDays(defaultTripDays))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTripDays(cloneTripDays(defaultTripDays))
  }, [defaultTripDays])

  const loadSharedTrip = async () => {
    if (!isSupabaseConfigured || !supabase) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: selectError } = await supabase
        .from('trips')
        .select('trip_data')
        .eq('id', tripId)
        .maybeSingle()

      if (selectError) {
        throw selectError
      }

      const sharedDays = data?.trip_data as TripDay[] | undefined

      if (Array.isArray(sharedDays) && sharedDays.length > 0) {
        setTripDays(sharedDays)
      } else {
        const fresh = cloneTripDays(defaultTripDays)
        const { error: upsertError } = await supabase
          .from('trips')
          .upsert({ id: tripId, trip_data: fresh, updated_at: new Date().toISOString() })

        if (upsertError) {
          throw upsertError
        }

        setTripDays(fresh)
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to load shared trip')
    } finally {
      setIsLoading(false)
    }
  }

  // Load on mount, then setup realtime
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return
    }

    const client = supabase
    let isCancelled = false

    const initialize = async () => {
      await loadSharedTrip()
    }

    initialize()

    // Realtime: listen for changes to this trip row from any device
    const channel = client
      .channel(`trip-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trips',
          filter: `id=eq.${tripId}`,
        },
        (payload) => {
          if (!isCancelled) {
            const incoming = payload.new as { trip_data?: TripDay[] }
            if (Array.isArray(incoming?.trip_data)) {
              setTripDays(incoming.trip_data)
            }
          }
        }
      )
      .subscribe()

    return () => {
      isCancelled = true
      client.removeChannel(channel)
    }
  }, [tripId])

  const saveTripDays = async (nextTripDays: TripDay[]) => {
    setTripDays(nextTripDays)

    if (!isSupabaseConfigured || !supabase) {
      return
    }

    setError(null)

    const { error: upsertError } = await supabase
      .from('trips')
      .upsert({ id: tripId, trip_data: nextTripDays, updated_at: new Date().toISOString() })

    if (upsertError) {
      setError(upsertError.message)
    }
  }

  return {
    tripDays,
    isConfigured: isSupabaseConfigured,
    isLoading,
    error,
    saveTripDays,
  }
}
