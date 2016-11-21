const html = require('choo/html')
const sf = require('sheetify')
sf('./css/main.css', {global: true})

module.exports = function (globalConfig) {
  return function (state, prev, send) {
    return html`
<div class=${css}>
    <div class="row">
        <h1>Realtime communication with WebRTC</h1>
    </div>

    <div class="row">
        <div class="split_side">
            <div class="row">
                <h3>Local View</h3>
            </div>
            <div class="row">
                <button id="localRestartButton" onclick="${send('newGame')}">Restart</button>
            </div>
            <div class="row">
                <span id="localTaskSpan">${state.game.task}</span>
            </div>
            <div class="row">
                place tiles here
            </div>
        </div>
    </div>
</div>
`
  }
}