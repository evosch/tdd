module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb-base",
  "plugins": [
      "import"
  ],
  "rules": {
      "complexity": ["error", 5],
      "valid-jsdoc": "error",
      "require-jsdoc": ["error", {
          "require": {
              "FunctionDeclaration": true,
              "MethodDefinition": true,
              "ClassDeclaration": true
          }
      }],
      "no-underscore-dangle": ["error", { "allow": ["_id", "_type"] }]
  },
  "env": {
      "browser": true,
      "node": true,
  }
};