const { defineConfig } = require('ulka')

return defineConfig({
  contents: {
    blog: {
      match: 'blogs/**/*.{ejs,ulka,md}',
    },
  },
  include: 'includes',
  layout: 'layouts',
  input: '.',
  output: 'dist',
})
