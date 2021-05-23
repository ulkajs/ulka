module.exports = () => ({
  input: '.',
  contents: {
    root: { match: '{index,custom_path}.ejs' },
    blog: {
      match: 'blogs/**/*.md',
      layout() {
        return null
      },
    },
  },
  layout: '_layouts',
  output: '_site',
  liquidInSpecialFrontMatter: true,
})
