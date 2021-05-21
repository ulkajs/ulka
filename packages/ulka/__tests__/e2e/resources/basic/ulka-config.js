module.exports = () => ({
  input: '.',
  contents: {
    root: { match: 'index.ejs' },
    blog: { match: 'blogs/**/*.md' },
  },
  layout: '_layouts',
  output: '_site',
})
