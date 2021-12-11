module.exports = () => ({
  contents: { root: { match: ['index.ulka', 'style.css'] } },
  plugins: ['./plugin', { plugin: './plugin2', options: {} }],
  verbose: true,
})
