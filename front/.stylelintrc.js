export default {
  extends: [
    "stylelint-config-recommended-scss",
    "stylelint-config-recommended-vue",
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    "no-duplicate-selectors": true,
    "selector-max-id": 0,
    "selector-attribute-quotes": "always",
    "font-family-name-quotes": "always-unless-keyword",
    "comment-whitespace-inside": "always",
    "comment-empty-line-before": "always",
    "custom-property-no-missing-var-function": true,
    "function-no-unknown": true,
    "rule-empty-line-before": [
      "always",
      {
        except: ["first-nested", "after-single-line-comment"],
      },
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["extend", "mixin", "include", "for"],
      },
    ],
  },
};
