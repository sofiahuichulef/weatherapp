# Weather App

Aplicación simple de clima en **JavaScript**.  
Recibe el nombre de una ciudad, utiliza la **API de geocodificación de Open-Meteo** para obtener sus coordenadas y, con ellas, consulta el **clima actual**.

## Estructura del proyecto

```
weather-app
├── src
│   ├── index.html      # Main HTML document
│   ├── styles.css      # Styles for the application
│   └── app.js          # JavaScript code for fetching and displaying weather data
├── package.json        # npm configuration file
├── .gitignore          # Files and directories to be ignored by Git
└── README.md           # Project documentation
```

## Antes de comenzar

To get a local copy up and running follow these simple steps.

### Prerequisitos

- Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Instalacion

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd weather-app
   ```
3. Install dependencies (if any):
   ```
   npm install
   ```

### Usabilidad

1. Open `src/index.html` in your web browser.
2. Enter the name of a city in the input field.
3. Click the button to fetch the weather data.
4. The current weather information will be displayed below the input field.

### API

This application uses the Open-Meteo API to fetch weather data. You can find more information about the API [here](https://open-meteo.com/).

### Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.


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


## Licencia

MIT.
