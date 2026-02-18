import { formatFullDate } from '../utils/weatherUtils';

export default function WeatherHero({ cityInfo, selectedDay, dailyData, weatherInfo }) {
	return (
		<div className="hero">
			<div className="city-name">{cityInfo.name}</div>
			<div className="city-date">
				{cityInfo.country} · {formatFullDate(dailyData.time[selectedDay])}
			</div>
			<div className="hero-main">
				<div className="hero-icon">{weatherInfo.icon}</div>
				<div>
					<div>
						<span className="hero-temp">{Math.round(dailyData.temperature_2m_max[selectedDay])}</span>
						<span className="hero-unit">°C</span>
					</div>
					<div className="hero-desc">{weatherInfo.label}</div>
				</div>
			</div>
		</div>
	);
}
