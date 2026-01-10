interface OutputPanelProps {
	outputJson: string;
	fontFamily: string;
	fontSize: string;
}

const getFontVariable = (font: string): string => {
	const fontMap: Record<string, string> = {
		jetbrains: 'var(--font-jetbrains-mono)',
		fira: 'var(--font-fira-code)',
		source: 'var(--font-source-code-pro)',
		ibm: 'var(--font-ibm-plex-mono)',
		roboto: 'var(--font-roboto-mono)',
	};
	return fontMap[font] || fontMap.jetbrains;
};

export default function OutputPanel({ outputJson, fontFamily, fontSize }: OutputPanelProps) {
	return (
		<div className="flex-1 flex flex-col min-h-0 animate-slide-in-right delay-300">
			<div className="flex items-center justify-between mb-3">
				<h2
					className="text-lg font-black uppercase tracking-wide"
					style={{
						color: 'var(--stark-white)',
						fontFamily: 'var(--font-work-sans)'
					}}
				>
					<span style={{ color: 'var(--lime-punch)' }}>▸</span> OUTPUT
				</h2>
				{outputJson && (
					<div
						className="text-xs uppercase font-bold tracking-wide"
						style={{
							color: 'var(--lime-punch)',
							fontFamily: 'var(--font-work-sans)'
						}}
					>
						{outputJson.split('\n').length} LINES
					</div>
				)}
			</div>
			<div
				className="flex-1 overflow-hidden relative"
				style={{
					border: '4px solid var(--lime-punch)',
					background: 'var(--deep-black)'
				}}
			>
				<pre
					style={{
						fontFamily: getFontVariable(fontFamily),
						fontSize: `${fontSize}px`,
						background: 'var(--deep-black)',
						color: 'var(--stark-white)'
					}}
					className="w-full h-full p-6 overflow-auto leading-relaxed whitespace-pre-wrap break-all"
				>
					{outputJson || (
						<span
							className="italic font-sans"
							style={{
								color: 'var(--steel-gray)',
								fontFamily: 'var(--font-work-sans)'
							}}
						>
							// FORMATTED OUTPUT APPEARS HERE
						</span>
					)}
				</pre>
			</div>
		</div>
	);
}
