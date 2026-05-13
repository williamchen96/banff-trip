import { getWeatherCondition, type WeatherDay, type WeatherCity } from '../services/weatherService'

type WeatherCardProps = {
  selectedWeather: WeatherDay | null
  selectedWeatherCity: WeatherCity
  weatherLoaded: boolean
}

export function WeatherCard({ selectedWeather, selectedWeatherCity, weatherLoaded }: WeatherCardProps) {
  const selectedCondition =
    selectedWeather && typeof selectedWeather.weatherCode === 'number'
      ? getWeatherCondition(selectedWeather.weatherCode)
      : null

  return (
    <section className="content-section">
      <h2>Current Weather 🌦️</h2>
      <article className="card weather-card">
        {selectedWeather && selectedCondition ? (
          <>
            {/* <p className="weather-source">Today's weather</p> */}
            <p className="weather-city">{selectedWeather.city}</p>
            <p className="weather-condition">
              {selectedWeather.current}°F {selectedCondition.emoji}
            </p>
            <p className="weather-temps">High {selectedWeather.high}°F • Low {selectedWeather.low}°F</p>
            <p className="weather-rain">Chance of rain: {selectedWeather.rainChance}%</p>
            {selectedWeather.outlook.length > 0 && (
              <div className="weather-outlook">
                <p className="weather-outlook-title">5-day outlook</p>
                <ul className="weather-outlook-list">
                  {selectedWeather.outlook.map((day, index) => {
                    const condition = getWeatherCondition(day.weatherCode)

                    return (
                      <li key={`${day.label}-${index}`} className="weather-outlook-item">
                        <span className="weather-outlook-day">{day.label}</span>
                        <span className="weather-outlook-condition">{condition.emoji}</span>
                        <span className="weather-outlook-temps">{day.high}°F / {day.low}°F</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="weather-unavailable">
            {weatherLoaded
              ? `Today's weather is unavailable right now for ${selectedWeatherCity}.`
              : `Loading today's weather for ${selectedWeatherCity}...`}
          </p>
        )}
      </article>
    </section>
  )
}
