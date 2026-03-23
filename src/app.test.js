import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getCoordinatesForCity,
  getWeatherForCoordinates,
  getWeatherByCity,
  formatWeatherHtml,
} from './app.js';

describe('weather app logic', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getCoordinatesForCity - returns coordinates for successful geocoding', async () => {
    const city = 'Madrid';
    const geoData = { results: [{ name: 'Madrid', country: 'ES', latitude: 40.4168, longitude: -3.7038 }] };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => geoData });

    const result = await getCoordinatesForCity(city);

    expect(result.name).toBe('Madrid');
    expect(result.country).toBe('ES');
    expect(result.latitude).toBe(40.4168);
    expect(result.longitude).toBe(-3.7038);
    expect(fetch).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=Madrid&count=1'
    );
  });

  it('getCoordinatesForCity - throws when city not found', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) });
    await expect(getCoordinatesForCity('Nowhere')).rejects.toThrow('No city found for Nowhere');
  });

  it('getWeatherForCoordinates - returns current weather', async () => {
    const coordPayload = { current_weather: { temperature: 15.1, windspeed: 5.2, time: '2026-03-19T10:00' } };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => coordPayload });

    const w = await getWeatherForCoordinates(40.4168, -3.7038);
    expect(w.temperature).toBe(15.1);
    expect(w.windspeed).toBe(5.2);
    expect(w.time).toBe('2026-03-19T10:00');
  });

  it('getWeatherForCoordinates - throws when API fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(getWeatherForCoordinates(0, 0)).rejects.toThrow('Weather API error');
  });

  it('getWeatherByCity - integrates geocoding and weather', async () => {
    const geoData = { results: [{ name: 'Madrid', country: 'ES', latitude: 40.4168, longitude: -3.7038 }] };
    const weatherData = { current_weather: { temperature: 18.2, windspeed: 3.6, time: '2026-03-19T12:00' } };

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => geoData })
      .mockResolvedValueOnce({ ok: true, json: async () => weatherData });

    const result = await getWeatherByCity('Madrid');
    expect(result.city).toBe('Madrid');
    expect(result.country).toBe('ES');
    expect(result.weather.temperature).toBe(18.2);
    expect(result.weather.windspeed).toBe(3.6);
    expect(result.weather.time).toBe('2026-03-19T12:00');
  });

  it('formatWeatherHtml - formats information as HTML string', () => {
    const result = {
      city: 'Madrid',
      country: 'ES',
      weather: { temperature: 10.42, windspeed: 7.1, time: '2026-03-19T12:00' },
    };

    const html = formatWeatherHtml(result);
    expect(html).toContain('Madrid, ES');
    expect(html).toContain('10.4°C');
    expect(html).toContain('7.1 km/h');
    expect(html).toContain('🌧️'); // Ícono de lluvia para temp ~10°C
  });
});