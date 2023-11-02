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
  plugins: ['@emotion', '@babel/plugin-transform-runtime'],
}
