const CACHE_PREFIX = 'weatherapp:cache:';

function setCacheWithExpiry(key, data, ttlMs) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const value = {
    data,
    expiresAt: Date.now() + ttlMs,
  };
  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
}

function getCacheWithExpiry(key) {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const raw = localStorage.getItem(CACHE_PREFIX + key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch {
    localStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }
}

function getCacheKeyForCity(city) {
  return `weather-${city.trim().toLowerCase()}`;
}

function hasNetworkConnection() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export async function getCoordinatesForCity(city) {
  if (!city || !city.trim()) {
    throw new Error('City name is required');
  }

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1`
  );

  if (!response.ok) {
    throw new Error('Geocoding API error');
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`No city found for ${city}`);
  }

  return data.results[0];
}

export async function getWeatherForCoordinates(latitude, longitude) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`
  );

  if (!response.ok) {
    throw new Error('Weather API error');
  }

  const data = await response.json();
  if (!data.current_weather) {
    throw new Error('No current weather found');
  }

  return data.current_weather;
}

/**
 * Obtiene el clima actual para una ciudad usando los servicios de Open-Meteo.
 *
 * 1) Busca coordenadas de la ciudad con la API de geocodificación.
 * 2) Consulta el clima actual de esas coordenadas con la API de pronóstico.
 *
 * @param {string} city - Nombre de la ciudad a buscar (por ejemplo, "Santiago").
 * @returns {Promise<{city: string, country: string, latitude: number, longitude: number, weather: object}>} Un objeto con la ciudad, el país, latitud, longitud y datos de clima.
 * @throws {Error} Si falta el nombre de ciudad, la API de geocodificación falla, no se encuentra la ciudad o la API de clima falla.
 *
 * @example
 * const resultado = await getWeatherByCity('Santiago');
 * console.log(resultado.city);
 * console.log(resultado.weather.temperature);
 */
export async function getWeatherByCity(city) {
  if (!city || !city.trim()) {
    throw new Error('City name is required');
  }

  const cacheKey = getCacheKeyForCity(city);
  const cached = getCacheWithExpiry(cacheKey);
  if (cached) {
    return {
      ...cached,
      fromCache: true,
    };
  }

  if (!hasNetworkConnection()) {
    if (cached) {
      return {
        ...cached,
        fromCache: true,
      };
    }
    throw new Error('No internet connection and no cached data available.');
  }

  const place = await getCoordinatesForCity(city);
  const weather = await getWeatherForCoordinates(place.latitude, place.longitude);
  const result = {
    city: place.name,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    weather,
  };

  // Cache 10 minutos (600000 ms)
  setCacheWithExpiry(cacheKey, result, 10 * 60 * 1000);
  return result;
}

export function formatWeatherHtml(result) {
  if (!result || !result.weather) {
    return 'No weather data';
  }

  const temp = result.weather.temperature;
  let icon = '🌤️'; // Default

  if (temp >= 25) {
    icon = '☀️'; // Sol
  } else if (temp >= 15) {
    icon = '⛅'; // Nublado
  } else if (temp >= 5) {
    icon = '🌧️'; // Lluvia
  } else {
    icon = '❄️'; // Nieve
  }

  return `
    <div style="text-align: center; font-size: 3em; margin-bottom: 10px;">${icon}</div>
    <strong>${result.city}, ${result.country}</strong><br>
    Temperatura actual: <strong>${result.weather.temperature.toFixed(1)}°C</strong><br>
    Viento: ${result.weather.windspeed} km/h<br>
    Hora: ${result.weather.time}
  `;
}

if (typeof window !== 'undefined') {
  const inputCiudad = document.getElementById('ciudad');
  const btnBuscar = document.getElementById('btnBuscar');
  const resultado = document.getElementById('resultado');

  if (btnBuscar) {
    btnBuscar.addEventListener('click', async () => {
      const ciudad = inputCiudad.value.trim();
      if (!ciudad) {
        resultado.textContent = 'Escribe el nombre de una ciudad.';
        return;
      }

      resultado.textContent = 'Buscando...';

      try {
        const resultadoClima = await getWeatherByCity(ciudad);
        resultado.innerHTML = formatWeatherHtml(resultadoClima);
        if (resultadoClima.fromCache) {
          resultado.innerHTML += '<div style="font-size:0.85rem; color:#555; margin-top:0.35rem;">Mostrado desde cache (datos recientes). Si estás sin internet, este resultado se seguirá mostrando hasta que caduque.</div>';
        }
      } catch (error) {
        console.error(error);
        if (error.message.includes('No internet connection')) {
          resultado.textContent = 'Sin conexión y no hay datos guardados en cache.';
        } else {
          resultado.textContent = 'Hubo un error. Intenta de nuevo.';
        }
      }
    });
  }
}
