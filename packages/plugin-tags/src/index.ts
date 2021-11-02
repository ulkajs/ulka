import { PluginFunction } from 'ulka'

const plugin: () => {
  afterCreateContext: PluginFunction<'afterCreateContext'>
  afterBuild: PluginFunction<'afterBuild'>
} = ({ matterKey = 'tags', contextKey = 'tags' } = {}) => {
  let tags: { [key: string]: { [key: string]: any } } = {}

  return {
    afterCreateContext: ({ content }) => {
      content.context[contextKey] = tags

      if (content.context.matter[matterKey]) {
        for (const tag of content.context.matter[matterKey]) {
          if (!tags[tag]) tags[tag] = []

          tags[tag].push(content.context)
        }
      }
    },
    afterBuild() {
      tags = {}
    },
  }
}

export default plugin
