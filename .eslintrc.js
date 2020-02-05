module.exports = {
    parser: '@typescript-eslint/parser', // eslint parser in use
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended', // recommened rule from @typescript-eslint/eslint-plugin.
        'prettier/@typesript-eslint', // uses eslint-config-prettier to disable ESLint rules from typescript-eslint/eslint-plugin to avoid conflicts with prettier.
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint error. NOTE: Should always be last config in the extend array.
    ],
    parserOption: {
        ecmaVersion: 2019,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        }
    },
    rules: {
        // This is where one will specify ESLint rules or override rules specified in the extended plugins.
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
};
