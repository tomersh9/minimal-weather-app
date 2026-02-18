import { useState, useEffect } from 'react';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

const WMO_CODES = {
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

function getWeatherInfo(code) {
	return WMO_CODES[code] || { label: 'Unknown', icon: '🌡️' };
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatDayShort(dateStr, index) {
	const date = new Date(dateStr);
	if (index === 0) return 'Today';
	if (index === 1) return 'Tomorrow';
	return DAYS[date.getDay()];
}

function formatDayFull(dateStr, index) {
	const date = new Date(dateStr);
	if (index === 0) return 'Today';
	if (index === 1) return 'Tomorrow';
	return FULL_DAYS[date.getDay()];
}

function formatFullDate(dateStr) {
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatHour(isoStr) {
	const d = new Date(isoStr);
	const h = d.getHours();
	const ampm = h >= 12 ? 'PM' : 'AM';
	const h12 = h % 12 === 0 ? 12 : h % 12;
	return `${h12}${ampm}`;
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #e8edf2;
    min-height: 100vh;
    width: 100%;          /* add this */
    display: flex;        /* add this */
    justify-content: center; /* add this */
  }

  .app-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 0;
    width: 100%;
  }

  /* ── MOBILE: single column card ── */
  .app {
    width: 100%;
    max-width:100%;
    min-height: 100vh;
    background: white;
    display: flex;
    flex-direction: column;
    padding: 40px 28px 48px;
    position: relative;
    overflow: hidden;
  }

  /* ── PC: two-column layout ── */
  @media (min-width: 900px) {
    .app-wrapper {
      padding: 40px;
      align-items: center;
      min-height: 100vh;
    }
    .app {
      max-width: 1060px;
      min-height: unset;
      height: calc(100vh - 80px);
      max-height: 860px;
      border-radius: 28px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.10);
      display: grid;
      grid-template-columns: 360px 1fr;
      padding: 0;
      overflow: hidden;
      flex-direction: unset;
    }
  }

  @media (min-width: 1200px) {
    .app { max-width: 1160px; grid-template-columns: 400px 1fr; }
  }

  /* ── PANELS ── */
  .app-left {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .app-right {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 900px) {
    .app-left {
      border-right: 1.5px solid #f1f5f9;
      padding: 40px 36px 40px 40px;
      overflow-y: auto;
    }
    .app-right {
      padding: 40px 40px 40px 36px;
      overflow-y: auto;
      background: #fafbfc;
    }
  }

  @media (max-width: 899px) {
    .app-left { padding: 0; flex: none; }
    .app-right { margin-top: 40px; flex: none; }
  }

  /* ── BLOBS ── */
  .blob {
    position: absolute;
    top: -80px; right: -80px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, #dbeafe 0%, #eff6ff 60%, transparent 100%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .blob2 {
    position: absolute;
    bottom: 80px; left: -60px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, #e0f2fe 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .rel { position: relative; z-index: 1; }

  /* ── SEARCH ── */
  .search-row { display: flex; gap: 10px; margin-bottom: 36px; }

  .search-input {
    flex: 1;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 12px 18px;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    color: #1e293b;
    background: #f8fafc;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .search-input:focus { border-color: #3b82f6; background: white; }
  .search-input::placeholder { color: #94a3b8; }

  .search-btn {
    background: #3b82f6; color: white; border: none;
    border-radius: 14px; padding: 12px 22px;
    font-size: 15px; font-family: 'DM Sans', sans-serif;
    font-weight: 500; cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
  }
  .search-btn:hover { background: #2563eb; }
  .search-btn:active { transform: scale(0.97); }

  /* ── HERO ── */
  .hero { margin-bottom: 28px; animation: fadeUp 0.45s ease both; }

  .city-name {
    font-family: 'DM Serif Display', serif;
    font-size: 36px; color: #0f172a; line-height: 1.1; margin-bottom: 4px;
  }
  .city-date {
    font-size: 13px; color: #94a3b8;
    font-weight: 400; letter-spacing: 0.02em; margin-bottom: 24px;
  }
  .hero-main { display: flex; align-items: flex-end; gap: 18px; }
  .hero-icon { font-size: 72px; line-height: 1; filter: drop-shadow(0 6px 16px rgba(0,0,0,0.08)); }
  .hero-temp {
    font-family: 'DM Serif Display', serif;
    font-size: 80px; color: #0f172a; line-height: 1; letter-spacing: -3px;
  }
  .hero-unit { font-size: 32px; color: #94a3b8; font-weight: 300; margin-left: 2px; }
  .hero-desc { font-size: 15px; color: #64748b; margin-top: 6px; }

  /* ── STATS ── */
  .stats {
    display: flex; gap: 10px; margin-bottom: 28px;
    animation: fadeUp 0.45s 0.08s ease both;
  }
  .stat-pill {
    flex: 1; background: #f1f5f9;
    border-radius: 14px; padding: 13px 10px; text-align: center;
  }
  .stat-label {
    font-size: 10px; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 4px; font-weight: 600;
  }
  .stat-value { font-size: 17px; color: #1e293b; font-weight: 600; }
  .stat-unit { font-size: 11px; color: #94a3b8; font-weight: 400; }

  /* ── SECTION TITLE ── */
  .section-title {
    font-size: 11px; text-transform: uppercase;
    letter-spacing: 0.1em; color: #94a3b8; font-weight: 600; margin-bottom: 12px;
  }

  /* ── WEEK LIST ── */
  .week-list { display: flex; flex-direction: column; gap: 7px; }

  .day-card {
    display: flex; align-items: center;
    padding: 13px 16px; border-radius: 14px;
    background: #f8fafc; border: 1.5px solid transparent;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s, transform 0.14s, box-shadow 0.18s;
    animation: fadeUp 0.5s ease both;
    user-select: none;
  }
  .day-card:hover { background: #eff6ff; border-color: #bfdbfe; transform: translateX(3px); }
  .day-card.active {
    background: #eff6ff; border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
  }

  .day-name { font-size: 14px; font-weight: 600; color: #334155; width: 80px; flex-shrink: 0; }
  .day-card.active .day-name { color: #2563eb; }
  .day-icon { font-size: 21px; margin-right: 12px; flex-shrink: 0; }
  .day-desc { font-size: 13px; color: #64748b; flex: 1; }
  .day-temps { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
  .day-high { font-size: 15px; font-weight: 600; color: #0f172a; }
  .day-low { font-size: 13px; color: #94a3b8; }

  /* ── RIGHT PANEL ── */
  .selected-header { margin-bottom: 24px; animation: fadeUp 0.3s ease both; }
  .sel-day-label { font-family: 'DM Serif Display', serif; font-size: 30px; color: #0f172a; margin-bottom: 3px; }
  .sel-day-date { font-size: 13px; color: #94a3b8; }

  /* ── HOURLY ── */
  .hourly-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    animation: fadeUp 0.3s ease both;
  }

  @media (min-width: 900px) and (max-width: 1099px) {
    .hourly-grid { grid-template-columns: repeat(4, 1fr); }
  }

  .hour-card {
    background: white; border-radius: 16px;
    padding: 16px 10px; text-align: center;
    border: 1.5px solid #f1f5f9;
    transition: border-color 0.18s, background 0.18s, transform 0.14s;
  }
  .hour-card:hover { background: #eff6ff; border-color: #bfdbfe; transform: translateY(-2px); }

  .hour-time {
    font-size: 11px; color: #94a3b8; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;
  }
  .hour-icon { font-size: 24px; margin-bottom: 8px; display: block; }
  .hour-temp { font-size: 20px; font-weight: 600; color: #1e293b; margin-bottom: 6px; }
  .hour-extra { font-size: 11px; color: #94a3b8; line-height: 1.6; }

  /* ── STATES ── */
  .state-box {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 14px; padding: 60px 0;
    animation: fadeUp 0.4s ease both;
  }
  .state-icon { font-size: 48px; }
  .state-text { font-size: 15px; color: #94a3b8; text-align: center; max-width: 240px; line-height: 1.6; }
  .error-text { color: #ef4444; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .app-left::-webkit-scrollbar, .app-right::-webkit-scrollbar { width: 4px; }
  .app-left::-webkit-scrollbar-thumb, .app-right::-webkit-scrollbar-thumb {
    background: #e2e8f0; border-radius: 4px;
  }
`;

export default function WeatherApp() {
	const [query, setQuery] = useState('');
	const [weather, setWeather] = useState(null);
	const [cityInfo, setCityInfo] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [selectedDay, setSelectedDay] = useState(0);

	async function fetchWeather(cityName) {
		if (!cityName.trim()) return;
		setLoading(true);
		setError('');
		setWeather(null);
		setSelectedDay(0);

		try {
			const geoRes = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
			const geoData = await geoRes.json();
			if (!geoData.results?.length) throw new Error('City not found');

			const { latitude, longitude, name, country } = geoData.results[0];
			setCityInfo({ name, country });

			const wRes = await fetch(
				`${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}` +
					`&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,precipitation_sum` +
					`&hourly=temperature_2m,weathercode,windspeed_10m,precipitation_probability` +
					`&current_weather=true&timezone=auto&forecast_days=7`,
			);
			const wData = await wRes.json();
			setWeather(wData);
		} catch (e) {
			setError(e.message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		fetchWeather(query);
	}

	useEffect(() => {
		fetchWeather('Tel Aviv');
		setQuery('Tel Aviv');
	}, []);

	const daily = weather?.daily;
	const hourly = weather?.hourly;

	function getHoursForDay(dayIndex) {
		if (!hourly) return [];
		const dateStr = daily.time[dayIndex];
		const slots = hourly.time.map((t, i) => ({ t, i })).filter(({ t }) => t.startsWith(dateStr));
		// every 3 hours → 8 slots per day
		return slots.filter((_, idx) => idx % 3 === 0);
	}

	const selInfo = daily ? getWeatherInfo(daily.weathercode[selectedDay]) : null;
	const selHours = daily ? getHoursForDay(selectedDay) : [];

	const hasData = !loading && !error && weather && cityInfo;

	return (
		<>
			<style>{styles}</style>
			<div className="app-wrapper">
				<div className="app">
					{/* ── LEFT ── */}
					<div className="app-left">
						<div className="blob" />
						<div className="blob2" />
						<div className="rel">
							<form className="search-row" onSubmit={handleSubmit}>
								<input
									className="search-input"
									type="text"
									placeholder="Search city..."
									value={query}
									onChange={e => setQuery(e.target.value)}
								/>
								<button className="search-btn" type="submit" disabled={loading}>
									{loading ? '...' : 'Search'}
								</button>
							</form>

							{loading && (
								<div className="state-box">
									<span className="state-icon">🌍</span>
									<p className="state-text">Fetching weather data...</p>
								</div>
							)}

							{error && (
								<div className="state-box">
									<span className="state-icon">🌩️</span>
									<p className="state-text error-text">{error}</p>
								</div>
							)}

							{hasData && (
								<>
									<div className="hero">
										<div className="city-name">{cityInfo.name}</div>
										<div className="city-date">
											{cityInfo.country} · {formatFullDate(daily.time[selectedDay])}
										</div>
										<div className="hero-main">
											<div className="hero-icon">{selInfo.icon}</div>
											<div>
												<div>
													<span className="hero-temp">{Math.round(daily.temperature_2m_max[selectedDay])}</span>
													<span className="hero-unit">°C</span>
												</div>
												<div className="hero-desc">{selInfo.label}</div>
											</div>
										</div>
									</div>

									<div className="stats">
										<div className="stat-pill">
											<div className="stat-label">Low</div>
											<div className="stat-value">
												{Math.round(daily.temperature_2m_min[selectedDay])}
												<span className="stat-unit">°C</span>
											</div>
										</div>
										<div className="stat-pill">
											<div className="stat-label">Wind</div>
											<div className="stat-value">
												{Math.round(daily.windspeed_10m_max[selectedDay])}
												<span className="stat-unit"> km/h</span>
											</div>
										</div>
										<div className="stat-pill">
											<div className="stat-label">Rain</div>
											<div className="stat-value">
												{daily.precipitation_sum[selectedDay].toFixed(1)}
												<span className="stat-unit"> mm</span>
											</div>
										</div>
									</div>

									<div className="section-title">7-Day Forecast</div>
									<div className="week-list">
										{daily.time.map((date, i) => {
											const info = getWeatherInfo(daily.weathercode[i]);
											return (
												<div
													key={date}
													className={`day-card ${i === selectedDay ? 'active' : ''}`}
													style={{ animationDelay: `${0.18 + i * 0.04}s` }}
													onClick={() => setSelectedDay(i)}
												>
													<span className="day-name">{formatDayShort(date, i)}</span>
													<span className="day-icon">{info.icon}</span>
													<span className="day-desc">{info.label}</span>
													<div className="day-temps">
														<span className="day-high">{Math.round(daily.temperature_2m_max[i])}°</span>
														<span className="day-low">{Math.round(daily.temperature_2m_min[i])}°</span>
													</div>
												</div>
											);
										})}
									</div>
								</>
							)}
						</div>
					</div>

					{/* ── RIGHT ── */}
					{hasData && (
						<div className="app-right">
							<div className="selected-header">
								<div className="sel-day-label">{formatDayFull(daily.time[selectedDay], selectedDay)}</div>
								<div className="sel-day-date">
									{formatFullDate(daily.time[selectedDay])} · {selInfo.label}
								</div>
							</div>

							<div className="section-title" style={{ marginBottom: '16px' }}>
								Hourly Breakdown
							</div>
							<div className="hourly-grid">
								{selHours.map(({ t, i }) => {
									const hInfo = getWeatherInfo(hourly.weathercode[i]);
									return (
										<div className="hour-card" key={t}>
											<div className="hour-time">{formatHour(t)}</div>
											<span className="hour-icon">{hInfo.icon}</span>
											<div className="hour-temp">{Math.round(hourly.temperature_2m[i])}°</div>
											<div className="hour-extra">
												💨 {Math.round(hourly.windspeed_10m[i])} km/h
												<br />
												🌂 {hourly.precipitation_probability[i]}%
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
