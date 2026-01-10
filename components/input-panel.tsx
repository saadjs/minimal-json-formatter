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
		<div className="flex-1 flex flex-col min-h-0 animate-slide-in-left delay-200">
			<div className="flex items-center justify-between mb-3">
				<h2
					className="text-lg font-black uppercase tracking-wide"
					style={{
						color: 'var(--stark-white)',
						fontFamily: 'var(--font-work-sans)'
					}}
				>
					<span style={{ color: 'var(--electric-cyan)' }}>▸</span> INPUT
				</h2>
				<div
					className="text-xs uppercase font-bold tracking-wide"
					style={{
						color: 'var(--steel-gray)',
						fontFamily: 'var(--font-work-sans)'
					}}
				>
					PASTE JSON
				</div>
			</div>
			<div
				className="flex-1 overflow-hidden relative"
				style={{
					border: '4px solid var(--electric-cyan)',
					background: 'var(--deep-black)'
				}}
			>
				<textarea
					style={{
						fontFamily: getFontVariable(fontFamily),
						fontSize: `${fontSize}px`,
						background: 'var(--deep-black)',
						color: 'var(--stark-white)'
					}}
					className="w-full h-full p-6 resize-none leading-relaxed focus:outline-none overflow-auto"
					value={value}
					onChange={onChange}
					onPaste={onPaste}
					placeholder='{"action": "PASTE_JSON_HERE"}'
					spellCheck={false}
				/>
			</div>
		</div>
	);
}
