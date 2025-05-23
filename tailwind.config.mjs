/**
 * tailwind.config.mjs
 *
 * Tailwind CSS configuration file using ESM syntax. This file exports an object
 * that Tailwind uses to:
 *   1. Locate all of your template files (via the `content` paths) to perform
 *      “purge” of unused styles in production builds.
 *   2. Extend or override the default design system (colors, spacing, fonts, etc.)
 *   3. Register additional Tailwind plugins.
 *
 * The `@type` JSDoc annotation imports the Tailwind `Config` type, enabling IDEs
 * to offer IntelliSense and basic type-checking in a plain JavaScript environment.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
