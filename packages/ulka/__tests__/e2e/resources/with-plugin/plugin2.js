/**
 * @returns {import("ulka").Plugins}
 */

exports.default = () => {
  return {
    afterSetup({ ulka }) {
      ulka.afterSetup = 'done'
    },
    beforeRender({ ulka, content }) {
      content.context.afterSetup = ulka.afterSetup
    },
  }
}
