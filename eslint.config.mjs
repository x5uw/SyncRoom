/**
 * ESLint configuration for a Next.js project using the "Flat" config format.
 * This file sets up the core-web-vitals rules from Next.js and ensures
 * compatibility with the legacy @eslint/eslintrc shareable configs.
 * 
 * ESLint is used to identify and detect problems in JavaScript code.
 */

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals")];

export default eslintConfig;
