import { formatDayShort, getWeatherInfo } from '../utils/weatherUtils';

export default function DayCard({ date, index, weatherCode, maxTemp, minTemp, isSelected, onClick, animationDelay }) {
	const info = getWeatherInfo(weatherCode);

	return (
		<div className={`day-card ${isSelected ? 'active' : ''}`} style={{ animationDelay: `${animationDelay}s` }} onClick={onClick}>
			<span className="day-name">{formatDayShort(date, index)}</span>
			<span className="day-icon">{info.icon}</span>
			<span className="day-desc">{info.label}</span>
			<div className="day-temps">
				<span className="day-high">{Math.round(maxTemp)}°</span>
				<span className="day-low">{Math.round(minTemp)}°</span>
			</div>
		</div>
	);
}
