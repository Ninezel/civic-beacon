import type { UnitSystem, WeatherSnapshot } from '../types'

function roundToWhole(value: number) {
  return Math.round(value)
}

export function formatTemperature(weather: WeatherSnapshot, unitSystem: UnitSystem) {
  if (unitSystem === 'imperial') {
    const fahrenheit = (weather.temperatureC * 9) / 5 + 32
    return `${roundToWhole(fahrenheit)}°F`
  }

  return `${roundToWhole(weather.temperatureC)}°C`
}

export function formatWindSpeed(weather: WeatherSnapshot, unitSystem: UnitSystem) {
  if (unitSystem === 'imperial') {
    const mph = weather.windKph * 0.621371
    return `${roundToWhole(mph)} mph`
  }

  return `${roundToWhole(weather.windKph)} kph`
}

export function describeUnitSystem(unitSystem: UnitSystem) {
  return unitSystem === 'imperial' ? 'Imperial display' : 'Metric display'
}
