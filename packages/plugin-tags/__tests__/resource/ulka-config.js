const { defineConfig } = require('ulka')

module.exports = defineConfig({
  contents: {
    blog: {
      match: 'blogs/**/*.md',
    },
    root: {
      match: ['tags.ulka'],
    },
  },
})
