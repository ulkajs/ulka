const { defineConfig } = require('ulka')

module.exports = defineConfig(() => ({
  contents: { root: { match: ['index.ulka'] } },
  plugins: ['./plugin', { plugin: './plugin2', options: {} }],
  verbose: true,
  copy: [
    {
      match: ['style.css'],
    },
  ],
}))
