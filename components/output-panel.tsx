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
		<div className="flex-1 flex flex-col min-h-0">
			<div className="flex items-center justify-between mb-2">
				<h2 className="text-lg font-semibold text-white">
					Formatted JSON
				</h2>
				{outputJson && (
					<div className="text-sm text-gray-400">
						{outputJson.split('\n').length} lines
					</div>
				)}
			</div>
			<div className="flex-1 border border-gray-600 rounded-lg overflow-hidden bg-gray-800 shadow-lg">
				<pre
					style={{
						fontFamily: getFontVariable(fontFamily),
						fontSize: `${fontSize}px`,
					}}
					className="w-full h-full p-4 overflow-auto bg-transparent text-gray-100 leading-relaxed whitespace-pre-wrap break-all"
				>
					{outputJson || (
						<span className="text-gray-500 italic">
							Formatted JSON will appear here...
						</span>
					)}
				</pre>
			</div>
		</div>
	);
}
