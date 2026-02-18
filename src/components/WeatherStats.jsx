export default function WeatherStats({ selectedDay, dailyData }) {
	return (
		<div className="stats">
			<div className="stat-pill">
				<div className="stat-label">Low</div>
				<div className="stat-value">
					{Math.round(dailyData.temperature_2m_min[selectedDay])}
					<span className="stat-unit">°C</span>
				</div>
			</div>
			<div className="stat-pill">
				<div className="stat-label">Wind</div>
				<div className="stat-value">
					{Math.round(dailyData.windspeed_10m_max[selectedDay])}
					<span className="stat-unit"> km/h</span>
				</div>
			</div>
			<div className="stat-pill">
				<div className="stat-label">Rain</div>
				<div className="stat-value">
					{dailyData.precipitation_sum[selectedDay].toFixed(1)}
					<span className="stat-unit"> mm</span>
				</div>
			</div>
		</div>
	);
}
