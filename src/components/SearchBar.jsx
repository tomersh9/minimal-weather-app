export default function SearchBar({ query, setQuery, onSubmit, loading, suggestions, showSuggestions, onSuggestionClick, searchWrapperRef }) {
	return (
		<div ref={searchWrapperRef} style={{ position: 'relative' }}>
			<form className="search-row" onSubmit={onSubmit}>
				<input className="search-input" type="text" placeholder="Search city..." value={query} onChange={e => setQuery(e.target.value)} />
				<button className="search-btn" type="submit" disabled={loading}>
					{loading ? '...' : 'Search'}
				</button>
			</form>

			{showSuggestions && suggestions.length > 0 && (
				<div className="suggestions-dropdown">
					{suggestions.map((suggestion, idx) => (
						<div key={idx} className="suggestion-item" onClick={() => onSuggestionClick(suggestion)}>
							<div className="suggestion-name">{suggestion.name}</div>
							<div className="suggestion-details">
								{suggestion.admin1 && `${suggestion.admin1}, `}
								{suggestion.country}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
