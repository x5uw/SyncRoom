/**
 * postcss.config.mjs
 *
 * PostCSS configuration file using ESModule syntax. This file exports
 * the PostCSS load-config object which defines plugins to transform
 * your CSS (e.g., Tailwind CSS, autoprefixer, etc.).
 *
 * The `@type` JSDoc annotation imports the `Config` type from
 * 'postcss-load-config', enabling IDEs to provide IntelliSense
 * and basic validation even in a plain JavaScript setup.
 */

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
