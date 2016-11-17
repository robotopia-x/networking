const html = require('choo/html')
const sf = require('sheetify')

module.exports = function (globalConfig) {
  return function (state, prev, send) {
    return html`<div><a href="./2">index</a></div>`
  }
}