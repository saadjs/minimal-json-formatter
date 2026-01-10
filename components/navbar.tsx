'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
	const pathname = usePathname();

	return (
		<nav
			className="relative z-30 flex items-center gap-0 border-b-4"
			style={{
				background: 'var(--void-black)',
				borderColor: 'var(--steel-gray)',
			}}
		>
			<Link
				href="/"
				className={`px-6 py-3 text-sm font-black uppercase tracking-wider transition-all border-r-2`}
				style={{
					background: pathname === '/' ? 'var(--electric-cyan)' : 'var(--void-black)',
					color: pathname === '/' ? 'var(--void-black)' : 'var(--steel-gray)',
					borderColor: 'var(--steel-gray)',
					fontFamily: 'var(--font-work-sans)',
				}}
			>
				<span className="flex items-center gap-2">
					<span>{ }</span> FORMATTER
				</span>
			</Link>
			<Link
				href="/compare"
				className={`px-6 py-3 text-sm font-black uppercase tracking-wider transition-all border-r-2`}
				style={{
					background: pathname === '/compare' ? 'var(--hot-pink)' : 'var(--void-black)',
					color: pathname === '/compare' ? 'var(--stark-white)' : 'var(--steel-gray)',
					borderColor: 'var(--steel-gray)',
					fontFamily: 'var(--font-work-sans)',
				}}
			>
				<span className="flex items-center gap-2">
					<span>⇄</span> COMPARE
				</span>
			</Link>
			<div
				className="flex-1 px-4 text-right text-xs font-bold uppercase tracking-wide"
				style={{
					color: 'var(--steel-gray)',
					fontFamily: 'var(--font-work-sans)',
				}}
			>
				JSON TOOLS
			</div>
		</nav>
	);
}
