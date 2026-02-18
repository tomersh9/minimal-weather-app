import { useState, useEffect, useRef } from 'react';
import SearchBar from './components/SearchBar';
import StateDisplay from './components/StateDisplay';
import WeatherHero from './components/WeatherHero';
import WeatherStats from './components/WeatherStats';
import DayCard from './components/DayCard';
import HourCard from './components/HourCard';
import { GEOCODING_URL, WEATHER_URL } from './utils/constants';
import { getWeatherInfo, formatDayFull, formatFullDate } from './utils/weatherUtils';
import './App.css';

export default function WeatherApp() {
	const [query, setQuery] = useState('');
	const [weather, setWeather] = useState(null);
	const [cityInfo, setCityInfo] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [selectedDay, setSelectedDay] = useState(0);
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const searchWrapperRef = useRef(null);

	// Debounced suggestion fetch
	useEffect(() => {
		if (query.trim().length < 2) {
			setSuggestions([]);
			setShowSuggestions(false);
			return;
		}
		const timer = setTimeout(async () => {
			try {
				const res = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`);
				const data = await res.json();
				setSuggestions(data.results || []);
				setShowSuggestions(true);
			} catch {
				setSuggestions([]);
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [query]);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(e) {
			if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
				setShowSuggestions(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

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
		setShowSuggestions(false);
		fetchWeather(query);
	}

	function handleSuggestionClick(s) {
		const label = s.admin1 ? `${s.name}, ${s.admin1}, ${s.country}` : `${s.name}, ${s.country}`;
		setQuery(label);
		setShowSuggestions(false);
		setSuggestions([]);
		fetchWeather(s.name);
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
		<div className="app-wrapper">
			<div className="app">
				{/* ── LEFT ── */}
				<div className="app-left">
					<div className="blob" />
					<div className="blob2" />
					<div className="rel">
						<SearchBar
							query={query}
							setQuery={setQuery}
							onSubmit={handleSubmit}
							loading={loading}
							suggestions={suggestions}
							showSuggestions={showSuggestions}
							onSuggestionClick={handleSuggestionClick}
							searchWrapperRef={searchWrapperRef}
						/>

						<StateDisplay loading={loading} error={error} />

						{hasData && (
							<>
								<WeatherHero cityInfo={cityInfo} selectedDay={selectedDay} dailyData={daily} weatherInfo={selInfo} />

								<WeatherStats selectedDay={selectedDay} dailyData={daily} />

								<div className="section-title">7-Day Forecast</div>
								<div className="week-list">
									{daily.time.map((date, i) => (
										<DayCard
											key={date}
											date={date}
											index={i}
											weatherCode={daily.weathercode[i]}
											maxTemp={daily.temperature_2m_max[i]}
											minTemp={daily.temperature_2m_min[i]}
											isSelected={i === selectedDay}
											onClick={() => setSelectedDay(i)}
											animationDelay={0.18 + i * 0.04}
										/>
									))}
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
							{selHours.map(({ t, i }) => (
								<HourCard
									key={t}
									time={t}
									weatherCode={hourly.weathercode[i]}
									temperature={hourly.temperature_2m[i]}
									windSpeed={hourly.windspeed_10m[i]}
									precipitationProbability={hourly.precipitation_probability[i]}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
