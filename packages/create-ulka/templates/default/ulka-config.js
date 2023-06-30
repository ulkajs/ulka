const { defineConfig } = require('ulka')

module.exports = defineConfig({
  contents: {
    blogs: {
      match: 'blogs/**/*.md',
      layout: 'blogs.ulka',
    },
    main: {
      match: ['blogs.ulka', 'index.ulka'],
    },
  },
  layout: 'layouts',
  input: '.',
  output: 'dist',
  copy: ['static/**'],
})
