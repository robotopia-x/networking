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

}

module.exports = function (prefix) {

  const id = prefix+"game";

  return {
    htmlTask: htmlTask,
    htmlGrid: htmlGrid
  }
  
  function htmlTask(state, prev, send) {
    return html`
  <div class="row">
    <span id="localTaskSpan">Task: ${displayTask(state[id].game)}</span>
  </div>
  `
  }
  
  function htmlGrid(state, prev, send) {
    return html`
    ${displayGrid(state[id].game, sendWrapper)}
`
    function sendWrapper(target, data) {
      send(prefix + target, data);
    }

  }

}