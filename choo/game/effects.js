const game = require('../lib/game')

module.exports = function (prefix) {

  return {
    newGame: newGame,
    guessTile: guessTile
  }

  function newGame(_, __, send, done) {
    var nextGame = game.createNewChallenge(2,2);
    send(prefix + 'game:setGame', nextGame, done)
  }

  function guessTile(data, state, send, done) {
    const result = state.game.handleInput(data)
    if (result) {
      if (prefix === 'local') {
        send('remotegame:setGame', result.challenge, done)
      } else {
        send('localgame:setGame', result.challenge, done)
      }
      newGame(null, null, send, done)
    } else {
      done()
    }
  }

}