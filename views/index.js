const html = require('choo/html')
//const sf = require('sheetify')
//sf('css/game.css', {global: true})

function displayTask(game) {
  return game ? game.task : ""
}

function displayGrid(game, send) {
  if (!game) {
    return html`<div>No game in progress</div>`
  }
  return html`
    <div class="game_div">
        ${game.grid.map(displayRow)}
    </div>
  `

  function displayRow(row, index_y) {
    return html`
      <div class="game_row">
        ${row.map(function (tile, index_x) {
      return html`<div 
class="game_tile" 
style="background-color: ${tile.backgroundColor.background}; 
                  color: ${tile.fontColor.font};
                  width: ${(100/row.length)}%"
onclick=${(e) => send('game:guessTile', {x: index_x, y: index_y})}>
    <div class="game_tile_text_container">
        <p>${tile.text.name}</p>
     </div>
</div>`
    })}
    </div>
  `
  }

  function tileClicked(x, y) {
    //send('game:guessTile', {x: ${index_x}, y: ${index_y}})
  }

}

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
                <span id="localTaskSpan">Task: ${displayTask(state.game.game)}</span>
            </div>
            <div class="row">
                ${displayGrid(state.game.game, send)}
            </div>
        </div>
    </div>
</div>
`
  }
}