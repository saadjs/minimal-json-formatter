/**
 * Font mapping utility
 */
export const getFontVariable = (font: string): string => {
	const fontMap: Record<string, string> = {
		jetbrains: 'var(--font-jetbrains-mono)',
		fira: 'var(--font-fira-code)',
		source: 'var(--font-source-code-pro)',
		ibm: 'var(--font-ibm-plex-mono)',
		roboto: 'var(--font-roboto-mono)',
	};
	return fontMap[font] || fontMap.jetbrains;
};

/**
 * Safe JSON parsing with error details
 */
export const parseJsonSafely = (
	json: string
): { success: true; data: unknown } | { success: false; error: string } => {
	try {
		const data = JSON.parse(json);
		return { success: true, data };
	} catch (err) {
		const errorMessage = (err as Error).message;
		return { success: false, error: errorMessage };
	}
};

/**
 * Calculate line and column from JSON parse error
 */
export const calculateErrorPosition = (
	error: Error,
	input: string
): { line: number; column: number } | null => {
	const errorMessage = error.message;
	const match = errorMessage.match(/at position (\d+)/);
	if (match) {
		const position = parseInt(match[1]);
		const lines = input.substring(0, position).split('\n');
		const line = lines.length;
		const column = lines[lines.length - 1].length + 1;
		return { line, column };
	}
	return null;
};

/**
 * Deep comparison of two JSON values
 * Returns an array of differences with paths
 */
export interface JsonDiff {
	type: 'added' | 'removed' | 'modified' | 'unchanged';
	path: string;
	leftValue?: unknown;
	rightValue?: unknown;
}

type JsonValue = string | number | boolean | null | undefined | JsonValue[] | { [key: string]: JsonValue };

export const deepCompareJson = (
	left: JsonValue,
	right: JsonValue,
	path: string = 'root'
): JsonDiff[] => {
	const diffs: JsonDiff[] = [];

	// Helper to check if value is an object (not array, not null)
	const isObject = (val: JsonValue): val is { [key: string]: JsonValue } => {
		return val !== null && typeof val === 'object' && !Array.isArray(val);
	};

	// Helper to check if value is an array
	const isArray = (val: JsonValue): val is JsonValue[] => {
		return Array.isArray(val);
	};

	// Handle null/undefined cases
	if (left === null || left === undefined) {
		if (right === null || right === undefined) {
			if (left === right) {
				diffs.push({ type: 'unchanged', path, leftValue: left, rightValue: right });
			} else {
				diffs.push({ type: 'modified', path, leftValue: left, rightValue: right });
			}
		} else {
			diffs.push({ type: 'added', path, rightValue: right });
		}
		return diffs;
	}

	if (right === null || right === undefined) {
		diffs.push({ type: 'removed', path, leftValue: left });
		return diffs;
	}

	// Compare primitives
	if (!isObject(left) && !isArray(left) && !isObject(right) && !isArray(right)) {
		if (left === right) {
			diffs.push({ type: 'unchanged', path, leftValue: left, rightValue: right });
		} else {
			diffs.push({ type: 'modified', path, leftValue: left, rightValue: right });
		}
		return diffs;
	}

	// Type mismatch (object vs array vs primitive)
	if (
		(isObject(left) && !isObject(right)) ||
		(isArray(left) && !isArray(right)) ||
		(!isObject(left) && !isArray(left) && (isObject(right) || isArray(right)))
	) {
		diffs.push({ type: 'modified', path, leftValue: left, rightValue: right });
		return diffs;
	}

	// Compare arrays
	if (isArray(left) && isArray(right)) {
		const maxLength = Math.max(left.length, right.length);
		for (let i = 0; i < maxLength; i++) {
			const itemPath = `${path}[${i}]`;
			if (i >= left.length) {
				diffs.push({ type: 'added', path: itemPath, rightValue: right[i] });
			} else if (i >= right.length) {
				diffs.push({ type: 'removed', path: itemPath, leftValue: left[i] });
			} else {
				// Recursively compare array items
				diffs.push(...deepCompareJson(left[i], right[i], itemPath));
			}
		}
		return diffs;
	}

	// Compare objects
	if (isObject(left) && isObject(right)) {
		const allKeys = Array.from(new Set([...Object.keys(left), ...Object.keys(right)]));

		for (const key of allKeys) {
			const itemPath = path === 'root' ? key : `${path}.${key}`;

			if (!(key in left)) {
				diffs.push({ type: 'added', path: itemPath, rightValue: right[key] });
			} else if (!(key in right)) {
				diffs.push({ type: 'removed', path: itemPath, leftValue: left[key] });
			} else {
				// Recursively compare object values
				diffs.push(...deepCompareJson(left[key], right[key], itemPath));
			}
		}
		return diffs;
	}

	return diffs;
};

/**
 * Format a value for display in diff view
 */
export const formatValueForDisplay = (value: unknown): string => {
	if (value === null) return 'null';
	if (value === undefined) return 'undefined';
	if (typeof value === 'string') return `"${value}"`;
	if (typeof value === 'object') return JSON.stringify(value, null, 2);
	return String(value);
};
