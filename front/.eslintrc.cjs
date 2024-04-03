module.exports = {
  extends: [
    "@nuxtjs",
    "@vue/eslint-config-airbnb",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  rules: {
    "no-undef": "off",
    // "import/no-cycle": "off",
    "no-console": "off",
    "vue/first-attribute-linebreak": "off",
    "no-param-reassign": ["error", { props: false }],
    "vue/multi-word-component-names": "off",
    "import/prefer-default-export": "off",
    // "consistent-return": "off",
    "vue/no-v-model-argument": "off",
    "vue/valid-v-model": "off",
    "import/no-unresolved": [
      2,
      {
        ignore: ["~assets/.*", "~public/.*", "~lang/.*"],
      },
    ],
  },
};
