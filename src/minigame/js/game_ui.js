'use strict'
var game_ui = {};

(function () {
  game_ui.drawGrid = drawGrid
  game_ui.registerCanvas = registerCanvas
  game_ui.registerTaskArea = registerTaskArea
  game_ui.restartGame = restartGame
  game_ui.canvas = null
  game_ui.game = null
  game_ui.tileSize = null

  function drawGrid () {
    var fullWidth, fullHeight, gridSize, x, y, context, grid
    context = game_ui.canvas.getContext('2d')
    grid = game_ui.game.grid
    gridSize = {
      x: grid[ 0 ].length,
      y: grid.length
    }
    fullWidth = context.canvas.width
    fullHeight = context.canvas.height
    game_ui.tileSize = {
      width: Math.round(fullWidth / gridSize.x),
      height: Math.round(fullHeight / gridSize.y)
    }
    context.clearRect(0, 0, fullWidth, fullHeight)

    for (x = 0; x < gridSize.x; x++) {
      for (y = 0; y < gridSize.y; y++) {
        drawTile({ x: x * tileSize.width, y: y * tileSize.height }, grid[ y ][ x ])
      }
    }

    function drawTile (position, tile) {
      context.fillStyle = tile.backgroundColor.background
      context.fillRect(position.x, position.y, tileSize.width, tileSize.height)
      context.font = '20px Arial'
      context.fillStyle = tile.fontColor.font
      context.fillText(tile.text.name, position.x + 30, position.y + 30)
    }
  }

  function registerTaskArea (span) {
    game_ui.span = span
  }

  function registerCanvas (canvas) {
    game_ui.canvas = canvas
    game_ui.canvas.onclick = function (event) {
      var x, y
      console.log('Clicked: ' + event.offsetX + ', ' + event.offsetY)
      x = event.offsetX
      y = event.offsetY
      // TODO: check for rect/tile, if is right.
    }
  }

  function restartGame () {
    game_ui.game = m_game.createNewChallenge(2, 2)
    game_ui.span.innerHTML = game_ui.game.task
    drawGrid()
  }
})()
