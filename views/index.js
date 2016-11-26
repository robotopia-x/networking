const html = require('choo/html')
const game = require('./game')
//const sf = require('sheetify')
//sf('css/game.css', {global: true})

var localGame = game('');
//var localGame = game('remote');

function newGame(send) {
  send('game:newGame', onFinish)
  
  function onFinish(result) {
    console.log('send me pls')
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
                <button id="localRestartButton" onclick=${(e) => newGame(send)}>Restart</button>
            </div>
            <div class="row">
                ${localGame.htmlTask(state, prev, send)}
            </div>
            <div class="row">
                ${localGame.htmlGrid(state, prev, send)}
            </div>
        </div>
    </div>
</div>
`
  }
}