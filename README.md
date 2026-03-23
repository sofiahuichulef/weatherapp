# Weather App

Aplicación simple de clima en JavaScript. Recibe un nombre de ciudad, usa la API de geocodificación de Open-Meteo para obtener coordenadas, y con esas coordenadas obtiene el clima actual desde Open-Meteo.

## Estructura del proyecto

```
weather-app
├── src
│   ├── index.html      # HTML principal
│   ├── styles.css      # Estilos de la app
│   ├── app.js          # Lógica de geocodificación y clima + funciones exportadas para test
│   └── app.test.js     # Pruebas automáticas con Vitest
├── package.json        # Configuración npm y scripts
├── .gitignore
└── README.md           # Esta documentación
```

### Requisitos

- [Node.js](https://nodejs.org/) (para ejecutar tests con Vitest y servidor local)

### Instalación

1. Clona el repositorio:
```bash
    git clone <repository-url>
```
2. Ve a la carpeta del proyecto:
```bash
   cd weather-app
```
3. Instala dependencias:
 ```bash
 npm install
```

### Ejecutar la aplicación

1. Lanza un servidor local (por ejemplo `live-server`):
```bash
    npm start
```
2. Abre `http://127.0.0.1:8080` (o el puerto que use live-server).
3. Ingresa un nombre de ciudad, haz clic en "Buscar clima".
4. Verás la temperatura, viento y hora actual.

## API usada

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`.
- Clima actual: `https://api.open-meteo.com/v1/forecast?current_weather=true`.

## Pruebas (testing)

Se agregaron pruebas unitarias con `Vitest` en `src/app.test.js` para validar:

1. `getCoordinatesForCity(city)`:
   - Busca coordenadas y devuelve `name`, `country`, `latitude`, `longitude`.
   - Lanza error si no se encuentra la ciudad.
2. `getWeatherForCoordinates(latitude, longitude)`:
   - Devuelve `current_weather`.
   - Lanza error si la API responde `ok: false`.
3. `getWeatherByCity(city)`:
   - Integra geocoding + clima (flujo completo).
4. `formatWeatherHtml(result)`:
   - Devuelve HTML con ciudad, país, temperatura y viento.

### Ejecutar tests

```bash
npm test
```

Deberías ver todos los tests en verde.

## Contribuciones

Puedes contribuir con mejoras: manejo de errores, UI, cache local, soporte de más idiomas, etc. ¡Abre un PR!

## Licencia

MIT.
