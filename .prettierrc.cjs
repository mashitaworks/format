module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
        printWidth: 10000
      }
    },
    {
      files: '*.html',
      options: {
        parser: 'html',
        printWidth: 10000
      }
    }
  ]
};