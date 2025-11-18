import fs from "fs";
import path from "path";
import { getTrack } from "../../app/lib/spotify.ts";
import songsData from "../songs.json";

async function generateTracks() {
	const tracks = [];

	for (const song of songsData) {
		if (!song.song_id) continue;

		const track = await getTrack(song.song_id);
		if (track) {
			tracks.push({
				id: track.id,
				name: track.name,
				artist: track.artist,
				album: track.album,
				cover: track.cover,
				message: song.message || "",
			});
		}
	}

	const outPath = path.resolve("./tracks.json");
	fs.writeFileSync(outPath, JSON.stringify(tracks, null, 2));
	console.log(`"tracks.json" generado con "${tracks.length}" canciones`);
}

generateTracks();
