interface ControlPanelProps {
	isFormatting: boolean;
	copyButtonText: string;
	outputJson: string;
	onFormat: () => void;
	onMinify: () => void;
	onClear: () => void;
	onCopy: () => void;
}

export default function ControlPanel({
	isFormatting,
	copyButtonText,
	outputJson,
	onFormat,
	onMinify,
	onClear,
	onCopy,
}: ControlPanelProps) {
	return (
		<div className="flex flex-row lg:flex-col lg:w-48 gap-3 animate-slide-in-left delay-100 lg:justify-center">
			<button
				className={`btn-brutal flex-1 lg:flex-none lg:w-full px-4 py-3 text-xs tracking-wider ${
					isFormatting ? 'cursor-not-allowed opacity-75' : ''
				}`}
				onClick={onFormat}
				disabled={isFormatting}
				style={{
					background: 'var(--electric-cyan)',
					borderColor: 'var(--stark-white)',
					color: 'var(--void-black)',
					fontFamily: 'var(--font-work-sans)'
				}}
			>
				{isFormatting ? (
					<span className="flex items-center justify-center gap-2">
						<svg
							className="animate-spin h-4 w-4"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						FORMATTING...
					</span>
				) : (
					'▶ FORMAT'
				)}
			</button>

			<button
				className="btn-brutal flex-1 lg:flex-none lg:w-full px-4 py-3 text-xs tracking-wider"
				onClick={onMinify}
				style={{
					background: 'var(--hot-pink)',
					borderColor: 'var(--stark-white)',
					color: 'var(--stark-white)',
					fontFamily: 'var(--font-work-sans)'
				}}
			>
				⚡ MINIFY
			</button>

			<button
				className="btn-brutal flex-1 lg:flex-none lg:w-full px-4 py-3 text-xs tracking-wider"
				onClick={onClear}
				style={{
					background: 'var(--void-black)',
					borderColor: 'var(--hot-pink)',
					color: 'var(--hot-pink)',
					fontFamily: 'var(--font-work-sans)'
				}}
			>
				✕ CLEAR
			</button>

			<button
				className={`btn-brutal flex-1 lg:flex-none lg:w-full px-4 py-3 text-xs tracking-wider ${
					!outputJson || copyButtonText.includes('failed')
						? 'cursor-not-allowed opacity-50'
						: ''
				}`}
				onClick={onCopy}
				disabled={!outputJson || copyButtonText.includes('failed')}
				style={{
					background: copyButtonText.includes('Copied')
						? 'var(--lime-punch)'
						: 'var(--neon-yellow)',
					borderColor: 'var(--void-black)',
					color: 'var(--void-black)',
					fontFamily: 'var(--font-work-sans)'
				}}
			>
				{copyButtonText.includes('Copied')
					? '✓ COPIED!'
					: '◎ COPY'}
			</button>
		</div>
	);
}
