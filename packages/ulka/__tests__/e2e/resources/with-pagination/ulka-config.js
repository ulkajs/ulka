const { defineConfig } = require('ulka')

module.exports = defineConfig({
  input: '.',
  contents: {
    root: {
      match: ['index.ejs', 'blogs.liquid', 'index*.ulka'],
      forEach: (templ) => {
        if (templ.fileinfo.filepath.includes('index2.ulka'))
          templ.context.arr = [1, 2, 3, 4]
        else if (templ.fileinfo.filepath.includes('index3.ulka'))
          templ.context.obj = { react: 1, node: 2 }
      },
    },
    blogs: { match: 'blogs/**' },
  },
  output: '_site',
})
