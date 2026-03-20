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
  const place = await getCoordinatesForCity(city);
  const weather = await getWeatherForCoordinates(place.latitude, place.longitude);
  return {
    city: place.name,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    weather,
  };
}

export function formatWeatherHtml(result) {
  if (!result || !result.weather) {
    return 'No weather data';
  }

  return `
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
      } catch (error) {
        console.error(error);
        resultado.textContent = 'Hubo un error. Intenta de nuevo.';
      }
    });
  }
}
