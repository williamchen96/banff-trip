import { useEffect, useState } from 'react'
import { fetchWeatherByTripDay, type WeatherDay } from '../services/weatherService'

export const useWeatherByDay = (tripLength: number) => {
  const [weatherByDay, setWeatherByDay] = useState<Record<number, WeatherDay | null>>({})
  const [weatherLoaded, setWeatherLoaded] = useState(false)

  useEffect(() => {
    let isCancelled = false

    const loadWeather = async () => {
      const nextWeather = await fetchWeatherByTripDay(tripLength)

      if (!isCancelled) {
        setWeatherByDay(nextWeather)
        setWeatherLoaded(true)
      }
    }

    loadWeather()

    return () => {
      isCancelled = true
    }
  }, [tripLength])

  return {
    weatherByDay,
    weatherLoaded,
  }
}
