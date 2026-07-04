import eslintPluginAstro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";

export default [
  // Base ignores
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
  // Astro configuration (uses astro-eslint-parser automatically for .astro)
  ...eslintPluginAstro.configs["flat/recommended"],
  // Standalone TypeScript file configuration
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: "latest",
    },
  },
  // Configure TypeScript parser inside Astro frontmatter
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
];
