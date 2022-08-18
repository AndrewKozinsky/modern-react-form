module.exports = {
	'env': {
		'es2021': true,
		'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'plugins': [
		'@typescript-eslint'
	],
	'rules': {
		'indent': [
			'warn',
			'tab', { 'SwitchCase': 1, 'ignoredNodes': ['PropertyDefinition'] }
		],
		'linebreak-style': ['error', 'unix'],
		'quotes': ['error', 'single'],
		'semi': ['warn', 'never'],
		'no-empty': ['off'],
		'eol-last': ['warn', 'always'],
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'object-curly-spacing': ['warn', 'always'],
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'no-debugger': 'off',
	}
}
