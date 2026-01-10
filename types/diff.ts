/**
 * Type of JSON difference
 */
export type DiffType = 'added' | 'removed' | 'modified' | 'unchanged';

/**
 * Comparison display mode
 */
export type ComparisonMode = 'full' | 'changes-only';

/**
 * Highlight mode for diff visualization
 */
export type HighlightMode = 'inline' | 'side-by-side';

/**
 * Individual diff entry
 */
export interface DiffEntry {
	type: DiffType;
	path: string;
	leftValue?: any;
	rightValue?: any;
}

/**
 * Complete diff result
 */
export interface DiffResult {
	diffs: DiffEntry[];
	totalChanges: number;
	addedCount: number;
	removedCount: number;
	modifiedCount: number;
}
