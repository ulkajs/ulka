/**
 * @returns {import("ulka").Plugins}
 */

exports.default = () => {
  return {
    afterSetup({ ulka }) {
      ulka.afterSetup = 'done'
    },
    beforeRender({ ulka, template }) {
      template.context.afterSetup = ulka.afterSetup
    },
  }
}
