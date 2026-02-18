export default function StateDisplay({ loading, error }) {
	if (loading) {
		return (
			<div className="state-box">
				<span className="state-icon">🌍</span>
				<p className="state-text">Fetching weather data...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="state-box">
				<span className="state-icon">🌩️</span>
				<p className="state-text error-text">{error}</p>
			</div>
		);
	}

	return null;
}
