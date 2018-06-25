// http://eslint.org/docs/user-guide/configuring

module.exports = {
   root: true,
    env: {
      es6: true,
      browser: true
    },
    plugins: ['vue'],
    extends: [
      'airbnb',
      'plugin:vue/recommended'
    ],
    parserOptions: {
      parser: 'babel-eslint',
      ecmaVersion: 2017,
      sourceType: 'module'
    },
    'rules': {
      "import/no-unresolved": 0,
      "indent": ["error", 4],
      'vue/html-indent': ['error', 4]
    }
  };