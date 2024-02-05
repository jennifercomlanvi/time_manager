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

// DEPRECATED
// indentation: 2,
// 'string-quotes': 'single',
// 'color-hex-case': 'lower',
// 'color-hex-length': 'long',
// 'selector-combinator-space-after': 'always',
// 'selector-attribute-operator-space-before': 'never',
// 'selector-attribute-operator-space-after': 'never',
// 'selector-attribute-brackets-space-inside': 'never',
// 'declaration-block-trailing-semicolon': 'always',
// 'declaration-colon-space-before': 'never',
// 'declaration-colon-space-after': 'always',
// 'number-leading-zero': 'always',
// 'selector-pseudo-element-colon-notation': 'single',
// 'selector-pseudo-class-parentheses-space-inside': 'never',
// 'media-feature-range-operator-space-before': 'always',
// 'media-feature-range-operator-space-after': 'always',
// 'media-feature-parentheses-space-inside': 'never',
// 'media-feature-colon-space-before': 'never',
// 'media-feature-colon-space-after': 'always',
