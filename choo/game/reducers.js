module.exports = function (globalConfig) {
  return {
    setGame: setGame
  }
}

function setGame(game, state) {
  state.game = game
}