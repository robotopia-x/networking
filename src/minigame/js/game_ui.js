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
  game_ui.gridsize = {}

  function drawGrid () {
    var fullWidth, fullHeight, x, y, context, grid
    context = game_ui.canvas.getContext('2d')
    grid = game_ui.game.grid
    game_ui.gridsize = {
      x: grid[ 0 ].length,
      y: grid.length
    }
    fullWidth = context.canvas.width
    fullHeight = context.canvas.height
    game_ui.tileSize = {
      width: Math.round(fullWidth / game_ui.gridsize.x),
      height: Math.round(fullHeight / game_ui.gridsize.y)
    }
    context.clearRect(0, 0, fullWidth, fullHeight)

    for (x = 0; x < game_ui.gridsize.x; x++) {
      for (y = 0; y < game_ui.gridsize.y; y++) {
        drawTile({ x: x * game_ui.tileSize.width, y: y * game_ui.tileSize.height }, grid[ y ][ x ])
      }
    }

    function drawTile (position, tile) {
      context.fillStyle = tile.backgroundColor.background
      context.fillRect(position.x, position.y, game_ui.tileSize.width, game_ui.tileSize.height)
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
      if (!game_ui.game) {
        return
      }
      var x, y
      console.log('Clicked: ' + event.offsetX + ', ' + event.offsetY)
      var hitboxForTiles = {
        x: canvas.getContext('2d').canvas.clientWidth / game_ui.gridsize.x,
        y: canvas.getContext('2d').canvas.clientHeight / game_ui.gridsize.y
      }
      x = Math.floor(event.offsetX / hitboxForTiles.x)
      y = Math.floor(event.offsetY / hitboxForTiles.y)
      console.log('Clicked - in tiles: ' + x + ', ' + y)
      // TODO: check for rect/tile, if is right.
      if (game_ui.game.correct.x === x && game_ui.game.correct.y === y) {
        console.log("correct!")
        restartGame()
      }
    }
  }

  function restartGame () {
    game_ui.game = m_game.createNewChallenge(2, 2)
    game_ui.span.innerHTML = game_ui.game.task
    drawGrid()
  }


})()
