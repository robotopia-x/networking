const html = require('choo/html')

module.exports = function (tile, y, x) {
  return html`${tile} ${y} ${x}`
}