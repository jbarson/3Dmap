module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  rules: {
    'no-extra-semi': 'error',
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    'no-global-assign': 'warn'
  },
  globals: {
    THREE: 'readonly',
    _: 'readonly',
    systemsArr: 'readonly',
    jumpList: 'readonly'
  }
};
