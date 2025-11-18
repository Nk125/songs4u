const BASE_SPOTIFY_URL = "https://api.spotify.com/v1";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

export interface SpotifyTrack {
	id: string;
	name: string;
	artist: string;
	cover: string;
	album: string;
}

class TrackCache {
	private cache = new Map<string, SpotifyTrack>();
	private maxSize: number;

	constructor(maxSize = 200) {
		this.maxSize = maxSize;
	}

	get(id: string): SpotifyTrack | undefined {
		const track = this.cache.get(id);
		if (track) {
			this.cache.delete(id);
			this.cache.set(id, track);
		}
		return track;
	}

	set(id: string, track: SpotifyTrack) {
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			this.cache.delete(firstKey as string);
		}
		this.cache.set(id, track);
	}
}

const trackCache = new TrackCache();

async function getSpotifyToken(): Promise<string> {
	const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

	const res = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			Authorization: `Basic ${creds}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "grant_type=client_credentials",
	});

	if (!res.ok) {
		const errData = await res.text();
		console.error("Spotify token error body:", errData);
		throw new Error(`Spotify token error: ${res.status} :: ${res.statusText}`);
	}

	const data = await res.json();
	return data.access_token;
}

async function safeFetch<T>(
	url: string,
	options: RequestInit,
): Promise<T | null> {
	try {
		const res = await fetch(url, options);

		if (!res.ok) {
			let errMsg = `[Spotify | HTTP] ${res.status} :: ${res.statusText}`;

			try {
				const errData = await res.json();

				if (
					errData &&
					typeof errData === "object" &&
					"error" in errData &&
					typeof errData.error.status === "number" &&
					typeof errData.error.message === "string"
				) {
					errMsg = `[Spotify] err: ${errData.error.status} :: ${errData.error.message}`;
				}
			} catch {}

			throw new Error(errMsg);
		}

		const data: T | null = await res.json().catch(() => null);
		return data;
	} catch (err) {
		console.error(`Spotify | fetch err: ${err}`);
		return null;
	}
}

async function parseTrack(
	data: any,
	token: string,
): Promise<SpotifyTrack | null> {
	if (!data || typeof data !== "object") return null;

	const id = typeof data.id === "string" ? data.id : null;
	const name = typeof data.name === "string" ? data.name : null;
	const artistName =
		Array.isArray(data.artists) && data.artists[0]?.name
			? data.artists[0].name
			: "Desconocido";

	const cover =
		Array.isArray(data.album?.images) && data.album.images[0]?.url
			? data.album.images[0].url
			: "";

	const album =
		typeof data.album?.name === "string" ? data.album.name : "Desconocido";

	if (!id || !name) return null;

	return { id, name, artist: artistName, cover, album };
}

export async function getTrack(id: string): Promise<SpotifyTrack | null> {
	if (!id) return null;

	const cached = trackCache.get(id);
	if (cached) return cached;

	const token = await getSpotifyToken();

	const data = await safeFetch(`${BASE_SPOTIFY_URL}/tracks/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!data) return null;

	const track = await parseTrack(data, token);
	if (track) trackCache.set(id, track);

	return track;
}

export async function getTracks(
	ids: string[],
	limit: number = 50,
): Promise<SpotifyTrack[]> {
	const validIds = ids.filter(Boolean).slice(0, limit);
	if (validIds.length === 0) return [];

	const tracks: SpotifyTrack[] = [];
	const idsToFetch = validIds.filter((id) => {
		const cached = trackCache.get(id);
		if (cached) tracks.push(cached);
		return !cached;
	});

	if (idsToFetch.length === 0) return tracks;

	const joined = idsToFetch.join(",");
	const token = await getSpotifyToken();

	const data = await safeFetch<{ tracks: any[] }>(
		`${BASE_SPOTIFY_URL}/tracks?ids=${joined}`,
		{ headers: { Authorization: `Bearer ${token}` } },
	);

	if (!data || !Array.isArray(data.tracks)) return tracks;

	for (const t of data.tracks) {
		const track = await parseTrack(t, token);
		if (track) {
			tracks.push(track);
			trackCache.set(track.id, track);
		}
	}

	return tracks;
}
