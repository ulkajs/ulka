module.exports = {
  input: '.',
  contents: {
    root: { match: ['index.ejs', 'blogs.liquid'] },
    blogs: { match: 'blogs/**' },
  },
  output: '_site',
  templateSpecialFrontMatter: true,
}
