import { AudioLines, ChevronRight } from "lucide-react";
import Image from "next/image";

export interface SpotifyTrack {
	id: string;
	name: string;
	artist: string;
	album: string;
	cover: string;
	message?: string;
}

interface SongCardProps {
	track: SpotifyTrack;
}

export default function SongCard({ track }: SongCardProps) {
	return (
		<div className="flex items-start bg-zinc-900 p-4 rounded-lg border border-zinc-800 w-full">
			{/* 
			<Image
				width={96}
				height={96}
				src={track.cover}
				alt={track.name}
				className="size-24 object-cover rounded-xl flex shrink-0"
			/>
			*/}

			{/* Placeholder album cover */}
			<div className="w-24 h-24 bg-linear-to-b from-[#16a34a] via-[#4ade80] to-[#bbf7d0]" />

			<div className="flex-1 flex flex-col ml-4 min-w-0 h-24">
				<div className="flex flex-col sm:flex-row">
					<div className="flex shrink-0 mb-1 sm:mb-0 sm:mr-3">
						<div className="bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center size-6">
							<AudioLines className="size-4 text-gray-300" />
						</div>
					</div>
					<h3 className="text-lg font-semibold text-white truncate min-w-0 text-left w-full">
						{track.name}
					</h3>
				</div>

				<p className="text-zinc-400 truncate mt-auto sm:mt-1 min-w-0 text-left w-full">
					{track.artist} · {track.album}
				</p>

				{track.message && (
					<p className="text-gray-300 text-sm truncate hidden sm:block mt-auto min-w-0 text-left w-full">
						{track.message}
					</p>
				)}
			</div>

			<div className="flex shrink-0 ml-4 h-24 items-center justify-center">
				<ChevronRight className="size-6 text-gray-400" />
			</div>
		</div>
	);
}
