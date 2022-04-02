import { useEffect, useState } from 'react';
import { REST_URL } from 'src/env';
import { embed } from 'src/util';

import './App.scss';

interface Level {
	id: number;
	name: string;
	userName: string;
	verifierName: string;
	video: string;
}

export default function App() {
	const [levels, setLevels] = useState<Level[]>([]);

	useEffect(() => {
		(async () => {
			const res = await fetch(new URL('/levels', REST_URL).toString());
			const levels = await res.json();
			setLevels(levels);
		})();
	});

	return (
		<main>
			<h1>GD Open List</h1>
			<p>Welcome to the GD Open List!</p>
			<ul>
				{levels.map((level) => (
					<li key={level.name}>
						<h2>{level.name}</h2>
						<iframe src={embed(level.video)} frameBorder="0" title="Verification" />
						<p>{level.userName}</p>
					</li>
				))}
			</ul>
		</main>
	);
}
