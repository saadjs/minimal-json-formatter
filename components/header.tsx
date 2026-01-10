import ThemeToggle from './theme-toggle';

interface HeaderProps {
	indentSize: number;
	onIndentChange: (size: number) => void;
	fontFamily: string;
	onFontChange: (font: string) => void;
	fontSize: string;
	onFontSizeChange: (size: string) => void;
	theme: 'dark' | 'light';
	onToggleTheme: () => void;
}

export default function Header({
	indentSize,
	onIndentChange,
	fontFamily,
	onFontChange,
	fontSize,
	onFontSizeChange,
	theme,
	onToggleTheme,
}: HeaderProps) {
	return (
		<div className="relative z-20 px-6 py-6 border-b-4 border-[var(--electric-cyan)] animate-slide-in-top" style={{ background: 'var(--deep-black)' }}>
			<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
				<div>
					<h1 className="text-5xl lg:text-6xl font-black tracking-tight glitch" style={{ fontFamily: 'var(--font-work-sans)' }}>
						<span style={{ color: 'var(--stark-white)' }}>JSON</span>
						{' '}
						<span style={{ color: 'var(--electric-cyan)' }}>FORMATTER</span>
					</h1>
					<p className="text-xs uppercase tracking-wider mt-2 font-semibold" style={{ color: 'var(--steel-gray)', fontFamily: 'var(--font-work-sans)' }}>
						<span style={{ color: 'var(--electric-cyan)' }}>⌘+ENTER</span> FORMAT{' '}
						<span className="mx-2">•</span>{' '}
						<span style={{ color: 'var(--hot-pink)' }}>⌘+K</span> CLEAR
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<ThemeToggle theme={theme} onToggle={onToggleTheme} />
					<div className="flex items-center gap-2">
						<label className="text-xs uppercase font-bold tracking-wide" style={{ color: 'var(--steel-gray)' }}>INDENT</label>
						<select
							value={indentSize}
							onChange={(e) => onIndentChange(Number(e.target.value))}
							className="px-3 py-2 text-xs font-bold uppercase border-2 focus:outline-none transition-colors cursor-pointer"
							style={{
								background: 'var(--void-black)',
								color: 'var(--stark-white)',
								borderColor: 'var(--steel-gray)',
								fontFamily: 'var(--font-work-sans)'
							}}
						>
							<option value={2}>2 SPC</option>
							<option value={4}>4 SPC</option>
							<option value={8}>8 SPC</option>
						</select>
					</div>
					<div className="flex items-center gap-2">
						<label className="text-xs uppercase font-bold tracking-wide" style={{ color: 'var(--steel-gray)' }}>FONT</label>
						<select
							value={fontFamily}
							onChange={(e) => onFontChange(e.target.value)}
							className="px-3 py-2 text-xs font-bold uppercase border-2 focus:outline-none transition-colors cursor-pointer"
							style={{
								background: 'var(--void-black)',
								color: 'var(--stark-white)',
								borderColor: 'var(--steel-gray)',
								fontFamily: 'var(--font-work-sans)'
							}}
						>
							<option value="jetbrains">JETBRAINS MONO</option>
							<option value="fira">FIRA CODE</option>
							<option value="source">SOURCE CODE PRO</option>
							<option value="ibm">IBM PLEX MONO</option>
							<option value="roboto">ROBOTO MONO</option>
						</select>
					</div>
					<div className="flex items-center gap-2">
						<label className="text-xs uppercase font-bold tracking-wide" style={{ color: 'var(--steel-gray)' }}>SIZE</label>
						<select
							value={fontSize}
							onChange={(e) => onFontSizeChange(e.target.value)}
							className="px-3 py-2 text-xs font-bold uppercase border-2 focus:outline-none transition-colors cursor-pointer"
							style={{
								background: 'var(--void-black)',
								color: 'var(--stark-white)',
								borderColor: 'var(--steel-gray)',
								fontFamily: 'var(--font-work-sans)'
							}}
						>
							<option value="12">12PX</option>
							<option value="14">14PX</option>
							<option value="16">16PX</option>
							<option value="18">18PX</option>
							<option value="20">20PX</option>
							<option value="22">22PX</option>
							<option value="24">24PX</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}
