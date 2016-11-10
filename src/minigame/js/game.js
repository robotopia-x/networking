'use strict'
var miniGame

(function Minigame () {
  var game = {}
  var colors, maxTiles, initialised, config

  config = {
    penalty: 2000
  }

  initialised = false

  colors = []
  maxTiles = 0

  game.createNewChallenge = createNewChallenge

  function createNewChallenge (dimX, dimY) {
    init()
    if (!(dimX > 0 && dimY > 0)) {
      return null
    }
    if (dimX * dimY > maxTiles) {
      return new Challenge({ x: 1, y: 1 })
    }
    return new Challenge({ x: dimX, y: dimY })
  }

  function addColor (color) {
    if (color) {
      colors.push(color)
      maxTiles = colors.length
    }
  }

  function Color (name, hexText, hexBackground) {
    var color = {
      name: name,
      font: hexText,
      background: hexBackground,
      equals: equals
    }

    function equals (otherColor) {
      return color.name === otherColor.name
    }

    return color
  }

  function Challenge (dimensions) {
    var grid, correctPosition, usableColors, startTime, stopTime, mistakes
    mistakes = 0
    grid = []
    usableColors = {}

    initColors()

    initGrid()

    correctPosition = {
      x: Math.floor(Math.random() * dimensions.x),
      y: Math.floor(Math.random() * dimensions.y)
    }

    startTime = Date.now();

    return {
      grid: grid,
      handleInput: handleInput,
      task: createSearchTextForTile(grid[ correctPosition.y ][ correctPosition.x ])
    }

    function initColors () {
      var allColors, i, required

      usableColors.all = []

      required = dimensions.x * dimensions.y

      allColors = colors.slice()

      for (i = 0; i < required; i++) {
        var randomIndex = Math.floor(Math.random() * allColors.length)
        usableColors.all.push(allColors[ randomIndex ])
        allColors.splice(randomIndex, 1)
      }

      usableColors.text = usableColors.all.slice()
      usableColors.font = usableColors.all.slice()
      usableColors.background = usableColors.all.slice()
    }

    function initGrid () {
      var i, j
      for (i = 0; i < dimensions.x; i++) {
        var row = []
        for (j = 0; j < dimensions.x; j++) {
          var textColor, fontColor, bgColor, randomIndex
          // text
          randomIndex = Math.floor(Math.random() * usableColors.text.length)
          textColor = usableColors.text[ randomIndex ]
          usableColors.text.splice(randomIndex, 1)
          // font
          randomIndex = Math.floor(Math.random() * usableColors.font.length)
          fontColor = usableColors.font[ randomIndex ]
          usableColors.font.splice(randomIndex, 1)
          // background
          randomIndex = Math.floor(Math.random() * usableColors.background.length)
          bgColor = usableColors.background[ randomIndex ]
          usableColors.background.splice(randomIndex, 1)
          row.push(new Tile(textColor, fontColor, bgColor))
        }
        grid.push(row)
      }
    }

    function handleInput(posX, posY) {
      if (correctPosition.x === posX && correctPosition.y === posY) {
        stopTime = Date.now()
        createChallengeResult(this, stopTime - startTime, mistakes)
        return true
      } else {
        mistakes++
        return false
      }
    }
  }

  function createChallengeResult(challenge, solvingTime, mistakes) {
    console.log("correct after " + solvingTime + " ms and " + mistakes + " mistakes; Adding a penalty of " + (mistakes * config.penalty) + "ms.")
  }

  function Tile (text, textColor, backgroundColor) {
    var tile = {
      text: text,
      fontColor: textColor,
      backgroundColor: backgroundColor,
      equals: equals
    }

    function equals (otherTile) {
      if (!(otherTile.hasOwnProperty('text') && otherTile.hasOwnProperty('fontColor') && otherTile.hasOwnProperty('backgroundColor'))) {
        return false
      }
      if (otherTile.text.equals(tile.text)) {
        return false
      }
      if (otherTile.fontColor.equals(tile.fontColor)) {
        return false
      }
      if (otherTile.backgroundColor.equals(tile.backgroundColor)) {
        return false
      }
      return true
    }

    return tile
  }

  function createSearchTextForTile (tile) {
    var fields, randomIndex, color, type
    fields = [ 'text', 'fontColor', 'backgroundColor' ]
    randomIndex = Math.floor(Math.random() * fields.length)
    switch (fields[ randomIndex ]) {
      case 'text':
        return 'Find the tile with the text: "' + tile.text.name + '"'
        break
      case 'fontColor':
        return 'Find the tile with the ' + tile.fontColor.name + ' text'
        break
      case 'backgroundColor':
        return 'Find the tile with the ' + tile.backgroundColor.name + ' background'
        break
      default:
        return 'Illegal Field'
        break
    }
  }

  function init () {
    if (initialised) {
      return
    }
    initialised = true
    addColor(new Color('Red', '#FF0000', '#CC0000'))
    addColor(new Color('Green', '#00FF00', '#00CC00'))
    addColor(new Color('Blue', '#0000FF', '#0000CC'))
    addColor(new Color('Yellow', '#FFFF00', '#CCCC00'))
    addColor(new Color('Pink', '#FF00FF', '#CC00CC'))
    addColor(new Color('Teal', '#00FFFF', '#00CCCC'))
  }

  miniGame = game
})();
