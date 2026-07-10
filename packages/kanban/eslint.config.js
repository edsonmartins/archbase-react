import baseConfig from "../../eslint.config.js";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  ...baseConfig,
  {
    files: ["src/**/*.{ts,tsx,d.ts}", "vite.config.ts"],
    rules: {
      "no-undef": "off",
      "react/display-name": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];
