"use client";

import { useState, useEffect } from "react";
import SongCard, { type SpotifyTrack } from "@/app/ui/SongCard";
import SearchBar from "@/app/ui/SearchBar";
import tracksDataJson from "@/test-data/tracks.json";

export default function Page() {
	const [query, setQuery] = useState<string>("");
	const [tracks, _] = useState<SpotifyTrack[]>(tracksDataJson);

	useEffect(() => {
		if (!("indexedDB" in window)) return;

		const request = indexedDB.open("songs4u-cache", 1);
		request.onupgradeneeded = (e) => {
			const db = (e.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains("tracks")) {
				db.createObjectStore("tracks", { keyPath: "id" });
			}
		};

		request.onsuccess = (e) => {
			const db = (e.target as IDBOpenDBRequest).result;
			const tx = db.transaction("tracks", "readwrite");
			const store = tx.objectStore("tracks");
			tracksDataJson.forEach((track) => store.put(track));
			tx.oncomplete = () => console.info("Offline mode, ready");
		};
	}, []);

	const matches = tracks.filter(
		(track) =>
			track.name.toLowerCase().includes(query.toLowerCase()) ||
			track.artist.toLowerCase().includes(query.toLowerCase()) ||
			track.album.toLowerCase().includes(query.toLowerCase()),
	);

	const filteredTracks = matches.length > 0 ? matches : tracks;

	return (
		<div className="p-4 flex flex-col items-center text-center mt-10">
			<div className="w-full max-w-xl">
				<SearchBar query={query} setQuery={setQuery} />
			</div>

			<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl">
				{filteredTracks.map((track) => (
					<SongCard key={track.id} track={track} />
				))}
			</section>
		</div>
	);
}
