'use client';

import { useState, useEffect, useCallback, useRef, useMemo, ChangeEvent } from 'react';
import CompareHeader from './compare-header';
import { calculateErrorPosition, getFontVariable } from '@/lib/utils';

interface DiffResult {
	leftLines: DiffLine[];
	rightLines: DiffLine[];
	stats: { added: number; removed: number; unchanged: number; modified: number };
}

interface DiffLine {
	content: string;
	type: 'added' | 'removed' | 'unchanged' | 'empty' | 'modified';
	lineNum: number | null;
	correspondingLine?: number;
}

/**
 * Post-process diff arrays to pair consecutive removed/added blocks side-by-side
 * This creates VS Code-style diffs where changed lines appear on the same row
 */
function pairChangeBlocks(
	leftLines: DiffLine[],
	rightLines: DiffLine[]
): { leftLines: DiffLine[]; rightLines: DiffLine[] } {
	const resultLeft: DiffLine[] = [];
	const resultRight: DiffLine[] = [];

	let i = 0;
	while (i < leftLines.length) {
		const left = leftLines[i];
		const right = rightLines[i];

		// Unchanged line - copy as-is
		if (left.type === 'unchanged') {
			resultLeft.push(left);
			resultRight.push(right);
			i++;
			continue;
		}

		// Collect consecutive changes
		const removedLines: DiffLine[] = [];
		const addedLines: DiffLine[] = [];

		while (i < leftLines.length) {
			const l = leftLines[i];
			const r = rightLines[i];

			if (l.type === 'removed' && r.type === 'empty') {
				removedLines.push(l);
				i++;
			} else if (l.type === 'empty' && r.type === 'added') {
				addedLines.push(r);
				i++;
			} else {
				break;
			}
		}

		// Pair removed and added lines on same rows
		const maxLen = Math.max(removedLines.length, addedLines.length);

		for (let j = 0; j < maxLen; j++) {
			const hasRemoved = j < removedLines.length;
			const hasAdded = j < addedLines.length;
			const isPaired = hasRemoved && hasAdded;

			resultLeft.push(
				hasRemoved
					? { ...removedLines[j], type: isPaired ? 'modified' : 'removed' }
					: { content: '', type: 'empty', lineNum: null }
			);

			resultRight.push(
				hasAdded
					? { ...addedLines[j], type: isPaired ? 'modified' : 'added' }
					: { content: '', type: 'empty', lineNum: null }
			);
		}
	}

	return { leftLines: resultLeft, rightLines: resultRight };
}

/**
 * Compute side-by-side diff using LCS algorithm
 */
function computeSideBySideDiff(leftJson: string, rightJson: string): DiffResult {
	// Format both JSONs consistently for comparison
	let leftFormatted: string;
	let rightFormatted: string;

	try {
		leftFormatted = JSON.stringify(JSON.parse(leftJson), null, 2);
	} catch {
		leftFormatted = leftJson;
	}

	try {
		rightFormatted = JSON.stringify(JSON.parse(rightJson), null, 2);
	} catch {
		rightFormatted = rightJson;
	}

	const leftSrc = leftFormatted.split('\n');
	const rightSrc = rightFormatted.split('\n');

	const m = leftSrc.length;
	const n = rightSrc.length;

	// Build LCS table
	const dp: number[][] = Array(m + 1)
		.fill(null)
		.map(() => Array(n + 1).fill(0));

	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			if (leftSrc[i - 1] === rightSrc[j - 1]) {
				dp[i][j] = dp[i - 1][j - 1] + 1;
			} else {
				dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
			}
		}
	}

	// Backtrack to build side-by-side diff
	let i = m;
	let j = n;
	const tempLeft: DiffLine[] = [];
	const tempRight: DiffLine[] = [];

	while (i > 0 || j > 0) {
		if (i > 0 && j > 0 && leftSrc[i - 1] === rightSrc[j - 1]) {
			// Unchanged line
			tempLeft.push({ content: leftSrc[i - 1], type: 'unchanged', lineNum: i, correspondingLine: j });
			tempRight.push({ content: rightSrc[j - 1], type: 'unchanged', lineNum: j, correspondingLine: i });
			i--;
			j--;
		} else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
			// Added in right
			tempLeft.push({ content: '', type: 'empty', lineNum: null });
			tempRight.push({ content: rightSrc[j - 1], type: 'added', lineNum: j });
			j--;
		} else {
			// Removed from left
			tempLeft.push({ content: leftSrc[i - 1], type: 'removed', lineNum: i });
			tempRight.push({ content: '', type: 'empty', lineNum: null });
			i--;
		}
	}

	// Reverse to get correct order
	const rawLeftLines: DiffLine[] = [];
	const rawRightLines: DiffLine[] = [];
	for (let k = tempLeft.length - 1; k >= 0; k--) {
		rawLeftLines.push(tempLeft[k]);
		rawRightLines.push(tempRight[k]);
	}

	// Post-process to pair changed lines side-by-side (VS Code style)
	const { leftLines, rightLines } = pairChangeBlocks(rawLeftLines, rawRightLines);

	// Count stats
	let added = 0, removed = 0, unchanged = 0, modified = 0;
	for (const line of leftLines) {
		if (line.type === 'removed') removed++;
		if (line.type === 'modified') modified++;
		if (line.type === 'unchanged') unchanged++;
	}
	for (const line of rightLines) {
		if (line.type === 'added') added++;
	}

	return { leftLines, rightLines, stats: { added, removed, unchanged, modified } };
}

export default function JsonCompare() {
	// JSON state
	const [leftJson, setLeftJson] = useState('');
	const [rightJson, setRightJson] = useState('');
	const [leftValid, setLeftValid] = useState(true);
	const [rightValid, setRightValid] = useState(true);
	const [leftError, setLeftError] = useState('');
	const [rightError, setRightError] = useState('');
	const [viewMode, setViewMode] = useState<'edit' | 'diff'>('edit');

	// UI preferences
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

	// Refs for synchronized scrolling
	const leftScrollRef = useRef<HTMLDivElement>(null);
	const rightScrollRef = useRef<HTMLDivElement>(null);
	const isScrolling = useRef(false);

	// Apply theme on mount and changes
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	// Persist preferences
	useEffect(() => {
		localStorage.setItem('json-formatter-font', fontFamily);
	}, [fontFamily]);

	useEffect(() => {
		localStorage.setItem('json-formatter-font-size', fontSize);
	}, [fontSize]);

	useEffect(() => {
		localStorage.setItem('json-formatter-theme', theme);
	}, [theme]);

	// Validate left JSON
	useEffect(() => {
		if (!leftJson.trim()) {
			setLeftValid(true);
			setLeftError('');
			return;
		}

		try {
			JSON.parse(leftJson);
			setLeftValid(true);
			setLeftError('');
		} catch (err) {
			setLeftValid(false);
			const errorPos = calculateErrorPosition(err as Error, leftJson);
			if (errorPos) {
				setLeftError(`Line ${errorPos.line}, Col ${errorPos.column}`);
			} else {
				setLeftError((err as Error).message);
			}
		}
	}, [leftJson]);

	// Validate right JSON
	useEffect(() => {
		if (!rightJson.trim()) {
			setRightValid(true);
			setRightError('');
			return;
		}

		try {
			JSON.parse(rightJson);
			setRightValid(true);
			setRightError('');
		} catch (err) {
			setRightValid(false);
			const errorPos = calculateErrorPosition(err as Error, rightJson);
			if (errorPos) {
				setRightError(`Line ${errorPos.line}, Col ${errorPos.column}`);
			} else {
				setRightError((err as Error).message);
			}
		}
	}, [rightJson]);

	// Compute diff
	const diffResult = useMemo(() => {
		if (!leftJson.trim() && !rightJson.trim()) return null;
		if (!leftValid || !rightValid) return null;
		return computeSideBySideDiff(leftJson, rightJson);
	}, [leftJson, rightJson, leftValid, rightValid]);

	// Synchronized scrolling
	const handleLeftScroll = useCallback(() => {
		if (isScrolling.current) return;
		isScrolling.current = true;
		if (leftScrollRef.current && rightScrollRef.current) {
			rightScrollRef.current.scrollTop = leftScrollRef.current.scrollTop;
			rightScrollRef.current.scrollLeft = leftScrollRef.current.scrollLeft;
		}
		requestAnimationFrame(() => {
			isScrolling.current = false;
		});
	}, []);

	const handleRightScroll = useCallback(() => {
		if (isScrolling.current) return;
		isScrolling.current = true;
		if (leftScrollRef.current && rightScrollRef.current) {
			leftScrollRef.current.scrollTop = rightScrollRef.current.scrollTop;
			leftScrollRef.current.scrollLeft = rightScrollRef.current.scrollLeft;
		}
		requestAnimationFrame(() => {
			isScrolling.current = false;
		});
	}, []);

	// Clear function
	const handleClear = useCallback(() => {
		setLeftJson('');
		setRightJson('');
		setViewMode('edit');
	}, []);

	// Swap function
	const handleSwap = useCallback(() => {
		const temp = leftJson;
		setLeftJson(rightJson);
		setRightJson(temp);
	}, [leftJson, rightJson]);

	// Toggle theme
	const handleToggleTheme = useCallback(() => {
		setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
	}, []);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Cmd/Ctrl + D to toggle diff view
			if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
				e.preventDefault();
				setViewMode((prev) => (prev === 'edit' ? 'diff' : 'edit'));
			}
			// Cmd/Ctrl + K to clear
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				handleClear();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleClear]);

	const canShowDiff = leftValid && rightValid && leftJson.trim() !== '' && rightJson.trim() !== '';
	const hasChanges = diffResult && (diffResult.stats.added > 0 || diffResult.stats.removed > 0 || diffResult.stats.modified > 0);

	return (
		<div
			className="flex-1 flex flex-col overflow-hidden"
			style={{ background: 'var(--bg-primary)' }}
		>
			{/* Background effects */}
			<div className="fixed inset-0 grid-bg pointer-events-none" />
			<div className="scanlines pointer-events-none" />

			{/* Header */}
			<CompareHeader
				fontFamily={fontFamily}
				onFontChange={setFontFamily}
				fontSize={fontSize}
				onFontSizeChange={setFontSize}
				theme={theme}
				onToggleTheme={handleToggleTheme}
			/>

			{/* Status bar with view mode toggle */}
			<div
				className="flex items-center justify-between px-6 py-3 relative z-10"
				style={{
					background: 'var(--bg-secondary)',
					borderBottom: '2px solid var(--steel-gray)',
				}}
			>
				<div className="flex items-center gap-4">
					{/* View mode toggle */}
					<div
						className="flex rounded-none overflow-hidden"
						style={{ border: '2px solid var(--steel-gray)' }}
					>
						<button
							onClick={() => setViewMode('edit')}
							className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
							style={{
								background: viewMode === 'edit' ? 'var(--electric-cyan)' : 'transparent',
								color: viewMode === 'edit' ? 'var(--void-black)' : 'var(--steel-gray)',
								fontFamily: 'var(--font-work-sans)',
							}}
						>
							Edit
						</button>
						<button
							onClick={() => canShowDiff && setViewMode('diff')}
							className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
								!canShowDiff ? 'opacity-50 cursor-not-allowed' : ''
							}`}
							style={{
								background: viewMode === 'diff' ? 'var(--hot-pink)' : 'transparent',
								color: viewMode === 'diff' ? 'var(--stark-white)' : 'var(--steel-gray)',
								fontFamily: 'var(--font-work-sans)',
								borderLeft: '2px solid var(--steel-gray)',
							}}
							disabled={!canShowDiff}
						>
							Diff
						</button>
					</div>

					{/* Diff stats */}
					{diffResult && viewMode === 'diff' && (
						<div className="flex items-center gap-2">
							{hasChanges ? (
								<>
									{diffResult.stats.removed > 0 && (
										<span
											className="px-2 py-1 text-xs font-bold"
											style={{
												background: 'var(--diff-bg-removed)',
												color: 'var(--diff-removed)',
												border: '1px solid var(--diff-removed)',
											}}
										>
											−{diffResult.stats.removed}
										</span>
									)}
									{diffResult.stats.modified > 0 && (
										<span
											className="px-2 py-1 text-xs font-bold"
											style={{
												background: 'var(--diff-bg-modified)',
												color: 'var(--warning-yellow)',
												border: '1px solid var(--warning-yellow)',
											}}
										>
											~{diffResult.stats.modified}
										</span>
									)}
									{diffResult.stats.added > 0 && (
										<span
											className="px-2 py-1 text-xs font-bold"
											style={{
												background: 'var(--diff-bg-added)',
												color: 'var(--diff-added)',
												border: '1px solid var(--diff-added)',
											}}
										>
											+{diffResult.stats.added}
										</span>
									)}
								</>
							) : (
								<span
									className="px-2 py-1 text-xs font-bold uppercase"
									style={{
										background: 'var(--lime-punch)',
										color: 'var(--void-black)',
									}}
								>
									✓ Identical
								</span>
							)}
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="flex items-center gap-2">
					<button
						onClick={handleSwap}
						className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-80"
						style={{
							background: 'transparent',
							color: 'var(--electric-cyan)',
							border: '2px solid var(--electric-cyan)',
							fontFamily: 'var(--font-work-sans)',
						}}
					>
						↔ Swap
					</button>
					<button
						onClick={handleClear}
						className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-80"
						style={{
							background: 'transparent',
							color: 'var(--hot-pink)',
							border: '2px solid var(--hot-pink)',
							fontFamily: 'var(--font-work-sans)',
						}}
					>
						✕ Clear
					</button>
				</div>
			</div>

			{/* Main content - side by side panels */}
			<div className="flex-1 flex overflow-hidden relative z-10">
				{/* Left panel */}
				<div
					className="flex-1 flex flex-col min-w-0 min-h-0"
					style={{ borderRight: '2px solid var(--steel-gray)' }}
				>
					{/* Panel header */}
					<div
						className="flex items-center justify-between px-4 py-2"
						style={{
							background: 'var(--bg-tertiary)',
							borderBottom: '2px solid var(--electric-cyan)',
						}}
					>
						<div className="flex items-center gap-2">
							<span
								className="w-3 h-3 rounded-full"
								style={{ background: 'var(--electric-cyan)' }}
							/>
							<span
								className="text-sm font-bold uppercase tracking-wide"
								style={{ color: 'var(--electric-cyan)', fontFamily: 'var(--font-work-sans)' }}
							>
								Original
							</span>
						</div>
						{!leftValid && leftError && (
							<span
								className="text-xs font-bold"
								style={{ color: 'var(--hot-pink)' }}
							>
								{leftError}
							</span>
						)}
						{leftValid && leftJson.trim() && (
							<span
								className="text-xs"
								style={{ color: 'var(--steel-gray)' }}
							>
								{leftJson.length} chars
							</span>
						)}
					</div>

					{/* Panel content */}
					{viewMode === 'edit' ? (
						<textarea
							style={{
								fontFamily: getFontVariable(fontFamily),
								fontSize: `${fontSize}px`,
								background: 'var(--deep-black)',
								color: 'var(--stark-white)',
							}}
							className="flex-1 w-full p-4 resize-none leading-relaxed focus:outline-none overflow-auto"
							value={leftJson}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setLeftJson(e.target.value)}
							placeholder='{"paste": "original JSON here"}'
							spellCheck={false}
						/>
					) : (
						<div
							ref={leftScrollRef}
							onScroll={handleLeftScroll}
							className="flex-1 overflow-auto"
							style={{ background: 'var(--deep-black)' }}
						>
							{diffResult && (
								<div
									style={{
										fontFamily: getFontVariable(fontFamily),
										fontSize: `${fontSize}px`,
									}}
								>
									{diffResult.leftLines.map((line, index) => (
										<div
											key={index}
											className="flex"
											style={{
												background:
													line.type === 'removed'
														? 'var(--diff-bg-removed)'
														: line.type === 'modified'
														? 'var(--diff-bg-modified)'
														: 'transparent',
												minHeight: `${parseInt(fontSize) * 1.6}px`,
											}}
										>
											{/* Line number */}
											<div
												className="flex-shrink-0 w-12 text-right pr-3 select-none"
												style={{
													color:
														line.type === 'removed' || line.type === 'modified'
															? 'var(--diff-removed)'
															: 'var(--steel-gray)',
													background: 'var(--coal-black)',
													borderRight: '2px solid var(--steel-gray)',
												}}
											>
												{line.lineNum || ''}
											</div>

											{/* Change indicator */}
											<div
												className="flex-shrink-0 w-6 text-center select-none font-bold"
												style={{
													color:
														line.type === 'removed' || line.type === 'modified'
															? 'var(--diff-removed)'
															: 'transparent',
													background:
														line.type === 'removed'
															? 'var(--diff-bg-removed)'
															: line.type === 'modified'
															? 'var(--diff-bg-modified)'
															: 'transparent',
												}}
											>
												{line.type === 'removed' || line.type === 'modified' ? '−' : ' '}
											</div>

											{/* Content */}
											<pre
												className="flex-1 px-3 whitespace-pre-wrap break-all min-w-0"
												style={{
													fontFamily: 'inherit',
													color:
														line.type === 'removed' || line.type === 'modified'
															? 'var(--diff-removed)'
															: line.type === 'empty'
															? 'transparent'
															: 'var(--stark-white)',
													margin: 0,
													lineHeight: '1.6',
												}}
											>
												{line.content || ' '}
											</pre>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>

				{/* Right panel */}
				<div className="flex-1 flex flex-col min-w-0 min-h-0">
					{/* Panel header */}
					<div
						className="flex items-center justify-between px-4 py-2"
						style={{
							background: 'var(--bg-tertiary)',
							borderBottom: '2px solid var(--hot-pink)',
						}}
					>
						<div className="flex items-center gap-2">
							<span
								className="w-3 h-3 rounded-full"
								style={{ background: 'var(--hot-pink)' }}
							/>
							<span
								className="text-sm font-bold uppercase tracking-wide"
								style={{ color: 'var(--hot-pink)', fontFamily: 'var(--font-work-sans)' }}
							>
								Modified
							</span>
						</div>
						{!rightValid && rightError && (
							<span
								className="text-xs font-bold"
								style={{ color: 'var(--hot-pink)' }}
							>
								{rightError}
							</span>
						)}
						{rightValid && rightJson.trim() && (
							<span
								className="text-xs"
								style={{ color: 'var(--steel-gray)' }}
							>
								{rightJson.length} chars
							</span>
						)}
					</div>

					{/* Panel content */}
					{viewMode === 'edit' ? (
						<textarea
							style={{
								fontFamily: getFontVariable(fontFamily),
								fontSize: `${fontSize}px`,
								background: 'var(--deep-black)',
								color: 'var(--stark-white)',
							}}
							className="flex-1 w-full p-4 resize-none leading-relaxed focus:outline-none overflow-auto"
							value={rightJson}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRightJson(e.target.value)}
							placeholder='{"paste": "modified JSON here"}'
							spellCheck={false}
						/>
					) : (
						<div
							ref={rightScrollRef}
							onScroll={handleRightScroll}
							className="flex-1 overflow-auto"
							style={{ background: 'var(--deep-black)' }}
						>
							{diffResult && (
								<div
									style={{
										fontFamily: getFontVariable(fontFamily),
										fontSize: `${fontSize}px`,
									}}
								>
									{diffResult.rightLines.map((line, index) => (
										<div
											key={index}
											className="flex"
											style={{
												background:
													line.type === 'added'
														? 'var(--diff-bg-added)'
														: line.type === 'modified'
														? 'var(--diff-bg-modified)'
														: 'transparent',
												minHeight: `${parseInt(fontSize) * 1.6}px`,
											}}
										>
											{/* Line number */}
											<div
												className="flex-shrink-0 w-12 text-right pr-3 select-none"
												style={{
													color:
														line.type === 'added' || line.type === 'modified'
															? 'var(--diff-added)'
															: 'var(--steel-gray)',
													background: 'var(--coal-black)',
													borderRight: '2px solid var(--steel-gray)',
												}}
											>
												{line.lineNum || ''}
											</div>

											{/* Change indicator */}
											<div
												className="flex-shrink-0 w-6 text-center select-none font-bold"
												style={{
													color:
														line.type === 'added' || line.type === 'modified'
															? 'var(--diff-added)'
															: 'transparent',
													background:
														line.type === 'added'
															? 'var(--diff-bg-added)'
															: line.type === 'modified'
															? 'var(--diff-bg-modified)'
															: 'transparent',
												}}
											>
												{line.type === 'added' || line.type === 'modified' ? '+' : ' '}
											</div>

											{/* Content */}
											<pre
												className="flex-1 px-3 whitespace-pre-wrap break-all min-w-0"
												style={{
													fontFamily: 'inherit',
													color:
														line.type === 'added' || line.type === 'modified'
															? 'var(--diff-added)'
															: line.type === 'empty'
															? 'transparent'
															: 'var(--stark-white)',
													margin: 0,
													lineHeight: '1.6',
												}}
											>
												{line.content || ' '}
											</pre>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>

		</div>
	);
}
