import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, setFilter }) => {

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <input 
        value={filter} 
        onChange={handleFilterChange} 
        placeholder="Search countries..."
      />
    </div>
  )
}

const Display = ({ countries, filter }) => {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  
  // OpenWeatherMap API key - 请替换为你自己的 API key
  const WEATHER_API_KEY = 'YOUR_API_KEY_HERE'
  
  // 获取天气数据
  const fetchWeather = async (capital) => {
    if (!capital || !WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
      return
    }
    
    setWeatherLoading(true)
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${WEATHER_API_KEY}&units=metric`
      )
      setWeather(response.data)
    } catch (error) {
      console.error('Error fetching weather:', error)
      setWeather(null)
    } finally {
      setWeatherLoading(false)
    }
  }
  
  // 当选择国家时，获取天气数据
  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setWeather(null) // 重置天气数据
    const capital = country.capital?.[0]
    if (capital) {
      fetchWeather(capital)
    }
  }
  
  // 根据过滤条件过滤国家列表
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  // 如果匹配的国家太多（超过10个），提示用户输入更具体的搜索
  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  // 如果只有一个国家，显示详细信息和天气
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    
    // 如果还没有获取天气数据，则获取
    if (!weather && !weatherLoading && country.capital?.[0] && WEATHER_API_KEY !== 'API_KEY') {
      fetchWeather(country.capital[0])
    }
    
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
        <p><strong>Population:</strong> {country.population?.toLocaleString()}</p>
        {country.flags?.png && (
          <img 
            src={country.flags.png} 
            alt={`Flag of ${country.name.common}`}
            style={{ width: '200px', height: 'auto', border: '1px solid #ccc' }}
          />
        )}
        
        {/* 天气信息 */}
        {country.capital?.[0] && (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Weather in {country.capital[0]}</h3>
            {weatherLoading && <p>Loading weather...</p>}
            {weather && (
              <div>
                <p><strong>Temperature:</strong> {Math.round(weather.main.temp)}°C</p>
                <p><strong>Feels like:</strong> {Math.round(weather.main.feels_like)}°C</p>
                <p><strong>Description:</strong> {weather.weather[0].description}</p>
                <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
                <p><strong>Wind speed:</strong> {weather.wind.speed} m/s</p>
                {weather.weather[0].icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                  />
                )}
              </div>
            )}
            {!weather && !weatherLoading && WEATHER_API_KEY === 'API_KEY' && (
              <p style={{ color: 'orange' }}>Please add your OpenWeatherMap API key to see weather data</p>
            )}
          </div>
        )}
      </div>
    )
  }

  // 如果有选中的国家，显示详细信息和天气
  if (selectedCountry) {
    return (
      <div>
        <button onClick={() => {
          setSelectedCountry(null)
          setWeather(null)
        }} style={{ marginBottom: '10px' }}>
          ← Back to list
        </button>
        <h2>{selectedCountry.name.common}</h2>
        <p><strong>Capital:</strong> {selectedCountry.capital?.[0] || 'N/A'}</p>
        <p><strong>Population:</strong> {selectedCountry.population?.toLocaleString()}</p>
        {selectedCountry.flags?.png && (
          <img 
            src={selectedCountry.flags.png} 
            alt={`Flag of ${selectedCountry.name.common}`}
            style={{ width: '200px', height: 'auto', border: '1px solid #ccc' }}
          />
        )}
        
        {/* 天气信息 */}
        {selectedCountry.capital?.[0] && (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Weather in {selectedCountry.capital[0]}</h3>
            {weatherLoading && <p>Loading weather...</p>}
            {weather && (
              <div>
                <p><strong>Temperature:</strong> {Math.round(weather.main.temp)}°C</p>
                <p><strong>Feels like:</strong> {Math.round(weather.main.feels_like)}°C</p>
                <p><strong>Description:</strong> {weather.weather[0].description}</p>
                <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
                <p><strong>Wind speed:</strong> {weather.wind.speed} m/s</p>
                {weather.weather[0].icon && (
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                  />
                )}
              </div>
            )}
            {!weather && !weatherLoading && WEATHER_API_KEY === 'API_KEY' && (
              <p style={{ color: 'orange' }}>Please add your OpenWeatherMap API key to see weather data</p>
            )}
          </div>
        )}
      </div>
    )
  }

  // 如果有2-10个国家，显示按钮列表
  return (
    <div>
      {filteredCountries.map(country => (
        <div key={country.name.common} style={{ margin: '5px' }}>
          <p>{country.name.common}<button onClick={() => handleCountrySelect(country)} style={{ margin: '5px' }}>
            Show
          </button></p>
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all?fields=name,capital,population,flags').then(response => {
      setCountries(response.data)
    })
  }, [])

  return (
    <div>
      <h1>Countries</h1>
      <Filter filter={filter} setFilter={setFilter} />
      <Display countries={countries} filter={filter} />
    </div>
  )
}

export default App