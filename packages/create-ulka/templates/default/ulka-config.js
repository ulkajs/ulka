const { defineConfig } = require('ulka')

return defineConfig({
  contents: {
    blog: {
      match: 'blogs/**/*.{ejs,ulka,md}',
    },
  },
  layout: 'layouts',
  input: '.',
  output: 'dist',
})
