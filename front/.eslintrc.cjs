module.exports = {
  extends: ["@nuxtjs", "@vue/eslint-config-airbnb", "prettier"],
  rules: {
    "no-undef": "off",
    // "import/no-cycle": "off",
    "no-console": "off",
    "vue/first-attribute-linebreak": "off",
    "no-param-reassign": ["error", { props: false }],
    "vue/multi-word-component-names": "off",
    "import/prefer-default-export": "off",
    // "consistent-return": "off",
    "import/no-unresolved": [
      2,
      {
        ignore: [
          "~assetsG/.*",
          "~assets/.*",
          "~publicG/.*",
          "~public/.*",
          "~lang/.*",
        ],
      },
    ],
  },
};
