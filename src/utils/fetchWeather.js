import axios from 'axios';
import { key, url } from './Config.js';
import {
	thunderstormSvg,
	drizzleSvg,
	rainSvg,
	snowSvg,
	atmosphereSvg,
	clearSvg,
	cloudSvg,
} from '../images/index.js';

// Mapeo de códigos de condición a nombres de clima
const conditionCodes = {
	thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
	drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
	rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
	snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
	atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
	clear: [800],
	clouds: [801, 802, 803, 804],
};

// Mapeo de íconos según las condiciones
const icons = {
	thunderstorm: thunderstormSvg,
	drizzle: drizzleSvg,
	rain: rainSvg,
	snow: snowSvg,
	atmosphere: atmosphereSvg,
	clear: clearSvg,
	clouds: cloudSvg,
};

export const fetchWeatherByCity = async (city) => {
	try {
		const response = await axios.get(
			`${url}?q=${city}&appid=${key}&units=metric`,
		);
		const data = response.data;

		const keys = Object.keys(conditionCodes);
		const iconName = keys.find((key) =>
			conditionCodes[key].includes(data.weather[0]?.id),
		);

		return {
			city: data.name,
			country: data.sys.country,
			icon: icons[iconName],
			main: data.weather[0].main,
			wind: data.wind.speed,
			clouds: data.clouds.all,
			pressure: data.main.pressure,
			temperature: Math.floor(data.main.temp),
		};
	} catch (error) {
		console.error('Error fetching weather by city:', error);
		throw error;
	}
};

// Función para obtener el clima por coordenadas
export const fetchWeatherByCoords = async (latitude, longitude) => {
	try {
		const response = await axios.get(
			`${url}?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`,
		);
		return response.data; // Asegúrate de estructurarlo correctamente como en fetchWeatherByCity
	} catch (error) {
		console.error('Error fetching weather by coordinates:', error);
		throw error;
	}
};
