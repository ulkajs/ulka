module.exports = {
  input: '.',
  contents: { root: { match: ['index.ejs', 'sample.css'] } },
  plugins: [
    {
      plugin: './plugins/invalid-plugin.js',
    },
    './this-doesnt-exist',
  ],
}
