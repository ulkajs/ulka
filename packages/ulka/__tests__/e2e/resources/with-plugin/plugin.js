/**
 *
 * @returns {import("ulka").Plugins}
 */

module.exports = () => {
  return {
    afterSetup({ ulka }) {
      ulka.afterSetup = 'done'
    },
    beforeRender({ ulka, content }) {
      content.context.time = 'random-text'
    },
  }
}
