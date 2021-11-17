const { defineConfig } = require('ulka')

module.exports = defineConfig({
  input: '.',
  contents: {
    root: {
      match: ['index.ejs', 'blogs.liquid', 'data-as-*.ulka', 'with*.ulka'],
      forEach: (templ) => {
        if (templ.fileinfo.filepath.includes('data-as-context-key.ulka'))
          templ.context.arr = [1, 2, 3, 4]
        else if (templ.fileinfo.filepath.includes('data-as-context-key2.ulka'))
          templ.context.obj = { react: 1, node: 2 }
      },
    },
    blogs: { match: 'blogs/**' },
  },
  output: '_site',
})
