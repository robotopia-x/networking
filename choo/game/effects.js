const game = require('../lib/game')

module.exports = function (globalConfig) {
  return {
    newGame: newGame,
    guessTile: guessTile
  }
}

function newGame(_, __, send, done) {
  send('game:setGame', game.createNewChallenge(2,2), done)
}

function guessTile(data, state, send, done) {
  if (state.game.handleInput(data)) {
    newGame(null, null, send, done)
  }
}