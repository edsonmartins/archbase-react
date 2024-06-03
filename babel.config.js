module.exports = {
  presets: [
    ['@babel/preset-env'],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    ['@babel/preset-typescript', { allowDeclareFields: true }],
  ],
  plugins: ['@emotion', '@babel/plugin-transform-runtime', ["@babel/plugin-transform-typescript", {allowDeclareFields: true}], ["@babel/plugin-proposal-decorators", { "legacy": true }], "@babel/plugin-transform-class-properties"],
}
