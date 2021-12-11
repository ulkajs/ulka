/**
 *
 * @returns {import("ulka").Plugins}
 */

module.exports = () => {
  return {
    afterSetup({ ulka }) {
      ulka.afterSetup = 'done'
    },
    beforeRender({ ulka, template }) {
      template.context.time = 'random-text'
    },
  }
}
