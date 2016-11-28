const html = require('choo/html')
const gameView = require('./game')
// const sf = require('sheetify')
// sf('css/game.css', {global: true})


var localGameView = gameView('local')
var remoteGameView = gameView('remote')

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
    </div>

    <div class="row">
        <div class="split_side">
            <div class="row">
                <h3>Local View</h3>
            </div>
            <div class="row">
                <button onclick=${(e) => send('localgame:newGame')}>Restart</button>
            </div>
            <div class="row">
                ${localGameView.htmlTask(state, prev, createPrefixSend(send, 'local'))}
            </div>
            <div class="row">
                ${localGameView.htmlGrid(state, prev, createPrefixSend(send, 'local'))}
            </div>
        </div>
        <div class="split_side">
            <div class="row">
                <h3>Remote View</h3>
            </div>
            <div class="row">
                <button onclick=${(e) => send('remotegame:newGame')}>Restart</button>
            </div>
            <div class="row">
                ${remoteGameView.htmlTask(state, prev, createPrefixSend(send, 'remote'))}
            </div>
            <div class="row">
                ${remoteGameView.htmlGrid(state, prev, createPrefixSend(send, 'remote'))}
            </div>
        </div>
    </div>
</div>
`
  }
}
