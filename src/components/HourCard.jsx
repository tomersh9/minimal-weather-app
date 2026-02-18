import { formatHour, getWeatherInfo } from '../utils/weatherUtils';

export default function HourCard({ time, weatherCode, temperature, windSpeed, precipitationProbability }) {
	const hInfo = getWeatherInfo(weatherCode);

	return (
		<div className="hour-card">
			<div className="hour-time">{formatHour(time)}</div>
			<span className="hour-icon">{hInfo.icon}</span>
			<div className="hour-temp">{Math.round(temperature)}°</div>
			<div className="hour-extra">
				💨 {Math.round(windSpeed)} km/h
				<br />
				🌂 {precipitationProbability}%
			</div>
		</div>
	);
}
