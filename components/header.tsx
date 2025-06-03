interface HeaderProps {
	indentSize: number;
	onIndentChange: (size: number) => void;
}

export default function Header({ indentSize, onIndentChange }: HeaderProps) {
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
			</div>
		</div>
	);
}
