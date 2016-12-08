const html = require('choo/html')
const cuid = require('cuid')
// const sf = require('sheetify')
// sf('css/game.css', {global: true})

module.exports = function (globalConfig) {
  return function (state, prev, send) {

    if (!state.connection.connectionId) {
      send('connection:setConnectionId', cuid())
      send('connection:awaitPeer', state.connection.connectionId)
    }

    return html`
<div>
    <div class="row">
        <h1>Realtime communication with WebRTC</h1>
        <p>Client</p>
    </div>
</div>
`
  }
}
