/**
 * Root PostCSS Configuration
 * Handles CSS processing for Web/App builds via Vite.
 */
export default {
  plugins: {
    // Initializes Tailwind CSS processing (utility class generation)
    tailwindcss: {},
    // Adds vendor prefixes automatically for cross-browser compatibility
    autoprefixer: {},
  },
}
