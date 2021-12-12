module.exports = () => ({
  contents: { root: { match: ['index.ulka'] } },
  plugins: ['./plugin', { plugin: './plugin2', options: {} }],
  verbose: true,
  copy: {
    match: ['style.css'],
  },
})
