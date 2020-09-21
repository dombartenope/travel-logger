const API_URL = `https://travel-log-two.vercel.app`;

export async function listLogEntries() {
	const res = await fetch(`${API_URL}/api/logs`)
	return res.json();
}

export async function createLogEntry(entry) {
	const res = await fetch(`${API_URL}/api/logs`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(entry),
	});
	return res.json();
}