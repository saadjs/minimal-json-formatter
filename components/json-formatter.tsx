'use client';

import {
	useState,
	useEffect,
	useCallback,
	ChangeEvent,
	ClipboardEvent,
} from 'react';
import Header from './header';
import StatusBar from './status-bar';
import InputPanel from './input-panel';
import ControlPanel from './control-panel';
import OutputPanel from './output-panel';

export default function JsonFormatter() {
	const [inputJson, setInputJson] = useState('');
	const [outputJson, setOutputJson] = useState('');
	const [copyButtonText, setCopyButtonText] = useState('Copy Formatted');
	const [error, setError] = useState('');
	const [isFormatting, setIsFormatting] = useState(false);
	const [isValid, setIsValid] = useState(true);
	const [characterCount, setCharacterCount] = useState(0);
	const [indentSize, setIndentSize] = useState(2);
	const [fontFamily, setFontFamily] = useState(() => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('json-formatter-font') || 'jetbrains';
		}
		return 'jetbrains';
	});
	const [fontSize, setFontSize] = useState(() => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('json-formatter-font-size') || '14';
		}
		return '14';
	});
	const [theme, setTheme] = useState<'dark' | 'light'>(() => {
		if (typeof window !== 'undefined') {
			return (localStorage.getItem('json-formatter-theme') as 'dark' | 'light') || 'dark';
		}
		return 'dark';
	});

	// Validation effect
	useEffect(() => {
		if (!inputJson.trim()) {
			setIsValid(true);
			setError('');
			setCharacterCount(0);
			return;
		}

		setCharacterCount(inputJson.length);

		try {
			JSON.parse(inputJson);
			setIsValid(true);
			setError('');
		} catch (err) {
			setIsValid(false);
			const errorMessage = (err as Error).message;
			const match = errorMessage.match(/at position (\d+)/);
			if (match) {
				const position = parseInt(match[1]);
				const lines = inputJson.substring(0, position).split('\n');
				const line = lines.length;
				const column = lines[lines.length - 1].length + 1;
				setError(`Line ${line}, Column ${column}: ${errorMessage}`);
			} else {
				setError(errorMessage);
			}
		}
	}, [inputJson]);

	// Reformat output when indent size changes
	useEffect(() => {
		if (outputJson && inputJson.trim()) {
			try {
				const parsed = JSON.parse(inputJson);
				setOutputJson(JSON.stringify(parsed, null, indentSize));
			} catch {
				// If parsing fails, keep the existing output
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [indentSize]);

	const formatJson = useCallback(async () => {
		if (!inputJson.trim()) {
			setError('Enter some JSON to format ‼️');
			return;
		}

		setIsFormatting(true);
		setError('');

		// 100ms delay to simulate formatting
		await new Promise((resolve) => setTimeout(resolve, 100));

		try {
			const parsedJson = JSON.parse(inputJson);
			setOutputJson(JSON.stringify(parsedJson, null, indentSize));
		} catch (error) {
			const errorMessage = (error as Error).message;
			const match = errorMessage.match(/at position (\d+)/);
			if (match) {
				const position = parseInt(match[1]);
				const lines = inputJson.substring(0, position).split('\n');
				const line = lines.length;
				const column = lines[lines.length - 1].length + 1;
				setError(`Line ${line}, Column ${column}: ${errorMessage}`);
			} else {
				setError(errorMessage);
			}
			setOutputJson('');
		} finally {
			setIsFormatting(false);
		}
	}, [inputJson, indentSize]);

	const clearAll = useCallback(() => {
		setInputJson('');
		setOutputJson('');
		setError('');
		setCopyButtonText('Copy Formatted');
	}, []);

	const minifyJson = useCallback(() => {
		if (!inputJson.trim()) {
			setError('Enter some JSON to minify ‼️');
			return;
		}

		try {
			const parsedJson = JSON.parse(inputJson);
			setOutputJson(JSON.stringify(parsedJson));
			setError('');
		} catch (error) {
			const errorMessage = (error as Error).message;
			setError(`Invalid JSON: ${errorMessage}`);
			setOutputJson('');
		}
	}, [inputJson]);

	const copyOutput = async () => {
		if (!outputJson || outputJson === 'Invalid JSON') return;

		try {
			await navigator.clipboard.writeText(outputJson);
			setCopyButtonText('✓ Copied!');
			setTimeout(() => setCopyButtonText('Copy Formatted'), 2000);
		} catch (err) {
			setCopyButtonText('Copy failed');
			setTimeout(() => setCopyButtonText('Copy Formatted'), 2000);
		}
	};

	const handlePaste = async (e: ClipboardEvent<HTMLTextAreaElement>) => {
		const pastedText = e.clipboardData.getData('text');
		try {
			// Try to parse and auto-format on paste
			const parsed = JSON.parse(pastedText);
			const formatted = JSON.stringify(parsed, null, indentSize);
			e.preventDefault(); // Prevent default paste behavior
			setInputJson(pastedText);
			setOutputJson(formatted);
		} catch {
			// If not valid JSON, allow default paste behavior
			// The onChange handler will update inputJson
		}
	};

	const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setInputJson(e.target.value);
	};

	const handleIndentChange = (size: number) => {
		setIndentSize(size);
	};

	const handleFontChange = (font: string) => {
		setFontFamily(font);
		if (typeof window !== 'undefined') {
			localStorage.setItem('json-formatter-font', font);
		}
	};

	const handleFontSizeChange = (size: string) => {
		setFontSize(size);
		if (typeof window !== 'undefined') {
			localStorage.setItem('json-formatter-font-size', size);
		}
	};

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
		if (typeof window !== 'undefined') {
			localStorage.setItem('json-formatter-theme', newTheme);
		}
	};

	// Apply theme to document
	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', theme);
		}
	}, [theme]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
				e.preventDefault();
				formatJson();
			}
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				clearAll();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [formatJson, clearAll]);

	return (
		<div className="flex flex-col flex-1 relative overflow-hidden" style={{ background: 'var(--void-black)' }}>
			{/* Grid Background */}
			<div className="absolute inset-0 grid-bg pointer-events-none" />

			{/* Scanlines */}
			<div className="scanlines absolute inset-0 pointer-events-none" />

			<Header
				indentSize={indentSize}
				onIndentChange={handleIndentChange}
				fontFamily={fontFamily}
				onFontChange={handleFontChange}
				fontSize={fontSize}
				onFontSizeChange={handleFontSizeChange}
				theme={theme}
				onToggleTheme={toggleTheme}
			/>

			<StatusBar
				characterCount={characterCount}
				isValid={isValid}
				error={error}
			/>

			<div className="flex flex-col lg:flex-row flex-1 p-6 gap-6 min-h-0 relative z-10">
				<InputPanel
					value={inputJson}
					onChange={handleInputChange}
					onPaste={handlePaste}
					fontFamily={fontFamily}
					fontSize={fontSize}
				/>

				<ControlPanel
					isFormatting={isFormatting}
					copyButtonText={copyButtonText}
					outputJson={outputJson}
					onFormat={formatJson}
					onMinify={minifyJson}
					onClear={clearAll}
					onCopy={copyOutput}
				/>

				<OutputPanel outputJson={outputJson} fontFamily={fontFamily} fontSize={fontSize} />
			</div>
		</div>
	);
}
