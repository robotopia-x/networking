'use strict'
var game_ui = {};

(function () {
  game_ui.drawGrid = drawGrid
  game_ui.registerCanvas = registerCanvas
  game_ui.registerTaskArea = registerTaskArea
  game_ui.restartGame = restartGame
  var canvas = null
  var game = null
  var tileSize = null
  var gridSize = {}

  var config = {
    penalty: 2000
  }

  var timeStamps = {}

  function drawGrid () {
    var fullWidth, fullHeight, x, y, context, grid
    context = canvas.getContext('2d')
    grid = game.grid
    gridSize = {
      x: grid[ 0 ].length,
      y: grid.length
    }
    fullWidth = context.canvas.width
    fullHeight = context.canvas.height
    tileSize = {
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

  function registerCanvas (canvasElement) {
    canvas = canvasElement
    canvas.onclick = function (event) {
      if (!game) {
        return
      }
      var x, y
      var hitboxForTiles = {
        x: canvas.getContext('2d').canvas.clientWidth / gridSize.x,
        y: canvas.getContext('2d').canvas.clientHeight / gridSize.y
      }
      x = Math.floor(event.offsetX / hitboxForTiles.x)
      y = Math.floor(event.offsetY / hitboxForTiles.y)
      console.log('Clicked tile: X=' + x + ', Y=' + y)
      // TODO: check for rect/tile, if is right.
      if (game.correct.x === x && game.correct.y === y) {
        handleCorrect()
      } else {
        handleMistake()
      }
    }
  }

  function handleMistake() {
    timeStamps.start = timeStamps.start - config.penalty
  }

  function handleCorrect() {
    timeStamps.end = Date.now()
    console.log("correct after " + (timeStamps.end - timeStamps.start) + " ms")
    restartGame()
  }

  function restartGame () {
    game = m_game.createNewChallenge(2, 2)
    game_ui.span.innerHTML = game.task
    drawGrid()
    timeStamps.start = Date.now()
  }


})()
