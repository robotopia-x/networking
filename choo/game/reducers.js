module.exports = function (prefix) {
  return {
    setGame: setGame
  }
}

function setGame (game, state) {
  state.game = game
}
