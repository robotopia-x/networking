const html = require('choo/html')
const sf = require('sheetify')
//sf('./css/main.css', {global: true})

function displayTask(game) {
  return game ? game.task : ""
}

function displayGrid(game) {
  if (!game) {
    return html`<div>No game in progress</div>`
  }
  return html`
    <div>
        ${game.grid.map(displayRow)}
    </div>
  `

  function displayRow(row, index_y) {
    return html`
      <div>
        ${row.map(function (tile, index_x) {
          return html`${tile} ${index_y} ${index_x}`
        })}
    </div>
  `
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
                <button id="localRestartButton" onclick=${(e) => send('game:newGame')}>Restart</button>
    </div>
    <div class="row">
                <span id="localTaskSpan">Task: ${displayTask(state.game.game)}</span>
            </div>
            <div class="row">
                ${displayGrid(state.game.game)}
            </div>
        </div>
    </div>
</div>
`
  }
}