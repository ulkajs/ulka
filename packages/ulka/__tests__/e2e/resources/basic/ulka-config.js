module.exports = () => ({
  input: '.',
  contents: {
    root: { match: '{index,custom_path}.ejs', layout: 'l.liquid' },
    blog: {
      match: 'blogs/**/*.md',
      layout() {
        return null
      },
    },
  },
  layout: '_layouts',
  output: '_site',
  copy: ['*.css'],
})
