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
		<div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 text-sm">
			<div className="flex items-center space-x-4">
				<span className="text-gray-400">
					Characters: {characterCount}
				</span>
				<div className="flex items-center space-x-2">
					<div
						className={`w-2 h-2 rounded-full ${
							isValid ? 'bg-green-500' : 'bg-red-500'
						}`}
					/>
					<span
						className={isValid ? 'text-green-400' : 'text-red-400'}
					>
						{isValid ? 'Valid JSON' : 'Invalid JSON'}
					</span>
				</div>
			</div>
			{error && (
				<div className="text-red-400 max-w-md truncate">⚠️ {error}</div>
			)}
		</div>
	);
}
