export const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
export const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export const WMO_CODES = {
	0: { label: 'Clear Sky', icon: '☀️' },
	1: { label: 'Mainly Clear', icon: '🌤️' },
	2: { label: 'Partly Cloudy', icon: '⛅' },
	3: { label: 'Overcast', icon: '☁️' },
	45: { label: 'Foggy', icon: '🌫️' },
	48: { label: 'Icy Fog', icon: '🌫️' },
	51: { label: 'Light Drizzle', icon: '🌦️' },
	53: { label: 'Drizzle', icon: '🌦️' },
	55: { label: 'Heavy Drizzle', icon: '🌧️' },
	61: { label: 'Light Rain', icon: '🌧️' },
	63: { label: 'Rain', icon: '🌧️' },
	65: { label: 'Heavy Rain', icon: '🌧️' },
	71: { label: 'Light Snow', icon: '🌨️' },
	73: { label: 'Snow', icon: '❄️' },
	75: { label: 'Heavy Snow', icon: '❄️' },
	80: { label: 'Showers', icon: '🌦️' },
	81: { label: 'Rain Showers', icon: '🌧️' },
	82: { label: 'Heavy Showers', icon: '⛈️' },
	95: { label: 'Thunderstorm', icon: '⛈️' },
	99: { label: 'Heavy Thunderstorm', icon: '⛈️' },
};

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
