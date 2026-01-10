interface HeaderProps {
	indentSize: number;
	onIndentChange: (size: number) => void;
	fontFamily: string;
	onFontChange: (font: string) => void;
	fontSize: string;
	onFontSizeChange: (size: string) => void;
}

export default function Header({
	indentSize,
	onIndentChange,
	fontFamily,
	onFontChange,
	fontSize,
	onFontSizeChange,
}: HeaderProps) {
	return (
		<div className="flex items-center justify-between p-4 border-b border-gray-700">
			<div>
				<h1 className="text-3xl font-bold text-white">
					JSON Formatter
				</h1>
				<p className="text-sm text-gray-400 mt-1">
					Format, validate, and minify JSON • Press Cmd/Ctrl+Enter to
					format • Cmd/Ctrl+K to clear
				</p>
			</div>
			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-2">
					<label className="text-sm text-gray-400">Indent:</label>
					<select
						value={indentSize}
						onChange={(e) => onIndentChange(Number(e.target.value))}
						className="bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value={2}>2 spaces</option>
						<option value={4}>4 spaces</option>
						<option value={8}>8 spaces</option>
					</select>
				</div>
				<div className="flex items-center space-x-2">
					<label className="text-sm text-gray-400">Font:</label>
					<select
						value={fontFamily}
						onChange={(e) => onFontChange(e.target.value)}
						className="bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="jetbrains">JetBrains Mono</option>
						<option value="fira">Fira Code</option>
						<option value="source">Source Code Pro</option>
						<option value="ibm">IBM Plex Mono</option>
						<option value="roboto">Roboto Mono</option>
					</select>
				</div>
				<div className="flex items-center space-x-2">
					<label className="text-sm text-gray-400">Size:</label>
					<select
						value={fontSize}
						onChange={(e) => onFontSizeChange(e.target.value)}
						className="bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="12">12px</option>
						<option value="14">14px</option>
						<option value="16">16px</option>
						<option value="18">18px</option>
						<option value="20">20px</option>
						<option value="22">22px</option>
						<option value="24">24px</option>
					</select>
				</div>
			</div>
		</div>
	);
}
