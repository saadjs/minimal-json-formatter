# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimal JSON formatter web application built with Next.js 14 (App Router), React 18, TypeScript, and Tailwind CSS. Features a neo-brutalist design aesthetic with dark/light themes, real-time JSON validation, and multiple formatting options.

## Development Commands

```bash
# Start development server (http://localhost:3000)
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start

# Run linter
pnpm run lint
```

**Package Manager:** This project uses `pnpm` (version 9.10.0). Always use `pnpm` instead of npm or yarn.

## Architecture

### Component Structure

The application follows a component-based architecture with a single-page layout:

- **`app/page.tsx`** - Entry point that renders the JsonFormatter component
- **`app/layout.tsx`** - Root layout that loads all Google Fonts (JetBrains Mono, Fira Code, Source Code Pro, IBM Plex Mono, Roboto Mono, Work Sans) and sets up font CSS variables
- **`components/json-formatter.tsx`** - Main orchestrator component containing all state management, business logic, and keyboard shortcuts
  - Manages JSON input/output state, validation, formatting, minification
  - Handles theme switching with localStorage persistence
  - Implements keyboard shortcuts: Cmd/Ctrl+Enter (format), Cmd/Ctrl+K (clear)
  - Auto-formats valid JSON on paste
  - Automatically reformats output when indent size changes

### Component Responsibilities

- **`input-panel.tsx`** - Left panel with textarea for JSON input
- **`output-panel.tsx`** - Right panel displaying formatted/minified output
- **`control-panel.tsx`** - Center column with action buttons (Format, Minify, Clear, Copy)
- **`header.tsx`** - Top bar with title, controls for indent size (2/4/8 spaces), font selection, font size (12-24px), theme toggle, and keyboard shortcut hints
- **`status-bar.tsx`** - Below header, displays character count, validation status with pulsing indicator, and error messages with line/column numbers
- **`theme-toggle.tsx`** - Theme switcher button component

All components except the entry point are client components (marked with `'use client'`).

### State Management

All state is managed locally in `json-formatter.tsx` using React hooks:

- Input/output JSON, validation state, character count, error messages
- UI preferences (indent size, font family, font size, theme) persisted to localStorage
- No external state management libraries (Redux, Zustand, etc.) are used

### Styling System

**CSS Variables Approach:** The app uses a comprehensive CSS custom properties system defined in `app/globals.css`:

- Theme-aware variables that switch between dark and light modes via `[data-theme]` attribute
- Dark mode: Pure black backgrounds (#000000, #0a0a0a, #141414), neon accents (cyan #00ffff, hot pink #ff006e, lime #00ff00, yellow #ffff00)
- Light mode: White/gray backgrounds, adjusted accent colors for readability
- Semantic color tokens (--bg-primary, --text-primary, --accent-primary, etc.)
- Grid and visual effect variables (--grid-size, --border-thicc)

**Font System:** Multiple monospace fonts loaded via Next.js Google Fonts with CSS variables (--font-jetbrains-mono, --font-fira-code, etc.) and Work Sans for UI text (--font-work-sans).

**Visual Effects:**
- Grid background overlay (`.grid-bg`)
- Animated scanlines effect (`.scanlines`)
- Glitch animation on title hover
- Slide-in animations for panels with staggered delays
- Neo-brutalist button style (`.btn-brutal`) with thick borders and 3D shadow effect
- Custom scrollbar styling
- Pulsing glow animation for validation indicator

### JSON Processing

- Real-time validation as user types using try/catch on `JSON.parse()`
- Error messages include line and column numbers calculated from error position
- Format: Uses `JSON.stringify(parsed, null, indentSize)` with configurable indent (2, 4, or 8 spaces)
- Minify: Uses `JSON.stringify(parsed)` with no spacing
- Auto-format on paste: Attempts to parse and format pasted content automatically

### Font Loading

Five monospace fonts are preloaded via Next.js Google Fonts API in `app/layout.tsx` and exposed as CSS variables. Font selection updates the CSS variable reference in input/output components. This approach ensures zero layout shift and optimal performance.

## Key Implementation Details

### Theme Switching
Theme state is stored in localStorage as 'json-formatter-theme' and applied to `document.documentElement` via `data-theme` attribute. CSS variables automatically update based on this attribute.

### Keyboard Shortcuts
Implemented in `json-formatter.tsx` using a global keydown event listener:
- Cmd/Ctrl+Enter: Format JSON
- Cmd/Ctrl+K: Clear all

### Auto-format on Paste
The `handlePaste` function in `json-formatter.tsx` intercepts paste events, attempts to parse the pasted text as JSON, and if valid, prevents default paste behavior and auto-formats the output.

### Indent Size Changes
When indent size changes, a `useEffect` hook reformats the existing output JSON with the new indent setting, ensuring the output always reflects the current indent preference.

### Error Display
JSON parsing errors are caught and processed to extract position information. Line and column numbers are calculated by splitting the input string at the error position and counting lines and characters.

## Adding New Features

When adding features to this project:

- **New UI controls:** Add to `header.tsx` and wire up state in `json-formatter.tsx`
- **New formatting options:** Implement in `json-formatter.tsx` and add button to `control-panel.tsx`
- **New color schemes:** Define CSS variables in `globals.css` under `[data-theme]` selectors
- **New fonts:** Add to `layout.tsx` via Next.js Google Fonts and update font maps in input/output panels
- **New animations:** Define keyframes in `globals.css` and apply via Tailwind classes

## Styling Guidelines

- Use CSS variables for all colors: `style={{ color: 'var(--electric-cyan)' }}`
- Use Tailwind utility classes for layout: `className="flex flex-col h-screen"`
- Use inline styles with CSS variables for theme-aware colors
- Neo-brutalist aesthetic: thick borders (4px), high contrast colors, bold typography, 3D button effects
- Maintain responsive design: test layouts at desktop (lg:) and mobile breakpoints
