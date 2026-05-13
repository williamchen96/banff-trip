export type WeatherCity = 'Calgary' | 'Banff' | 'Jasper'

export type WeatherOutlookDay = {
  label: string
  high: number
  low: number
  weatherCode: number
}

export type WeatherDay = {
  current: number
  high: number
  low: number
  rainChance: number
  weatherCode: number
  city: WeatherCity
  outlook: WeatherOutlookDay[]
}

const cityCoordinates: Record<WeatherCity, { latitude: number; longitude: number }> = {
  Calgary: { latitude: 51.0447, longitude: -114.0719 },
  Banff: { latitude: 51.1784, longitude: -115.5708 },
  Jasper: { latitude: 52.8737, longitude: -118.0814 },
}

export const dayWeatherCity: WeatherCity[] = [
  'Calgary',
  'Banff',
  'Banff',
  'Banff',
  'Banff',
  'Banff',
  'Jasper',
  'Jasper',
  'Calgary',
  'Calgary',
]

export const getWeatherCondition = (weatherCode: number) => {
  if (weatherCode === 0) {
    return { label: 'Sunny', emoji: '☀️' }
  }

  if (weatherCode === 1) {
    return { label: 'Mostly Sunny', emoji: '🌤️' }
  }

  if (weatherCode === 2) {
    return { label: 'Partly Cloudy', emoji: '⛅' }
  }

  if (weatherCode === 3) {
    return { label: 'Cloudy', emoji: '☁️' }
  }

  if ([45, 48].includes(weatherCode)) {
    return { label: 'Foggy', emoji: '🌫️' }
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return { label: 'Drizzle', emoji: '🌦️' }
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return { label: 'Rain', emoji: '🌧️' }
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return { label: 'Snow', emoji: '❄️' }
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return { label: 'Thunderstorm', emoji: '⛈️' }
  }

  return { label: 'Variable', emoji: '🌥️' }
}

const getWeekdayLabel = (isoDate: string) => {
  const date = new Date(`${isoDate}T12:00:00`)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

const fetchCityWeather = async (city: WeatherCity): Promise<WeatherDay | null> => {
  const { latitude, longitude } = cityCoordinates[city]
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
    `&longitude=${longitude}` +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code' +
    '&current=temperature_2m' +
    '&temperature_unit=fahrenheit' +
    '&forecast_days=5' +
    '&timezone=auto'

  try {
    const response = await fetch(weatherUrl)

    if (!response.ok) {
      return null
    }

    const payload = await response.json()
    const currentTemp = payload?.current?.temperature_2m
    const times = payload?.daily?.time
    const maxTemps = payload?.daily?.temperature_2m_max
    const minTemps = payload?.daily?.temperature_2m_min
    const rainChances = payload?.daily?.precipitation_probability_max
    const weatherCodes = payload?.daily?.weather_code

    const maxTemp = maxTemps?.[0]
    const minTemp = minTemps?.[0]
    const rainChance = rainChances?.[0]
    const weatherCode = weatherCodes?.[0]

    if (
      typeof currentTemp !== 'number' ||
      typeof maxTemp !== 'number' ||
      typeof minTemp !== 'number' ||
      typeof rainChance !== 'number' ||
      typeof weatherCode !== 'number' ||
      !Array.isArray(times) ||
      !Array.isArray(maxTemps) ||
      !Array.isArray(minTemps) ||
      !Array.isArray(weatherCodes) ||
      times.length === 0 ||
      maxTemps.length === 0 ||
      minTemps.length === 0 ||
      weatherCodes.length === 0
    ) {
      return null
    }

    const outlook = times.slice(0, 5).map((isoDate: string, outlookIndex: number) => {
      const outlookHigh = maxTemps[outlookIndex]
      const outlookLow = minTemps[outlookIndex]
      const outlookCode = weatherCodes[outlookIndex]

      return {
        label: getWeekdayLabel(isoDate),
        high: typeof outlookHigh === 'number' ? Math.round(outlookHigh) : 0,
        low: typeof outlookLow === 'number' ? Math.round(outlookLow) : 0,
        weatherCode: typeof outlookCode === 'number' ? outlookCode : 0,
      }
    })

    return {
      current: Math.round(currentTemp),
      high: Math.round(maxTemp),
      low: Math.round(minTemp),
      rainChance: Math.round(rainChance),
      weatherCode,
      city,
      outlook,
    }
  } catch {
    return null
  }
}

export const fetchWeatherByTripDay = async (tripLength: number): Promise<Record<number, WeatherDay | null>> => {
  const cityWeather: Partial<Record<WeatherCity, WeatherDay | null>> = {}
  const nextWeather: Record<number, WeatherDay | null> = {}

  await Promise.all(
    (Object.keys(cityCoordinates) as WeatherCity[]).map(async (city) => {
      cityWeather[city] = await fetchCityWeather(city)
    }),
  )

  for (let dayIndex = 0; dayIndex < tripLength; dayIndex += 1) {
    const fallbackCity = dayWeatherCity[dayWeatherCity.length - 1]
    const city = dayWeatherCity[dayIndex] ?? fallbackCity
    nextWeather[dayIndex] = cityWeather[city] ?? null
  }

  return nextWeather
}
