import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './components/Card.jsx';
import { key, url, initialState } from './utils/Config.js';
import {
	fetchWeatherByCoords,
	fetchWeatherByCity,
} from './utils/fetchWeather.js';
import {
	thunderstormSvg,
	drizzleSvg,
	rainSvg,
	snowSvg,
	atmosphereSvg,
	clearSvg,
	cloudSvg,
} from './images/index.js';
import './App.css';

const conditionCodes = {
	thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],

	drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],

	rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],

	snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],

	atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],

	clear: [800],

	clouds: [801, 802, 803, 804],
};

const icons = {
	thunderstorm: thunderstormSvg,

	drizzle: drizzleSvg,

	rain: rainSvg,

	snow: snowSvg,

	atmosphere: atmosphereSvg,

	clear: clearSvg,

	clouds: cloudSvg,
};

function App() {
	const [coords, setCoords] = useState(initialState);
	const [weather, setWeather] = useState({});
	const [toggle, setToggle] = useState(false);
	const [city, setCity] = useState('');
	const [loading, setLoading] = useState(true);
	const [bgClass, setBgClass] = useState('default-bg');

	useEffect(() => {
		console.log(
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setCoords({ latitude, longitude });
				},
				(error) => {
					console.log('No aceptaste la ubicación');
				},
			),
		);
	}, []);

	useEffect(() => {
		if (coords.latitude && coords.longitude) {
			setLoading(true);
			axios
				.get(
					`${url}?lat=${coords.latitude}&lon=${coords.longitude}&appid=${key}&units=metric`,
				)
				.then((res) => {
					const keys = Object.keys(conditionCodes);
					const iconName = keys.find((key) =>
						conditionCodes[key].includes(res.data?.weather[0]?.id),
					);

					setWeather({
						city: res.data?.name,
						country: res.data?.sys?.country,
						icon: icons[iconName],
						main: res.data?.weather[0]?.main,
						wind: res.data?.wind?.speed,
						clouds: res.data?.clouds?.all,
						pressure: res.data?.main?.pressure,
						temperature: Math.floor(res.data?.main?.temp),
					});
					updateBackground(iconName);
					setLoading(false);
				})
				.catch((error) => {
					console.log('Error fetching weather:', error);
					setLoading(false);
				});
		}
	}, [coords]);

	const handleCityChange = (e) => {
		setCity(e.target.value);
	};

	const handleSearch = () => {
		if (city) {
			setLoading(true);
			fetchWeatherByCity(city)
				.then((weatherData) => {
					setWeather(weatherData);
					updateBackground(weatherData.main);
					setLoading(false);
				})
				.catch((error) => {
					console.log('Error fetching weather:', error);
					setLoading(false);
				});
		}
	};

	return (
		<div className={`app ${bgClass}`}>
			<div className="search__container">
				<input
					type="text"
					value={city}
					onChange={handleCityChange}
					placeholder="Search for a city "
				/>
				<button onClick={handleSearch}>Search</button>
			</div>
			{loading ? (
				<p className="loading">Loading...</p>
			) : (
				<Card weather={weather} toggle={toggle} setToggle={setToggle} />
			)}
		</div>
	);
}

export default App;
