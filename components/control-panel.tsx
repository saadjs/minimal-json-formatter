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
		<div className="flex flex-row lg:flex-col lg:w-48 space-x-2 lg:space-x-0 lg:space-y-3">
			<button
				className={`flex-1 lg:w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
					isFormatting
						? 'bg-blue-400 cursor-not-allowed'
						: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
				} text-white shadow-lg`}
				onClick={onFormat}
				disabled={isFormatting}
			>
				{isFormatting ? (
					<span className="flex items-center justify-center">
						<svg
							className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
						Formatting...
					</span>
				) : (
					'Format JSON'
				)}
			</button>

			<button
				className="flex-1 lg:w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 font-medium transition-all duration-200 shadow-lg"
				onClick={onMinify}
			>
				Minify JSON
			</button>

			<button
				className="flex-1 lg:w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 font-medium transition-all duration-200 shadow-lg"
				onClick={onClear}
			>
				Clear All
			</button>

			<button
				className={`flex-1 lg:w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg ${
					copyButtonText.includes('Copied')
						? 'bg-green-600 text-white'
						: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white'
				}`}
				onClick={onCopy}
				disabled={!outputJson || copyButtonText.includes('failed')}
			>
				{copyButtonText}
			</button>
		</div>
	);
}
