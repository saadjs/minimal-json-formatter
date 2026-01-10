import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'jetbrains': ['var(--font-jetbrains-mono)', 'monospace'],
        'fira': ['var(--font-fira-code)', 'monospace'],
        'source': ['var(--font-source-code-pro)', 'monospace'],
        'ibm': ['var(--font-ibm-plex-mono)', 'monospace'],
        'roboto': ['var(--font-roboto-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
