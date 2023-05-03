// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
  },
  env: {
    es6: true,
    browser: true,
  },
  rules: {
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
