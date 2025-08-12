// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      // REGLA PARA IGNORAR VARIABLES NO USADAS ---
      '@typescript-eslint/no-unused-vars': [
        'warn', // Puedes cambiar a "error" si prefieres que sea un error
        {
          argsIgnorePattern: '^_', // Ignora argumentos que empiezan con _
          varsIgnorePattern: '^_', // Ignora variables que empiezan con _
          caughtErrorsIgnorePattern: '^_', // Ignora errores capturados que empiezan con _
        },
      ],
    },
  },
);
