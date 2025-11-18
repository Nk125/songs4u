import { Music4 } from "lucide-react";

interface SearchBarProps {
	query: string;
	setQuery: (q: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
	return (
		<div className="sticky top-4 z-50 w-full max-w-xl mx-auto mb-4 transition-all duration-300">
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search by name, artist or album"
				className="w-full bg-zinc-900 text-white rounded-lg border border-zinc-800 p-3 pl-10 focus:outline-none focus:ring focus:ring-zinc-800 focus:border-zinc-800 placeholder:text-zinc-500 truncate transition-all duration-300"
			/>
			<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<Music4 className="size-4 text-gray-300" />
			</div>
		</div>
	);
}
