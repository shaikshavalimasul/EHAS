import { useState } from 'react'
import api from '../services/api'

function WeatherWidget() {
  const [city, setCity] = useState('Hyderabad')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async () => {
    setLoading(true)
    setError('')
    setWeather(null)
    try {
      const res = await api.get('/weather/', { params: { city } })
      if (res.data.error) {
        setError(res.data.error)
      } else {
        setWeather(res.data)
      }
    } catch {
      setError('Failed to fetch weather')
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Exam Day Weather</h2>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city name"
          className="w-full p-3 border rounded-lg text-center text-lg"
          onKeyDown={e => e.key === 'Enter' && fetchWeather()}
        />
        <button onClick={fetchWeather} disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold disabled:opacity-50">
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
        {error && <div className="text-red-600 text-center">{error}</div>}
        {weather && (
          <div className="text-center space-y-2 p-4 bg-blue-50 rounded-lg">
            <p className="text-4xl font-bold">{Math.round(weather.main?.temp)}°C</p>
            <p className="text-lg capitalize">{weather.weather?.[0]?.description}</p>
            <p className="text-gray-600">📍 {weather.name}, {weather.sys?.country}</p>
            <div className="flex justify-around text-sm text-gray-600 pt-2">
              <span>💧 Humidity: {weather.main?.humidity}%</span>
              <span>💨 Wind: {weather.wind?.speed} m/s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherWidget
