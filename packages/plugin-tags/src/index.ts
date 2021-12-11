import { Plugin } from 'ulka'

const plugin: Plugin<{ matterKey?: string; contextKey?: string }> = ({
  matterKey = 'tags',
  contextKey = 'tags',
} = {}) => {
  let tags: { [key: string]: any } = {}

  return {
    afterCreateContext: ({ template }) => {
      template.context[contextKey] = tags

      if (template.context.matter[matterKey]) {
        for (const tag of template.context.matter[matterKey]) {
          if (!tags[tag]) tags[tag] = []

          tags[tag].push(template.context)
        }
      }
    },
    afterBuild() {
      tags = {}
    },
  }
}

export default plugin
