module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
  overrides: [
    {
      // Define the configuration for `.astro` file.
      files: ["*.astro"],
      // Allows Astro components to be parsed.
      parser: "astro-eslint-parser",
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {
        // Make formatting issues errors instead of warnings
        "no-unused-vars": "error",
        "no-undef": "error",
        "no-console": "warn",

        // Astro specific rules
        "astro/no-set-html-directive": "error",
        "astro/no-unused-define-vars-in-style": "error",
      },
    },
    {
      // Define the configuration for TypeScript files
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
      rules: {
        // TypeScript specific rules
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "error",
      },
    },
  ],
};
