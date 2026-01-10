interface StatusBarProps {
	characterCount: number;
	isValid: boolean;
	error: string;
}

export default function StatusBar({
	characterCount,
	isValid,
	error,
}: StatusBarProps) {
	return (
		<div
			className="relative z-20 flex items-center justify-between px-6 py-3 border-b-2 text-xs font-bold uppercase tracking-wide"
			style={{
				background: 'var(--coal-black)',
				borderColor: 'var(--steel-gray)',
				fontFamily: 'var(--font-work-sans)'
			}}
		>
			<div className="flex items-center gap-6">
				<div className="flex items-center gap-2">
					<span style={{ color: 'var(--steel-gray)' }}>CHARS:</span>
					<span style={{ color: 'var(--electric-cyan)' }}>{characterCount.toLocaleString()}</span>
				</div>
				<div className="flex items-center gap-2">
					<div
						className={`w-3 h-3 border-2 rounded-full ${
							isValid ? 'pulse-border' : ''
						}`}
						style={{
							borderColor: isValid ? 'var(--lime-punch)' : 'var(--hot-pink)',
							background: isValid ? 'var(--lime-punch)' : 'var(--hot-pink)',
							boxShadow: isValid
								? '0 0 10px var(--lime-punch)'
								: '0 0 10px var(--hot-pink)'
						}}
					/>
					<span
						style={{
							color: isValid ? 'var(--lime-punch)' : 'var(--hot-pink)'
						}}
					>
						{isValid ? '✓ VALID' : '✗ INVALID'}
					</span>
				</div>
			</div>
			{error && (
				<div
					className="flex items-center gap-2 max-w-md truncate"
					style={{ color: 'var(--hot-pink)' }}
				>
					<span className="text-base">⚠</span>
					<span className="font-mono text-xs normal-case">{error}</span>
				</div>
			)}
		</div>
	);
}
