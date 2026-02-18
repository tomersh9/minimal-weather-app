import { WMO_CODES, DAYS, FULL_DAYS } from './constants';

export function getWeatherInfo(code) {
	return WMO_CODES[code] || { label: 'Unknown', icon: '🌡️' };
}

export function formatDayShort(dateStr, index) {
	const date = new Date(dateStr);
	if (index === 0) return 'Today';
	if (index === 1) return 'Tomorrow';
	return DAYS[date.getDay()];
}

export function formatDayFull(dateStr, index) {
	const date = new Date(dateStr);
	if (index === 0) return 'Today';
	if (index === 1) return 'Tomorrow';
	return FULL_DAYS[date.getDay()];
}

export function formatFullDate(dateStr) {
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatHour(isoStr) {
	const d = new Date(isoStr);
	const h = d.getHours();
	const ampm = h >= 12 ? 'PM' : 'AM';
	const h12 = h % 12 === 0 ? 12 : h % 12;
	return `${h12}${ampm}`;
}
