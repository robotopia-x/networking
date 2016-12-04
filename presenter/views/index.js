const html = require('choo/html')
// const sf = require('sheetify')
// sf('css/game.css', {global: true})


function createPrefixSend (regularSend, prefix) {
  return function (target, data) {
    regularSend(prefix + target, data)
  }
}

module.exports = function (globalConfig) {
  return function (state, prev, send) {
    return html`
<div>
    <div class="row">
        <h1>Realtime communication with WebRTC</h1>
        <p>Presenter</p>
    </div>
</div>
`
  }
}
