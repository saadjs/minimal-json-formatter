import { ChangeEvent, ClipboardEvent } from 'react';

interface InputPanelProps {
	value: string;
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	onPaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
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

export default function InputPanel({
	value,
	onChange,
	onPaste,
	fontFamily,
	fontSize,
}: InputPanelProps) {
	return (
		<div className="flex-1 flex flex-col min-h-0">
			<div className="flex items-center justify-between mb-2">
				<h2 className="text-lg font-semibold text-white">Input JSON</h2>
				<div className="text-sm text-gray-400">Paste JSON here</div>
			</div>
			<div className="flex-1 border border-gray-600 rounded-lg overflow-hidden bg-gray-800 shadow-lg">
				<textarea
					style={{
						fontFamily: getFontVariable(fontFamily),
						fontSize: `${fontSize}px`,
					}}
					className="w-full h-full p-4 bg-transparent text-gray-100 placeholder-gray-500 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset overflow-auto"
					value={value}
					onChange={onChange}
					onPaste={onPaste}
					placeholder='Enter or paste JSON here...\n\nExample:\n{\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}'
					spellCheck={false}
				/>
			</div>
		</div>
	);
}
