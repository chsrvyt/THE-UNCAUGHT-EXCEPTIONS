import weatherService from '../services/weatherService.js';

/**
 * Controller to handle weather-related HTTP requests.
 */
class WeatherController {
    async getWeather(req, res, next) {
        try {
            const { lat, lon } = req.query;

            // Validation
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lon);

            if (isNaN(latitude) || latitude < -90 || latitude > 90) {
                return res.status(400).json({ error: 'Invalid latitude. Must be between -90 and 90.' });
            }
            if (isNaN(longitude) || longitude < -180 || longitude > 180) {
                return res.status(400).json({ error: 'Invalid longitude. Must be between -180 and 180.' });
            }

            const data = await weatherService.getWeatherData(lat, lon);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async getHistory(req, res, next) {
        try {
            const { lat, lon } = req.query;
            if (!lat || !lon) {
                return res.status(400).json({ error: 'lat and lon are required' });
            }
            const history = await weatherService.getHistory(lat, lon);
            res.json(history);
        } catch (error) {
            next(error);
        }
    }

    async getLatest(req, res, next) {
        try {
            const { lat, lon } = req.query;
            if (!lat || !lon) {
                return res.status(400).json({ error: 'lat and lon are required' });
            }
            const latest = await weatherService.getLatest(lat, lon);
            if (!latest) {
                return res.status(404).json({ message: 'No records found for this location' });
            }
            res.json(latest);
        } catch (error) {
            next(error);
        }
    }
}

export default new WeatherController();
