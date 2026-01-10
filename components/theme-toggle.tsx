'use client';

interface ThemeToggleProps {
	theme: 'dark' | 'light';
	onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
	return (
		<button
			onClick={onToggle}
			className="btn-brutal px-4 py-2 text-xs tracking-wider"
			style={{
				background: theme === 'dark' ? 'var(--neon-yellow)' : 'var(--void-black)',
				borderColor: theme === 'dark' ? 'var(--void-black)' : 'var(--stark-white)',
				color: theme === 'dark' ? 'var(--void-black)' : 'var(--neon-yellow)',
				fontFamily: 'var(--font-work-sans)'
			}}
			aria-label="Toggle theme"
		>
			{theme === 'dark' ? '☀ LIGHT' : '● DARK'}
		</button>
	);
}
